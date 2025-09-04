import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import matchRoutes from "./routes/matchRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import discussionRoutes from "./routes/discussion.js";
import directMessageRoutes from "./routes/directMessages.js";

// Import socket server
import SocketServer from "./socket/socketServer.js";

dotenv.config();

const app = express();
const server = createServer(app);

// ⚙️ Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // 🔥 sécuriser en prod
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 📂 Serve uploaded files
app.use("/uploads", express.static("uploads"));

// 🚏 API routes
app.use("/api/matches", matchRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/discussion", discussionRoutes);
app.use("/api/messages", directMessageRoutes);

// 🌍 MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/networking-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// 🟢 Route test API
app.get("/", (req, res) => {
  res.json({ message: "🚀 EventBuddy API is running!" });
});

// 🔥 WebSocket (using SocketServer class)
new SocketServer(server);

// 🛑 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API + WebSocket running on http://localhost:${PORT}`);
});
