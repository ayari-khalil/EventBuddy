import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  ArrowLeft,
  Upload,
  Euro,
  Tag,
  User,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import axios from 'axios';


interface EventFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  maxAttendees: string;
  category: string;
  price: string;
  organizer: string;
  image: string;
  tags: string[];
  difficulty: string;
  networking: string;
}

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    category: 'tech',
    price: '',
    organizer: '',
    image: '',
    tags: [],
    difficulty: 'Débutant',
    networking: 'Modéré'
  });

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
      matches: [] as string[],
  
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
          matches: parsedUser.matches || [],
          });
        } catch (error) {
          console.error("Erreur lors du parsing des données utilisateur :", error);
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
        }
      }
    }, []);

  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'tech', name: 'Tech', icon: Sparkles },
    { id: 'business', name: 'Business', icon: Target },
    { id: 'startup', name: 'Startup', icon: TrendingUp },
    { id: 'ai', name: 'IA', icon: Sparkles }
  ];

  const difficulties = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
  const networkingLevels = ['Faible', 'Modéré', 'Élevé', 'Très élevé'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/events', {
        ...formData,
        createdBy: profileData._id || "Utilisateur inconnu",
        aiMatchScore: Math.floor(Math.random() * 30) + 70,
        potentialMatches: Math.floor(Math.random() * 20) + 5,
        featured: false
      });

      console.log('Event created:', response.data);
      navigate('/events', { state: { message: 'Événement créé avec succès!' } });
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Créer un nouvel événement ✨
          </h1>
          <p className="text-gray-400 text-lg">
            Organisez votre événement et connectez-vous avec votre communauté
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titre de l'événement *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Conférence IA & Innovation 2025"
                  className="w-full px-4 py-3 glass-input"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre événement, les sujets abordés, les intervenants..."
                  className="w-full px-4 py-3 glass-input resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 glass-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Heure *
                </label>
                <input
                  type="text"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleInputChange}
                  placeholder="Ex: 14:00 - 18:00"
                  className="w-full px-4 py-3 glass-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Lieu *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ex: Station F, Paris"
                  className="w-full px-4 py-3 glass-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Nombre max de participants *
                </label>
                <input
                  type="number"
                  name="maxAttendees"
                  required
                  min="1"
                  value={formData.maxAttendees}
                  onChange={handleInputChange}
                  placeholder="Ex: 100"
                  className="w-full px-4 py-3 glass-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Euro className="w-4 h-4 inline mr-2" />
                  Prix
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Ex: Gratuit ou 50€"
                  className="w-full px-4 py-3 glass-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Organisateur *
                </label>
                <input
                  type="text"
                  name="organizer"
                  required
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="Nom de l'organisation"
                  className="w-full px-4 py-3 glass-input"
                />
              </div>
            </div>

            {/* Category and Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Catégorie *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 glass-input"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-gray-800">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulté
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 glass-input"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff} className="bg-gray-800">
                      {diff}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Niveau de networking
                </label>
                <select
                  name="networking"
                  value={formData.networking}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 glass-input"
                >
                  {networkingLevels.map(level => (
                    <option key={level} value={level} className="bg-gray-800">
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Upload className="w-4 h-4 inline mr-2" />
                URL de l'image
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 glass-input"
              />
              {formData.image && (
                <div className="mt-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Ajouter un tag"
                  className="flex-1 px-4 py-3 glass-input"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  className="px-6 gradient-button text-white"
                >
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-300 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 gradient-button text-white font-medium flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Création en cours...</span>
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4" />
                    <span>Créer l'événement</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateEvent;