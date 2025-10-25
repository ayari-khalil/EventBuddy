import DirectMessage from '../models/DirectMessage.js';
import DirectMessageContent from '../models/DirectMessageContent.js';
import User from '../models/User.js';

class DirectMessageService {
  // Get or create a conversation between two users
  async getOrCreateConversation(userId1, userId2, relatedEventId = null) {
    try {
      // Find existing conversation
      let conversation = await DirectMessage.findOne({
        participants: { $all: [userId1, userId2] }
      })
        .populate('participants', 'name email avatar role')
        .populate('lastMessage')
        .populate('relatedEvent', 'title');

      // Create new conversation if doesn't exist
      if (!conversation) {
        conversation = await DirectMessage.create({
          participants: [userId1, userId2],
          relatedEvent: relatedEventId || null
        });

        conversation = await DirectMessage.findById(conversation._id)
          .populate('participants', 'name email avatar role')
          .populate('relatedEvent', 'title');
      }

      return conversation;
    } catch (error) {
      throw new Error(`Error getting/creating conversation: ${error.message}`);
    }
  }

  // Get all conversations for a user
  async getUserConversations(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const conversations = await DirectMessage.find({
        participants: userId
      })
        .populate('participants', 'name email avatar role')
        .populate({
          path: 'lastMessage',
          populate: { path: 'sender', select: 'name email avatar' }
        })
        .populate('relatedEvent', 'title')
        .sort({ lastActivity: -1 })
        .skip(skip)
        .limit(limit);

      return conversations;
    } catch (error) {
      throw new Error(`Error getting conversations: ${error.message}`);
    }
  }

  // Get messages for a conversation
  async getConversationMessages(conversationId, userId, page = 1, limit = 50) {
    try {
      // Verify user is participant
      const conversation = await DirectMessage.findById(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        throw new Error('Unauthorized access to conversation');
      }

      const skip = (page - 1) * limit;

      const messages = await DirectMessageContent.find({
        directMessageId: conversationId
      })
        .populate('sender', 'name email avatar')
        .populate('reactions.users', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return messages.reverse();
    } catch (error) {
      throw new Error(`Error getting messages: ${error.message}`);
    }
  }

  // Send a message
  async sendMessage(conversationId, senderId, content, messageType = 'text') {
    try {
      // Verify conversation exists and user is participant
      const conversation = await DirectMessage.findById(conversationId);
      if (!conversation || !conversation.participants.includes(senderId)) {
        throw new Error('Unauthorized to send message');
      }

      // Create message
      const message = await DirectMessageContent.create({
        directMessageId: conversationId,
        sender: senderId,
        content: content.trim(),
        messageType
      });

      // Update conversation
      await DirectMessage.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        lastActivity: new Date(),
        $inc: { messageCount: 1 }
      });

      // Populate sender info
      const populatedMessage = await DirectMessageContent.findById(message._id)
        .populate('sender', 'name email avatar');

      return populatedMessage;
    } catch (error) {
      throw new Error(`Error sending message: ${error.message}`);
    }
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId, userId) {
    try {
      const conversation = await DirectMessage.findById(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        throw new Error('Unauthorized access');
      }

      // Find all unread messages in this conversation
      const unreadMessages = await DirectMessageContent.find({
        directMessageId: conversationId,
        sender: { $ne: userId },
        'readBy.user': { $ne: userId }
      });

      // Mark each as read
      for (const message of unreadMessages) {
        message.readBy.push({
          user: userId,
          readAt: new Date()
        });
        await message.save();
      }

      return unreadMessages.length;
    } catch (error) {
      throw new Error(`Error marking messages as read: ${error.message}`);
    }
  }

  // Get unread message count for user
  async getUnreadCount(userId) {
    try {
      const conversations = await DirectMessage.find({
        participants: userId
      }).select('_id');

      const conversationIds = conversations.map(c => c._id);

      const unreadCount = await DirectMessageContent.countDocuments({
        directMessageId: { $in: conversationIds },
        sender: { $ne: userId },
        'readBy.user': { $ne: userId }
      });

      return unreadCount;
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

      // Find existing reaction with this emoji
      const existingReaction = message.reactions.find(r => r.emoji === emoji);

      if (existingReaction) {
        // Toggle reaction
        const userIndex = existingReaction.users.indexOf(userId);
        if (userIndex > -1) {
          existingReaction.users.splice(userIndex, 1);
          existingReaction.count--;
          if (existingReaction.count === 0) {
            message.reactions = message.reactions.filter(r => r.emoji !== emoji);
          }
        } else {
          existingReaction.users.push(userId);
          existingReaction.count++;
        }
      } else {
        // Add new reaction
        message.reactions.push({
          emoji,
          users: [userId],
          count: 1
        });
      }

      await message.save();
      return message;
    } catch (error) {
      throw new Error(`Error adding reaction: ${error.message}`);
    }
  }
}

const directMessageService = new DirectMessageService();

// Socket.IO setup for direct messaging
export const setupDirectMessageSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected to DM: ${socket.id}`);

    // Join DM system
    socket.on("join_dm_system", async (data) => {
      try {
        const { userId } = data;
        socket.userId = userId;
        socket.join(`user_${userId}`);

        // Get unread count
        const unreadCount = await directMessageService.getUnreadCount(userId);
        socket.emit("unread_count_update", { unreadCount });

        console.log(`User ${userId} joined DM system`);
      } catch (error) {
        console.error("Error joining DM system:", error);
        socket.emit("dm_error", { message: error.message });
      }
    });

    // Join conversation
    socket.on("join_conversation", async (data) => {
      try {
        const { conversationId } = data;
        
        // Verify user is participant
        const conversation = await DirectMessage.findById(conversationId);
        if (!conversation || !conversation.participants.includes(socket.userId)) {
          socket.emit("dm_error", { message: "Unauthorized" });
          return;
        }

        socket.join(`dm_${conversationId}`);

        // Get messages
        const messages = await directMessageService.getConversationMessages(
          conversationId,
          socket.userId
        );

        socket.emit("conversation_joined", { messages, conversation });

        // Mark as read
        await directMessageService.markMessagesAsRead(conversationId, socket.userId);
        const unreadCount = await directMessageService.getUnreadCount(socket.userId);
        socket.emit("unread_count_update", { unreadCount });

        console.log(`User ${socket.userId} joined conversation ${conversationId}`);
      } catch (error) {
        console.error("Error joining conversation:", error);
        socket.emit("dm_error", { message: error.message });
      }
    });

    // Send message
    socket.on("send_dm", async (data) => {
      try {
        const { conversationId, content, messageType = 'text' } = data;

        if (!content || content.trim().length === 0) {
          socket.emit("dm_error", { message: "Message content required" });
          return;
        }

        const message = await directMessageService.sendMessage(
          conversationId,
          socket.userId,
          content,
          messageType
        );

        // Emit to conversation
        io.to(`dm_${conversationId}`).emit("new_dm", { message });

        // Update unread for other participant
        const conversation = await DirectMessage.findById(conversationId);
        for (const participantId of conversation.participants) {
          if (participantId.toString() !== socket.userId.toString()) {
            const unreadCount = await directMessageService.getUnreadCount(participantId);
            io.to(`user_${participantId}`).emit("unread_count_update", { unreadCount });
          }
        }
      } catch (error) {
        console.error("Error sending DM:", error);
        socket.emit("dm_error", { message: error.message });
      }
    });

    // Typing indicator
    socket.on("dm_typing", (data) => {
      const { conversationId, isTyping } = data;
      socket.to(`dm_${conversationId}`).emit("dm_user_typing", {
        userId: socket.userId,
        isTyping
      });
    });

    // Leave conversation
    socket.on("leave_conversation", (data) => {
      const { conversationId } = data;
      socket.leave(`dm_${conversationId}`);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected from DM: ${socket.id}`);
    });
  });
};

// Controller
class DirectMessageController {
  async getOrCreateConversation(req, res) {
    try {
      const { otherUserId } = req.params;
      const { relatedEventId } = req.query;
      
      // Get userId from req.user (set by auth middleware) or from body as fallback
      const userId = req.user?.id || req.user?._id || req.body.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (userId === otherUserId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot create conversation with yourself'
        });
      }

      const conversation = await directMessageService.getOrCreateConversation(
        userId,
        otherUserId,
        relatedEventId
      );

      res.json({
        success: true,
        data: conversation
      });
    } catch (error) {
      console.error('Error in getOrCreateConversation:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getConversations(req, res) {
  try {
    // TEMPORARY: Accept userId from query for testing
    const userId = req.user?.id || req.user?._id || req.query.userId;
    const { page = 1, limit = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required - userId missing'
      });
    }

    console.log('Getting conversations for userId:', userId); // Debug log

    const conversations = await directMessageService.getUserConversations(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Error in getConversations:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const userId = req.user?.id || req.user?._id || req.query.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const messages = await directMessageService.getConversationMessages(
        conversationId,
        userId,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error('Error in getMessages:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async sendMessage(req, res) {
    try {
      const { conversationId } = req.params;
      const { content, messageType = 'text' } = req.body;
      const userId = req.user?.id || req.user?._id || req.body.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Message content is required'
        });
      }

      const message = await directMessageService.sendMessage(
        conversationId,
        userId,
        content,
        messageType
      );

      res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async markAsRead(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user?.id || req.user?._id || req.body.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      await directMessageService.markMessagesAsRead(conversationId, userId);

      res.json({
        success: true,
        message: 'Messages marked as read'
      });
    } catch (error) {
      console.error('Error in markAsRead:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const userId = req.user?.id || req.user?._id || req.query.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const count = await directMessageService.getUnreadCount(userId);

      res.json({
        success: true,
        data: { unreadCount: count }
      });
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new DirectMessageController();