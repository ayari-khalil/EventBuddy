// services/messageService.js
import Message from '../models/Message.js';
import Discussion from '../models/Discussion.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

class MessageService {
  // Get all messages for an event with pagination
  async getEventMessages(eventId, page = 1, limit = 50) {
    try {
      const skip = (page - 1) * limit;
      
      // Get parent messages (not replies) with their replies
      const messages = await Message.find({
        eventId,
        parentMessage: null,
        isDeleted: false
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'replies',
        match: { isDeleted: false },
        options: { sort: { createdAt: 1 } }
      });

      // Reverse to show oldest first
      return messages.reverse();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  }

  // Create a new message
  async createMessage(messageData) {
    try {
      const { eventId, authorId, content, parentMessageId = null } = messageData;

      // Check if user is event organizer
      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      const isOrganizer = event.organizer.toString() === authorId.toString();

      const message = new Message({
        eventId,
        author: authorId,
        content,
        parentMessage: parentMessageId,
        isOrganizer
      });

      const savedMessage = await message.save();

      // If it's a reply, add to parent's replies array
      if (parentMessageId) {
        await Message.findByIdAndUpdate(parentMessageId, {
          $push: { replies: savedMessage._id }
        });
      }

      // Update discussion stats
      await Discussion.findOneAndUpdate(
        { eventId },
        { 
          $inc: { messageCount: 1 },
          $set: { lastActivity: new Date() }
        },
        { upsert: true }
      );

      return await Message.findById(savedMessage._id);
    } catch (error) {
      console.error('Error creating message:', error);
      throw new Error('Failed to create message');
    }
  }

  // Update a message
  async updateMessage(messageId, authorId, content) {
    try {
      const message = await Message.findOne({
        _id: messageId,
        author: authorId,
        isDeleted: false
      });

      if (!message) {
        throw new Error('Message not found or unauthorized');
      }

      message.content = content;
      message.isEdited = true;
      message.editedAt = new Date();

      return await message.save();
    } catch (error) {
      console.error('Error updating message:', error);
      throw new Error('Failed to update message');
    }
  }

  // Delete a message (soft delete)
  async deleteMessage(messageId, authorId) {
    try {
      const message = await Message.findOne({
        _id: messageId,
        author: authorId,
        isDeleted: false
      });

      if (!message) {
        throw new Error('Message not found or unauthorized');
      }

      message.isDeleted = true;
      message.deletedAt = new Date();

      await message.save();

      // Update discussion message count
      await Discussion.findOneAndUpdate(
        { eventId: message.eventId },
        { 
          $inc: { messageCount: -1 },
          $set: { lastActivity: new Date() }
        }
      );

      return { success: true };
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Failed to delete message');
    }
  }

  // Add reaction to a message
  async addReaction(messageId, userId, emoji) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      const existingReactionIndex = message.reactions.findIndex(r => r.emoji === emoji);
      
      if (existingReactionIndex >= 0) {
        const reaction = message.reactions[existingReactionIndex];
        const userIndex = reaction.users.indexOf(userId);
        
        if (userIndex >= 0) {
          // Remove user's reaction
          reaction.users.splice(userIndex, 1);
          reaction.count = reaction.users.length;
          
          // Remove reaction if no users left
          if (reaction.count === 0) {
            message.reactions.splice(existingReactionIndex, 1);
          }
        } else {
          // Add user's reaction
          reaction.users.push(userId);
          reaction.count = reaction.users.length;
        }
      } else {
        // Create new reaction
        message.reactions.push({
          emoji,
          users: [userId],
          count: 1
        });
      }

      return await message.save();
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw new Error('Failed to add reaction');
    }
  }

  // Pin/unpin a message
  async togglePin(messageId, userId) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Check if user is event organizer
      const event = await Event.findById(message.eventId);
      if (!event || event.organizer.toString() !== userId.toString()) {
        throw new Error('Only event organizers can pin messages');
      }

      message.isPinned = !message.isPinned;
      return await message.save();
    } catch (error) {
      console.error('Error toggling pin:', error);
      throw new Error('Failed to toggle pin');
    }
  }

  // Get pinned messages for an event
  async getPinnedMessages(eventId) {
    try {
      return await Message.find({
        eventId,
        isPinned: true,
        isDeleted: false
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching pinned messages:', error);
      throw new Error('Failed to fetch pinned messages');
    }
  }

  // Search messages in an event
  async searchMessages(eventId, query, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      return await Message.find({
        eventId,
        isDeleted: false,
        $or: [
          { content: { $regex: query, $options: 'i' } },
          { 'author.name': { $regex: query, $options: 'i' } }
        ]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    } catch (error) {
      console.error('Error searching messages:', error);
      throw new Error('Failed to search messages');
    }
  }

  // Get discussion stats
  async getDiscussionStats(eventId) {
    try {
      const discussion = await Discussion.findOne({ eventId });
      const messageCount = await Message.countDocuments({ eventId, isDeleted: false });
      const participantCount = await Message.distinct('author', { eventId, isDeleted: false });
      const reactionCount = await Message.aggregate([
        { $match: { eventId: eventId, isDeleted: false } },
        { $unwind: '$reactions' },
        { $group: { _id: null, total: { $sum: '$reactions.count' } } }
      ]);

      return {
        messageCount,
        participantCount: participantCount.length,
        reactionCount: reactionCount[0]?.total || 0,
        activeUsers: discussion?.activeUsers?.length || 0,
        pinnedCount: await Message.countDocuments({ eventId, isPinned: true, isDeleted: false })
      };
    } catch (error) {
      console.error('Error getting discussion stats:', error);
      throw new Error('Failed to get discussion stats');
    }
  }
}

export default new MessageService();