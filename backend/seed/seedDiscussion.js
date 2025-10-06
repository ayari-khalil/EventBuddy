// scripts/seedDiscussion.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DiscussionMessage from '../models/DiscussionMessage.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

dotenv.config();

const seedDiscussion = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // --- Ensure some users exist ---
    let users = await User.find().limit(4);
    if (users.length < 4) {
      users = await User.insertMany([
        {
          firstName: 'Sarah',
          lastName: 'Martin',
          email: 'sarah@example.com',
          password: 'hashedpw',
        },
        {
          firstName: 'Alex',
          lastName: 'Dupont',
          email: 'alex@example.com',
          password: 'hashedpw',
        },
        {
          firstName: 'Marie',
          lastName: 'Leroy',
          email: 'marie@example.com',
          password: 'hashedpw',
        },
        {
          firstName: 'Future',
          lastName: 'Work Institute',
          email: 'fwi@example.com',
          password: 'hashedpw',
        }
      ]);
      console.log('Created sample users');
    }

    const [sarah, alex, marie, fwi] = users;

    // --- Create or find an event ---
    let event = await Event.findOne();
    if (!event) {
      event = new Event({
        title: "Future of Work Summit",
        description: "Comment l'IA et l'automatisation transforment le monde du travail",
        date: new Date('2025-04-12'),
        time: "09:30 - 16:30",
        location: "La Défense Arena, Paris",
        category: 'tech',
        price: 'Gratuit',
        maxAttendees: 800,
        createdBy: fwi._id,
        participants: [sarah._id, alex._id, marie._id, fwi._id],
        tags: ['IA', 'Future of Work', 'Technology'],
        featured: true
      });
      await event.save();
      console.log('Event created:', event._id);
    }

    // --- Clear existing messages for this event ---
    await DiscussionMessage.deleteMany({ event: event._id });
    console.log('Cleared existing messages');

    // --- Seed top-level messages ---
    const seedMessages = [
      {
        event: event._id,
        author: sarah._id,
        content: "Très hâte de participer ! Quelqu'un sait si les sessions seront enregistrées ?",
        parentMessage: null,
        isPinned: true,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        reactions: [
          { emoji: '👍', user: alex._id },
          { emoji: '👍', user: marie._id },
          { emoji: '❤️', user: fwi._id }
        ]
      },
      {
        event: event._id,
        author: fwi._id,
        content: "Bonjour à tous ! Oui les sessions principales seront enregistrées et disponibles 48h après l'événement pour tous les participants. N'hésitez pas si vous avez d'autres questions !",
        parentMessage: null,
        isPinned: false,
        createdAt: new Date(Date.now() - 82800000), // 23h ago
        reactions: [
          { emoji: '👍', user: sarah._id },
          { emoji: '👍', user: marie._id },
          { emoji: '👍', user: alex._id }
        ]
      },
      {
        event: event._id,
        author: marie._id,
        content: "Y aura-t-il des sessions dédiées aux startups ? Je travaille dans une startup EdTech et j'aimerais savoir comment l'IA peut nous aider.",
        parentMessage: null,
        isPinned: false,
        createdAt: new Date(Date.now() - 50400000), // 14h ago
        reactions: [
          { emoji: '🚀', user: sarah._id },
          { emoji: '🚀', user: alex._id },
          { emoji: '🚀', user: fwi._id },
          { emoji: '💡', user: marie._id }
        ]
      }
    ];

    const createdMessages = await DiscussionMessage.insertMany(seedMessages);
    console.log(`Created ${createdMessages.length} top-level messages`);

    // --- Create a reply to the second message ---
    const replyMessage = new DiscussionMessage({
      event: event._id,
      author: alex._id,
      content: "Parfait, merci pour l'info !",
      parentMessage: createdMessages[1]._id,
      createdAt: new Date(Date.now() - 82000000), // ~22.8h ago
      reactions: [
        { emoji: '👍', user: sarah._id }
      ]
    });

    const savedReply = await replyMessage.save();

    // Link reply to parent
    await DiscussionMessage.findByIdAndUpdate(
      createdMessages[1]._id,
      { $push: { replies: savedReply._id } }
    );

    console.log('Created reply message');
    console.log(`Event ID for frontend: ${event._id}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding discussion:', error);
    process.exit(1);
  }
};

seedDiscussion();
