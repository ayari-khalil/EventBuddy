// models/Discussion.js
import mongoose from "mongoose";

const activeUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isTyping: {
    type: Boolean,
    default: false
  },
  socketId: String
});

const discussionSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  activeUsers: [activeUserSchema],
  messageCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  settings: {
    allowReactions: {
      type: Boolean,
      default: true
    },
    allowReplies: {
      type: Boolean,
      default: true
    },
    moderationEnabled: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for better performance
discussionSchema.index({ eventId: 1 });
discussionSchema.index({ 'activeUsers.user': 1 });

// Method to add active user
discussionSchema.methods.addActiveUser = function(userId, socketId) {
  const existingUserIndex = this.activeUsers.findIndex(
    u => u.user.toString() === userId.toString()
  );
  
  if (existingUserIndex !== -1) {
    this.activeUsers[existingUserIndex].lastSeen = new Date();
    this.activeUsers[existingUserIndex].socketId = socketId;
  } else {
    this.activeUsers.push({
      user: userId,
      lastSeen: new Date(),
      socketId: socketId
    });
  }
  
  return this.save();
};

// Method to remove active user
discussionSchema.methods.removeActiveUser = function(userId) {
  this.activeUsers = this.activeUsers.filter(
    u => u.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to update typing status
discussionSchema.methods.updateTypingStatus = function(userId, isTyping) {
  const user = this.activeUsers.find(
    u => u.user.toString() === userId.toString()
  );
  
  if (user) {
    user.isTyping = isTyping;
    user.lastSeen = new Date();
    return this.save();
  }
};

// Method to clean inactive users (not seen in last 5 minutes)
discussionSchema.methods.cleanInactiveUsers = function() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  this.activeUsers = this.activeUsers.filter(
    u => u.lastSeen > fiveMinutesAgo
  );
  return this.save();
};

const Discussion = mongoose.model('Discussion', discussionSchema);
export default Discussion;