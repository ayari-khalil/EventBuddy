import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Edit3, Mail, Calendar, MapPin, Target, Tag, Star, Save, X, Plus, Camera, Award, TrendingUp } from 'lucide-react';

const ProfilePage = () => {

  const [isEditing, setIsEditing] = useState(false);
 const [user, setUser] = useState<any | null>(null);

  const [profileData, setProfileData] = useState({
    _id: "",
    name: "",
    email: "",
    bio: "",
    location: "",
    interests: [] as string[],
    goals: [] as string[],
    joinDate: "",
    matches: ""

  });


useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
      console.log("→ Données utilisateur récupérées :", storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Remplir profileData avec les infos du backend
        setProfileData({
          _id: parsedUser._id || "",
          name: parsedUser.name || "Nom inconnu",
          email: parsedUser.email || "Email non renseigné",
          bio: parsedUser.bio || "Aucune bio disponible",
          location: parsedUser.location || "Non spécifié",
          interests: parsedUser.interests || [],
          goals: parsedUser.goals || [],
          joinDate: new Date(parsedUser.createdAt).toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          }),
          matches: parsedUser.matches || "aucun match"
        });
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur :", error);
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  const [newInterest, setNewInterest] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const profileStats = [
    { label: "Connections", value: 145, icon: User },
    { label: "Événements", value: 23, icon: Calendar },
    { label: "Score IA", value: "92%", icon: Star },
    { label: "Matches", value: 78, icon: Target }
  ];

  const recentConnections = [
    {
      name: "Marie Dubois",
      role: "CEO @ TechStart",
      event: "Tech Summit 2025",
      avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Thomas Martin",
      role: "CTO @ InnoLab", 
      event: "AI Conference",
      avatar: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Sophie Laurent",
      role: "VP Marketing @ GrowthCo",
      event: "Marketing Meetup",
      avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
  ];

const addInterest = async (interest: string) => {
  if (!interest || profileData.interests.includes(interest)) return;

  try {
    const response = await fetch("http://localhost:5000/api/users/add-interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id, interest }),
    });

    const updatedUser = await response.json();
    setProfileData(updatedUser);
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'intérêt :", err);
  }
};

  const removeInterest = async (userId: string, interest: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}/removeInterest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interest }),
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression de l’intérêt");

    const updatedUser = await response.json();
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error(error);
  }
};

  const addGoal = (goal: string) => {
    if (goal && !profileData.goals.includes(goal)) {
      setProfileData({
        ...profileData,
        goals: [...profileData.goals, goal]
      });
    }
  };

  const removeGoal = (goal: string) => {
    setProfileData({
      ...profileData,
      goals: profileData.goals.filter(g => g !== goal)
    });
  };

  const addCustomInterest = () => {
    if (newInterest.trim()) {
      addInterest(newInterest.trim());
      setNewInterest('');
    }
  };

  const addCustomGoal = () => {
    if (newGoal.trim()) {
      addGoal(newGoal.trim());
      setNewGoal('');
    }
  };

  const saveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to a backend
    console.log('Saving profile:', profileData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="text-3xl font-bold bg-transparent text-white border-b border-white/30 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {profileData.name}
                    </h1>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-gray-400">
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {profileData.email}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profileData.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Membre depuis {profileData.joinDate}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={saveProfile}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Modifier
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-gray-300 focus:border-blue-500/50 focus:outline-none resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-300 leading-relaxed">{profileData.bio}</p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profileStats.map((stat, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-3 text-center">
                    <stat.icon className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interests */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Tag className="w-5 h-5 text-blue-400 mr-2" />
                Centres d'intérêt
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {profileData.interests.map((interest) => (
                  <div
                    key={interest}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full"
                  >
                    <span className="text-blue-300">{interest}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeInterest(profileData._id,interest)}
                        className="text-blue-400 hover:text-red-400 transition-colors duration-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ajouter un intérêt"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none"
                  />
                  <button
                    onClick={addCustomInterest}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Goals */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 text-pink-400 mr-2" />
                Objectifs de networking
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {profileData.goals.map((goal) => (
                  <div
                    key={goal}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-orange-500/20 backdrop-blur-sm border border-pink-500/30 rounded-full"
                  >
                    <span className="text-pink-300">{goal}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeGoal(goal)}
                        className="text-pink-400 hover:text-red-400 transition-colors duration-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ajouter un objectif"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomGoal()}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none"
                  />
                  <button
                    onClick={addCustomGoal}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 text-yellow-400 mr-2" />
                Accomplissements
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Super Networker</h3>
                      <p className="text-xs text-gray-400">50+ connexions réussies</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Matching Expert</h3>
                      <p className="text-xs text-gray-400">Score IA de 90%+</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Connections */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 text-green-400 mr-2" />
                Connexions récentes
              </h3>

              <div className="space-y-3">
                {recentConnections.map((connection, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <img
                      src={connection.avatar}
                      alt={connection.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{connection.name}</h4>
                      <p className="text-gray-400 text-xs">{connection.role}</p>
                      <p className="text-blue-400 text-xs">{connection.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Profile Completion */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Profil complété à 85%
              </h3>
              
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Photo de profil ajoutée
                </div>
                <div className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Bio renseignée
                </div>
                <div className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Intérêts définis
                </div>
                <div className="flex items-center text-gray-400">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  Liens sociaux à ajouter
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;