// routes/discussion.js
import express from "express";
import multer from "multer";
import path from "path";

import Event from "../models/Event.js";
import DiscussionChannel from "../models/DiscussionChannel.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const router = express.Router();


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'voice') {
      cb(null, 'uploads/voice/');
    } else if (file.fieldname === 'image') {
      cb(null, 'uploads/images/');
    } else {
      cb(null, 'uploads/files/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Get or create discussion channel for an event
router.post('/events/:eventId/channel', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body; // Current user

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    let channel = await DiscussionChannel.findOne({ event: eventId });
    
    if (!channel) {
      // Create new discussion channel
      channel = new DiscussionChannel({
        event: eventId,
        name: `Discussion - ${event.title}`,
        description: `Discussion générale pour l'événement ${event.title}`,
        type: 'general',
        participants: [userId],
        admins: [event.organizer]
      });
      await channel.save();
      
      // Update event with channel reference
      event.discussionChannel = channel._id;
      await event.save();
    } else {
      // Add user to participants if not already there
      if (!channel.participants.includes(userId)) {
        channel.participants.push(userId);
        await channel.save();
      }
    }

    await channel.populate(['participants', 'admins']);
    res.json(channel);
  } catch (error) {
    console.error('Error creating/getting channel:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get channel messages with pagination
router.get('/channels/:channelId/messages', async (req, res) => {
  try {
    const { channelId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ channel: channelId })
      .populate('sender', 'name avatar role company')
      .populate('replyTo', 'content sender')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(messages.reverse()); // Reverse to get chronological order
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send text message
router.post('/channels/:channelId/messages', async (req, res) => {
  try {
    const { channelId } = req.params;
    const { content, senderId, replyTo } = req.body;

    const channel = await DiscussionChannel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const message = new Message({
      channel: channelId,
      sender: senderId,
      content,
      type: 'text',
      replyTo: replyTo || null
    });

    await message.save();
    await message.populate('sender', 'name avatar role company');

    // Update channel last activity and message count
    channel.messageCount += 1;
    channel.lastActivity = new Date();
    await channel.save();

    // If it's a reply, add to parent message
    if (replyTo) {
      await Message.findByIdAndUpdate(replyTo, {
        $push: { replies: message._id }
      });
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send voice message
router.post('/channels/:channelId/messages/voice', upload.single('voice'), async (req, res) => {
  try {
    const { channelId } = req.params;
    const { senderId, duration } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No voice file uploaded' });
    }

    const channel = await DiscussionChannel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const message = new Message({
      channel: channelId,
      sender: senderId,
      type: 'voice',
      voiceUrl: `/uploads/voice/${req.file.filename}`,
      voiceDuration: parseInt(duration)
    });

    await message.save();
    await message.populate('sender', 'name avatar role company');

    // Update channel
    channel.messageCount += 1;
    channel.lastActivity = new Date();
    await channel.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending voice message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send image message
router.post('/channels/:channelId/messages/image', upload.single('image'), async (req, res) => {
  try {
    const { channelId } = req.params;
    const { senderId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const channel = await DiscussionChannel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const message = new Message({
      channel: channelId,
      sender: senderId,
      type: 'image',
      fileUrl: `/uploads/images/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });

    await message.save();
    await message.populate('sender', 'name avatar role company');

    // Update channel
    channel.messageCount += 1;
    channel.lastActivity = new Date();
    await channel.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending image:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add reaction to message
router.post('/messages/:messageId/reactions', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji, userId } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const existingReaction = message.reactions.find(r => r.emoji === emoji);
    
    if (existingReaction) {
      // Toggle user reaction
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
      // Add new reaction
      message.reactions.push({
        emoji,
        users: [userId]
      });
    }

    await message.save();
    res.json(message);
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark messages as read
router.post('/channels/:channelId/read', async (req, res) => {
  try {
    const { channelId } = req.params;
    const { userId, messageIds } = req.body;

    await Message.updateMany(
      { 
        _id: { $in: messageIds },
        'readBy.user': { $ne: userId }
      },
      { 
        $push: { 
          readBy: { 
            user: userId,
            readAt: new Date()
          }
        }
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get channel participants
router.get('/channels/:channelId/participants', async (req, res) => {
  try {
    const { channelId } = req.params;
    
    const channel = await DiscussionChannel.findById(channelId)
      .populate('participants', 'name avatar role company isOnline lastSeen');
    
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    res.json(channel.participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;