import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  matchedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  score: { type: Number, required: true }, // 0-100 (IA)
  createdAt: { type: Date, default: Date.now }
});

const Match = mongoose.model("Match", matchSchema);
export default Match;
