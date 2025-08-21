import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Star, Filter, Search, Heart, Zap, Target, ArrowRight, Eye, UserPlus, Sparkles } from 'lucide-react';

const EventsHub = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const categories = [
    { id: 'all', name: 'Tous', icon: Sparkles },
    { id: 'tech', name: 'Tech', icon: Zap },
    { id: 'business', name: 'Business', icon: Target },
    { id: 'startup', name: 'Startup', icon: Heart },
    { id: 'ai', name: 'IA', icon: Brain }
  ];

  const events = [
    {
      id: 1,
      title: "AI Revolution Summit 2025",
      description: "Le plus grand événement IA de l'année avec les leaders mondiaux de l'intelligence artificielle",
      date: "15 Mars 2025",
      time: "09:00 - 18:00",
      location: "Station F, Paris",
      attendees: 1200,
      maxAttendees: 1500,
      category: "ai",
      price: "Gratuit",
      organizer: "AI France",
      image: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["IA", "Machine Learning", "Deep Learning"],
      aiMatchScore: 95,
      potentialMatches: 47,
      featured: true,
      difficulty: "Intermédiaire",
      networking: "Élevé"
    },
    {
      id: 2,
      title: "Startup Grind Paris",
      description: "Rencontrez les entrepreneurs les plus prometteurs et les investisseurs de la capitale",
      date: "22 Mars 2025",
      time: "18:00 - 22:00",
      location: "WeWork Opéra, Paris",
      attendees: 300,
      maxAttendees: 400,
      category: "startup",
      price: "25€",
      organizer: "Startup Grind",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Entrepreneuriat", "Investissement", "Pitch"],
      aiMatchScore: 88,
      potentialMatches: 23,
      featured: false,
      difficulty: "Débutant",
      networking: "Très élevé"
    },
    {
      id: 3,
      title: "Blockchain & Web3 Conference",
      description: "Explorez l'avenir de la finance décentralisée et des technologies blockchain",
      date: "5 Avril 2025",
      time: "10:00 - 17:00",
      location: "Palais des Congrès, Paris",
      attendees: 800,
      maxAttendees: 1000,
      category: "tech",
      price: "150€",
      organizer: "Blockchain France",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Blockchain", "Crypto", "DeFi", "NFT"],
      aiMatchScore: 76,
      potentialMatches: 31,
      featured: false,
      difficulty: "Avancé",
      networking: "Moyen"
    },
    {
      id: 4,
      title: "Future of Work Summit",
      description: "Comment l'IA et l'automatisation transforment le monde du travail",
      date: "12 Avril 2025",
      time: "09:30 - 16:30",
      location: "La Défense Arena, Paris",
      attendees: 600,
      maxAttendees: 800,
      category: "business",
      price: "75€",
      organizer: "Future Work Institute",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["RH", "Management", "Innovation"],
      aiMatchScore: 82,
      potentialMatches: 19,
      featured: true,
      difficulty: "Intermédiaire",
      networking: "Élevé"
    },
    {
      id: 5,
      title: "Women in Tech Meetup",
      description: "Réseau exclusif pour les femmes leaders dans la technologie",
      date: "18 Avril 2025",
      time: "19:00 - 22:00",
      location: "Google Campus, Paris",
      attendees: 150,
      maxAttendees: 200,
      category: "tech",
      price: "Gratuit",
      organizer: "Women in Tech Paris",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Diversité", "Leadership", "Tech"],
      aiMatchScore: 91,
      potentialMatches: 12,
      featured: false,
      difficulty: "Tous niveaux",
      networking: "Très élevé"
    },
    {
      id: 6,
      title: "SaaS Growth Masterclass",
      description: "Stratégies avancées pour faire croître votre SaaS de 0 à 100M€",
      date: "25 Avril 2025",
      time: "14:00 - 18:00",
      location: "Hôtel des Arts et Métiers, Paris",
      attendees: 250,
      maxAttendees: 300,
      category: "business",
      price: "200€",
      organizer: "SaaS Academy",
      image: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["SaaS", "Growth", "Marketing"],
      aiMatchScore: 79,
      potentialMatches: 15,
      featured: false,
      difficulty: "Avancé",
      networking: "Moyen"
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleApply = (eventId: number) => {
    console.log('Applying to event:', eventId);
    // Here you would handle the application logic
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Découvrez les événements 🚀
          </h1>
          <p className="text-gray-400 text-lg">
            Trouvez les événements parfaits pour votre networking grâce à notre IA
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8"
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
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
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
                  className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:from-white/15 hover:to-white/10 transition-all duration-500 group"
                >
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      À la une
                    </div>
                  </div>
                  
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* AI Match Score */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-3 py-1 flex items-center space-x-2">
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <UserPlus className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-300 text-sm">{event.potentialMatches} matches potentiels</span>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApply(event.id)}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
                      >
                        <span>Postuler</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
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
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* AI Match Score */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-2 py-1 flex items-center space-x-1">
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
                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <UserPlus className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-300 text-xs">{event.potentialMatches} matches</span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApply(event.id)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm flex items-center space-x-1"
                    >
                      <span>Postuler</span>
                      <ArrowRight className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
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
      </div>
    </motion.div>
  );
};

export default EventsHub;