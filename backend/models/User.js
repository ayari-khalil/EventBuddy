import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  interests: [{ type: String }], // ex: "AI", "Blockchain"
  goals: [{ type: String }],     // ex: "Trouver investisseur"
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },

  // 🔗 Liens sociaux (objets avec nom + url)
  socialLinks: [
    {
      platform: { type: String }, // ex: "LinkedIn", "GitHub"
      url: { type: String }
    }
  ],

  // 👥 Connexions avec d’autres users
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // 🏆 Accomplissements (liste avec titre + description + date)
  accomplishments: [
    {
      title: { type: String }, // ex: "Certificat AWS"
      description: { type: String },
      date: { type: Date, default: Date.now }
    }
  ],

  // 📅 Événements (créés ou rejoints)
  events: [
    {
      title: { type: String }, // ex: "Hackathon 2025"
      description: { type: String },
      date: { type: Date },
      location: { type: String }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export default User;
