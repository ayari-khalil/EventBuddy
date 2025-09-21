import express from "express";
import { signupUser, loginUser, verifyEmail, forgotPassword, resetPassword, getUserById, updateUser, uploadProfileImage, addInterest, removeGoal, addGoal, removeInterest, bookEvent } from "../controllers/userController.js";
import {
  createUser,
  getUserByEmail,
  deleteUser,
  getAllUsers,
  getUsersWithCommonSkills,
  getTotalUsers
} from "../services/userService.js";
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
router.post("/add-interest", addInterest);
router.post("/remove-interest", removeInterest);

// Goals
router.post("/add-goal", addGoal);
router.post("/remove-goal", removeGoal);

router.post("/:userId/bookEvent/:eventId", bookEvent);



router.post("/", async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Récupérer tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // ✅ Récupérer un utilisateur par ID
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await getUserById(req.params.id);
//     if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// ✅ Récupérer un utilisateur par email (ex: /users/email/test@mail.com)
router.get("/email/:email", async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // ✅ Mettre à jour un utilisateur
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedUser = await updateUser(req.params.id, req.body);
//     if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// ✅ Supprimer un utilisateur
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Récupérer utilisateurs avec des compétences communes
// Exemple: /users/common-skills/123?skills=Node.js,React
router.get("/common-skills/:id", async (req, res) => {
  try {
    const skills = req.query.skills ? req.query.skills.split(",") : [];
    const users = await getUsersWithCommonSkills(req.params.id, skills);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Obtenir le nombre total d’utilisateurs
router.get("/count/all", async (req, res) => {
  try {
    const count = await getTotalUsers();
    res.json({ totalUsers: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
