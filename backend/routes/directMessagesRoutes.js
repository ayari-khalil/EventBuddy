import express from 'express';
//import directMessageController from '../controllers/directMessageController.js';
import directMessageController from '../services/directMessageService.js';// Assuming you have auth middleware
// import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
// router.use(authenticateToken);

router.get('/conversations', directMessageController.getConversations);
router.get('/conversations/:otherUserId', directMessageController.getOrCreateConversation);
router.get('/:conversationId/messages', directMessageController.getMessages);
router.post('/:conversationId/messages', directMessageController.sendMessage);
router.patch('/:conversationId/read', directMessageController.markAsRead);
router.get('/unread-count', directMessageController.getUnreadCount);


export default router;