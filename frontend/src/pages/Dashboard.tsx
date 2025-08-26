import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Brain, Zap, Star, MapPin, Clock, UserPlus, MessageSquare, TrendingUp, Target, Filter } from 'lucide-react';

const Dashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const upcomingEvents = [
    {
      id: 1,
      name: "Tech Innovation Summit 2025",
      date: "15 Mars 2025",
      location: "Paris, France",
      attendees: 250,
      matches: 12,
      image: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
        {
      id: 11,
      name: "Tech Innovation Summit 2025",
      date: "15 Mars 2025",
      location: "Paris, France",
      attendees: 250,
      matches: 12,
      image: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 2,
      name: "AI & Future Work Conference",
      date: "22 Mars 2025",
      location: "Lyon, France",
      attendees: 180,
      matches: 8,
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const aiRecommendations = [
    {
      id: 1,
      name: "Marie Dubois",
      role: "CEO @ TechStart",
      matchScore: 95,
      commonInterests: ["IA", "Fintech"],
      goals: ["Trouver investisseur"],
      avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150",
      event: "Tech Innovation Summit 2025"
    },
    {
      id: 2,
      name: "Thomas Martin",
      role: "CTO @ InnoLab",
      matchScore: 88,
      commonInterests: ["Blockchain", "SaaS"],
      goals: ["Partenariat"],
      avatar: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=150",
      event: "Tech Innovation Summit 2025"
    },
    {
      id: 3,
      name: "Sophie Laurent",
      role: "VP Marketing @ GrowthCo",
      matchScore: 82,
      commonInterests: ["Marketing", "SaaS"],
      goals: ["Recruter talents"],
      avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150",
      event: "AI & Future Work Conference"
    }
  ];

  const recentActivity = [
    {
      type: "match",
      content: "Nouveau match avec Marie Dubois",
      time: "Il y a 2h",
      icon: UserPlus
    },
    {
      type: "message",
      content: "Message reçu de Thomas Martin",
      time: "Il y a 4h",
      icon: MessageSquare
    },
    {
      type: "event",
      content: "Nouvel événement recommandé",
      time: "Il y a 1 jour",
      icon: Calendar
    }
  ];

  const stats = [
    { label: "Matches cette semaine", value: 12, icon: Users, color: "blue" },
    { label: "Événements à venir", value: 3, icon: Calendar, color: "purple" },
    { label: "Score IA moyen", value: "88%", icon: Brain, color: "pink" },
    { label: "Connexions actives", value: 45, icon: Zap, color: "orange" }
  ];

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Bonjour ! 👋
          </h1>
          <p className="text-gray-400">
            Voici vos recommandations personnalisées et vos prochains événements
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${
                  stat.color === 'blue' ? 'from-blue-500/20 to-blue-600/20' :
                  stat.color === 'purple' ? 'from-purple-500/20 to-purple-600/20' :
                  stat.color === 'pink' ? 'from-pink-500/20 to-pink-600/20' :
                  'from-orange-500/20 to-orange-600/20'
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'purple' ? 'text-purple-400' :
                    stat.color === 'pink' ? 'text-pink-400' :
                    'text-orange-400'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Recommendations */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Brain className="w-6 h-6 text-purple-400 mr-2" />
                  Recommandations IA
                </h2>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="all">Tous</option>
                    <option value="high">Score élevé</option>
                    <option value="recent">Récents</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {aiRecommendations.map((person, index) => (
                  <motion.div
                    key={person.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:from-white/10 hover:to-white/15 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">{person.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-medium">{person.matchScore}%</span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">{person.role}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex space-x-1">
                            {person.commonInterests.map((interest) => (
                              <span
                                key={interest}
                                className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-500">•</span>
                          <span className="text-xs text-gray-400">{person.event}</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        Connecter
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Upcoming Events */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                Événements à venir
              </h3>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4 hover:from-white/10 hover:to-white/15 transition-all duration-300 cursor-pointer"
                  >
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-20 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-medium text-white text-sm mb-2">{event.name}</h4>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {event.attendees} participants
                        </span>
                        <span className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-300 px-2 py-1 rounded-full">
                          {event.matches} matches
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                Activité récente
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <activity.icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.content}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;