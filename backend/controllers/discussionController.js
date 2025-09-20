// controllers/discussionController.js
import Discussion from "../models/Discussion.js";
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

    // Find or create discussion using correct field
    let discussion = await Discussion.findOne({ eventId })
      .populate({
        path: 'messages',
        populate: {
          path: 'author',
          select: 'name avatar initials'
        }
      });

    if (!discussion) {
      discussion = new Discussion({
        eventId,
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

    const discussion = await Discussion.findOne({ eventId });
    if (!discussion) {
      return res.json([]);
    }

    const messages = await Message.find({
      _id: { $in: discussion.messages },
      parentMessage: { $exists: false }
    })
      .populate('author', 'name avatar initials')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name avatar initials' }
      })
      .sort({ createdAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

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
      reactions: message.reactions.map(r => ({
        emoji: r.emoji,
        users: r.users.map(u => u.toString()),
        count: r.count
      })),
      isOrganizer: message.author._id.toString() === discussion.eventId?.createdBy?.toString(),
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
        isOrganizer: reply.author._id.toString() === discussion.eventId?.createdBy?.toString(),
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

    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({ error: "User not found" });
    }

    let discussion = await Discussion.findOne({ eventId });
    if (!discussion) {
      discussion = new Discussion({ eventId, messages: [] });
      await discussion.save();
    }

    const message = new Message({
      content: content.trim(),
      author: authorId,
      parentMessage: parentMessageId || undefined,
      reactions: []
    });

    await message.save();
    await message.populate('author', 'name avatar initials');

    if (parentMessageId) {
      await Message.findByIdAndUpdate(parentMessageId, {
        $push: { replies: message._id }
      });
    } else {
      discussion.messages.push(message._id);
      await discussion.save();
    }

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
      isOrganizer: false,
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

    if (message.author._id.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to edit this message" });
    }

    message.content = content.trim();
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    const transformedMessage = {
      id: message._id.toString(),
      author: {
        id: message.author._id.toString(),
        name: message.author.name,
        avatar: message.author.avatar || '',
        initials: message.author.name.charAt(0).toUpperCase()
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

    if (message.author.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this message" });
    }

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
        existingReaction.users.splice(userIndex, 1);
        existingReaction.count = Math.max(0, existingReaction.count - 1);
        if (existingReaction.count === 0) {
          message.reactions = message.reactions.filter(r => r.emoji !== emoji);
        }
      } else {
        existingReaction.users.push(userId);
        existingReaction.count += 1;
      }
    } else {
      message.reactions.push({
        emoji,
        users: [userId],
        count: 1
      });
    }

    await message.save();

    res.json({
      emoji,
      users: existingReaction ? existingReaction.users.map(u => u.toString()) : [userId],
      count: existingReaction ? existingReaction.count : 1
    });
  } catch (error) {
    console.error("Error adding reaction:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Toggle pin status
export const togglePin = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

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

    const discussion = await Discussion.findOne({ eventId });
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
