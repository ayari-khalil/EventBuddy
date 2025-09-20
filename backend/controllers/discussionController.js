// controllers/discussionController.js
import { Discussion } from "../models/Discussion.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import Message from "../models/DiscussionMessage.js";

// Get or create discussion for an event
export const getOrCreateDiscussion = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Find or create discussion
    let discussion = await Discussion.findOne({ event: eventId })
      .populate({
        path: 'messages',
        populate: {
          path: 'author',
          select: 'name avatar initials'
        }
      });

    if (!discussion) {
      discussion = new Discussion({
        event: eventId,
        messages: []
      });
      await discussion.save();
    }

    res.json(discussion);
  } catch (error) {
    console.error("Error getting/creating discussion:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get messages for an event discussion
export const getEventMessages = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Find discussion and populate messages with replies
    const discussion = await Discussion.findOne({ event: eventId });
    if (!discussion) {
      return res.json([]);
    }

    // Get messages with pagination
    const messages = await Message.find({ 
      _id: { $in: discussion.messages },
      parentMessage: { $exists: false } // Only top-level messages
    })
    .populate('author', 'name avatar initials')
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
        select: 'name avatar initials'
      }
    })
    .sort({ createdAt: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Transform to match frontend format
    const transformedMessages = messages.map(message => ({
      id: message._id.toString(),
      author: {
        id: message.author._id.toString(),
        name: message.author.name,
        avatar: message.author.avatar || '',
        initials: message.author.initials || message.author.name.charAt(0).toUpperCase()
      },
      content: message.content,
      timestamp: message.createdAt.toISOString(),
      reactions: message.reactions.map(reaction => ({
        emoji: reaction.emoji,
        users: reaction.users.map(u => u.toString()),
        count: reaction.count
      })),
      isOrganizer: message.author._id.toString() === discussion.event?.createdBy?.toString(),
      isPinned: message.isPinned,
      replies: message.replies?.map(reply => ({
        id: reply._id.toString(),
        author: {
          id: reply.author._id.toString(),
          name: reply.author.name,
          avatar: reply.author.avatar || '',
          initials: reply.author.initials || reply.author.name.charAt(0).toUpperCase()
        },
        content: reply.content,
        timestamp: reply.createdAt.toISOString(),
        reactions: reply.reactions.map(r => ({
          emoji: r.emoji,
          users: r.users.map(u => u.toString()),
          count: r.count
        })),
        isOrganizer: reply.author._id.toString() === discussion.event?.createdBy?.toString(),
        isPinned: false,
        replies: [],
        isEdited: reply.isEdited,
        editedAt: reply.editedAt?.toISOString()
      })) || [],
      isEdited: message.isEdited,
      editedAt: message.editedAt?.toISOString()
    }));

    res.json(transformedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { content, authorId, parentMessageId } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // Check if user exists (in a real app, you'd get this from auth middleware)
    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find or create discussion
    let discussion = await Discussion.findOne({ event: eventId });
    if (!discussion) {
      discussion = new Discussion({ event: eventId, messages: [] });
      await discussion.save();
    }

    // Create the message
    const message = new Message({
      content: content.trim(),
      author: authorId,
      parentMessage: parentMessageId || undefined,
      reactions: []
    });

    await message.save();
    await message.populate('author', 'name avatar initials');

    // If it's a reply, add to parent's replies array
    if (parentMessageId) {
      await Message.findByIdAndUpdate(parentMessageId, {
        $push: { replies: message._id }
      });
    } else {
      // Add to discussion messages if it's a top-level message
      discussion.messages.push(message._id);
      await discussion.save();
    }

    // Transform response to match frontend format
    const transformedMessage = {
      id: message._id.toString(),
      author: {
        id: message.author._id.toString(),
        name: message.author.name,
        avatar: message.author.avatar || '',
        initials: message.author.initials || message.author.name.charAt(0).toUpperCase()
      },
      content: message.content,
      timestamp: message.createdAt.toISOString(),
      reactions: [],
      isOrganizer: false, // You'd need to check against event organizer
      isPinned: false,
      replies: [],
      isEdited: false
    };

    res.status(201).json(transformedMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a message
export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content, userId } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Message content is required" });
    }

    const message = await Message.findById(messageId).populate('author', 'name avatar initials');
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user owns the message (in real app, use auth middleware)
    if (message.author._id.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to edit this message" });
    }

    message.content = content.trim();
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    // Transform response
    const transformedMessage = {
      id: message._id.toString(),
      author: {
        id: message.author._id.toString(),
        name: message.author.name,
        avatar: message.author.avatar || '',
        initials: getInitials(message.author.name)
      },
      content: message.content,
      timestamp: message.createdAt.toISOString(),
      reactions: message.reactions.map(r => ({
        emoji: r.emoji,
        users: r.users.map(u => u.toString()),
        count: r.count
      })),
      isOrganizer: false,
      isPinned: message.isPinned,
      replies: [],
      isEdited: true,
      editedAt: message.editedAt.toISOString()
    };

    res.json(transformedMessage);
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user owns the message
    if (message.author.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this message" });
    }

    // Remove from discussion or parent message
    if (message.parentMessage) {
      await Message.findByIdAndUpdate(message.parentMessage, {
        $pull: { replies: messageId }
      });
    } else {
      await Discussion.updateOne(
        { messages: messageId },
        { $pull: { messages: messageId } }
      );
    }

    // Delete the message and its replies
    await Message.deleteMany({ parentMessage: messageId });
    await Message.findByIdAndDelete(messageId);

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Add reaction to message
export const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji, userId } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const existingReaction = message.reactions.find(r => r.emoji === emoji);

    if (existingReaction) {
      const userIndex = existingReaction.users.indexOf(userId);
      if (userIndex > -1) {
        // Remove reaction
        existingReaction.users.splice(userIndex, 1);
        existingReaction.count = Math.max(0, existingReaction.count - 1);
        
        // Remove reaction if no users
        if (existingReaction.count === 0) {
          message.reactions = message.reactions.filter(r => r.emoji !== emoji);
        }
      } else {
        // Add reaction
        existingReaction.users.push(userId);
        existingReaction.count += 1;
      }
    } else {
      // New reaction
      message.reactions.push({
        emoji,
        users: [userId],
        count: 1
      });
    }

    await message.save();

    const transformedReaction = {
      emoji,
      users: existingReaction ? existingReaction.users.map(u => u.toString()) : [userId],
      count: existingReaction ? existingReaction.count : 1
    };

    res.json(transformedReaction);
  } catch (error) {
    console.error("Error adding reaction:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Toggle pin status
export const togglePin = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user is event organizer (simplified check)
    message.isPinned = !message.isPinned;
    await message.save();

    res.json({ isPinned: message.isPinned });
  } catch (error) {
    console.error("Error toggling pin:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get discussion stats
export const getDiscussionStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    const discussion = await Discussion.findOne({ event: eventId });
    if (!discussion) {
      return res.json({
        totalMessages: 0,
        totalParticipants: 0,
        totalReactions: 0,
        pinnedMessages: 0
      });
    }

    const messages = await Message.find({ _id: { $in: discussion.messages } });
    const participants = new Set();
    let totalReactions = 0;
    let pinnedMessages = 0;

    messages.forEach(message => {
      participants.add(message.author.toString());
      totalReactions += message.reactions.reduce((sum, r) => sum + r.count, 0);
      if (message.isPinned) pinnedMessages++;
    });

    res.json({
      totalMessages: messages.length,
      totalParticipants: participants.size,
      totalReactions,
      pinnedMessages
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ error: "Server error" });
  }
};