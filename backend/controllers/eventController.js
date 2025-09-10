import * as eventService from "../services/eventService.js";

export const createEvent = async (req, res) => {
  try {
    console.log("Creating event with data:", req.body);
    const event = await eventService.createEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    console.error("Controller error creating event:", error);
    res.status(500).json({ 
      error: error.message,
      details: error.stack 
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    console.log("Fetching all events...");
    const events = await eventService.getAllEvents();
    console.log("Successfully fetched", events.length, "events");
    res.status(200).json(events);
  } catch (error) {
    console.error("Controller error fetching events:", error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    console.log("Fetching event by ID:", req.params.id);
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Controller error fetching event:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    console.log("Updating event:", req.params.id, "with:", req.body);
    const event = await eventService.updateEvent(req.params.id, req.body);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Controller error updating event:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    console.log("Deleting event:", req.params.id);
    const event = await eventService.deleteEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Controller error deleting event:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const countEvents = async (req, res) => {
  try {
    const total = await eventService.countEvents();
    res.status(200).json({ totalEvents: total });
  } catch (error) {
    console.error("Controller error counting events:", error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};