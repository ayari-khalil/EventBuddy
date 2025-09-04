const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'DiscussionChannel', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  type: { 
    type: String, 
    enum: ['text', 'voice', 'image', 'file', 'system'], 
    default: 'text' 
  },
  //voice messages
  voiceUrl: { type: String },
  voiceDuration: { type: Number }, // in seconds
  //files/images
  fileUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },
  // Message status
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  // Reactions
  reactions: [{
    emoji: { type: String },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  // Threading
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  // Read receipts
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});
// Index for better query performance
messageSchema.index({ channel: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);