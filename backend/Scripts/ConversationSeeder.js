// scripts/seedDirectMessages.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DirectMessage from '../models/DirectMessage.js';
import DirectMessageContent from '../models/DirectMessageContent.js';
import User from '../models/User.js';

dotenv.config();

const seedDirectMessages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get existing users
    const users = await User.find().limit(5);
    
    if (users.length < 2) {
      console.log('❌ Need at least 2 users in database. Create users first.');
      process.exit(1);
    }

    console.log(`Found ${users.length} users`);

    // Clear existing direct messages
    await DirectMessage.deleteMany({});
    await DirectMessageContent.deleteMany({});
    console.log('🗑️ Cleared existing direct messages');

    // Create conversations
    const conversations = [];

    // Conversation 1: User 0 and User 1
    const conv1 = await DirectMessage.create({
      participants: [users[0]._id, users[1]._id],
      lastActivity: new Date(Date.now() - 120000), // 2 minutes ago
      messageCount: 3
    });

    // Messages for conversation 1
    const msg1_1 = await DirectMessageContent.create({
      directMessageId: conv1._id,
      sender: users[1]._id,
      content: "Hey! How are you doing?",
      messageType: 'text',
      createdAt: new Date(Date.now() - 300000)
    });

    const msg1_2 = await DirectMessageContent.create({
      directMessageId: conv1._id,
      sender: users[0]._id,
      content: "I'm doing great! Working on some exciting projects.",
      messageType: 'text',
      createdAt: new Date(Date.now() - 240000),
      readBy: [{ user: users[1]._id, readAt: new Date(Date.now() - 180000) }]
    });

    const msg1_3 = await DirectMessageContent.create({
      directMessageId: conv1._id,
      sender: users[1]._id,
      content: "That sounds awesome! Tell me more about it.",
      messageType: 'text',
      createdAt: new Date(Date.now() - 120000)
    });

    // Update conversation with last message
    conv1.lastMessage = msg1_3._id;
    await conv1.save();

    conversations.push(conv1);

    // Conversation 2: User 0 and User 2 (if exists)
    if (users.length > 2) {
      const conv2 = await DirectMessage.create({
        participants: [users[0]._id, users[2]._id],
        lastActivity: new Date(Date.now() - 7200000), // 2 hours ago
        messageCount: 2
      });

      const msg2_1 = await DirectMessageContent.create({
        directMessageId: conv2._id,
        sender: users[0]._id,
        content: "The project looks great!",
        messageType: 'text',
        createdAt: new Date(Date.now() - 7200000),
        readBy: [{ user: users[2]._id, readAt: new Date(Date.now() - 7140000) }]
      });

      const msg2_2 = await DirectMessageContent.create({
        directMessageId: conv2._id,
        sender: users[2]._id,
        content: "Thanks! I appreciate your feedback.",
        messageType: 'text',
        createdAt: new Date(Date.now() - 7100000),
        readBy: [{ user: users[0]._id, readAt: new Date(Date.now() - 7000000) }]
      });

      conv2.lastMessage = msg2_2._id;
      await conv2.save();

      conversations.push(conv2);
    }

    // Conversation 3: User 1 and User 2 (if exists)
    if (users.length > 2) {
      const conv3 = await DirectMessage.create({
        participants: [users[1]._id, users[2]._id],
        lastActivity: new Date(Date.now() - 86400000), // 1 day ago
        messageCount: 1
      });

      const msg3_1 = await DirectMessageContent.create({
        directMessageId: conv3._id,
        sender: users[1]._id,
        content: "Looking forward to the upcoming event!",
        messageType: 'text',
        createdAt: new Date(Date.now() - 86400000)
      });

      conv3.lastMessage = msg3_1._id;
      await conv3.save();

      conversations.push(conv3);
    }

    console.log(`✅ Created ${conversations.length} conversations with messages`);
    console.log('\nConversations:');
    conversations.forEach(conv => {
      console.log(`- ${conv._id}: ${conv.participants.length} participants, ${conv.messageCount} messages`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding direct messages:', error);
    process.exit(1);
  }
};

seedDirectMessages();