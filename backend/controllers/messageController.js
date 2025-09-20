// controllers/messageController.js
import messageService from '../services/messageService.js';

class MessageController {
  // Get messages for an event
  async getMessages(req, res) {
    try {
      const { eventId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const messages = await messageService.getEventMessages(
        eventId, 
        parseInt(page), 
        parseInt(limit)
      );

      res.json({
        success: true,
        data: messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: messages.length
        }
      });
    } catch (error) {
      console.error('Error in getMessages:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch messages'
      });
    }
  }

  // Create a new message
  async createMessage(req, res) {
    try {
      const { eventId } = req.params;
      const { content, parentMessageId } = req.body;
      const authorId = req.user?.id; // Assuming you have auth middleware

      if (!authorId) {
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

      if (content.length > 2000) {
        return res.status(400).json({
          success: false,
          message: 'Message content too long (max 2000 characters)'
        });
      }

      const message = await messageService.createMessage({
        eventId,
        authorId,
        content: content.trim(),
        parentMessageId
      });

      res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Error in createMessage:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create message'
      });
    }
  }

  // Update a message
  async updateMessage(req, res) {
    try {
      const { messageId } = req.params;
      const { content } = req.body;
      const authorId = req.user?.id;

      if (!authorId) {
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

      if (content.length > 2000) {
        return res.status(400).json({
          success: false,
          message: 'Message content too long (max 2000 characters)'
        });
      }

      const message = await messageService.updateMessage(
        messageId,
        authorId,
        content.trim()
      );

      res.json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Error in updateMessage:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update message'
      });
    }
  }

  // Delete a message
  async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;
      const authorId = req.user?.id;

      if (!authorId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      await messageService.deleteMessage(messageId, authorId);

      res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete message'
      });
    }
  }

  // Add reaction to a message
  async addReaction(req, res) {
    try {
      const { messageId } = req.params;
      const { emoji } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!emoji) {
        return res.status(400).json({
          success: false,
          message: 'Emoji is required'
        });
      }

      const message = await messageService.addReaction(messageId, userId, emoji);

      res.json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Error in addReaction:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to add reaction'
      });
    }
  }

  // Pin/unpin a message
  async togglePin(req, res) {
    try {
      const { messageId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const message = await messageService.togglePin(messageId, userId);

      res.json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Error in togglePin:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to toggle pin'
      });
    }
  }

  // Get pinned messages
  async getPinnedMessages(req, res) {
    try {
      const { eventId } = req.params;

      const messages = await messageService.getPinnedMessages(eventId);

      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error('Error in getPinnedMessages:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch pinned messages'
      });
    }
  }

  // Search messages
  async searchMessages(req, res) {
    try {
      const { eventId } = req.params;
      const { q: query, page = 1, limit = 20 } = req.query;

      if (!query || query.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const messages = await messageService.searchMessages(
        eventId,
        query.trim(),
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: messages.length
        }
      });
    } catch (error) {
      console.error('Error in searchMessages:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search messages'
      });
    }
  }

  // Get discussion stats
  async getStats(req, res) {
    try {
      const { eventId } = req.params;

      const stats = await messageService.getDiscussionStats(eventId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch discussion stats'
      });
    }
  }
}

export default new MessageController();