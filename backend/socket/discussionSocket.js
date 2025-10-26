// socket/discussionSocket.js
import Discussion from "../models/Discussion.js";
import Message from "../models/Message.js";
import Event from "../models/Event.js";

let io;

export const initializeSocket = (socketIO) => {
  // ✅ Utilisez l'instance passée au lieu d'en créer une nouvelle
  io = socketIO;

  io.on("connection", (socket) => {
    console.log(`📡 User connected to discussion: ${socket.id}`);

    // Initialize storage for multiple events
    socket.userId = null;
    socket.eventIds = [];

    // Join discussion
    socket.on("join_discussion", async (data) => {
      try {
        const { userId, eventId } = data;

        if (!userId || !eventId) {
          socket.emit("error", { message: "Missing userId or eventId" });
          return;
        }

        // Save userId if not already stored
        if (!socket.userId) socket.userId = userId;

        // Join event room only once
        if (!socket.eventIds.includes(eventId)) {
          socket.eventIds.push(eventId);
          socket.join(`event_${eventId}`);
        }

        // Find or create discussion
        let discussion = await Discussion.findOne({ eventId });
        if (!discussion) {
          discussion = await Discussion.create({ eventId, messageCount: 0 });
        }

        await discussion.addActiveUser(userId);
        await discussion.populate("activeUsers.user", "name email profileImage");

        // Broadcast active users
        const activeUsers = discussion.activeUsers.filter(
          (u) => u.lastSeen > new Date(Date.now() - 5 * 60 * 1000)
        );

        io.to(`event_${eventId}`).emit("active_users_update", {
          activeUsers: activeUsers.map((u) => ({
            _id: u.user._id,
            name: u.user.name,
            email: u.user.email,
            profileImage: u.user.profileImage,
            isTyping: u.isTyping,
            lastSeen: u.lastSeen
          }))
        });

        // Send last 50 messages
        const messages = await Message.find({ eventId })
          .sort({ createdAt: -1 })
          .limit(50)
          .populate("author", "name email profileImage")
          .populate("reactions.users", "name");

        socket.emit("discussion_joined", {
          messages: messages.reverse(),
          discussion: {
            _id: discussion._id,
            messageCount: discussion.messageCount,
            settings: discussion.settings
          }
        });

        console.log(`✅ User ${userId} joined discussion for event ${eventId}`);
      } catch (error) {
        console.error("Error joining discussion:", error);
        socket.emit("error", { message: "Failed to join discussion" });
      }
    });

    // Send message
    socket.on("send_message", async (data) => {
      try {
        const { eventId, userId, content, parentMessageId } = data;

        if (!content || !content.trim()) {
          socket.emit("error", { message: "Message content is required" });
          return;
        }

        const message = new Message({
          eventId,
          author: userId,
          content: content.trim(),
          parentMessage: parentMessageId || null
        });

        await message.save();
        await message.populate("author", "name email profileImage");

        // Update discussion stats
        const discussion = await Discussion.findOne({ eventId });
        if (discussion) {
          discussion.messageCount += 1;
          discussion.lastActivity = new Date();
          await discussion.save();
        }

        if (parentMessageId) {
          await Message.findByIdAndUpdate(parentMessageId, {
            $push: { replies: message._id }
          });
        }

        io.to(`event_${eventId}`).emit("new_message", {
          message: {
            _id: message._id,
            content: message.content,
            author: message.author,
            createdAt: message.createdAt,
            reactions: message.reactions,
            parentMessage: message.parentMessage,
            replies: message.replies,
            isEdited: message.isEdited,
            isPinned: message.isPinned
          }
        });

        console.log(`📩 Message sent in event ${eventId} by user ${userId}`);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("typing", async (data) => {
      try {
        const { eventId, userId, isTyping } = data;
        const discussion = await Discussion.findOne({ eventId });

        if (discussion) {
          await discussion.updateTypingStatus(userId, isTyping);
          socket.to(`event_${eventId}`).emit("user_typing", { userId, isTyping });
        }
      } catch (error) {
        console.error("Error updating typing status:", error);
      }
    });

    // Add reaction
    socket.on("add_reaction", async (data) => {
      try {
        const { messageId, emoji, userId } = data;
        const message = await Message.findById(messageId);

        if (!message) {
          socket.emit("error", { message: "Message not found" });
          return;
        }

        let reaction = message.reactions.find((r) => r.emoji === emoji);
        if (reaction) {
          if (reaction.users.includes(userId)) {
            reaction.users = reaction.users.filter(
              (id) => id.toString() !== userId.toString()
            );
            reaction.count = reaction.users.length;
            if (reaction.count === 0) {
              message.reactions = message.reactions.filter((r) => r.emoji !== emoji);
            }
          } else {
            reaction.users.push(userId);
            reaction.count = reaction.users.length;
          }
        } else {
          message.reactions.push({ emoji, users: [userId], count: 1 });
        }

        await message.save();
        await message.populate("reactions.users", "name");

        io.to(`event_${message.eventId}`).emit("reaction_updated", {
          messageId,
          reactions: message.reactions
        });
      } catch (error) {
        console.error("Error adding reaction:", error);
        socket.emit("error", { message: "Failed to add reaction" });
      }
    });

    // Leave discussion
    socket.on("leave_discussion", async (data) => {
      try {
        const { eventId } = data;
        if (!eventId) return;

        socket.eventIds = socket.eventIds.filter((id) => id !== eventId);

        const discussion = await Discussion.findOne({ eventId });
        if (discussion) {
          await discussion.removeActiveUser(socket.userId);
          await discussion.populate("activeUsers.user", "name email profileImage");

          const activeUsers = discussion.activeUsers.filter(
            (u) => u.lastSeen > new Date(Date.now() - 5 * 60 * 1000)
          );

          io.to(`event_${eventId}`).emit("active_users_update", {
            activeUsers: activeUsers.map((u) => ({
              _id: u.user._id,
              name: u.user.name,
              email: u.user.email,
              profileImage: u.user.profileImage,
              isTyping: u.isTyping,
              lastSeen: u.lastSeen
            }))
          });
        }

        socket.leave(`event_${eventId}`);
        console.log(`👋 User ${socket.userId} left discussion for event ${eventId}`);
      } catch (error) {
        console.error("Error leaving discussion:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      try {
        for (const eventId of socket.eventIds) {
          const discussion = await Discussion.findOne({ eventId });
          if (discussion) {
            await discussion.removeActiveUser(socket.userId);
            await discussion.populate("activeUsers.user", "name email profileImage");

            const activeUsers = discussion.activeUsers.filter(
              (u) => u.lastSeen > new Date(Date.now() - 5 * 60 * 1000)
            );

            socket.to(`event_${eventId}`).emit("active_users_update", {
              activeUsers: activeUsers.map((u) => ({
                _id: u.user._id,
                name: u.user.name,
                email: u.user.email,
                profileImage: u.user.profileImage,
                isTyping: u.isTyping,
                lastSeen: u.lastSeen
              }))
            });

            socket.leave(`event_${eventId}`);
          }
        }

        console.log(`❌ User disconnected from discussion: ${socket.id}`);
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });

  // Clean inactive users every 5 min
  setInterval(async () => {
    try {
      const discussions = await Discussion.find({});
      for (const discussion of discussions) {
        await discussion.cleanInactiveUsers();
      }
    } catch (error) {
      console.error("Error cleaning inactive users:", error);
    }
  }, 5 * 60 * 1000);

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};