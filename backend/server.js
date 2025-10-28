import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";

// Routes
import matchRoutes from "./routes/matchRoutes.js";
import paymentRoutes from './routes/PaymentRouter.js';
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import directMessageRoutes from './routes/directMessagesRoutes.js';

// Socket
import { initializeSocket } from "./socket/discussionSocket.js";
import { setupDirectMessageSocket } from './services/directMessageService.js';

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
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

app.use('/api/payment', paymentRoutes);

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

// ✅ Initialiser les deux systèmes Socket.IO avec la MÊME instance io
initializeSocket(io);
setupDirectMessageSocket(io);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API + WebSocket running on http://localhost:${PORT}`);
  console.log(`📡 Discussion events: join_discussion, send_message, typing, add_reaction`);
  console.log(`💬 DM events: join_dm_system, send_dm, dm_typing`);
});