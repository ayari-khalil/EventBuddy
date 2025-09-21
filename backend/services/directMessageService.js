import DirectMessage from '../models/DirectMessage.js';
import DirectMessageContent from '../models/DirectMessageContent.js';
import User from '../models/User.js';

class DirectMessageService {
  // Get or create conversation between two users
  async getOrCreateConversation(user1Id, user2Id, relatedEventId = null) {
    try {
      // Check if conversation already exists
      let conversation = await DirectMessage.findOne({
        participants: { $all: [user1Id, user2Id] }
      })
      .populate('participants', 'name email avatar')
      .populate('lastMessage');

      if (!conversation) {
        // Create new conversation
        conversation = new DirectMessage({
          participants: [user1Id, user2Id],
          relatedEvent: relatedEventId,
          messageCount: 0
        });
        await conversation.save();
        await conversation.populate('participants', 'name email avatar');
      }

      return conversation;
    } catch (error) {
      throw new Error(`Error creating/finding conversation: ${error.message}`);
    }
  }

  // Get user's conversations
  async getUserConversations(userId, page = 1, limit = 20) {
    try {
      const conversations = await DirectMessage.find({
        participants: userId
      })
      .populate('participants', 'name email avatar lastActive')
      .populate('lastMessage')
      .populate('relatedEvent', 'title')
      .sort({ lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

      return conversations.map(conv => {
        const otherUser = conv.participants.find(p => p._id.toString() !== userId.toString());
        return {
          ...conv.toObject(),
          otherUser
        };
      });
    } catch (error) {
      throw new Error(`Error fetching conversations: ${error.message}`);
    }
  }

  // Get messages in a conversation
  async getConversationMessages(conversationId, userId, page = 1, limit = 50) {
    try {
      // Verify user is participant
      const conversation = await DirectMessage.findById(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        throw new Error('Unauthorized access to conversation');
      }

      const messages = await DirectMessageContent.find({
        directMessageId: conversationId
      })
      .populate('sender', 'name email avatar')
      .populate('reactions.users', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      throw new Error(`Error fetching messages: ${error.message}`);
    }
  }

  // Send a message
  async sendMessage(conversationId, senderId, content, messageType = 'text') {
    try {
      // Verify conversation exists and user is participant
      const conversation = await DirectMessage.findById(conversationId);
      if (!conversation || !conversation.participants.includes(senderId)) {
        throw new Error('Unauthorized access to conversation');
      }

      // Create message
      const message = new DirectMessageContent({
        directMessageId: conversationId,
        sender: senderId,
        content: content.trim(),
        messageType
      });

      await message.save();
      await message.populate('sender', 'name email avatar');

      // Update conversation
      conversation.lastMessage = message._id;
      conversation.lastActivity = new Date();
      conversation.messageCount += 1;
      await conversation.save();

      return message;
    } catch (error) {
      throw new Error(`Error sending message: ${error.message}`);
    }
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId, userId) {
    try {
      await DirectMessageContent.updateMany(
        {
          directMessageId: conversationId,
          sender: { $ne: userId },
          'readBy.user': { $ne: userId }
        },
        {
          $push: { readBy: { user: userId, readAt: new Date() } }
        }
      );
    } catch (error) {
      throw new Error(`Error marking messages as read: ${error.message}`);
    }
  }

  // Get unread count for user
  async getUnreadCount(userId) {
    try {
      const conversations = await DirectMessage.find({
        participants: userId
      });

      let totalUnread = 0;
      for (const conv of conversations) {
        const unreadCount = await DirectMessageContent.countDocuments({
          directMessageId: conv._id,
          sender: { $ne: userId },
          'readBy.user': { $ne: userId }
        });
        totalUnread += unreadCount;
      }

      return totalUnread;
    } catch (error) {
      throw new Error(`Error getting unread count: ${error.message}`);
    }
  }

  // Add reaction to message
  async addReaction(messageId, userId, emoji) {
    try {
      const message = await DirectMessageContent.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      let reaction = message.reactions.find(r => r.emoji === emoji);
      if (reaction) {
        if (reaction.users.includes(userId)) {
          reaction.users = reaction.users.filter(id => id.toString() !== userId.toString());
          reaction.count = reaction.users.length;
          if (reaction.count === 0) {
            message.reactions = message.reactions.filter(r => r.emoji !== emoji);
          }
        } else {
          reaction.users.push(userId);
          reaction.count = reaction.users.length;
        }
      } else {
        message.reactions.push({ emoji, users: [userId], count: 1 });
      }

      await message.save();
      await message.populate('reactions.users', 'name');
      return message;
    } catch (error) {
      throw new Error(`Error adding reaction: ${error.message}`);
    }
  }
}

export default new DirectMessageService();
