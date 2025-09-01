import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  bio: { type: String },
  interests: [{ type: String }],
  goals: [{ type: String }],

  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },

  // ✅ Nouveaux champs pertinents
  avatar: { type: String, default: "" }, // photo profil
  location: { type: String },
  verified: { type: Boolean, default: false },
  subscription: { type: String, enum: ["free", "premium"], default: "free" },
  reports: { type: Number, default: 0 },
  lastActive: { type: Date },

  // 🔗 Liens sociaux
  socialLinks: [
    {
      platform: { type: String },
      url: { type: String },
    }
  ],

  // 👥 Connexions avec d’autres users
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // 🏆 Accomplissements
  accomplishments: [
    {
      title: { type: String },
      description: { type: String },
      date: { type: Date, default: Date.now },
    }
  ],

  // 📅 Événements liés
  events: [
    {
      title: { type: String },
      description: { type: String },
      date: { type: Date },
      location: { type: String },
    }
  ],

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
