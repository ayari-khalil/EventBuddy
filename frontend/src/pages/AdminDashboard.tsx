import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, Users, AlertTriangle, Calendar, TrendingUp, Eye, 
  UserCheck, UserX, Clock, CheckCircle, XCircle, BarChart3,
  FileText, Settings, Bell, Activity, Zap, Target, Award,
  ArrowUp, ArrowDown, Filter, Search, MoreVertical
} from 'lucide-react';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  const stats = [
    {
      label: "Utilisateurs actifs",
      value: "12,847",
      change: +12.5,
      changeType: "increase",
      icon: Users,
      color: "blue"
    },
    {
      label: "Reports en attente",
      value: "23",
      change: -8,
      changeType: "decrease", 
      icon: AlertTriangle,
      color: "red",
      urgent: true
    },
    {
      label: "Événements à approuver",
      value: "15",
      change: +3,
      changeType: "increase",
      icon: Calendar,
      color: "orange"
    },
    {
      label: "Revenus ce mois",
      value: "€45,230",
      change: +18.2,
      changeType: "increase",
      icon: TrendingUp,
      color: "green"
    }
  ];

  const recentActivity = [
    {
      type: "user_signup",
      message: "Nouvel utilisateur inscrit",
      user: "Marie Dubois",
      time: "Il y a 5 min",
      icon: UserCheck,
      color: "green"
    },
    {
      type: "report",
      message: "Nouveau signalement",
      user: "Contenu inapproprié signalé",
      time: "Il y a 12 min",
      icon: AlertTriangle,
      color: "red"
    },
    {
      type: "event_request",
      message: "Demande d'événement",
      user: "Tech Summit 2025",
      time: "Il y a 25 min",
      icon: Calendar,
      color: "blue"
    },
    {
      type: "user_verified",
      message: "Profil vérifié",
      user: "Thomas Martin",
      time: "Il y a 1h",
      icon: CheckCircle,
      color: "green"
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: "event",
      title: "Blockchain Innovation Summit",
      requester: "Alex Chen",
      date: "15 Mars 2025",
      status: "pending",
      priority: "high"
    },
    {
      id: 2,
      type: "organizer",
      title: "Demande organisateur",
      requester: "Sophie Laurent",
      company: "TechEvents Pro",
      status: "pending",
      priority: "medium"
    },
    {
      id: 3,
      type: "event",
      title: "AI & Future Work Conference",
      requester: "Innovation Lab",
      date: "22 Mars 2025",
      status: "pending",
      priority: "low"
    }
  ];

  const quickActions = [
    {
      title: "Gestion des utilisateurs",
      description: "Voir et gérer tous les utilisateurs",
      icon: Users,
      color: "blue",
      link: "/admin/users",
      count: "12,847"
    },
    {
      title: "Reports & Signalements",
      description: "Traiter les signalements",
      icon: AlertTriangle,
      color: "red",
      link: "/admin/reports",
      count: "23",
      urgent: true
    },
    {
      title: "Approbations",
      description: "Approuver événements et organisateurs",
      icon: CheckCircle,
      color: "orange",
      link: "/admin/approvals",
      count: "15"
    },
    {
      title: "Analytics avancées",
      description: "Statistiques détaillées",
      icon: BarChart3,
      color: "purple",
      link: "/admin/analytics",
      count: "Voir tout"
    }
  ];

  const systemHealth = [
    { metric: "Uptime", value: "99.9%", status: "excellent" },
    { metric: "Response Time", value: "120ms", status: "good" },
    { metric: "Error Rate", value: "0.02%", status: "excellent" },
    { metric: "Active Sessions", value: "2,847", status: "normal" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'normal': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Admin Dashboard 🛡️
              </h1>
              <p className="text-gray-400 text-lg">
                Gérez votre plateforme Event Buddy en temps réel
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
              <div className="flex space-x-2">
                {[
                  { id: 'today', label: "Aujourd'hui" },
                  { id: 'week', label: '7 jours' },
                  { id: 'month', label: '30 jours' }
                ].map((range) => (
                  <motion.button
                    key={range.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTimeRange(range.id as any)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      timeRange === range.id
                        ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {range.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
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
              className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 ${
                stat.urgent ? 'ring-2 ring-red-500/50 animate-pulse' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${
                  stat.color === 'blue' ? 'from-blue-500/20 to-blue-600/20' :
                  stat.color === 'red' ? 'from-red-500/20 to-red-600/20' :
                  stat.color === 'orange' ? 'from-orange-500/20 to-orange-600/20' :
                  'from-green-500/20 to-green-600/20'
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'red' ? 'text-red-400' :
                    stat.color === 'orange' ? 'text-orange-400' :
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
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Zap className="w-6 h-6 text-yellow-400 mr-2" />
              Actions rapides
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="block"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group ${
                      action.urgent ? 'ring-2 ring-red-500/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${
                        action.color === 'blue' ? 'from-blue-500/20 to-blue-600/20' :
                        action.color === 'red' ? 'from-red-500/20 to-red-600/20' :
                        action.color === 'orange' ? 'from-orange-500/20 to-orange-600/20' :
                        'from-purple-500/20 to-purple-600/20'
                      }`}>
                        <action.icon className={`w-6 h-6 ${
                          action.color === 'blue' ? 'text-blue-400' :
                          action.color === 'red' ? 'text-red-400' :
                          action.color === 'orange' ? 'text-orange-400' :
                          'text-purple-400'
                        }`} />
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        action.urgent 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse' 
                          : 'bg-white/10 text-gray-300'
                      }`}>
                        {action.count}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 text-green-400 mr-2" />
              Activité récente
            </h3>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${
                    activity.color === 'green' ? 'from-green-500/20 to-green-600/20' :
                    activity.color === 'red' ? 'from-red-500/20 to-red-600/20' :
                    'from-blue-500/20 to-blue-600/20'
                  }`}>
                    <activity.icon className={`w-4 h-4 ${
                      activity.color === 'green' ? 'text-green-400' :
                      activity.color === 'red' ? 'text-red-400' :
                      'text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-400 truncate">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Pending Approvals */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Clock className="w-6 h-6 text-orange-400 mr-2" />
              Approbations en attente
            </h2>
            <Link
              to="/admin/approvals"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300"
            >
              Voir tout →
            </Link>
          </div>

          <div className="space-y-4">
            {pendingApprovals.map((approval, index) => (
              <motion.div
                key={approval.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 bg-gradient-to-r ${getPriorityColor(approval.priority)} rounded-full`}>
                      <span className="text-white text-xs font-medium">
                        {approval.priority === 'high' ? 'Urgent' : 
                         approval.priority === 'medium' ? 'Moyen' : 'Faible'}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white">{approval.title}</h4>
                      <p className="text-sm text-gray-400">
                        Par {approval.requester}
                        {approval.date && ` • ${approval.date}`}
                        {approval.company && ` • ${approval.company}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
                    >
                      <XCircle className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-xl border border-green-500/20 rounded-3xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 text-green-400 mr-2" />
            État du système
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemHealth.map((health, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-white mb-1">{health.value}</div>
                <div className="text-sm text-gray-400 mb-1">{health.metric}</div>
                <div className={`text-xs font-medium ${getStatusColor(health.status)}`}>
                  {health.status === 'excellent' ? 'Excellent' :
                   health.status === 'good' ? 'Bon' :
                   health.status === 'normal' ? 'Normal' : 'Critique'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;