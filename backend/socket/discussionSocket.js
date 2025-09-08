// socket/discussionSocket.js
import { Server } from 'socket.io';
import DiscussionMessage from '../models/DiscussionMessage.js';
import Event from '../models/Event.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Store active users in event rooms
  const activeUsers = new Map(); // eventId -> Set of userIds
  const userSockets = new Map(); // userId -> socketId

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join event discussion room
    socket.on('join_event_discussion', async (data) => {
      try {
        const { eventId, userId, userInfo } = data;
        
        // Validate event exists
        const event = await Event.findById(eventId);
        if (!event) {
          socket.emit('error', { message: 'Event not found' });
          return;
        }

        // Join the room
        socket.join(`event_${eventId}`);
        socket.eventId = eventId;
        socket.userId = userId;
        socket.userInfo = userInfo;

        // Track active users
        if (!activeUsers.has(eventId)) {
          activeUsers.set(eventId, new Set());
        }
        activeUsers.get(eventId).add(userId);
        userSockets.set(userId, socket.id);

        // Notify others about new user joining
        socket.to(`event_${eventId}`).emit('user_joined', {
          userId,
          userInfo,
          timestamp: new Date().toISOString()
        });

        // Send current active users count
        const activeCount = activeUsers.get(eventId).size;
        io.to(`event_${eventId}`).emit('active_users_count', { count: activeCount });

        console.log(`User ${userId} joined event ${eventId} discussion`);
      } catch (error) {
        console.error('Error joining discussion:', error);
        socket.emit('error', { message: 'Failed to join discussion' });
      }
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { eventId, content, parentMessageId, mentions } = data;
        const { userId, userInfo } = socket;

        if (!eventId || !userId) {
          socket.emit('error', { message: 'Missing required data' });
          return;
        }

        // Create message in database
        const messageData = {
          event: eventId,
          author: userId,
          content: content.trim(),
          parentMessage: parentMessageId || null,
          mentions: mentions || []
        };

        const message = new DiscussionMessage(messageData);
        await message.save();

        // If replying, update parent message
        if (parentMessageId) {
          const parentMessage = await DiscussionMessage.findById(parentMessageId);
          if (parentMessage) {
            parentMessage.replies.push(message._id);
            await parentMessage.save();
          }
        }

        // Populate message data for broadcasting
        await message.populate('author', 'firstName lastName avatar');
        
        const messageForBroadcast = {
          id: message._id,
          author: userInfo,
          content: message.content,
          timestamp: message.createdAt,
          parentMessage: parentMessageId,
          reactions: [],
          replies: [],
          isPinned: false,
          isEdited: false
        };

        // Broadcast to all users in the event room
        io.to(`event_${eventId}`).emit('new_message', messageForBroadcast);

        // Send confirmation to sender
        socket.emit('message_sent', { messageId: message._id });

        console.log(`Message sent in event ${eventId} by user ${userId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Add reaction
    socket.on('add_reaction', async (data) => {
      try {
        const { messageId, emoji } = data;
        const { userId, userInfo } = socket;

        if (!messageId || !emoji || !userId) {
          socket.emit('error', { message: 'Missing required data' });
          return;
        }

        const message = await DiscussionMessage.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        await message.addReaction(userId, emoji);
        await message.populate('reactions.user', 'firstName lastName');

        // Broadcast reaction update
        io.to(`event_${message.event}`).emit('reaction_updated', {
          messageId: message._id,
          reactions: message.reactions,
          reactionCounts: message.reactionCounts,
          updatedBy: userInfo
        });

        console.log(`Reaction ${emoji} added to message ${messageId} by user ${userId}`);
      } catch (error) {
        console.error('Error adding reaction:', error);
        socket.emit('error', { message: 'Failed to add reaction' });
      }
    });

    // Remove reaction
    socket.on('remove_reaction', async (data) => {
      try {
        const { messageId, emoji } = data;
        const { userId, userInfo } = socket;

        const message = await DiscussionMessage.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        await message.removeReaction(userId, emoji);
        await message.populate('reactions.user', 'firstName lastName');

        // Broadcast reaction update
        io.to(`event_${message.event}`).emit('reaction_updated', {
          messageId: message._id,
          reactions: message.reactions,
          reactionCounts: message.reactionCounts,
          updatedBy: userInfo
        });

        console.log(`Reaction ${emoji} removed from message ${messageId} by user ${userId}`);
      } catch (error) {
        console.error('Error removing reaction:', error);
        socket.emit('error', { message: 'Failed to remove reaction' });
      }
    });

    // User typing indicator
    socket.on('typing_start', (data) => {
      const { eventId } = data;
      const { userId, userInfo } = socket;
      
      if (eventId && userId) {
        socket.to(`event_${eventId}`).emit('user_typing', {
          userId,
          userInfo,
          isTyping: true
        });
      }
    });

    socket.on('typing_stop', (data) => {
      const { eventId } = data;
      const { userId, userInfo } = socket;
      
      if (eventId && userId) {
        socket.to(`event_${eventId}`).emit('user_typing', {
          userId,
          userInfo,
          isTyping: false
        });
      }
    });

    // Edit message
    socket.on('edit_message', async (data) => {
      try {
        const { messageId, newContent } = data;
        const { userId, userInfo } = socket;

        const message = await DiscussionMessage.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        if (message.author.toString() !== userId) {
          socket.emit('error', { message: 'Not authorized to edit this message' });
          return;
        }

        // Add to edit history
        if (message.content !== newContent.trim()) {
          message.editHistory.push({
            content: message.content,
            editedAt: new Date()
          });
          message.isEdited = true;
        }

        message.content = newContent.trim();
        await message.save();

        // Broadcast message update
        io.to(`event_${message.event}`).emit('message_updated', {
          messageId: message._id,
          content: message.content,
          isEdited: message.isEdited,
          editedBy: userInfo,
          editedAt: new Date().toISOString()
        });

        console.log(`Message ${messageId} edited by user ${userId}`);
      } catch (error) {
        console.error('Error editing message:', error);
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    // Delete message
    socket.on('delete_message', async (data) => {
      try {
        const { messageId } = data;
        const { userId, userInfo } = socket;

        const message = await DiscussionMessage.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        // Check permissions
        const event = await Event.findById(message.event);
        const isAuthor = message.author.toString() === userId;
        const isOrganizer = event.createdBy?.toString() === userId;

        if (!isAuthor && !isOrganizer) {
          socket.emit('error', { message: 'Not authorized to delete this message' });
          return;
        }

        await message.softDelete(userId);

        // Broadcast message deletion
        io.to(`event_${message.event}`).emit('message_deleted', {
          messageId: message._id,
          deletedBy: userInfo,
          deletedAt: new Date().toISOString()
        });

        console.log(`Message ${messageId} deleted by user ${userId}`);
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const { eventId, userId } = socket;
      
      if (eventId && userId) {
        // Remove from active users
        if (activeUsers.has(eventId)) {
          activeUsers.get(eventId).delete(userId);
          if (activeUsers.get(eventId).size === 0) {
            activeUsers.delete(eventId);
          }
        }
        userSockets.delete(userId);

        // Notify others about user leaving
        socket.to(`event_${eventId}`).emit('user_left', {
          userId,
          timestamp: new Date().toISOString()
        });

        // Update active users count
        const activeCount = activeUsers.get(eventId)?.size || 0;
        socket.to(`event_${eventId}`).emit('active_users_count', { count: activeCount });
      }

      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

// Helper function to get active users for an event
export const getActiveUsers = (eventId) => {
  return activeUsers.get(eventId) || new Set();
};