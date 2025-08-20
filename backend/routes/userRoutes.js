import express from "express";
import { signupUser, loginUser, verifyEmail, forgotPassword, resetPassword, getUserById, updateUser, uploadProfileImage } from "../controllers/userController.js";
// import multer from "multer";

const router = express.Router();

// Multer pour upload images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "./uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
// });
// const upload = multer({ storage });

// Routes utilisateur
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/:id", getUserById);
router.put("/:id", updateUser);
//router.put("/:id/upload", upload.single("profileImage"), uploadProfileImage);

export default router;
