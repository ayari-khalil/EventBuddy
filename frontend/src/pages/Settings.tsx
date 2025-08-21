import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Brain, Palette, Globe, Smartphone, Mail, Lock, Eye, EyeOff, Save, Trash2 } from 'lucide-react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile
    name: "Alex Dubois",
    email: "alex.dubois@email.com",
    bio: "Entrepreneur passionné par l'IA et les technologies émergentes.",
    location: "Paris, France",
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    matchNotifications: true,
    eventReminders: true,
    weeklyDigest: true,
    
    // Privacy
    profileVisibility: "public",
    showEmail: false,
    showLocation: true,
    allowMessages: "matches",
    
    // AI Preferences
    aiMatching: true,
    matchRadius: 50,
    minMatchScore: 70,
    autoAcceptHighMatches: false,
    
    // Appearance
    theme: "dark",
    language: "fr",
    
    // Account
    twoFactorAuth: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const sections = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
    { id: 'ai', label: 'IA & Matching', icon: Brain },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'account', label: 'Compte', icon: Lock }
  ];

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Here you would typically save to your backend
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      console.log('Deleting account...');
      // Handle account deletion
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
        <input
          type="text"
          value={settings.name}
          onChange={(e) => setSettings({ ...settings, name: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
        <input
          type="email"
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
        <textarea
          value={settings.bio}
          onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300 resize-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Localisation</label>
        <input
          type="text"
          value={settings.location}
          onChange={(e) => setSettings({ ...settings, location: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Notifications par email</h3>
          <p className="text-gray-400 text-sm">Recevez des emails pour les événements importants</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Notifications push</h3>
          <p className="text-gray-400 text-sm">Notifications sur votre appareil</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.pushNotifications}
            onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Nouveaux matches</h3>
          <p className="text-gray-400 text-sm">Soyez notifié des nouveaux matches</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.matchNotifications}
            onChange={(e) => setSettings({ ...settings, matchNotifications: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Rappels d'événements</h3>
          <p className="text-gray-400 text-sm">Rappels avant vos événements</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.eventReminders}
            onChange={(e) => setSettings({ ...settings, eventReminders: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Résumé hebdomadaire</h3>
          <p className="text-gray-400 text-sm">Résumé de votre activité chaque semaine</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.weeklyDigest}
            onChange={(e) => setSettings({ ...settings, weeklyDigest: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
        </label>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Visibilité du profil</label>
        <select
          value={settings.profileVisibility}
          onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500/50 focus:outline-none transition-all duration-300"
        >
          <option value="public">Public</option>
          <option value="matches">Matches uniquement</option>
          <option value="private">Privé</option>
        </select>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Afficher l'email</h3>
          <p className="text-gray-400 text-sm">Votre email sera visible sur votre profil</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.showEmail}
            onChange={(e) => setSettings({ ...settings, showEmail: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Afficher la localisation</h3>
          <p className="text-gray-400 text-sm">Votre ville sera visible sur votre profil</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.showLocation}
            onChange={(e) => setSettings({ ...settings, showLocation: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Qui peut m'envoyer des messages</label>
        <select
          value={settings.allowMessages}
          onChange={(e) => setSettings({ ...settings, allowMessages: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500/50 focus:outline-none transition-all duration-300"
        >
          <option value="everyone">Tout le monde</option>
          <option value="matches">Matches uniquement</option>
          <option value="none">Personne</option>
        </select>
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Matching IA activé</h3>
          <p className="text-gray-400 text-sm">Utiliser l'IA pour trouver des matches pertinents</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.aiMatching}
            onChange={(e) => setSettings({ ...settings, aiMatching: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Rayon de matching: {settings.matchRadius} km
        </label>
        <input
          type="range"
          min="10"
          max="100"
          value={settings.matchRadius}
          onChange={(e) => setSettings({ ...settings, matchRadius: parseInt(e.target.value) })}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Score minimum pour les matches: {settings.minMatchScore}%
        </label>
        <input
          type="range"
          min="50"
          max="95"
          value={settings.minMatchScore}
          onChange={(e) => setSettings({ ...settings, minMatchScore: parseInt(e.target.value) })}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Auto-accepter les matches élevés</h3>
<p className="text-gray-400 text-sm">
  Accepter automatiquement les matches &gt; 90%
</p>        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoAcceptHighMatches}
            onChange={(e) => setSettings({ ...settings, autoAcceptHighMatches: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
        </label>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Thème</label>
        <select
          value={settings.theme}
          onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500/50 focus:outline-none transition-all duration-300"
        >
          <option value="dark">Sombre</option>
          <option value="light">Clair</option>
          <option value="auto">Automatique</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Langue</label>
        <select
          value={settings.language}
          onChange={(e) => setSettings({ ...settings, language: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500/50 focus:outline-none transition-all duration-300"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Authentification à deux facteurs</h3>
          <p className="text-gray-400 text-sm">Sécurisez votre compte avec 2FA</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
        </label>
      </div>
      
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Changer le mot de passe</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe actuel</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.currentPassword}
                onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              value={settings.newPassword}
              onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={settings.confirmPassword}
              onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-red-400 font-medium mb-2">Zone de danger</h3>
        <p className="text-gray-400 text-sm mb-4">
          Cette action supprimera définitivement votre compte et toutes vos données.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDeleteAccount}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Supprimer mon compte</span>
        </motion.button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSettings();
      case 'notifications': return renderNotificationSettings();
      case 'privacy': return renderPrivacySettings();
      case 'ai': return renderAISettings();
      case 'appearance': return renderAppearanceSettings();
      case 'account': return renderAccountSettings();
      default: return renderProfileSettings();
    }
  };

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
            Paramètres ⚙️
          </h1>
          <p className="text-gray-400 text-lg">
            Personnalisez votre expérience Event Buddy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-24">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span>{section.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {sections.find(s => s.id === activeSection)?.label}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </motion.button>
              </div>

              {renderContent()}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;