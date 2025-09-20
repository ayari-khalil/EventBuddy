// models/Message.js
import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
  emoji: {
    type: String,
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  count: {
    type: Number,
    default: 1
  }
});

const messageSchema = new mongoose.Schema({
  eventId: {
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
  reactions: [reactionSchema],
  isOrganizer: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
messageSchema.index({ eventId: 1, createdAt: -1 });
messageSchema.index({ parentMessage: 1 });

// Populate author info when querying
messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name email profileImage'
  });
  next();
});

// Populate reactions with user info
messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'reactions.users',
    select: 'name'
  });
  next();
});

// Virtual for getting author initials
messageSchema.virtual('authorInitials').get(function() {
  if (this.author && this.author.name) {
    return this.author.name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  return 'U';
});

// Ensure virtuals are included in JSON output
messageSchema.set('toJSON', { virtuals: true });
messageSchema.set('toObject', { virtuals: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;