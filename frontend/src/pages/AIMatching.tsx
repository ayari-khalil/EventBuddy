import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Heart, X, Star, MapPin, Briefcase, Target, MessageCircle, Sparkles, Zap, Users, ArrowLeft, ArrowRight, Filter, Brain } from 'lucide-react';

const AIMatching = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [matches, setMatches] = useState<number[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [lastMatchedUser, setLastMatchedUser] = useState<any>(null);

  const users = [
    {
      id: 1,
      name: "Marie Dubois",
      role: "CEO & Co-fondatrice",
      company: "TechFlow AI",
      location: "Paris, France",
      bio: "Passionnée d'IA et d'innovation, je cherche à révolutionner l'industrie avec des solutions intelligentes. 10 ans d'expérience en tech.",
      interests: ["IA", "Machine Learning", "Fintech", "Leadership"],
      goals: ["Trouver investisseur", "Partenariat stratégique", "Recruter CTO"],
      avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400",
      matchScore: 95,
      mutualConnections: 12,
      event: "AI Revolution Summit 2025",
      commonInterests: ["IA", "Fintech"],
      personalityMatch: "Visionnaire",
      experience: "10+ ans",
      funding: "Série A",
      teamSize: "15-50"
    },
    {
      id: 2,
      name: "Thomas Martin",
      role: "CTO",
      company: "InnoLab Solutions",
      location: "Lyon, France",
      bio: "Expert en architecture cloud et IA. Je développe des solutions scalables pour les entreprises. Ancien Google et Microsoft.",
      interests: ["Cloud", "DevOps", "IA", "Blockchain"],
      goals: ["Partenariat technique", "Mentorship", "Investir dans startups"],
      avatar: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=400",
      matchScore: 88,
      mutualConnections: 8,
      event: "AI Revolution Summit 2025",
      commonInterests: ["IA", "Cloud"],
      personalityMatch: "Innovateur",
      experience: "8+ ans",
      funding: "Bootstrapped",
      teamSize: "5-15"
    },
    {
      id: 3,
      name: "Sophie Laurent",
      role: "VP Marketing",
      company: "GrowthCo",
      location: "Paris, France",
      bio: "Spécialiste en growth marketing et acquisition. J'aide les startups à scaler rapidement avec des stratégies data-driven.",
      interests: ["Growth Marketing", "SaaS", "Analytics", "UX"],
      goals: ["Recruter talents", "Partenariat marketing", "Lever des fonds"],
      avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400",
      matchScore: 82,
      mutualConnections: 15,
      event: "Startup Grind Paris",
      commonInterests: ["SaaS", "Analytics"],
      personalityMatch: "Stratège",
      experience: "6+ ans",
      funding: "Seed",
      teamSize: "20-50"
    },
    {
      id: 4,
      name: "Alexandre Chen",
      role: "Founder",
      company: "BlockChain Ventures",
      location: "Monaco",
      bio: "Entrepreneur serial dans la blockchain. J'investis et conseille les startups Web3. Passionné par la DeFi et les NFTs.",
      interests: ["Blockchain", "DeFi", "NFT", "Crypto"],
      goals: ["Investir", "Mentorship", "Partenariat"],
      avatar: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=400",
      matchScore: 76,
      mutualConnections: 5,
      event: "Blockchain & Web3 Conference",
      commonInterests: ["Blockchain", "Crypto"],
      personalityMatch: "Pionnier",
      experience: "12+ ans",
      funding: "Série B",
      teamSize: "50+"
    },
    {
      id: 5,
      name: "Emma Rodriguez",
      role: "Head of Design",
      company: "DesignFirst Studio",
      location: "Barcelona, Spain",
      bio: "Designer UX/UI passionnée par l'innovation. Je crée des expériences utilisateur exceptionnelles pour les produits tech.",
      interests: ["UX/UI", "Design System", "Innovation", "Tech"],
      goals: ["Collaborations créatives", "Recruter designers", "Lancer produit"],
      avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400",
      matchScore: 91,
      mutualConnections: 7,
      event: "Future of Work Summit",
      commonInterests: ["Innovation", "Tech"],
      personalityMatch: "Créative",
      experience: "5+ ans",
      funding: "Pre-seed",
      teamSize: "5-15"
    }
  ];

  const currentUser = users[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    if (direction === 'right') {
      setMatches([...matches, currentUser.id]);
      setLastMatchedUser(currentUser);
      setShowMatchModal(true);
    }
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % users.length);
      setSwipeDirection(null);
    }, 300);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    }
  };

  const getSwipeVariants = () => ({
    center: { x: 0, rotate: 0, opacity: 1 },
    left: { x: -300, rotate: -30, opacity: 0 },
    right: { x: 300, rotate: 30, opacity: 0 }
  });

  if (!currentUser) {
    return (
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-12 h-12 text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Plus de profils pour le moment</h2>
          <p className="text-gray-400">Revenez plus tard pour découvrir de nouveaux talents !</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            AI Matching 💫
          </h1>
          <p className="text-gray-400">
            Découvrez vos matches parfaits grâce à notre IA
          </p>
          
          {/* Progress */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 text-sm">
              {matches.length} matches • {users.length - currentIndex - 1} profils restants
            </span>
          </div>
        </motion.div>

        {/* Card Stack */}
        <div className="relative h-[600px] mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentUser.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              variants={getSwipeVariants()}
              initial="center"
              animate={swipeDirection || "center"}
              exit={swipeDirection || "center"}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              whileDrag={{ scale: 1.05 }}
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden h-full shadow-2xl">
                {/* Profile Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Match Score */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-3 py-2 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 font-bold">{currentUser.matchScore}%</span>
                    </div>
                  </div>

                  {/* Event Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-blue-300 text-sm">{currentUser.event}</span>
                    </div>
                  </div>

                  {/* Basic Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl font-bold text-white mb-1">{currentUser.name}</h2>
                    <p className="text-blue-300 font-medium">{currentUser.role}</p>
                    <p className="text-gray-300 text-sm">{currentUser.company}</p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-6 space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 256px)' }}>
                  {/* Location & Experience */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      {currentUser.location}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {currentUser.experience}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-300 text-sm leading-relaxed">{currentUser.bio}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <div className="text-white font-bold text-sm">{currentUser.mutualConnections}</div>
                      <div className="text-gray-400 text-xs">Connexions</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Target className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                      <div className="text-white font-bold text-sm">{currentUser.teamSize}</div>
                      <div className="text-gray-400 text-xs">Équipe</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Zap className="w-4 h-4 text-green-400 mx-auto mb-1" />
                      <div className="text-white font-bold text-sm">{currentUser.funding}</div>
                      <div className="text-gray-400 text-xs">Financement</div>
                    </div>
                  </div>

                  {/* Common Interests */}
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center">
                      <Heart className="w-4 h-4 text-pink-400 mr-2" />
                      Intérêts communs
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.commonInterests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 text-sm rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Goals */}
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center">
                      <Target className="w-4 h-4 text-blue-400 mr-2" />
                      Objectifs
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.goals.slice(0, 2).map((goal) => (
                        <span
                          key={goal}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 text-sm rounded-full"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Personality Match */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Personnalité</h4>
                        <p className="text-purple-300 text-sm">{currentUser.personalityMatch}</p>
                      </div>
                      <div className="text-2xl">🎯</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center space-x-6"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-500/30 rounded-full flex items-center justify-center hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300"
          >
            <X className="w-8 h-8 text-red-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-500/30 rounded-full flex items-center justify-center hover:from-green-500/30 hover:to-blue-500/30 transition-all duration-300"
          >
            <Heart className="w-8 h-8 text-green-400" />
          </motion.button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400 text-sm">
            Glissez à droite pour matcher • Glissez à gauche pour passer
          </p>
        </motion.div>
      </div>

      {/* Match Modal */}
      <AnimatePresence>
        {showMatchModal && lastMatchedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMatchModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                C'est un match !
              </h2>
              <p className="text-gray-300 mb-6">
                Vous et <span className="text-white font-semibold">{lastMatchedUser.name}</span> vous êtes likés mutuellement !
              </p>
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMatchModal(false)}
                  className="flex-1 px-4 py-3 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  Continuer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer un message</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIMatching;