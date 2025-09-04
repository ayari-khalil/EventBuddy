import mongoose from "mongoose";

const directMessageContentSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'DirectMessage', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  type: { 
    type: String, 
    enum: ['text', 'voice', 'image', 'file'], 
    default: 'text' 
  },
  // For voice messages
  voiceUrl: { type: String },
  voiceDuration: { type: Number },
  // For files/images
  fileUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },
  // Message status
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  deliveredAt: { type: Date },
  readAt: { type: Date },
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'read'], 
    default: 'sent' 
  }
}, {
  timestamps: true
});

directMessageContentSchema.index({ conversation: 1, createdAt: -1 });

export default mongoose.model('DirectMessageContent', directMessageContentSchema);