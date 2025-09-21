import mongoose from "mongoose";

const directMessageContentSchema = new mongoose.Schema({
  directMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DirectMessage',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxLength: 2000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  reactions: [{
    emoji: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    count: { type: Number, default: 0 }
  }]
}, {
  timestamps: true
});

export default mongoose.model('DirectMessageContent', directMessageContentSchema);