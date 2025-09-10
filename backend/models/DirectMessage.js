import mongoose from "mongoose";

const directMessageSchema = new mongoose.Schema({
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'DirectMessageContent' },
  lastActivity: { type: Date, default: Date.now },
  // For event-based connections
  relatedEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  messageCount: { type: Number, default: 0 }
}, {
  timestamps: true
});
// Ensure only 2 participants max
directMessageSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    next(new Error('Direct message must have exactly 2 participants'));
  } else {
    next();
  }
});

export default mongoose.model('DirectMessage', directMessageSchema);