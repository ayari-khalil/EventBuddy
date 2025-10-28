import express from 'express';
//import directMessageController from '../controllers/directMessageController.js';
import directMessageController from '../services/directMessageService.js';// Assuming you have auth middleware
// import { authenticateToken } from '../middleware/auth.js';
import DirectMessageController from '../services/directMessageService.js';
import DirectMessage from '../models/DirectMessage.js'; // ✅ Import du modèle


const router = express.Router();

// Apply auth middleware to all routes
// router.use(authenticateToken);

router.get('/conversations', directMessageController.getConversations);
router.get('/conversations/:otherUserId', directMessageController.getOrCreateConversation);
router.get('/:conversationId/messages', directMessageController.getMessages);
router.post('/:conversationId/messages', directMessageController.sendMessage);
router.patch('/:conversationId/read', directMessageController.markAsRead);
router.get('/unread-count', directMessageController.getUnreadCount);
router.post('/start-with-event-owner/:eventId', DirectMessageController.startConversationWithEventOwner);
router.post('/start-conversation', async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;
    
    if (!userId || !targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'userId et targetUserId sont requis'
      });
    }
    
    if (userId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas créer une conversation avec vous-même'
      });
    }
    
    // Vérifier si une conversation existe déjà
    let conversation = await DirectMessage.findOne({
      participants: { $all: [userId, targetUserId] }
    });
    
    // Si elle existe, la retourner
    if (conversation) {
      return res.json({
        success: true,
        data: conversation,
        message: 'Conversation existante trouvée'
      });
    }
    
    // Sinon, créer une nouvelle conversation
    conversation = new DirectMessage({
      participants: [userId, targetUserId],
      messages: [],
      createdAt: new Date(),
      lastMessageAt: new Date()
    });
    
    await conversation.save();
    
    res.json({
      success: true,
      data: conversation,
      message: 'Nouvelle conversation créée'
    });
    
  } catch (error) {
    console.error('Error in start-conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la conversation',
      error: error.message
    });
  }
});


export default router;