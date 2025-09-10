import Event from "../models/Event.js";

export const createEvent = async (eventData) => {
  try {
    const event = new Event(eventData);
    return await event.save();
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Error creating event: " + error.message);
  }
};

export const getAllEvents = async () => {
  try {
    // Remove populate if the fields don't exist in your schema
    const events = await Event.find().sort({ createdAt: -1 });
    console.log("Fetched events:", events.length);
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Error fetching events: " + error.message);
  }
};

export const getEventById = async (id) => {
  try {
    const event = await Event.findById(id);
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw new Error("Error fetching event: " + error.message);
  }
};

export const updateEvent = async (id, updateData) => {
  try {
    const event = await Event.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    });
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Error updating event: " + error.message);
  }
};

export const deleteEvent = async (id) => {
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw new Error("Error deleting event: " + error.message);
  }
};

export const countEvents = async () => {
  try {
    return await Event.countDocuments();
  } catch (error) {
    console.error("Error counting events:", error);
    throw new Error("Error counting events: " + error.message);
  }
};