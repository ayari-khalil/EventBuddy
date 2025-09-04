import mongoose from "mongoose";

const discussionChannelSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['general', 'networking', 'qa', 'announcements'], default: 'general' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messageCount: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const DiscussionChannel = mongoose.model("DiscussionChannel", discussionChannelSchema);
export default DiscussionChannel;

