import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Target, Star, Calendar, MessageCircle, Award, Brain, Zap, Eye, ArrowUp, ArrowDown } from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const stats = [
    {
      label: "Connexions totales",
      value: 145,
      change: +12,
      changeType: "increase",
      icon: Users,
      color: "blue"
    },
    {
      label: "Événements participés",
      value: 23,
      change: +3,
      changeType: "increase",
      icon: Calendar,
      color: "purple"
    },
    {
      label: "Score IA moyen",
      value: "92%",
      change: +5,
      changeType: "increase",
      icon: Brain,
      color: "pink"
    },
    {
      label: "Taux de match",
      value: "78%",
      change: -2,
      changeType: "decrease",
      icon: Target,
      color: "orange"
    }
  ];

  const networkingData = [
    { month: 'Jan', connections: 12, events: 2, matches: 8 },
    { month: 'Fév', connections: 18, events: 3, matches: 14 },
    { month: 'Mar', connections: 25, events: 4, matches: 19 },
    { month: 'Avr', connections: 32, events: 3, matches: 24 },
    { month: 'Mai', connections: 28, events: 5, matches: 22 },
    { month: 'Juin', connections: 35, events: 4, matches: 28 }
  ];

  const topEvents = [
    {
      name: "AI Revolution Summit 2025",
      connections: 12,
      matches: 8,
      rating: 4.8,
      image: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Startup Grind Paris",
      connections: 8,
      matches: 6,
      rating: 4.5,
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Tech Innovation Meetup",
      connections: 7,
      matches: 5,
      rating: 4.6,
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
  ];

  const topConnections = [
    {
      name: "Marie Dubois",
      role: "CEO @ TechFlow AI",
      interactions: 15,
      lastContact: "2 jours",
      avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      strength: "Fort"
    },
    {
      name: "Thomas Martin",
      role: "CTO @ InnoLab",
      interactions: 12,
      lastContact: "1 semaine",
      avatar: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=100",
      strength: "Moyen"
    },
    {
      name: "Sophie Laurent",
      role: "VP Marketing @ GrowthCo",
      interactions: 10,
      lastContact: "3 jours",
      avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      strength: "Fort"
    }
  ];

  const achievements = [
    {
      title: "Super Networker",
      description: "50+ connexions créées",
      icon: "🌟",
      date: "Mars 2025",
      rarity: "Rare"
    },
    {
      title: "AI Expert",
      description: "Score IA de 90%+",
      icon: "🤖",
      date: "Février 2025",
      rarity: "Épique"
    },
    {
      title: "Event Master",
      description: "20+ événements participés",
      icon: "🎯",
      date: "Janvier 2025",
      rarity: "Commun"
    },
    {
      title: "Top Speaker",
      description: "5+ présentations données",
      icon: "🎤",
      date: "Mars 2025",
      rarity: "Rare"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Commun': return 'from-gray-500 to-gray-600';
      case 'Rare': return 'from-blue-500 to-purple-600';
      case 'Épique': return 'from-purple-500 to-pink-600';
      case 'Légendaire': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Fort': return 'text-green-400';
      case 'Moyen': return 'text-yellow-400';
      case 'Faible': return 'text-red-400';
      default: return 'text-gray-400';
    }
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
            Analytics 📊
          </h1>
          <p className="text-gray-400 text-lg">
            Analysez vos performances de networking et optimisez votre stratégie
          </p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 mb-8 inline-flex"
        >
          {[
            { id: 'week', label: '7 jours' },
            { id: 'month', label: '30 jours' },
            { id: 'year', label: '1 an' }
          ].map((range) => (
            <motion.button
              key={range.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTimeRange(range.id as any)}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                timeRange === range.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {range.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
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
                <div className={`flex items-center space-x-1 ${
                  stat.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.changeType === 'increase' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 text-blue-400 mr-2" />
              Évolution du networking
            </h2>
            
            {/* Simple Chart Visualization */}
            <div className="space-y-4">
              {networkingData.map((data, index) => (
                <div key={data.month} className="flex items-center space-x-4">
                  <div className="w-12 text-sm text-gray-400">{data.month}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="flex-1 bg-white/5 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(data.connections / 40) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-blue-400 w-8">{data.connections}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="flex-1 bg-white/5 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(data.matches / 30) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-purple-400 w-8">{data.matches}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-6 mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-400">Connexions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-400">Matches</span>
              </div>
            </div>
          </motion.div>

          {/* Top Events */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              Top événements
            </h3>
            <div className="space-y-4">
              {topEvents.map((event, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm truncate">{event.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{event.connections} connexions</span>
                      <span>•</span>
                      <span>{event.matches} matches</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs">{event.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Top Connections */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 text-green-400 mr-2" />
              Connexions les plus actives
            </h3>
            <div className="space-y-4">
              {topConnections.map((connection, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <img
                    src={connection.avatar}
                    alt={connection.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">{connection.name}</h4>
                    <p className="text-gray-400 text-xs">{connection.role}</p>
                    <div className="flex items-center space-x-2 text-xs mt-1">
                      <span className="text-gray-400">{connection.interactions} interactions</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">Il y a {connection.lastContact}</span>
                    </div>
                  </div>
                  <div className={`text-xs font-medium ${getStrengthColor(connection.strength)}`}>
                    {connection.strength}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Award className="w-5 h-5 text-yellow-400 mr-2" />
              Accomplissements récents
            </h3>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <div className={`w-10 h-10 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-xl flex items-center justify-center text-lg`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">{achievement.title}</h4>
                    <p className="text-gray-400 text-xs">{achievement.description}</p>
                    <div className="flex items-center space-x-2 text-xs mt-1">
                      <span className="text-gray-400">{achievement.date}</span>
                      <span className="text-gray-500">•</span>
                      <span className={`font-medium ${
                        achievement.rarity === 'Commun' ? 'text-gray-400' :
                        achievement.rarity === 'Rare' ? 'text-blue-400' :
                        achievement.rarity === 'Épique' ? 'text-purple-400' :
                        'text-yellow-400'
                      }`}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Brain className="w-5 h-5 text-purple-400 mr-2" />
            Insights IA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium text-sm">Tendance positive</span>
              </div>
              <p className="text-gray-300 text-sm">
                Votre taux de connexion a augmenté de 15% ce mois-ci. Continuez sur cette lancée !
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium text-sm">Recommandation</span>
              </div>
              <p className="text-gray-300 text-sm">
                Participez à plus d'événements IA pour maximiser vos matches de qualité.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-medium text-sm">Opportunité</span>
              </div>
              <p className="text-gray-300 text-sm">
                3 de vos connexions recherchent des partenaires dans votre domaine.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;