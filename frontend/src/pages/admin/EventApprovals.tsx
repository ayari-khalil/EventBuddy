import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, CheckCircle, XCircle, Clock, Eye, Users, MapPin, 
  DollarSign, Star, AlertTriangle, FileText, Image, Link as LinkIcon,
  Filter, Search, ArrowRight, Award, Shield, Zap
} from 'lucide-react';

const EventApprovals = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const pendingEvents = [
    {
      id: 1,
      title: "Blockchain Innovation Summit 2025",
      description: "Le plus grand événement blockchain de France avec les leaders mondiaux de la technologie décentralisée.",
      organizer: {
        name: "Alex Chen",
        email: "alex.chen@blockchainventures.com",
        company: "Blockchain Ventures",
        verified: true,
        pastEvents: 12,
        rating: 4.8
      },
      date: "2025-04-15",
      time: "09:00 - 18:00",
      location: "Palais des Congrès, Paris",
      capacity: 1000,
      price: "€150",
      category: "tech",
      status: "pending",
      priority: "high",
      submittedAt: "2025-03-08T10:00:00Z",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400",
      speakers: [
        { name: "Vitalik Buterin", role: "Founder Ethereum" },
        { name: "Changpeng Zhao", role: "Ex-CEO Binance" }
      ],
      agenda: [
        { time: "09:00", title: "Accueil et networking" },
        { time: "10:00", title: "Keynote: L'avenir de la blockchain" },
        { time: "14:00", title: "Panel: DeFi et régulation" }
      ],
      requirements: {
        insurance: true,
        security: true,
        permits: true,
        covid: false
      },
      budget: "€50,000",
      expectedAttendees: 800,
      sponsorshipLevel: "platinum"
    },
    {
      id: 2,
      title: "Women in Tech Leadership Summit",
      description: "Conférence dédiée aux femmes leaders dans la technologie avec des ateliers pratiques et du networking.",
      organizer: {
        name: "Sophie Laurent",
        email: "sophie@womenintech.fr",
        company: "Women in Tech France",
        verified: false,
        pastEvents: 3,
        rating: 4.2
      },
      date: "2025-04-22",
      time: "14:00 - 20:00",
      location: "Station F, Paris",
      capacity: 300,
      price: "Gratuit",
      category: "diversity",
      status: "pending",
      priority: "medium",
      submittedAt: "2025-03-09T14:30:00Z",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400",
      speakers: [
        { name: "Reshma Saujani", role: "Founder Girls Who Code" },
        { name: "Susan Wojcicki", role: "Ex-CEO YouTube" }
      ],
      agenda: [
        { time: "14:00", title: "Accueil" },
        { time: "15:00", title: "Leadership féminin en tech" },
        { time: "17:00", title: "Ateliers pratiques" }
      ],
      requirements: {
        insurance: true,
        security: false,
        permits: true,
        covid: false
      },
      budget: "€15,000",
      expectedAttendees: 250,
      sponsorshipLevel: "gold"
    },
    {
      id: 3,
      title: "Startup Pitch Night",
      description: "Soirée de pitch pour startups avec investisseurs et entrepreneurs expérimentés.",
      organizer: {
        name: "Marc Dubois",
        email: "marc@startupgrind.com",
        company: "Startup Grind Paris",
        verified: true,
        pastEvents: 25,
        rating: 4.9
      },
      date: "2025-04-10",
      time: "18:00 - 22:00",
      location: "WeWork Opéra, Paris",
      capacity: 150,
      price: "€25",
      category: "startup",
      status: "reviewing",
      priority: "low",
      submittedAt: "2025-03-07T16:20:00Z",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
      speakers: [
        { name: "Xavier Niel", role: "Founder Free" },
        { name: "Roxanne Varza", role: "Director Station F" }
      ],
      agenda: [
        { time: "18:00", title: "Networking cocktail" },
        { time: "19:00", title: "Pitchs startups" },
        { time: "21:00", title: "Q&A investisseurs" }
      ],
      requirements: {
        insurance: true,
        security: true,
        permits: false,
        covid: false
      },
      budget: "€8,000",
      expectedAttendees: 120,
      sponsorshipLevel: "silver"
    }
  ];

  const filters = [
    { id: 'all', label: 'Tous', count: pendingEvents.length },
    { id: 'pending', label: 'En attente', count: pendingEvents.filter(e => e.status === 'pending').length },
    { id: 'reviewing', label: 'En révision', count: pendingEvents.filter(e => e.status === 'reviewing').length },
    { id: 'high', label: 'Priorité haute', count: pendingEvents.filter(e => e.priority === 'high').length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'reviewing': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'approved': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'rejected': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const handleEventAction = (eventId: number, action: string) => {
    console.log(`Action ${action} on event ${eventId}`);
    // Implement event actions
  };

  const filteredEvents = pendingEvents.filter(event => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'high') return event.priority === 'high';
    return event.status === selectedFilter;
  });

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
            Approbation d'événements 📅
          </h1>
          <p className="text-gray-400 text-lg">
            Examinez et approuvez les demandes d'événements
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <span>{filter.label}</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{filter.count}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Events List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 ${
                event.priority === 'high' ? 'ring-2 ring-red-500/50' : ''
              }`}
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                          {event.status === 'pending' ? 'En attente' :
                           event.status === 'reviewing' ? 'En révision' : event.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(event.priority)}`}>
                          {event.priority === 'high' ? 'Urgent' :
                           event.priority === 'medium' ? 'Moyen' : 'Faible'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
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
                      {event.capacity} places
                    </div>
                  </div>

                  {/* Organizer Info */}
                  <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <h4 className="text-white font-medium mb-2">Organisateur</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {event.organizer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{event.organizer.name}</span>
                          {event.organizer.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <div className="text-sm text-gray-400">{event.organizer.company}</div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{event.organizer.pastEvents} événements</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span>{event.organizer.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
                      <div className="text-white font-bold text-sm">{event.price}</div>
                      <div className="text-gray-400 text-xs">Prix</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <div className="text-white font-bold text-sm">{event.expectedAttendees}</div>
                      <div className="text-gray-400 text-xs">Attendus</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Award className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                      <div className="text-white font-bold text-sm">{event.sponsorshipLevel}</div>
                      <div className="text-gray-400 text-xs">Sponsor</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventModal(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Examiner</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEventAction(event.id, 'approve')}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approuver</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEventAction(event.id, 'reject')}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Rejeter</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Event Detail Modal */}
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Examen de l'événement</h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Event Details */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-bold text-white mb-2">{selectedEvent.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedEvent.description}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">Agenda</h4>
                    <div className="space-y-2">
                      {selectedEvent.agenda.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center space-x-3 text-sm">
                          <span className="text-blue-400 font-mono">{item.time}</span>
                          <span className="text-gray-300">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">Intervenants</h4>
                    <div className="space-y-2">
                      {selectedEvent.speakers.map((speaker: any, idx: number) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {speaker.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{speaker.name}</div>
                            <div className="text-gray-400 text-xs">{speaker.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Organizer & Requirements */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">Organisateur</h4>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {selectedEvent.organizer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{selectedEvent.organizer.name}</span>
                          {selectedEvent.organizer.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <div className="text-sm text-gray-400">{selectedEvent.organizer.company}</div>
                        <div className="text-xs text-gray-500">{selectedEvent.organizer.email}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center">
                        <div className="text-white font-bold">{selectedEvent.organizer.pastEvents}</div>
                        <div className="text-gray-400 text-xs">Événements passés</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-white font-bold">{selectedEvent.organizer.rating}</span>
                        </div>
                        <div className="text-gray-400 text-xs">Note moyenne</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">Exigences légales</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedEvent.requirements).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm capitalize">
                            {key === 'insurance' ? 'Assurance' :
                             key === 'security' ? 'Sécurité' :
                             key === 'permits' ? 'Permis' : 'COVID'}
                          </span>
                          {value ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">Informations financières</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Budget:</span>
                        <span className="text-white font-medium">{selectedEvent.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Prix d'entrée:</span>
                        <span className="text-white font-medium">{selectedEvent.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Niveau sponsoring:</span>
                        <span className="text-white font-medium capitalize">{selectedEvent.sponsorshipLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Final Actions */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEventAction(selectedEvent.id, 'approve')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Approuver l'événement</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Demander des modifications</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEventAction(selectedEvent.id, 'reject')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Rejeter l'événement</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EventApprovals;