import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Calendar, DollarSign, Star,
  ArrowUp, ArrowDown, Eye, Download, RefreshCw, Filter,
  Activity, Target, Zap, Award, Globe, Smartphone, Mail,
  MessageCircle, UserPlus, Heart, Brain, Shield
} from 'lucide-react';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const overviewStats = [
    {
      label: "Utilisateurs totaux",
      value: "12,847",
      change: +12.5,
      changeType: "increase",
      icon: Users,
      color: "blue",
      details: "Croissance constante"
    },
    {
      label: "Événements créés",
      value: "1,234",
      change: +8.3,
      changeType: "increase",
      icon: Calendar,
      color: "purple",
      details: "Ce mois"
    },
    {
      label: "Matches réussis",
      value: "45,678",
      change: +15.7,
      changeType: "increase",
      icon: Heart,
      color: "pink",
      details: "Taux de succès: 78%"
    },
    {
      label: "Revenus",
      value: "€125,430",
      change: +22.1,
      changeType: "increase",
      icon: DollarSign,
      color: "green",
      details: "ARR: €1.5M"
    }
  ];

  const engagementData = [
    { metric: 'Sessions quotidiennes', value: '8,547', change: +5.2 },
    { metric: 'Temps moyen par session', value: '12m 34s', change: +2.1 },
    { metric: 'Pages vues', value: '156,789', change: +8.9 },
    { metric: 'Taux de rebond', value: '23.4%', change: -3.2 }
  ];

  const userGrowthData = [
    { month: 'Oct', users: 8500, events: 145, matches: 12400 },
    { month: 'Nov', users: 9200, events: 167, matches: 15600 },
    { month: 'Déc', users: 10100, events: 189, matches: 18900 },
    { month: 'Jan', users: 11200, events: 234, matches: 23400 },
    { month: 'Fév', users: 12100, events: 278, matches: 28900 },
    { month: 'Mar', users: 12847, events: 312, matches: 34500 }
  ];

  const topEvents = [
    {
      name: "AI Revolution Summit 2025",
      attendees: 1200,
      matches: 2847,
      rating: 4.9,
      revenue: "€18,000",
      image: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Startup Grind Paris",
      attendees: 800,
      matches: 1654,
      rating: 4.7,
      revenue: "€12,000",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Blockchain Conference",
      attendees: 600,
      matches: 1234,
      rating: 4.8,
      revenue: "€15,000",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
  ];

  const platformHealth = [
    { metric: "Uptime", value: "99.98%", status: "excellent", icon: Shield },
    { metric: "API Response", value: "89ms", status: "excellent", icon: Zap },
    { metric: "Error Rate", value: "0.01%", status: "excellent", icon: Activity },
    { metric: "User Satisfaction", value: "4.8/5", status: "excellent", icon: Star }
  ];

  const geographicData = [
    { country: "France", users: 8547, percentage: 66.5 },
    { country: "Belgique", users: 1234, percentage: 9.6 },
    { country: "Suisse", users: 987, percentage: 7.7 },
    { country: "Canada", users: 756, percentage: 5.9 },
    { country: "Autres", users: 1323, percentage: 10.3 }
  ];

  const deviceStats = [
    { device: "Desktop", percentage: 65.4, users: 8402 },
    { device: "Mobile", percentage: 28.7, users: 3687 },
    { device: "Tablet", percentage: 5.9, users: 758 }
  ];

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Analytics Avancées 📊
              </h1>
              <p className="text-gray-400 text-lg">
                Insights détaillés sur votre plateforme Event Buddy
              </p>
            </div>
            
            {/* Time Range & Actions */}
            <div className="flex items-center space-x-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
                <div className="flex space-x-2">
                  {[
                    { id: 'week', label: '7j' },
                    { id: 'month', label: '30j' },
                    { id: 'quarter', label: '3M' },
                    { id: 'year', label: '1A' }
                  ].map((range) => (
                    <motion.button
                      key={range.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTimeRange(range.id as any)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        timeRange === range.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {range.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <Download className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {overviewStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${
                  stat.color === 'blue' ? 'from-blue-500/20 to-blue-600/20' :
                  stat.color === 'purple' ? 'from-purple-500/20 to-purple-600/20' :
                  stat.color === 'pink' ? 'from-pink-500/20 to-pink-600/20' :
                  'from-green-500/20 to-green-600/20'
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'purple' ? 'text-purple-400' :
                    stat.color === 'pink' ? 'text-pink-400' :
                    'text-green-400'
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
              <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.details}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 text-purple-400 mr-2" />
              Croissance de la plateforme
            </h2>
            
            {/* Chart Visualization */}
            <div className="space-y-4">
              {userGrowthData.map((data, index) => (
                <div key={data.month} className="flex items-center space-x-4">
                  <div className="w-12 text-sm text-gray-400">{data.month}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="flex-1 bg-white/5 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(data.users / 15000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-blue-400 w-12">{(data.users / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="flex-1 bg-white/5 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(data.events / 400) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-purple-400 w-12">{data.events}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <div className="flex-1 bg-white/5 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(data.matches / 40000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-pink-400 w-12">{(data.matches / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-6 mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-400">Utilisateurs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-400">Événements</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                <span className="text-sm text-gray-400">Matches</span>
              </div>
            </div>
          </motion.div>

          {/* Top Events */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Award className="w-5 h-5 text-yellow-400 mr-2" />
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
                      <span>{event.attendees} participants</span>
                      <span>•</span>
                      <span>{event.matches} matches</span>
                    </div>
                    <div className="text-xs text-green-400">{event.revenue}</div>
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

        {/* Engagement Metrics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Activity className="w-6 h-6 text-green-400 mr-2" />
            Métriques d'engagement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagementData.map((metric, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm text-gray-400 mb-2">{metric.metric}</div>
                <div className={`flex items-center justify-center space-x-1 text-xs ${
                  metric.change > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Geographic Distribution */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Globe className="w-5 h-5 text-blue-400 mr-2" />
              Répartition géographique
            </h3>
            <div className="space-y-3">
              {geographicData.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {country.country.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{country.country}</div>
                      <div className="text-gray-400 text-xs">{country.users.toLocaleString()} utilisateurs</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-sm">{country.percentage}%</div>
                    <div className="w-16 bg-white/10 rounded-full h-1 mt-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Device Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Smartphone className="w-5 h-5 text-green-400 mr-2" />
              Utilisation par appareil
            </h3>
            <div className="space-y-4">
              {deviceStats.map((device, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">{device.device}</span>
                    <span className="text-gray-400 text-sm">{device.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        device.device === 'Desktop' ? 'from-blue-500 to-blue-600' :
                        device.device === 'Mobile' ? 'from-green-500 to-green-600' :
                        'from-purple-500 to-purple-600'
                      }`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">{device.users.toLocaleString()} utilisateurs</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Platform Health */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-xl border border-green-500/20 rounded-3xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 text-green-400 mr-2" />
            Santé de la plateforme
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platformHealth.map((health, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-4 text-center">
                <health.icon className={`w-6 h-6 mx-auto mb-2 ${getHealthColor(health.status)}`} />
                <div className="text-lg font-bold text-white mb-1">{health.value}</div>
                <div className="text-sm text-gray-400 mb-1">{health.metric}</div>
                <div className={`text-xs font-medium ${getHealthColor(health.status)}`}>
                  {health.status === 'excellent' ? 'Excellent' :
                   health.status === 'good' ? 'Bon' :
                   health.status === 'warning' ? 'Attention' : 'Critique'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Performance */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Brain className="w-5 h-5 text-purple-400 mr-2" />
            Performance de l'IA
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">94.2%</div>
              <div className="text-sm text-gray-400 mb-1">Précision du matching</div>
              <div className="text-xs text-green-400">+2.1% ce mois</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">78%</div>
              <div className="text-sm text-gray-400 mb-1">Taux de satisfaction</div>
              <div className="text-xs text-green-400">+5.3% ce mois</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">156ms</div>
              <div className="text-sm text-gray-400 mb-1">Temps de réponse IA</div>
              <div className="text-xs text-green-400">-12ms ce mois</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminAnalytics;