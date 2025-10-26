import directMessageService from '../services/directMessageService.js';

class DirectMessageController {
  // Get or create conversation
  async getOrCreateConversation(req, res) {
    try {
      const { otherUserId } = req.params;
      const { relatedEventId } = req.query;
      const userId = req.user?.id;

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

  // Get user conversations
  async getConversations(req, res) {
    try {
      const userId = req.user?.id;
      const { page = 1, limit = 20 } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

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

  // Get conversation messages
  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const userId = req.user?.id;

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

  // Send message
  async sendMessage(req, res) {
    try {
      const { conversationId } = req.params;
      const { content, messageType = 'text' } = req.body;
      const userId = req.user?.id;

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

  // Mark messages as read
  async markAsRead(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user?.id;

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

  // Get unread count
  async getUnreadCount(req, res) {
    try {
      const userId = req.user?.id;

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


async startConversationWithEventOwner(req, res) {
    try {
      const { eventId } = req.params;
      
      // Récupérer l'utilisateur actuel
      const userId = req.user?.id || req.user?._id || req.body.userId || req.query.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required - userId missing'
        });
      }

      console.log('Finding event:', eventId);

      // ✅ Utilisez "createdBy" au lieu de "owner"
      const event = await Event.findById(eventId).populate('createdBy', 'name email avatar role');
      
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      console.log('Event found:', event.title);
      console.log('Event creator:', event.createdBy);

      // ✅ Récupérer l'ID depuis createdBy
      const ownerId = event.createdBy?._id || event.createdBy;

      if (!ownerId) {
        return res.status(404).json({
          success: false,
          message: 'Event creator not found'
        });
      }

      // Vérifier que l'utilisateur n'essaie pas de discuter avec lui-même
      if (userId.toString() === ownerId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'You cannot start a conversation with yourself'
        });
      }

      console.log(`Creating conversation between ${userId} and ${ownerId}`);

      // Créer ou récupérer la conversation
      const conversation = await directMessageService.getOrCreateConversation(
        userId,
        ownerId.toString(),
        eventId
      );

      console.log('✅ Conversation created/found:', conversation._id);

      res.json({
        success: true,
        data: conversation,
        eventInfo: {
          title: event.title,
          creator: { // ✅ Changé de "owner" à "creator"
            _id: event.createdBy._id || event.createdBy,
            name: event.createdBy.name || 'Unknown',
            avatar: event.createdBy.avatar || null,
            role: event.createdBy.role || null
          }
        }
      });
    } catch (error) {
      console.error('Error in startConversationWithEventOwner:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}

const directMessageService = new DirectMessageService();
export default new DirectMessageController();
export { setupDirectMessageSocket };