import React, { useState, useEffect } from 'react';
import axios from "axios";
import { motion } from 'framer-motion';
import { 
  Users, Search, Filter, MoreVertical, Eye, UserCheck, UserX, 
  Shield, Mail, Calendar, MapPin, Activity, Ban, CheckCircle,
  AlertTriangle, Edit, Trash2, Download, Upload, RefreshCw
} from 'lucide-react';

interface User {
  _id: string;  // ✅ Changé de 'id' à '_id' pour correspondre à MongoDB
  id?: string;  // Optionnel pour compatibilité
  name: string;
  email: string;
  role: string;
  status?: string;
  joinDate?: string;
  lastActive?: string;
  eventsAttended?: number;
  connections?: number;
  reports?: number | 0;
  avatar?: string;
  location?: string;
  verified?: boolean;
  subscription?: string;
}

const UserManagement = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContactingUser, setIsContactingUser] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<{ users: User[] }>(`${API_BASE_URL}/users`);
        console.log(response.data);
        setUsers(Array.isArray(response.data) ? response.data : response.data.users);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /**
   * Contacter un utilisateur - créer une conversation directe
   */
  const handleContactUser = async (targetUser: User) => {
    try {
      console.log('=== START handleContactUser ===');
      console.log('Target user:', targetUser);
      
      setIsContactingUser(true);
      
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      console.log('Stored user exists:', !!storedUser);
      
      if (!storedUser) {
        alert('Veuillez vous connecter pour contacter cet utilisateur');
        window.location.href = '/login';
        return;
      }
      
      const currentUser = JSON.parse(storedUser);
      console.log('Current user:', currentUser);
      console.log('Current user ID:', currentUser._id);
      
      // Vérifier si l'utilisateur n'essaie pas de se contacter lui-même
      if (targetUser._id === currentUser._id) {
        alert('Vous ne pouvez pas vous envoyer un message à vous-même');
        return;
      }
      
      console.log('Making API call to:', `${API_BASE_URL}/direct-messages/start-conversation`);
      console.log('Sending data:', { userId: currentUser._id, targetUserId: targetUser._id });
      
      const response = await fetch(
        `${API_BASE_URL}/direct-messages/start-conversation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser._id,
            targetUserId: targetUser._id  // ✅ Utiliser _id au lieu de id
          })
        }
      );
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!data.success) {
        console.error('API returned error:', data.message);
        throw new Error(data.message);
      }
      
      console.log('✅ Conversation created successfully:', data.data._id);
      
      // Fermer la modal
      setShowUserModal(false);
      
      // Rediriger vers la page de messages avec la conversation sélectionnée
      window.location.href = `/messages?conversation=${data.data._id}`;
      
    } catch (error) {
      console.error('=== ERROR in handleContactUser ===');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : error);
      console.error('Full error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      
      alert(error instanceof Error ? error.message : 'Erreur lors de la création de la conversation');
    } finally {
      setIsContactingUser(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Chargement des utilisateurs...</p>
      </div>
    </div>
  );

  const filters = [
    { id: 'all', label: 'Tous', count: users?.length ?? 0 },
    { id: 'active', label: 'Actifs', count: users?.filter(u => u.status === 'active').length ?? 0 },
    { id: 'suspended', label: 'Suspendus', count: users?.filter(u => u.status === 'suspended').length ?? 0 },
    { id: 'pending', label: 'En attente', count: users?.filter(u => u.status === 'pending').length ?? 0 },
    { id: 'reported', label: 'Signalés', count: users?.filter(u => (u.reports || 0) > 0).length ?? 0 }
  ];

  const filteredUsers = (users ?? []).filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                          (selectedFilter === 'reported' ? (user.reports || 0) > 0 : user.status === selectedFilter);
    return matchesSearch && matchesFilter;
  });

  // Ajouter l'ID pour compatibilité avec l'ancien code
  const usersWithId = filteredUsers.map(user => ({
    ...user,
    id: user._id  // Créer un alias 'id' qui pointe vers '_id'
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'suspended': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'ORGANIZER': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action ${action} on user ${userId}`);
    // Implement user actions
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} on users:`, selectedUsers);
    // Implement bulk actions
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(usersWithId.map(user => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
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
            Gestion des utilisateurs 👥
          </h1>
          <p className="text-gray-400 text-lg">
            Gérez tous les utilisateurs de votre plateforme
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-2 overflow-x-auto">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{filter.count}</span>
                </motion.button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                title="Exporter les données"
              >
                <Download className="w-5 h-5 text-gray-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                title="Rafraîchir"
              >
                <RefreshCw className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-blue-300 font-medium">
                  {selectedUsers.length} utilisateur(s) sélectionné(s)
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all duration-300"
                  >
                    Activer
                  </button>
                  <button
                    onClick={() => handleBulkAction('suspend')}
                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                  >
                    Suspendre
                  </button>
                  <button
                    onClick={clearSelection}
                    className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all duration-300"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Utilisateurs ({usersWithId.length})
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={selectedUsers.length === usersWithId.length ? clearSelection : selectAllUsers}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300"
                >
                  {selectedUsers.length === usersWithId.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === usersWithId.length && usersWithId.length > 0}
                      onChange={selectedUsers.length === usersWithId.length ? clearSelection : selectAllUsers}
                      className="w-4 h-4 rounded border-gray-600 text-blue-500 bg-transparent focus:ring-blue-500/20"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Rôle</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Activité</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Reports</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersWithId.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="hover:bg-white/5 transition-all duration-300"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="w-4 h-4 rounded border-gray-600 text-blue-500 bg-transparent focus:ring-blue-500/20"
                      />
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                          />
                          {user.verified && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{user.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status || '')}`}>
                        {user.status === 'active' ? 'Actif' :
                         user.status === 'suspended' ? 'Suspendu' :
                         user.status === 'pending' ? 'En attente' : user.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {user.role === 'ADMIN' ? 'Admin' :
                         user.role === 'ORGANIZER' ? 'Organisateur' : 'Utilisateur'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{user.eventsAttended} événements</div>
                      <div className="text-sm text-gray-400">{user.connections} connexions</div>
                      <div className="text-xs text-gray-500">Actif: {user.lastActive}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {(user.reports || 0) > 0 ? (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-red-400 font-medium">{user.reports}</span>
                        </div>
                      ) : (
                        <span className="text-green-400">Aucun</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        
                        {user.status === 'active' ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                            title="Suspendre"
                          >
                            <Ban className="w-4 h-4" />
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300"
                            title="Activer"
                          >
                            <UserCheck className="w-4 h-4" />
                          </motion.button>
                        )}
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all duration-300"
                          title="Plus d'options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Détails utilisateur</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-400 text-2xl">&times;</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                    <p className="text-gray-400">{selectedUser.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedUser.status || '')}`}>
                        {selectedUser.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">{selectedUser.eventsAttended}</div>
                    <div className="text-xs text-gray-400">Événements</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Users className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">{selectedUser.connections}</div>
                    <div className="text-xs text-gray-400">Connexions</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">{selectedUser.reports}</div>
                    <div className="text-xs text-gray-400">Reports</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Activity className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">Actif</div>
                    <div className="text-xs text-gray-400">Statut</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleContactUser(selectedUser)}
                    disabled={isContactingUser}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isContactingUser ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Connexion...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Contacter</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-300"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UserManagement;