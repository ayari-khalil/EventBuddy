import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Eye, CheckCircle, XCircle, Clock, User, 
  MessageSquare, Image, Flag, Search, Filter, Calendar,
  ArrowRight, FileText, Shield, Ban, UserCheck
} from 'lucide-react';

const ReportsManagement = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const reports = [
    {
      id: 1,
      type: "inappropriate_content",
      status: "pending",
      priority: "high",
      reportedUser: {
        name: "John Smith",
        email: "john.smith@email.com",
        avatar: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=100"
      },
      reportedBy: {
        name: "Marie Dubois",
        email: "marie.dubois@email.com"
      },
      reason: "Contenu inapproprié dans le profil",
      description: "L'utilisateur a publié du contenu offensant dans sa bio et ses messages.",
      evidence: [
        { type: "text", content: "Capture d'écran du profil" },
        { type: "message", content: "Messages inappropriés" }
      ],
      createdAt: "2025-03-10T14:30:00Z",
      event: "Tech Summit 2025",
      category: "harassment"
    },
    {
      id: 2,
      type: "fake_profile",
      status: "investigating",
      priority: "medium",
      reportedUser: {
        name: "Alex Johnson",
        email: "alex.johnson@email.com",
        avatar: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=100"
      },
      reportedBy: {
        name: "Thomas Martin",
        email: "thomas.martin@email.com"
      },
      reason: "Profil suspect/faux",
      description: "Le profil semble être faux avec des informations incohérentes.",
      evidence: [
        { type: "profile", content: "Informations contradictoires" },
        { type: "verification", content: "Documents suspects" }
      ],
      createdAt: "2025-03-09T16:45:00Z",
      event: "AI Conference 2025",
      category: "fraud"
    },
    {
      id: 3,
      type: "spam",
      status: "resolved",
      priority: "low",
      reportedUser: {
        name: "Sarah Wilson",
        email: "sarah.wilson@email.com",
        avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100"
      },
      reportedBy: {
        name: "Sophie Laurent",
        email: "sophie.laurent@email.com"
      },
      reason: "Messages de spam",
      description: "Envoi massif de messages promotionnels non sollicités.",
      evidence: [
        { type: "messages", content: "Historique des messages" }
      ],
      createdAt: "2025-03-08T10:20:00Z",
      resolvedAt: "2025-03-09T09:15:00Z",
      action: "warning_issued",
      category: "spam"
    }
  ];

  const filters = [
    { id: 'all', label: 'Tous', count: reports.length },
    { id: 'pending', label: 'En attente', count: reports.filter(r => r.status === 'pending').length },
    { id: 'investigating', label: 'En cours', count: reports.filter(r => r.status === 'investigating').length },
    { id: 'resolved', label: 'Résolus', count: reports.filter(r => r.status === 'resolved').length },
    { id: 'high', label: 'Priorité haute', count: reports.filter(r => r.priority === 'high').length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'investigating': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'resolved': return 'text-green-400 bg-green-500/20 border-green-500/30';
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'harassment': return AlertTriangle;
      case 'fraud': return Shield;
      case 'spam': return MessageSquare;
      default: return Flag;
    }
  };

  const handleReportAction = (reportId: number, action: string) => {
    console.log(`Action ${action} on report ${reportId}`);
    // Implement report actions
  };

  const filteredReports = reports.filter(report => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'high') return report.priority === 'high';
    return report.status === selectedFilter;
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Gestion des signalements 🚨
          </h1>
          <p className="text-gray-400 text-lg">
            Traitez les signalements et maintenez la sécurité de la plateforme
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
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <span>{filter.label}</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{filter.count}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Reports List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {filteredReports.map((report, index) => {
            const CategoryIcon = getCategoryIcon(report.category);
            
            return (
              <motion.div
                key={report.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 ${
                  report.priority === 'high' ? 'ring-2 ring-red-500/50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-red-500/20 rounded-xl">
                      <CategoryIcon className="w-6 h-6 text-red-400" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                          {report.status === 'pending' ? 'En attente' :
                           report.status === 'investigating' ? 'En cours' :
                           'Résolu'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(report.priority)}`}>
                          {report.priority === 'high' ? 'Urgent' :
                           report.priority === 'medium' ? 'Moyen' : 'Faible'}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-1">{report.reason}</h3>
                      <p className="text-gray-400 text-sm mb-2">{report.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Signalé par: {report.reportedBy.name}</span>
                        <span>•</span>
                        <span>Événement: {report.event}</span>
                        <span>•</span>
                        <span>{new Date(report.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reported User */}
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <h4 className="text-white font-medium mb-3">Utilisateur signalé</h4>
                  <div className="flex items-center space-x-3">
                    <img
                      src={report.reportedUser.avatar}
                      alt={report.reportedUser.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                    />
                    <div>
                      <div className="font-medium text-white">{report.reportedUser.name}</div>
                      <div className="text-sm text-gray-400">{report.reportedUser.email}</div>
                    </div>
                  </div>
                </div>

                {/* Evidence */}
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Preuves ({report.evidence.length})</h4>
                  <div className="space-y-2">
                    {report.evidence.map((evidence, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-400">
                        <FileText className="w-4 h-4" />
                        <span>{evidence.content}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedReport(report);
                      setShowReportModal(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Examiner</span>
                  </motion.button>
                  
                  {report.status === 'pending' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReportAction(report.id, 'approve')}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Valider</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReportAction(report.id, 'reject')}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Rejeter</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Report Detail Modal */}
        {showReportModal && selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Détails du signalement</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Report Info */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-medium mb-3">Informations du signalement</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">{selectedReport.reason}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Priorité:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedReport.priority)}`}>
                          {selectedReport.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Statut:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedReport.status)}`}>
                          {selectedReport.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span className="text-white">{new Date(selectedReport.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-medium mb-3">Description</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedReport.description}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-medium mb-3">Preuves</h3>
                    <div className="space-y-2">
                      {selectedReport.evidence.map((evidence: any, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300 text-sm">{evidence.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-medium mb-3">Utilisateur signalé</h3>
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={selectedReport.reportedUser.avatar}
                        alt={selectedReport.reportedUser.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                      />
                      <div>
                        <div className="font-medium text-white">{selectedReport.reportedUser.name}</div>
                        <div className="text-sm text-gray-400">{selectedReport.reportedUser.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-medium mb-3">Signalé par</h3>
                    <div className="text-sm">
                      <div className="text-white">{selectedReport.reportedBy.name}</div>
                      <div className="text-gray-400">{selectedReport.reportedBy.email}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Envoyer un avertissement</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Suspendre l'utilisateur</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Marquer comme résolu</span>
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

export default ReportsManagement;