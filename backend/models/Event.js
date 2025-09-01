import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true }, // titre de l’événement
  description: { type: String }, // description
  location: { type: String, required: true }, // lieu
  date: { type: String, required: true }, // "22 Mars 2025" -> string formatée (sinon séparer en date + time)
  time: { type: String }, // ex: "18:00 - 22:00"
  
  attendees: { type: Number, default: 0 }, // nombre actuel de participants
  maxAttendees: { type: Number }, // capacité max
  category: { type: String }, // ex: "startup"
  price: { type: String, default: "Gratuit" }, // ex: "25€"
  
  organizer: { type: String }, // nom de l’organisateur
  image: { type: String }, // URL de l’image
  
  tags: [{ type: String }], // ex: ["Entrepreneuriat", "Investissement"]
  aiMatchScore: { type: Number, default: 0 }, // score IA
  potentialMatches: { type: Number, default: 0 }, // nb de matchs suggérés
  
  featured: { type: Boolean, default: false }, // événement mis en avant ou pas
  difficulty: { type: String, enum: ["Débutant", "Intermédiaire", "Avancé","Tous niveaux"], default: "Débutant" },
  networking: { type: String, default: "Moyen" }, // niveau de networking
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // organisateur (User)
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // liste des utilisateurs inscrits
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
