import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, FileText, Target, Tag, ArrowRight, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    interests: [] as string[],
    goals: [] as string[]
  });

  const [newInterest, setNewInterest] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const navigate = useNavigate();

  const suggestedInterests = ['IA', 'Blockchain', 'Fintech', 'SaaS', 'E-commerce', 'Marketing', 'Design', 'Dev'];
  const suggestedGoals = ['Trouver investisseur', 'Recruter talents', 'Partenariat', 'Mentorship', 'Clients', 'Co-fondateur'];

  const addInterest = (interest: string) => {
    if (!formData.interests.includes(interest)) {
      setFormData({ ...formData, interests: [...formData.interests, interest] });
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
  };

  const addGoal = (goal: string) => {
    if (!formData.goals.includes(goal)) {
      setFormData({ ...formData, goals: [...formData.goals, goal] });
    }
  };

  const removeGoal = (goal: string) => {
    setFormData({ ...formData, goals: formData.goals.filter(g => g !== goal) });
  };

  const addCustomInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      addInterest(newInterest.trim());
      setNewInterest('');
    }
  };

  const addCustomGoal = () => {
    if (newGoal.trim() && !formData.goals.includes(newGoal.trim())) {
      addGoal(newGoal.trim());
      setNewGoal('');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Vérifier que tous les champs obligatoires sont remplis
    if (!formData.name || !formData.email || !formData.password) {
      setNotification({
        show: true,
        type: "error",
        message: "Veuillez remplir tous les champs obligatoires.",
      });
      setIsLoading(false);
      
      // Auto-hide notification après 5 secondes
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setNotification({
          show: true,
          type: "error",
          message: result.error || "Erreur lors de l'inscription.",
        });
        setIsLoading(false);
        
        // Auto-hide notification après 5 secondes
        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }));
        }, 5000);
        return;
      }

      // ✅ Succès : Afficher le popup
      setNotification({
        show: true,
        type: "success",
        message: "Inscription réussie ! Vous allez être redirigé vers la page de connexion.",
      });

      setIsLoading(false);
      
      // ✅ Redirection après 2 secondes
      setTimeout(() => {
        navigate("/login"); 
      }, 2500);

    } catch (error) {
      console.error("Erreur signup :", error);
      setNotification({
        show: true,
        type: "error",
        message: "Une erreur est survenue. Veuillez réessayer.",
      });
      setIsLoading(false);
      
      // Auto-hide notification après 5 secondes
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    if (currentStep === 1) return formData.name && formData.email && formData.password;
    if (currentStep === 2) return formData.bio.length > 0;
    return true;
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4"
    >
      {/* Notification Toast */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <div className={`p-4 rounded-2xl backdrop-blur-xl border shadow-2xl ${
              notification.type === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}>
              <div className="flex items-center space-x-3">
                {notification.type === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                )}
                <p className="text-sm font-medium">{notification.message}</p>
                <button
                  onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                  className="ml-auto text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-20">
        <div className="bg-white/5 backdrop-blur-xl rounded-full p-1">
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full flex-1 transition-all duration-500 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-lg w-full">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Rejoignez Event Buddy
          </h1>
          <p className="text-gray-400">
            {currentStep === 1 && "Créons votre compte"}
            {currentStep === 2 && "Parlez-nous de vous"}
            {currentStep === 3 && "Définissez vos objectifs"}
          </p>
        </motion.div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nom complet
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Adresse email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Mot de passe sécurisé"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Bio */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Parlez-nous de vous
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        required
                        rows={4}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 resize-none"
                        placeholder="Décrivez votre expertise, votre parcours et ce qui vous passionne..."
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.bio.length}/300 caractères
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Vos centres d'intérêt
                    </label>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {suggestedInterests.map((interest) => (
                          <motion.button
                            key={interest}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addInterest(interest)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                              formData.interests.includes(interest)
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            {interest}
                          </motion.button>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <input
                          type="text"
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                          placeholder="Ajouter un intérêt personnalisé"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInterest())}
                        />
                        <button
                          type="button"
                          onClick={addCustomInterest}
                          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {formData.interests.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.interests.map((interest) => (
                            <div
                              key={interest}
                              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full"
                            >
                              <span className="text-blue-300 text-sm">{interest}</span>
                              <button
                                type="button"
                                onClick={() => removeInterest(interest)}
                                className="text-blue-400 hover:text-red-400 transition-colors duration-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Goals */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Vos objectifs de networking
                    </label>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {suggestedGoals.map((goal) => (
                          <motion.button
                            key={goal}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addGoal(goal)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                              formData.goals.includes(goal)
                                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            <Target className="w-4 h-4 inline-block mr-1" />
                            {goal}
                          </motion.button>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <input
                          type="text"
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                          placeholder="Ajouter un objectif personnalisé"
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomGoal())}
                        />
                        <button
                          type="button"
                          onClick={addCustomGoal}
                          className="px-4 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all duration-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {formData.goals.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.goals.map((goal) => (
                            <div
                              key={goal}
                              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-pink-500/20 to-orange-500/20 backdrop-blur-sm border border-pink-500/30 rounded-full"
                            >
                              <span className="text-pink-300 text-sm">{goal}</span>
                              <button
                                type="button"
                                onClick={() => removeGoal(goal)}
                                className="text-pink-400 hover:text-red-400 transition-colors duration-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Précédent
                </motion.button>
              )}

              <div className="flex-1"></div>

              {currentStep < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Suivant
                  <ArrowRight className="ml-2 w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      Créer mon compte
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>

          {currentStep === 1 && (
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SignUpPage;