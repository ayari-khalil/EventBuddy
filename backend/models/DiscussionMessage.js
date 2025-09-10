// models/DiscussionMessage.js
import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emoji: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const discussionMessageSchema = new mongoose.Schema({
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    maxLength: 2000
  },
  parentMessage: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DiscussionMessage',
    default: null 
  },
  replies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DiscussionMessage' 
  }],
  reactions: [reactionSchema],
  isEdited: { 
    type: Boolean, 
    default: false 
  },
  editHistory: [{
    content: String,
    editedAt: { type: Date, default: Date.now }
  }],
  isPinned: { 
    type: Boolean, 
    default: false 
  },
  pinnedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  attachments: [{
    type: { type: String, enum: ['image', 'file', 'link'] },
    url: String,
    name: String,
    size: Number
  }],
  mentions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  isDeleted: { 
    type: Boolean, 
    default: false 
  },
  deletedAt: Date,
  deletedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true
});

// Indexes for better performance
discussionMessageSchema.index({ event: 1, createdAt: -1 });
discussionMessageSchema.index({ parentMessage: 1 });
discussionMessageSchema.index({ author: 1 });
discussionMessageSchema.index({ isPinned: -1 });

// Virtual for reply count
discussionMessageSchema.virtual('replyCount').get(function() {
  return this.replies ? this.replies.length : 0;
});

// Virtual for reaction counts
discussionMessageSchema.virtual('reactionCounts').get(function() {
  const counts = {};
  this.reactions.forEach(reaction => {
    counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
  });
  return counts;
});

// Method to add reaction
discussionMessageSchema.methods.addReaction = function(userId, emoji) {
  // Remove existing reaction from this user for this emoji
  this.reactions = this.reactions.filter(
    r => !(r.user.toString() === userId.toString() && r.emoji === emoji)
  );
  // Add new reaction
  this.reactions.push({ user: userId, emoji });
  return this.save();
};

// Method to remove reaction
discussionMessageSchema.methods.removeReaction = function(userId, emoji) {
  this.reactions = this.reactions.filter(
    r => !(r.user.toString() === userId.toString() && r.emoji === emoji)
  );
  return this.save();
};

// Method to soft delete
discussionMessageSchema.methods.softDelete = function(deletedBy) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  this.content = '[Message supprimé]';
  return this.save();
};

export default mongoose.model('DiscussionMessage', discussionMessageSchema);