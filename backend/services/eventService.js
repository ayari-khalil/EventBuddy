import Event from "../models/Event.js";

export const createEvent = async (eventData) => {
  try {
    const event = new Event(eventData);
    return await event.save();
  } catch (error) {
    throw new Error("Error creating event: " + error.message);
  }
};

export const getAllEvents = async () => {
  try {
    return await Event.find().populate("createdBy participants", "username email");
  } catch (error) {
    throw new Error("Error fetching events: " + error.message);
  }
};

export const getEventById = async (id) => {
  try {
    return await Event.findById(id).populate("createdBy participants", "username email");
  } catch (error) {
    throw new Error("Error fetching event: " + error.message);
  }
};

export const updateEvent = async (id, updateData) => {
  try {
    return await Event.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw new Error("Error updating event: " + error.message);
  }
};

export const deleteEvent = async (id) => {
  try {
    return await Event.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error deleting event: " + error.message);
  }
};

export const countEvents = async () => {
  try {
    return await Event.countDocuments();
  } catch (error) {
    throw new Error("Error counting events: " + error.message);
  }
};
