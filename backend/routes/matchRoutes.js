import express from "express";
import * as matchController from "../controllers/matchController.js";

const router = express.Router();

// CRUD
router.post("/", matchController.createMatch);
router.get("/", matchController.getAllMatches);
router.get("/:id", matchController.getMatchById);
router.put("/:id", matchController.updateMatch);
router.delete("/:id", matchController.deleteMatch);


export default router;