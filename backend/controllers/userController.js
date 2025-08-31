import * as userService from "../services/userService.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// --- Signup ---
export const signupUser = async (req, res) => {
  try {
    const { name, email, password, bio, interests, goals } = req.body;

    // Vérifier si email déjà utilisé
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création utilisateur
    const newUser = await userService.createUser({
      name,
      email,
      password: hashedPassword,
      bio,
      interests,
      goals,
      role: "USER",
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        interests: newUser.interests,
        goals: newUser.goals,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Erreur signup:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// --- Login ---
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    //if (!user.isVerified) return res.status(400).json({ error: "Compte non vérifié" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Mot de passe incorrect" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// --- Verify Email ---
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ error: "Token invalide" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/login`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// --- Forgot Password ---
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("Utilisateur trouvé pour l'email:", user , email);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    // Génère un token sécurisé
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 3600000; // 1 heure

    // Sauvegarde dans le user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpire;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Envoi de l'e-mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ayari2014khalil@gmail.com", 
        pass: "mcpc bhvj eotn ffft", 
      },
    });

    await transporter.sendMail({
  from: "ayari2014khalil@gmail.com",
        to: user.email,
      subject: "Réinitialisation de votre mot de passe",
      html: `<p>Bonjour ${user.firstName},</p>
            <p>Vous avez demandé une réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour le faire :</p>
            <a href="${resetLink}">Réinitialiser mon mot de passe</a><br/>
            <p>Ce lien expirera dans 1 heure.</p>`,
    });

    res.status(200).json({ message: "Email de réinitialisation envoyé avec succès." });
  } catch (error) {
    console.error("Erreur dans forgotPassword:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// --- Reset Password ---
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  console.log("Token reçu :", token);
  console.log("Token reçu :", newPassword);


  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Token invalide ou expiré" });
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error("Erreur dans resetPassword:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const updateUserInterests = async (req, res) => {
  const { id } = req.params;
  const { interests } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { interests }, // ou { $set: { interests } } si plus clair
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Intérêts mis à jour avec succès", user: updatedUser });
  } catch (error) {
    console.error("Erreur updateUser:", error);
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour" });
  }
};

// --- Get User by ID ---
export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// --- Update Profile ---
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ message: "Profil mis à jour", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// --- Upload Profile Image ---
export const uploadProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { file } = req;
    if (!file) return res.status(400).json({ error: "Fichier manquant" });

    const updatedUser = await userService.updateUser(userId, { profileImagePath: file.path });
    res.json({ message: "Image mise à jour", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
export const addInterest = async (req, res) => {
  try {
    const { userId, interest } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { interests: interest } }, // évite les doublons
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout de l'intérêt." });
  }
};

// ✅ Supprimer un intérêt
export const removeInterest = async (req, res) => {
  try {
    const { userId, interest } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { interests: interest } },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'intérêt." });
  }
};

// ✅ Ajouter un objectif
export const addGoal = async (req, res) => {
  try {
    const { userId, goal } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { goals: goal } },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout de l'objectif." });
  }
};

// ✅ Supprimer un objectif
export const removeGoal = async (req, res) => {
  try {
    const { userId, goal } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { goals: goal } },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'objectif." });
  }
};
