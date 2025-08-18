import express from "express";
import * as eventController from "../controllers/eventController.js";

const router = express.Router();

router.post("/", eventController.createEvent);
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);
router.get("/count/total", eventController.countEvents);

export default router;
