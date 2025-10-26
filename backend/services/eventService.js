// services/eventService.js
import Event from "../models/Event.js";
import Discussion from "../models/Discussion.js";


export const createEvent = async (eventData) => {
  try {
    console.log('📝 Creating event with data:', eventData);

    // 1. Créer l'événement d'abord
    const event = new Event(eventData);
    await event.save();
    
    console.log('✅ Event created with ID:', event._id);

    // 2. Créer la discussion associée APRÈS avoir l'ID de l'événement
    try {
      const discussion = new Discussion({
        eventId: event._id,  // ✅ Maintenant on a l'ID de l'événement
        messages: [],
        participants: eventData.createdBy ? [eventData.createdBy] : []
      });
      
      await discussion.save();
      console.log('✅ Discussion created for event:', event._id);
      
      // 3. Lier la discussion à l'événement (optionnel, selon votre schéma)
      event.discussionId = discussion._id;
      await event.save();
      
    } catch (discussionError) {
      console.warn('⚠️  Discussion creation failed, but event was created:', discussionError.message);
      // L'événement est créé même si la discussion échoue
      // Vous pouvez décider de supprimer l'événement ou de continuer
    }

    return event;
    
  } catch (error) {
    console.error('❌ Error in createEvent service:', error);
    throw error;
  }
};

export const getAllEvents = async (query = {}) => {
  try {
    console.log("Fetching events with query:", query);
    
    const {
      category,
      featured,
      limit = 10,
      page = 1,
      sortBy = 'date',
      sortOrder = 'desc'
    } = query;
    
    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const events = await Event.find(filter)
      .populate('createdBy', 'name email avatar')
      .populate('participants', 'name avatar')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    console.log("Successfully fetched events:", events.length);
    return events;
  } catch (error) {
    console.error("Service error fetching events:", error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  try {
    console.log("Fetching event by ID in service:", eventId);
    
    const event = await Event.findById(eventId)
      .populate('createdBy', 'name email avatar bio location')
      .populate('participants', 'name avatar bio location');
    
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }
    
    // Transform event data to match frontend expectations
    const transformedEvent = {
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      time: event.time,
      location: event.location,
      category: event.category,
      price: event.price,
      attendees: event.participants?.length || 0,
      maxAttendees: event.maxAttendees,
      organizer: event.createdBy?.name || 'Unknown',
      image: event.image,
      tags: event.tags || [],
      featured: event.featured,
      createdBy: event.createdBy,
      participants: event.participants || [],
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    };
    
    console.log("Successfully fetched and transformed event");
    return transformedEvent;
  } catch (error) {
    console.error("Service error fetching event by ID:", error);
    throw error;
  }
};

export const updateEvent = async (eventId, updateData) => {
  try {
    console.log("Updating event in service:", eventId, updateData);
    
    const event = await Event.findByIdAndUpdate(
      eventId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name email avatar')
    .populate('participants', 'name avatar');
    
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }
    
    console.log("Event updated successfully");
    return event;
  } catch (error) {
    console.error("Service error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    console.log("Deleting event in service:", eventId);
    
    const event = await Event.findByIdAndDelete(eventId);
    
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }
    
    // Also delete the associated discussion and messages
    await Discussion.deleteOne({ event: eventId });
    
    console.log("Event and discussion deleted successfully");
    return event;
  } catch (error) {
    console.error("Service error deleting event:", error);
    throw error;
  }
};

export const countEvents = async (filter = {}) => {
  try {
    const count = await Event.countDocuments(filter);
    console.log("Total events counted:", count);
    return count;
  } catch (error) {
    console.error("Service error counting events:", error);
    throw error;
  }
};

export const joinEvent = async (eventId, userId) => {
  try {
    console.log("User joining event:", { eventId, userId });
    
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }
    
    // Check if user already joined
    if (event.participants.includes(userId)) {
      throw new Error("User already joined this event");
    }
    
    // Check if event is full
    if (event.participants.length >= event.maxAttendees) {
      throw new Error("Event is full");
    }
    
    event.participants.push(userId);
    await event.save();
    
    console.log("User successfully joined event");
    return event;
  } catch (error) {
    console.error("Service error joining event:", error);
    throw error;
  }
};

export const leaveEvent = async (eventId, userId) => {
  try {
    console.log("User leaving event:", { eventId, userId });
    
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }
    
    // Remove user from participants
    event.participants = event.participants.filter(
      participantId => participantId.toString() !== userId
    );
    
    await event.save();
    
    console.log("User successfully left event");
    return event;
  } catch (error) {
    console.error("Service error leaving event:", error);
    throw error;
  }
};

export const getEventParticipants = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
      .populate('participants', 'name email avatar bio location');
    
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }
    
    return event.participants;
  } catch (error) {
    console.error("Service error getting participants:", error);
    throw error;
  }
};