import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Message from "../models/Message.js";
import DiscussionChannel from "../models/DiscussionChannel.js";
import DirectMessage from "../models/DirectMessage.js";
import DirectMessageContent from "../models/DirectMessageContent.js";
const socketIo = Server;

class SocketServer {
  constructor(server) {
    this.io = new socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    
    this.connectedUsers = new Map(); // userId -> socketId
    this.userSockets = new Map(); // socketId -> userId
    this.channelUsers = new Map(); // channelId -> Set of userIds
    
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Authentication
      socket.on('authenticate', async (token) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.userId);
          
          if (user) {
            socket.userId = user._id.toString();
            this.connectedUsers.set(user._id.toString(), socket.id);
            this.userSockets.set(socket.id, user._id.toString());
            
            // Update user online status
            await User.findByIdAndUpdate(user._id, {
              isOnline: true,
              lastSeen: new Date()
            });

            socket.emit('authenticated', { user: user });
            
            // Notify contacts about online status
            this.broadcastUserStatus(user._id.toString(), true);
            
            console.log(`User ${user.name} authenticated`);
          } else {
            socket.emit('auth_error', 'Invalid user');
          }
        } catch (error) {
          socket.emit('auth_error', 'Invalid token');
        }
      });

      // Join event discussion channel
      socket.on('join_channel', async (data) => {
        try {
          const { channelId, userId } = data;
          
          const channel = await DiscussionChannel.findById(channelId);
          if (!channel) {
            socket.emit('error', 'Channel not found');
            return;
          }

          // Join socket room
          socket.join(`channel:${channelId}`);
          
          // Track user in channel
          if (!this.channelUsers.has(channelId)) {
            this.channelUsers.set(channelId, new Set());
          }
          this.channelUsers.get(channelId).add(userId);
          
          // Notify channel about new participant
          socket.to(`channel:${channelId}`).emit('user_joined_channel', {
            userId,
            channelId
          });

          socket.emit('joined_channel', { channelId });
          console.log(`User ${userId} joined channel ${channelId}`);
        } catch (error) {
          socket.emit('error', 'Failed to join channel');
        }
      });

      // Leave channel
      socket.on('leave_channel', (data) => {
        const { channelId, userId } = data;
        
        socket.leave(`channel:${channelId}`);
        
        if (this.channelUsers.has(channelId)) {
          this.channelUsers.get(channelId).delete(userId);
        }
        
        socket.to(`channel:${channelId}`).emit('user_left_channel', {
          userId,
          channelId
        });
      });

      // Send message to channel
      socket.on('send_channel_message', async (data) => {
        try {
          const { channelId, senderId, content, type = 'text', replyTo } = data;
          
          const channel = await DiscussionChannel.findById(channelId);
          if (!channel) {
            socket.emit('error', 'Channel not found');
            return;
          }

          const message = new Message({
            channel: channelId,
            sender: senderId,
            content,
            type,
            replyTo: replyTo || null
          });

          await message.save();
          await message.populate('sender', 'name avatar role company');

          // Update channel
          channel.messageCount += 1;
          channel.lastActivity = new Date();
          await channel.save();

          // Broadcast to all channel members
          this.io.to(`channel:${channelId}`).emit('new_channel_message', message);
          
          console.log(`Message sent to channel ${channelId}`);
        } catch (error) {
          socket.emit('error', 'Failed to send message');
        }
      });

      // Typing indicator for channels
      socket.on('typing_channel', (data) => {
        const { channelId, userId, isTyping } = data;
        socket.to(`channel:${channelId}`).emit('user_typing_channel', {
          userId,
          channelId,
          isTyping
        });
      });

      // Join direct conversation
      socket.on('join_conversation', async (data) => {
        try {
          const { conversationId, userId } = data;
          
          const conversation = await DirectMessage.findById(conversationId);
          if (!conversation || !conversation.participants.includes(userId)) {
            socket.emit('error', 'Conversation not found or access denied');
            return;
          }

          socket.join(`dm:${conversationId}`);
          socket.emit('joined_conversation', { conversationId });
          
          console.log(`User ${userId} joined conversation ${conversationId}`);
        } catch (error) {
          socket.emit('error', 'Failed to join conversation');
        }
      });

      // Send direct message
      socket.on('send_direct_message', async (data) => {
        try {
          const { conversationId, senderId, content, type = 'text' } = data;
          
          const conversation = await DirectMessage.findById(conversationId);
          if (!conversation) {
            socket.emit('error', 'Conversation not found');
            return;
          }

          const message = new DirectMessageContent({
            conversation: conversationId,
            sender: senderId,
            content,
            type,
            status: 'sent'
          });

          await message.save();
          await message.populate('sender', 'name avatar role company');

          // Update conversation
          await DirectMessage.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            lastActivity: new Date(),
            $inc: { messageCount: 1 }
          });

          // Mark as delivered for online recipients
          const recipientId = conversation.participants.find(
            id => id.toString() !== senderId
          );
          
          if (this.connectedUsers.has(recipientId.toString())) {
            message.deliveredAt = new Date();
            message.status = 'delivered';
            await message.save();
          }

          // Broadcast to conversation participants
          this.io.to(`dm:${conversationId}`).emit('new_direct_message', message);
          
          // Send push notification to offline users
          this.sendDirectMessageNotification(conversationId, message, recipientId);
          
          console.log(`Direct message sent to conversation ${conversationId}`);
        } catch (error) {
          socket.emit('error', 'Failed to send direct message');
        }
      });

      // Typing indicator for direct messages
      socket.on('typing_direct', (data) => {
        const { conversationId, userId, isTyping } = data;
        socket.to(`dm:${conversationId}`).emit('user_typing_direct', {
          userId,
          conversationId,
          isTyping
        });
      });

      // Mark direct messages as read
      socket.on('mark_messages_read', async (data) => {
        try {
          const { conversationId, userId } = data;
          
          const updatedMessages = await DirectMessageContent.find({
            conversation: conversationId,
            sender: { $ne: userId },
            readAt: { $exists: false }
          });

          await DirectMessageContent.updateMany(
            { 
              conversation: conversationId,
              sender: { $ne: userId },
              readAt: { $exists: false }
            },
            { 
              readAt: new Date(),
              status: 'read'
            }
          );

          // Notify sender about read receipts
          socket.to(`dm:${conversationId}`).emit('messages_read', {
            conversationId,
            readBy: userId,
            messageIds: updatedMessages.map(msg => msg._id)
          });

        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      });

      // Voice message handling
      socket.on('voice_message_start', (data) => {
        const { channelId, conversationId, userId } = data;
        const room = channelId ? `channel:${channelId}` : `dm:${conversationId}`;
        
        socket.to(room).emit('user_recording_voice', { userId, isRecording: true });
      });

      socket.on('voice_message_stop', (data) => {
        const { channelId, conversationId, userId } = data;
        const room = channelId ? `channel:${channelId}` : `dm:${conversationId}`;
        
        socket.to(room).emit('user_recording_voice', { userId, isRecording: false });
      });

      // Message reactions
      socket.on('add_reaction', async (data) => {
        try {
          const { messageId, emoji, userId, channelId, conversationId } = data;
          
          const message = channelId 
            ? await Message.findById(messageId)
            : await DirectMessageContent.findById(messageId);
          
          if (!message) {
            socket.emit('error', 'Message not found');
            return;
          }

          const existingReaction = message.reactions?.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            const userIndex = existingReaction.users.indexOf(userId);
            if (userIndex > -1) {
              existingReaction.users.splice(userIndex, 1);
              if (existingReaction.users.length === 0) {
                message.reactions = message.reactions.filter(r => r.emoji !== emoji);
              }
            } else {
              existingReaction.users.push(userId);
            }
          } else {
            if (!message.reactions) message.reactions = [];
            message.reactions.push({ emoji, users: [userId] });
          }

          await message.save();
          
          const room = channelId ? `channel:${channelId}` : `dm:${conversationId}`;
          this.io.to(room).emit('reaction_updated', {
            messageId,
            reactions: message.reactions
          });

        } catch (error) {
          socket.emit('error', 'Failed to add reaction');
        }
      });

      // User presence updates
      socket.on('update_presence', async (data) => {
        try {
          const { userId, status } = data; // status: 'online', 'away', 'busy', 'offline'
          
          await User.findByIdAndUpdate(userId, {
            presenceStatus: status,
            lastSeen: new Date()
          });

          this.broadcastUserStatus(userId, status !== 'offline');
        } catch (error) {
          console.error('Error updating presence:', error);
        }
      });

      // Handle disconnection
      socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        
        const userId = this.userSockets.get(socket.id);
        if (userId) {
          // Update user offline status
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date()
          });

          // Clean up tracking
          this.connectedUsers.delete(userId);
          this.userSockets.delete(socket.id);

          // Remove from channels
          for (const [channelId, users] of this.channelUsers.entries()) {
            if (users.has(userId)) {
              users.delete(userId);
              socket.to(`channel:${channelId}`).emit('user_left_channel', {
                userId,
                channelId
              });
            }
          }

          // Notify contacts about offline status
          this.broadcastUserStatus(userId, false);
        }
      });
    });
  }

  // Broadcast user online/offline status to their contacts
  async broadcastUserStatus(userId, isOnline) {
    try {
      // Find all conversations this user is part of
      const conversations = await DirectMessage.find({
        participants: userId
      }).populate('participants', '_id');

      const contactIds = new Set();
      conversations.forEach(conv => {
        conv.participants.forEach(participant => {
          if (participant._id.toString() !== userId) {
            contactIds.add(participant._id.toString());
          }
        });
      });

      // Send status update to online contacts
      contactIds.forEach(contactId => {
        const contactSocketId = this.connectedUsers.get(contactId);
        if (contactSocketId) {
          this.io.to(contactSocketId).emit('contact_status_changed', {
            userId,
            isOnline,
            lastSeen: new Date()
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting user status:', error);
    }
  }

  // Send notification for direct messages to offline users
  async sendDirectMessageNotification(conversationId, message, recipientId) {
    try {
      // Only send if recipient is offline
      if (!this.connectedUsers.has(recipientId.toString())) {
        // Here you would integrate with push notification service
        // For now, we'll just log it
        console.log(`Push notification should be sent to user ${recipientId} for message: ${message.content}`);
        
        // You can integrate with services like:
        // - Firebase Cloud Messaging (FCM)
        // - Apple Push Notification Service (APNs)
        // - OneSignal
        // - Pusher Beams
        // - etc.
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  // Get online users in a channel
  getChannelOnlineUsers(channelId) {
    const users = this.channelUsers.get(channelId);
    return users ? Array.from(users) : [];
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(userId.toString());
  }

  // Get user socket
  getUserSocket(userId) {
    const socketId = this.connectedUsers.get(userId.toString());
    return socketId ? this.io.sockets.sockets.get(socketId) : null;
  }
}
export default SocketServer;