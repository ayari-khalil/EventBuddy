import { Server } from "socket.io";
import DirectMessage from "../models/DirectMessage.js";
import DirectMessageContent from "../models/DirectMessageContent.js";
import directMessageService from "../services/directMessageService.js";

let io;

export const initializeDirectMessageSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected to DM: ${socket.id}`);

    socket.userId = null;
    socket.activeConversations = [];

    // Join user's personal room for notifications
    socket.on("join_dm_system", async (data) => {
      try {
        const { userId } = data;
        if (!userId) {
          socket.emit("dm_error", { message: "Missing userId" });
          return;
        }

        socket.userId = userId;
        socket.join(`user_${userId}`);

        // Join all user's active conversations
        const conversations = await DirectMessage.find({
          participants: userId
        });

        conversations.forEach(conv => {
          socket.join(`dm_${conv._id}`);
          socket.activeConversations.push(conv._id.toString());
        });

        // Send unread count
        const unreadCount = await directMessageService.getUnreadCount(userId);
        socket.emit("unread_count_update", { unreadCount });

        console.log(`User ${userId} joined DM system`);
      } catch (error) {
        console.error("Error joining DM system:", error);
        socket.emit("dm_error", { message: "Failed to join DM system" });
      }
    });

    // Join specific conversation
    socket.on("join_conversation", async (data) => {
      try {
        const { conversationId } = data;
        
        if (!socket.userId) {
          socket.emit("dm_error", { message: "Not authenticated" });
          return;
        }

        // Verify user is participant
        const conversation = await DirectMessage.findById(conversationId);
        if (!conversation || !conversation.participants.includes(socket.userId)) {
          socket.emit("dm_error", { message: "Unauthorized" });
          return;
        }

        socket.join(`dm_${conversationId}`);
        if (!socket.activeConversations.includes(conversationId)) {
          socket.activeConversations.push(conversationId);
        }

        // Mark messages as read
        await directMessageService.markMessagesAsRead(conversationId, socket.userId);

        // Update unread count
        const unreadCount = await directMessageService.getUnreadCount(socket.userId);
        socket.emit("unread_count_update", { unreadCount });

        console.log(`User ${socket.userId} joined conversation ${conversationId}`);
      } catch (error) {
        console.error("Error joining conversation:", error);
        socket.emit("dm_error", { message: "Failed to join conversation" });
      }
    });

    // Send direct message
    socket.on("send_dm", async (data) => {
      try {
        const { conversationId, content, messageType = 'text' } = data;

        if (!socket.userId) {
          socket.emit("dm_error", { message: "Not authenticated" });
          return;
        }

        if (!content || content.trim().length === 0) {
          socket.emit("dm_error", { message: "Message content required" });
          return;
        }

        const message = await directMessageService.sendMessage(
          conversationId,
          socket.userId,
          content,
          messageType
        );

        // Emit to conversation room
        io.to(`dm_${conversationId}`).emit("new_dm", {
          message: {
            _id: message._id,
            content: message.content,
            sender: message.sender,
            messageType: message.messageType,
            createdAt: message.createdAt,
            reactions: message.reactions
          },
          conversationId
        });

        // Update unread counts for other participants
        const conversation = await DirectMessage.findById(conversationId);
        for (const participantId of conversation.participants) {
          if (participantId.toString() !== socket.userId.toString()) {
            const unreadCount = await directMessageService.getUnreadCount(participantId);
            io.to(`user_${participantId}`).emit("unread_count_update", { unreadCount });
            
            // Send notification to offline users
            io.to(`user_${participantId}`).emit("new_dm_notification", {
              conversationId,
              senderName: message.sender.name,
              preview: content.substring(0, 100)
            });
          }
        }

        console.log(`DM sent in conversation ${conversationId} by user ${socket.userId}`);
      } catch (error) {
        console.error("Error sending DM:", error);
        socket.emit("dm_error", { message: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("dm_typing", async (data) => {
      try {
        const { conversationId, isTyping } = data;
        
        if (!socket.userId) return;

        socket.to(`dm_${conversationId}`).emit("dm_user_typing", {
          userId: socket.userId,
          isTyping
        });
      } catch (error) {
        console.error("Error with typing indicator:", error);
      }
    });

    // Add reaction to DM
    socket.on("add_dm_reaction", async (data) => {
      try {
        const { messageId, emoji } = data;

        if (!socket.userId) {
          socket.emit("dm_error", { message: "Not authenticated" });
          return;
        }

        const message = await directMessageService.addReaction(messageId, socket.userId, emoji);

        // Find conversation to emit to correct room
        const conversation = await DirectMessage.findById(message.directMessageId);
        if (conversation) {
          io.to(`dm_${conversation._id}`).emit("dm_reaction_updated", {
            messageId,
            reactions: message.reactions
          });
        }
      } catch (error) {
        console.error("Error adding DM reaction:", error);
        socket.emit("dm_error", { message: "Failed to add reaction" });
      }
    });

    // Leave conversation
    socket.on("leave_conversation", (data) => {
      try {
        const { conversationId } = data;
        socket.leave(`dm_${conversationId}`);
        socket.activeConversations = socket.activeConversations.filter(
          id => id !== conversationId
        );
        console.log(`User ${socket.userId} left conversation ${conversationId}`);
      } catch (error) {
        console.error("Error leaving conversation:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      try {
        console.log(`User disconnected from DM: ${socket.id}`);
        // Cleanup is automatic with socket.io room management
      } catch (error) {
        console.error("Error handling DM disconnect:", error);
      }
    });
  });

  return io;
};

export const getDMIO = () => {
  if (!io) throw new Error("DM Socket.io not initialized!");
  return io;
};