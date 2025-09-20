import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  Search, 
  Heart, 
  Zap, 
  Target, 
  ArrowRight, 
  Brain, 
  UserPlus, 
  Sparkles, 
  Plus, 
  MessageCircle,
  Hash,
  Phone,
  Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventType {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string; // format "YYYY-MM-DD"
  time?: string; // ex: "22:00"
  attendees: number;
  maxAttendees?: number;
  category: string;
  price?: string; // ex: "50Dt"
  organizer?: string;
  image?: string;
  tags?: string[];
  aiMatchScore?: number;
  potentialMatches?: number;
  featured?: boolean;
  difficulty?: string;
  networking?: string;
  createdBy?: string; // id de l’utilisateur organisateur
  participants?: string[]; // tableau des IDs des participants
  __v?: number; // version du document MongoDB
    discussionChannel?: {
    id: string;
    messageCount: number;
    activeParticipants: number;
    lastActivity: string;
  };
}

const EventsHub: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const categories = [
    { id: 'all', name: 'Tous', icon: Sparkles },
    { id: 'tech', name: 'Tech', icon: Zap },
    { id: 'business', name: 'Business', icon: Target },
    { id: 'startup', name: 'Startup', icon: Heart },
    { id: 'ai', name: 'IA', icon: Brain }
  ];

  // API configuration for Vite
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('Fetching events from:', `${API_BASE_URL}/events`);
        
        const response = await fetch(`${API_BASE_URL}/events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Received data:', data);
        
        // Transform the data if needed to match your EventType interface
        const transformedEvents = data.map((event: any) => ({
          id: event._id || event.id,
          title: event.title || '',
          description: event.description || '',
          date: event.date ? new Date(event.date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }) : '',
          time: event.time || event.startTime,
          location: event.location || '',
          attendees: event.attendees?.length || event.attendeeCount || 0,
          maxAttendees: event.maxAttendees || event.capacity,
          category: event.category || 'tech',
          price: event.price || event.ticketPrice || 'Gratuit',
          organizer: event.organizer?.name || event.organizerName,
          image: event.image || event.imageUrl || 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
          tags: event.tags || [],
          aiMatchScore: event.aiMatchScore || Math.floor(Math.random() * 30) + 70,
          potentialMatches: event.potentialMatches || Math.floor(Math.random() * 20) + 5,
          featured: event.featured || false,
          difficulty: event.difficulty || 'Intermédiaire',
          networking: event.networking || 'Modéré',
          discussionChannel: event.discussionChannel || {
            id: `channel_${event._id || event.id}`,
            messageCount: Math.floor(Math.random() * 200) + 10,
            activeParticipants: Math.floor(Math.random() * 50) + 5,
            lastActivity: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString()
          }
        }));

        setEvents(transformedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue lors du chargement des événements");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [API_BASE_URL]);

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });



    // Ici tu appelles l’API POST pour s’inscrire
  const handleApply = async (eventId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        // body: JSON.stringify({ userId: currentUserId })
      });
            navigate(`/event/${eventId}/book`);


      if (!response.ok) {
        throw new Error('Failed to apply to event');
      }

      console.log('Successfully applied to event:', eventId);
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, attendees: event.attendees + 1 }
            : event
        )
      );
      console.log('Applying to event:', eventId);
      navigate(`/event/${eventId}/book`);
    } catch (error) {
      console.error('Error applying to event:', error);
    }
  };

  const handleJoinDiscussion = (eventId: string) => {
    navigate(`/event/${eventId}/discussion`);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays}j`;
  };

  const handleRetry = () => {
    setEvents([]);
    setError('');
    setLoading(true);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Erreur de chargement</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Découvrez les événements 🚀
              </h1>
              <p className="text-gray-400 text-lg">
                Trouvez les événements parfaits pour votre networking grâce à notre IA
              </p>
            </div>
            <button
              onClick={() => navigate('/create-event')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>Créer un événement</span>
            </button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un événement, une technologie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Categories */}
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Events */}
        {filteredEvents.some(event => event.featured) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Star className="w-6 h-6 text-yellow-400 mr-2" />
              Événements à la une
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.filter(event => event.featured).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500 group"
                >
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                      À la une
                    </div>
                  </div>
                  
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* AI Match Score */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-3 py-1 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-green-400" />
                        <span className="text-green-300 text-sm font-medium">{event.aiMatchScore}% match</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                        {event.title}
                      </h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">{event.price}</div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees}/{event.maxAttendees}
                      </div>
                    </div>

                    {/* Discussion Stats */}
                    {event.discussionChannel && (
                      <div className="bg-white/5 rounded-xl p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Hash className="w-4 h-4 text-blue-400" />
                              <span className="text-sm text-gray-300">Discussion</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-400">{event.discussionChannel.messageCount}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-400">{event.discussionChannel.activeParticipants}</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(event.discussionChannel.lastActivity)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <UserPlus className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-300 text-sm">{event.potentialMatches} matches potentiels</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleJoinDiscussion(event.id)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-gray-300 px-4 py-2 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 border border-white/20"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Discussion</span>
                      </button>
                      <button
                        onClick={() => handleApply(event.id)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300"
                      >
                        <span>Postuler</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Events */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Tous les événements ({filteredEvents.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.filter(event => !event.featured).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* AI Match Score */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-2 py-1 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-green-400" />
                      <span className="text-green-300 text-xs font-medium">{event.aiMatchScore}%</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-green-400 font-bold text-sm">{event.price}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="w-3 h-3 mr-2" />
                      {event.date} • {event.time}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-3 h-3 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Users className="w-3 h-3 mr-2" />
                      {event.attendees}/{event.maxAttendees} participants
                    </div>
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {event.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Discussion Preview */}
                  {event.discussionChannel && (
                    <div className="bg-white/5 rounded-lg p-3 mb-3 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          <Hash className="w-3 h-3 text-blue-400" />
                          <span className="text-xs text-blue-300 font-medium">Discussion active</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(event.discussionChannel.lastActivity)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{event.discussionChannel.messageCount} messages</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{event.discussionChannel.activeParticipants} actifs</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <UserPlus className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-300 text-xs">{event.potentialMatches} matches</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleJoinDiscussion(event.id)}
                      className="w-full bg-white/10 hover:bg-white/20 text-gray-300 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 border border-white/20"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span className="text-sm">Rejoindre la discussion</span>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApply(event.id)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm px-4 py-2 rounded-lg flex items-center justify-center space-x-1 transition-all duration-300"
                      >
                        <span>Postuler</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      
                      {/* Quick Actions */}
                      <div className="flex space-x-1">
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/20 transition-all duration-300">
                          <Phone className="w-3 h-3 text-gray-400" />
                        </button>
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/20 transition-all duration-300">
                          <Video className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* No Results */}
        {filteredEvents.length === 0 && !loading && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
          </motion.div>
        )}

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create-event')}
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventsHub;