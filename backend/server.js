import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";

// Routes
import matchRoutes from "./routes/matchRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import directMessageRoutes from "./routes/directMessagesRoutes.js";

// Socket
import { initializeSocket } from "./socket/discussionSocket.js";
import { initializeDirectMessageSocket } from "./socket/directMessageSocket.js";

dotenv.config();

const app = express();
const server = createServer(app);

// Initialize Socket.IO with discussion logic
const io = initializeSocket(server);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Routes
app.use("/api/matches", matchRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// Test API route
app.get("/", (req, res) => {
  res.json({ message: "🚀 EventBuddy API is running!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});







// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? 'Configuré ✓' : 'Non configuré ✗'}`);
  console.log(`🚀 API + WebSocket running on http://localhost:${PORT}`);
});
