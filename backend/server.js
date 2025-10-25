import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";

// Routes
import matchRoutes from "./routes/matchRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import directMessageRoutes from './routes/directMessagesRoutes.js';

// Socket
import { initializeSocket } from "./socket/discussionSocket.js";
import { setupDirectMessageSocket } from './services/directMessageService.js';

dotenv.config();

const app = express();                    // ← Only ONE time
const server = createServer(app);         // ← Only ONE time

const io = new Server(server, {           // ← Only ONE time
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  pingTimeout: 60000,
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Routes
app.use("/api/matches", matchRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/direct-messages', directMessageRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "🚀 EventBuddy API is running!" });
});

// Socket handlers
initializeSocket(io);
setupDirectMessageSocket(io);

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  socket.on("sendMessage", (data) => {
    console.log("📩 Message reçu:", data);
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API + WebSocket running on http://localhost:${PORT}`);
});