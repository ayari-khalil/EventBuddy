// routes/messageRoutes.js
import express from "express";
import Message from "../models/Message.js";
import Discussion from "../models/Discussion.js";

const router = express.Router();

// Get messages for an event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ eventId, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'name email profileImage')
      .populate('reactions.users', 'name')
      .populate('replies');

    const total = await Message.countDocuments({ eventId, isDeleted: false });

    res.json({
      messages: messages.reverse(),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalMessages: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Get discussion info for an event
router.get("/discussion/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    let discussion = await Discussion.findOne({ eventId })
      .populate('activeUsers.user', 'name email profileImage');

    if (!discussion) {
      discussion = new Discussion({ eventId });
      await discussion.save();
    }

    res.json({
      discussion: {
        _id: discussion._id,
        eventId: discussion.eventId,
        messageCount: discussion.messageCount,
        lastActivity: discussion.lastActivity,
        settings: discussion.settings,
        activeUsers: discussion.activeUsers.filter(u => 
          u.lastSeen > new Date(Date.now() - 5 * 60 * 1000)
        )
      }
    });
  } catch (error) {
    console.error("Error fetching discussion:", error);
    res.status(500).json({ error: "Failed to fetch discussion" });
  }
});

// Delete a message (soft delete)
router.delete("/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body; // In a real app, this would come from auth middleware

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only allow the author to delete their message
    if (message.author.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this message" });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// Edit a message
router.patch("/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content, userId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only allow the author to edit their message
    if (message.author.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to edit this message" });
    }

    message.content = content.trim();
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();
    await message.populate('author', 'name email profileImage');

    res.json({ message });
  } catch (error) {
    console.error("Error editing message:", error);
    res.status(500).json({ error: "Failed to edit message" });
  }
});

export default router;