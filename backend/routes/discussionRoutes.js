// routes/discussionRoutes.js
import express from 'express';
import * as discussionController from '../controllers/discussionController.js';
// import { authenticateUser } from '../middleware/auth.js'; // Uncomment when you have auth middleware

const router = express.Router();

// Get messages for an event
router.get('/:eventId/messages', discussionController.getEventMessages);

// Create a new message
router.post('/:eventId/messages', /* authenticateUser, */ discussionController.createMessage);

// Update a message
router.put('/messages/:messageId', /* authenticateUser, */ discussionController.updateMessage);

// Delete a message
router.delete('/messages/:messageId', /* authenticateUser, */ discussionController.deleteMessage);

// Add reaction to message
router.post('/messages/:messageId/reactions', /* authenticateUser, */ discussionController.addReaction);

// Remove reaction from message
router.delete('/messages/:messageId/reactions', /* authenticateUser, */ discussionController.removeReaction);

// Pin/Unpin message
router.patch('/messages/:messageId/pin', /* authenticateUser, */ discussionController.togglePinMessage);

// Get replies for a message
router.get('/messages/:messageId/replies', discussionController.getMessageReplies);

// Search messages in event
router.get('/:eventId/search', discussionController.searchMessages);

export default router;