// models/Event.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['tech', 'business', 'startup', 'ai'],
    default: 'tech'
  },
  price: {
    type: String,
    default: 'Gratuit'
  },
  maxAttendees: {
    type: Number,
    default: 100
  },
  image: {
    type: String,
    default: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  tags: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

export default mongoose.model('Event', eventSchema);