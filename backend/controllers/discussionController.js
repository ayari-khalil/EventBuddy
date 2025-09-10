// controllers/discussionController.js
import DiscussionMessage from '../models/DiscussionMessage.js';
import Event from '../models/Event.js';
import mongoose from 'mongoose';

// Get all messages for an event
export const getEventMessages = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 50, parentId = null } = req.query;

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const query = {
      event: eventId,
      isDeleted: false,
      ...(parentId ? { parentMessage: parentId } : { parentMessage: null })
    };

    const messages = await DiscussionMessage.find(query)
      .populate('author', 'firstName lastName avatar')
      .populate('replies', 'author content createdAt')
      .populate('reactions.user', 'firstName lastName')
      .populate('pinnedBy', 'firstName lastName')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await DiscussionMessage.countDocuments(query);

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { content, parentMessageId, mentions } = req.body;
    const authorId = req.user?.id; // Assuming auth middleware sets req.user

    if (!authorId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Validate parent message if replying
    let parentMessage = null;
    if (parentMessageId) {
      parentMessage = await DiscussionMessage.findById(parentMessageId);
      if (!parentMessage || parentMessage.event.toString() !== eventId) {
        return res.status(400).json({ message: 'Invalid parent message' });
      }
    }

    const messageData = {
      event: eventId,
      author: authorId,
      content: content.trim(),
      parentMessage: parentMessageId || null,
      mentions: mentions || []
    };

    const message = new DiscussionMessage(messageData);
    await message.save();

    // If this is a reply, add to parent's replies array
    if (parentMessage) {
      parentMessage.replies.push(message._id);
      await parentMessage.save();
    }

    // Populate the message before sending
    await message.populate('author', 'firstName lastName avatar');
    await message.populate('mentions', 'firstName lastName');

    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a message
export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    const message = await DiscussionMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the author
    if (message.author.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this message' });
    }

    if (message.isDeleted) {
      return res.status(400).json({ message: 'Cannot edit deleted message' });
    }

    // Add to edit history
    if (message.content !== content.trim()) {
      message.editHistory.push({
        content: message.content,
        editedAt: new Date()
      });
      message.isEdited = true;
    }

    message.content = content.trim();
    await message.save();

    await message.populate('author', 'firstName lastName avatar');
    res.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id;

    const message = await DiscussionMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the author or event organizer
    const event = await Event.findById(message.event);
    const isAuthor = message.author.toString() === userId;
    const isOrganizer = event.createdBy?.toString() === userId;

    if (!isAuthor && !isOrganizer) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await message.softDelete(userId);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add reaction to message
export const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user?.id;

    const message = await DiscussionMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.isDeleted) {
      return res.status(400).json({ message: 'Cannot react to deleted message' });
    }

    await message.addReaction(userId, emoji);
    await message.populate('reactions.user', 'firstName lastName');

    res.json({ 
      reactions: message.reactions,
      reactionCounts: message.reactionCounts 
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove reaction from message
export const removeReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user?.id;

    const message = await DiscussionMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.removeReaction(userId, emoji);
    await message.populate('reactions.user', 'firstName lastName');

    res.json({ 
      reactions: message.reactions,
      reactionCounts: message.reactionCounts 
    });
  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Pin/Unpin message
export const togglePinMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id;

    const message = await DiscussionMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is event organizer
    const event = await Event.findById(message.event);
    if (event.createdBy?.toString() !== userId) {
      return res.status(403).json({ message: 'Only event organizers can pin messages' });
    }

    message.isPinned = !message.isPinned;
    message.pinnedBy = message.isPinned ? userId : null;
    await message.save();

    await message.populate('author', 'firstName lastName avatar');
    await message.populate('pinnedBy', 'firstName lastName');

    res.json(message);
  } catch (error) {
    console.error('Error toggling pin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get message replies
export const getMessageReplies = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const replies = await DiscussionMessage.find({
      parentMessage: messageId,
      isDeleted: false
    })
    .populate('author', 'firstName lastName avatar')
    .populate('reactions.user', 'firstName lastName')
    .sort({ createdAt: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const total = await DiscussionMessage.countDocuments({
      parentMessage: messageId,
      isDeleted: false
    });

    res.json({
      replies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search messages
export const searchMessages = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const searchQuery = {
      event: eventId,
      isDeleted: false,
      $text: { $search: q }
    };

    const messages = await DiscussionMessage.find(searchQuery)
      .populate('author', 'firstName lastName avatar')
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await DiscussionMessage.countDocuments(searchQuery);

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      query: q
    });
  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};