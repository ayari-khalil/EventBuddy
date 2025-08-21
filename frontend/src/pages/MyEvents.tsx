import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Star, Eye, MessageCircle, UserPlus, Award, TrendingUp, Target, Filter, Plus } from 'lucide-react';

const MyEvents = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'applied'>('upcoming');

  const upcomingEvents = [
    {
      id: 1,
      title: "AI Revolution Summit 2025",
      date: "15 Mars 2025",
      time: "09:00 - 18:00",
      location: "Station F, Paris",
      status: "confirmed",
      attendees: 1200,
      myConnections: 12,
      newMatches: 5,
      image: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=400",
      organizer: "AI France",
      myRole: "Speaker",
      talkTitle: "L'avenir de l'IA dans la Fintech"
    },
    {
      id: 2,
      title: "Startup Grind Paris",
      date: "22 Mars 2025",
      time: "18:00 - 22:00",
      location: "WeWork Opéra, Paris",
      status: "confirmed",
      attendees: 300,
      myConnections: 8,
      newMatches: 3,
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
      organizer: "Startup Grind",
      myRole: "Attendee"
    }
  ];

  const pastEvents = [
    {
      id: 3,
      title: "Tech Innovation Meetup",
      date: "10 Février 2025",
      time: "19:00 - 22:00",
      location: "Google Campus, Paris",
      status: "completed",
      attendees: 150,
      connectionsMade: 7,
      rating: 4.8,
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400",
      organizer: "Tech Paris",
      myRole: "Attendee",
      feedback: "Excellent événement, j'ai rencontré des personnes très intéressantes !",
      achievements: ["Super Networker", "Early Bird"]
    },
    {
      id: 4,
      title: "Blockchain Conference 2025",
      date: "25 Janvier 2025",
      time: "10:00 - 17:00",
      location: "Palais des Congrès, Paris",
      status: "completed",
      attendees: 800,
      connectionsMode: 12,
      rating: 4.5,
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400",
      organizer: "Blockchain France",
      myRole: "Panelist",
      talkTitle: "DeFi et l'avenir de la finance",
      achievements: ["Expert Speaker", "Top Networker"]
    }
  ];

  const appliedEvents = [
    {
      id: 5,
      title: "Future of Work Summit",
      date: "12 Avril 2025",
      time: "09:30 - 16:30",
      location: "La Défense Arena, Paris",
      status: "pending",
      attendees: 600,
      applicationDate: "5 Mars 2025",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
      organizer: "Future Work Institute",
      appliedAs: "Speaker",
      proposedTalk: "IA et transformation du travail"
    },
    {
      id: 6,
      title: "Women in Tech Meetup",
      date: "18 Avril 2025",
      time: "19:00 - 22:00",
      location: "Google Campus, Paris",
      status: "waitlist",
      attendees: 150,
      applicationDate: "1 Mars 2025",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400",
      organizer: "Women in Tech Paris",
      appliedAs: "Attendee",
      waitlistPosition: 15
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'from-green-500 to-blue-500';
      case 'pending': return 'from-yellow-500 to-orange-500';
      case 'waitlist': return 'from-purple-500 to-pink-500';
      case 'completed': return 'from-gray-500 to-gray-600';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'waitlist': return 'Liste d\'attente';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const renderUpcomingEvents = () => (
    <div className="space-y-6">
      {upcomingEvents.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * index }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300"
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
                    <div className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(event.status)} rounded-full`}>
                      <span className="text-white text-sm font-medium">{getStatusText(event.status)}</span>
                    </div>
                    {event.myRole === 'Speaker' && (
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <span className="text-white text-sm font-medium">🎤 Speaker</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  {event.talkTitle && (
                    <p className="text-purple-300 font-medium mb-2">"{event.talkTitle}"</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
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
                  {event.attendees} participants
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <UserPlus className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-bold">{event.myConnections}</div>
                  <div className="text-gray-400 text-xs">Mes connexions</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <div className="text-white font-bold">{event.newMatches}</div>
                  <div className="text-gray-400 text-xs">Nouveaux matches</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <Eye className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-white font-bold">Actif</div>
                  <div className="text-gray-400 text-xs">Statut</div>
                </div>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir les détails</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Messages</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderPastEvents = () => (
    <div className="space-y-6">
      {pastEvents.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * index }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300"
        >
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 md:h-full object-cover opacity-75"
              />
            </div>
            
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(event.status)} rounded-full`}>
                      <span className="text-white text-sm font-medium">{getStatusText(event.status)}</span>
                    </div>
                    {event.myRole === 'Panelist' && (
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <span className="text-white text-sm font-medium">🎯 Panelist</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  {event.talkTitle && (
                    <p className="text-purple-300 font-medium mb-2">"{event.talkTitle}"</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{event.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
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
                  {event.attendees} participants
                </div>
              </div>

              {/* Achievements */}
              {event.achievements && (
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2 flex items-center">
                    <Award className="w-4 h-4 text-yellow-400 mr-2" />
                    Accomplissements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.achievements.map((achievement) => (
                      <span
                        key={achievement}
                        className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 text-sm rounded-full"
                      >
                        🏆 {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {event.feedback && (
                <div className="mb-4 p-4 bg-white/5 rounded-xl">
                  <p className="text-gray-300 italic">"{event.feedback}"</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <UserPlus className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-white font-bold">{event.connectionsMode}</div>
                  <div className="text-gray-400 text-xs">Connexions créées</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-bold">{event.rating}/5</div>
                  <div className="text-gray-400 text-xs">Ma note</div>
                </div>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir le résumé</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connexions</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderAppliedEvents = () => (
    <div className="space-y-6">
      {appliedEvents.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * index }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300"
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
                    <div className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(event.status)} rounded-full`}>
                      <span className="text-white text-sm font-medium">{getStatusText(event.status)}</span>
                    </div>
                    <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                      <span className="text-white text-sm font-medium">{event.appliedAs}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  {event.proposedTalk && (
                    <p className="text-blue-300 font-medium mb-2">Sujet proposé: "{event.proposedTalk}"</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
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
                  {event.attendees} participants
                </div>
              </div>

              {/* Application Info */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Candidature envoyée:</span>
                    <span className="text-white ml-2">{event.applicationDate}</span>
                  </div>
                  {event.waitlistPosition && (
                    <div>
                      <span className="text-gray-400">Position liste d'attente:</span>
                      <span className="text-purple-300 ml-2 font-bold">#{event.waitlistPosition}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir ma candidature</span>
                </motion.button>
                {event.status === 'pending' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    Modifier
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Mes événements 📅
          </h1>
          <p className="text-gray-400 text-lg">
            Gérez vos participations et suivez vos performances de networking
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 mb-8"
        >
          <div className="flex space-x-2">
            {[
              { id: 'upcoming', label: 'À venir', count: upcomingEvents.length },
              { id: 'past', label: 'Passés', count: pastEvents.length },
              { id: 'applied', label: 'Candidatures', count: appliedEvents.length }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'upcoming' && renderUpcomingEvents()}
          {activeTab === 'past' && renderPastEvents()}
          {activeTab === 'applied' && renderAppliedEvents()}
        </motion.div>

        {/* Empty State */}
        {((activeTab === 'upcoming' && upcomingEvents.length === 0) ||
          (activeTab === 'past' && pastEvents.length === 0) ||
          (activeTab === 'applied' && appliedEvents.length === 0)) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'upcoming' && "Aucun événement à venir"}
              {activeTab === 'past' && "Aucun événement passé"}
              {activeTab === 'applied' && "Aucune candidature"}
            </h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'upcoming' && "Découvrez de nouveaux événements pour étendre votre réseau"}
              {activeTab === 'past' && "Vos événements passés apparaîtront ici"}
              {activeTab === 'applied' && "Vos candidatures en cours apparaîtront ici"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Découvrir des événements</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyEvents;