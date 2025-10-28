import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Clock, Star, ArrowLeft, CreditCard, 
  CheckCircle, User, Mail, Phone, Building, Briefcase, Target,
  Sparkles, UserPlus, Award, Shield, Zap, Heart, Brain, Globe,
  FileText, AlertCircle, Info, Gift, Ticket, Crown, Diamond,
  Download, QrCode, Share2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  category: string;
  price: string;
  organizer: string;
  image: string;
  tags: string[];
  aiMatchScore: number;
  potentialMatches: number;
  featured: boolean;
  difficulty: string;
  networking: string;
  agenda?: Array<{ time: string; title: string; speaker?: string }>;
  speakers?: Array<{ name: string; role: string; avatar?: string }>;
  benefits?: string[];
  requirements?: string[];
  cancellationPolicy?: string;
  refundPolicy?: string;
}

interface BookingConfirmation {
  bookingId: string;
  bookingDate: string;
  ticketType: string;
  attendeeName: string;
  attendeeEmail: string;
}

const EventBooking = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const ticketRef = useRef<HTMLDivElement>(null);
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState('standard');
  const [bookingData, setBookingData] = useState({
    attendeeName: user?.name || '',
    attendeeEmail: user?.email || '',
    attendeePhone: '',
    company: '',
    jobTitle: '',
    specialRequests: '',
    dietaryRestrictions: '',
    networkingGoals: user?.goals?.join(', ') || '',
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const ticketTypes = [
    {
      id: 'standard',
      name: 'Standard',
      price: 'Gratuit',
      originalPrice: null,
      features: [
        'Accès à toutes les conférences',
        'Networking lunch inclus',
        'Accès au matching IA',
        'Certificat de participation'
      ],
      icon: Ticket,
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '€75',
      originalPrice: '€100',
      features: [
        'Tout du Standard',
        'Accès VIP aux speakers',
        'Networking dinner exclusif',
        'Matching IA prioritaire',
        'Goodies premium',
        'Photos professionnelles'
      ],
      icon: Crown,
      popular: true
    },
    {
      id: 'vip',
      name: 'VIP',
      price: '€150',
      originalPrice: '€200',
      features: [
        'Tout du Premium',
        'Rencontre privée avec speakers',
        'Accès salon VIP',
        'Concierge personnel',
        'Transport inclus',
        'Suivi post-événement'
      ],
      icon: Diamond,
      popular: false
    }
  ];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const mockEvent: Event = {
          id: eventId || '1',
          title: "AI Revolution Summit 2025",
          description: "Le plus grand événement IA de l'année avec les leaders mondiaux de l'intelligence artificielle. Découvrez les dernières innovations, rencontrez les experts et développez votre réseau professionnel.",
          date: "15 Mars 2025",
          time: "09:00 - 18:00",
          location: "Station F, Paris",
          attendees: 1200,
          maxAttendees: 1500,
          category: "ai",
          price: "Gratuit",
          organizer: "AI France",
          image: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800",
          tags: ["IA", "Machine Learning", "Deep Learning", "Innovation"],
          aiMatchScore: 95,
          potentialMatches: 47,
          featured: true,
          difficulty: "Intermédiaire",
          networking: "Élevé",
        };
      }
      catch (error) {
        console.error('Erreur lors du chargement de l\'événement:', error);
      }
    }});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const mockEvent: Event = {
          id: eventId || '1',
          title: "AI Revolution Summit 2025",
          description: "Le plus grand événement IA de l'année avec les leaders mondiaux de l'intelligence artificielle. Découvrez les dernières innovations, rencontrez les experts et développez votre réseau professionnel.",
          date: "15 Mars 2025",
          time: "09:00 - 18:00",
          location: "Station F, Paris",
          attendees: 1200,
          maxAttendees: 1500,
          category: "ai",
          price: "Gratuit",
          organizer: "AI France",
          image: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800",
          tags: ["IA", "Machine Learning", "Deep Learning", "Innovation"],
          aiMatchScore: 95,
          potentialMatches: 47,
          featured: true,
          difficulty: "Intermédiaire",
          networking: "Élevé",
          agenda: [
            { time: "09:00", title: "Accueil et petit-déjeuner networking" },
            { time: "10:00", title: "Keynote: L'avenir de l'IA", speaker: "Dr. Sarah Chen" },
            { time: "11:30", title: "Panel: IA et éthique", speaker: "Experts internationaux" },
            { time: "14:00", title: "Ateliers pratiques", speaker: "Équipes techniques" },
            { time: "16:00", title: "Networking & démonstrations" },
            { time: "17:30", title: "Clôture et cocktail" }
          ],
          speakers: [
            { name: "Dr. Sarah Chen", role: "AI Research Director @ Google", avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100" },
            { name: "Marc Dubois", role: "CEO @ OpenAI France", avatar: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=100" },
            { name: "Emma Rodriguez", role: "VP AI @ Microsoft", avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100" }
          ],
          benefits: [
            "Accès exclusif aux dernières innovations IA",
            "Networking avec 1500+ professionnels",
            "Certificat de participation reconnu",
            "Accès aux replays des conférences",
            "Kit de ressources IA premium"
          ],
          requirements: [
            "Niveau intermédiaire en IA recommandé",
            "Ordinateur portable pour les ateliers",
            "Carte d'identité pour l'accès"
          ],
          cancellationPolicy: "Annulation gratuite jusqu'à 48h avant l'événement",
          refundPolicy: "Remboursement intégral en cas d'annulation de l'événement"
        };
        
        setEvent(mockEvent);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'événement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const generateBookingId = () => {
    return `EB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const handleBooking = async (eventId: string | number) => {
    if (!bookingData.agreeToTerms) {
      alert('Veuillez accepter les conditions générales');
      return;
    }

    // Vérifier si le billet nécessite un paiement
    const selectedTicket = ticketTypes.find(t => t.id === selectedTicketType);
    const isPaidTicket = selectedTicket?.price !== 'Gratuit';

    if (isPaidTicket) {
      // Extraire le prix numérique
      const priceMatch = selectedTicket?.price.match(/\d+/);
      const price = priceMatch ? parseInt(priceMatch[0]) : 0;

      // Rediriger vers la page de paiement
      navigate('/payment', {
        state: {
          eventId: eventId,
          eventTitle: event?.title,
          ticketType: selectedTicket?.name,
          price: price,
          attendeeName: bookingData.attendeeName,
          attendeeEmail: bookingData.attendeeEmail,
          bookingData: bookingData
        }
      });
      return;
    }

    // Si gratuit, procéder directement à la réservation
    setIsBooking(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
      const token = localStorage.getItem('token') || sessionStorage.getItem('token') || null;
      
      if (!storedUser || !storedUser._id) {
        throw new Error('Utilisateur non authentifié');
      }
      
      const userId = storedUser._id;

      const res = await fetch(`http://localhost:5000/api/users/${userId}/bookEvent/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Erreur backend:', data);
        alert(data.error || 'Erreur lors de la réservation');
        return;
      }

      // Créer les données de confirmation
      const confirmation: BookingConfirmation = {
        bookingId: generateBookingId(),
        bookingDate: new Date().toLocaleString('fr-FR'),
        ticketType: ticketTypes.find(t => t.id === selectedTicketType)?.name || 'Standard',
        attendeeName: bookingData.attendeeName,
        attendeeEmail: bookingData.attendeeEmail
      };

      setBookingConfirmation(confirmation);
      setShowConfirmation(true);

      const updatedUser = { ...storedUser };
      if (!updatedUser.events) updatedUser.events = [];
      if (!updatedUser.events.includes(eventId)) {
        updatedUser.events.push(eventId);
        if (localStorage.getItem('user')) localStorage.setItem('user', JSON.stringify(updatedUser));
        else sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }

    } catch (error: any) {
      console.error('Erreur lors de la réservation:', error);
      alert(error.message || 'Erreur lors de la réservation');
    } finally {
      setIsBooking(false);
    }
  };

  const downloadTicket = async () => {
    if (!event || !bookingConfirmation) return;

    // Créer un canvas pour générer l'image du billet
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions du billet (format A4 paysage réduit)
    canvas.width = 1200;
    canvas.height = 600;

    // Fond dégradé
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(0.5, '#7c3aed');
    gradient.addColorStop(1, '#ec4899');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Overlay pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(i * 60, 0, 30, canvas.height);
    }

    // Bordure
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Logo/Badge EventBuddy
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(100, 80, 40, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('EB', 84, 90);

    // Titre EventBuddy
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('EventBuddy', 160, 85);

    // Type de billet (badge)
    const ticketType = ticketTypes.find(t => t.id === selectedTicketType);
    ctx.fillStyle = selectedTicketType === 'vip' ? '#fbbf24' : 
                    selectedTicketType === 'premium' ? '#a78bfa' : '#60a5fa';
    ctx.fillRect(canvas.width - 250, 40, 200, 60);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(ticketType?.name.toUpperCase() || 'STANDARD', canvas.width - 150, 80);
    ctx.textAlign = 'left';

    // Ligne de séparation
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 140);
    ctx.lineTo(canvas.width - 50, 140);
    ctx.stroke();

    // Titre de l'événement
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(event.title, 50, 200);

    // Détails de l'événement
    ctx.font = '20px Arial';
    ctx.fillStyle = '#e5e7eb';

    // Date
    ctx.fillText('📅 ' + event.date, 50, 260);
    
    // Heure
    ctx.fillText('🕐 ' + event.time, 50, 300);
    
    // Lieu
    ctx.fillText('📍 ' + event.location, 50, 340);

    // Ligne de séparation
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 380);
    ctx.lineTo(canvas.width - 50, 380);
    ctx.stroke();

    // Informations du participant
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('PARTICIPANT', 50, 420);

    ctx.font = '18px Arial';
    ctx.fillStyle = '#e5e7eb';
    ctx.fillText(bookingConfirmation.attendeeName, 50, 450);
    ctx.fillText(bookingConfirmation.attendeeEmail, 50, 480);

    // ID de réservation
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('ID RÉSERVATION', canvas.width - 450, 420);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(bookingConfirmation.bookingId, canvas.width - 450, 450);

    // Date de réservation
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '14px Arial';
    ctx.fillText('Réservé le: ' + bookingConfirmation.bookingDate, canvas.width - 450, 480);

    // QR Code placeholder (carré)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(canvas.width - 180, 400, 120, 120);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR CODE', canvas.width - 120, 460);
    ctx.font = '10px Arial';
    ctx.fillText('Scan à l\'entrée', canvas.width - 120, 480);
    ctx.textAlign = 'left';

    // Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Ce billet est personnel et non transférable • Présentez-le à l\'entrée de l\'événement', canvas.width / 2, 560);
    ctx.textAlign = 'left';

    // Convertir le canvas en blob et télécharger
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `billet-${event.title.replace(/\s+/g, '-')}-${bookingConfirmation.bookingId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const shareTicket = () => {
    if (!event || !bookingConfirmation) return;
    
    const shareText = `🎉 Je serai à ${event.title} le ${event.date} !\n📍 ${event.location}\n\nRéservez votre place sur EventBuddy`;
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      // Fallback: copier dans le presse-papier
      navigator.clipboard.writeText(shareText);
      alert('Lien copié dans le presse-papier !');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="text-white font-medium">Chargement de l'événement...</div>
        </motion.div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Événement introuvable</h2>
          <p className="text-gray-400 mb-6">L'événement que vous recherchez n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux événements</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details - Same as before */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Hero Section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-4 py-2 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-bold text-lg">{event.aiMatchScore}% match</span>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-200">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees}/{event.maxAttendees}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-300 leading-relaxed mb-6">{event.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <UserPlus className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-white font-bold">{event.potentialMatches}</div>
                    <div className="text-gray-400 text-xs">Matches potentiels</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-white font-bold">{event.difficulty}</div>
                    <div className="text-gray-400 text-xs">Niveau</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-white font-bold">{event.networking}</div>
                    <div className="text-gray-400 text-xs">Networking</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Building className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-white font-bold">{event.organizer}</div>
                    <div className="text-gray-400 text-xs">Organisateur</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agenda */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Clock className="w-6 h-6 text-blue-400 mr-2" />
                Programme de la journée
              </h2>
              <div className="space-y-4">
                {event.agenda?.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-16 text-center">
                      <div className="text-blue-400 font-bold">{item.time}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      {item.speaker && (
                        <p className="text-gray-400 text-sm">Par {item.speaker}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Speakers */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Award className="w-6 h-6 text-purple-400 mr-2" />
                Intervenants de prestige
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {event.speakers?.map((speaker, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300"
                  >
                    <img
                      src={speaker.avatar}
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-white/20"
                    />
                    <h3 className="text-white font-medium text-sm">{speaker.name}</h3>
                    <p className="text-gray-400 text-xs">{speaker.role}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Booking Form - Same as before, keeping all your existing form fields */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Ticket Selection */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Ticket className="w-6 h-6 text-green-400 mr-2" />
                Choisissez votre billet
              </h2>
              
              <div className="space-y-3">
                {ticketTypes.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedTicketType === ticket.id
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    } ${ticket.popular ? 'ring-2 ring-purple-500/50' : ''}`}
                    onClick={() => setSelectedTicketType(ticket.id)}
                  >
                    {ticket.popular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Le plus populaire
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <ticket.icon className={`w-6 h-6 ${
                          ticket.id === 'standard' ? 'text-blue-400' :
                          ticket.id === 'premium' ? 'text-purple-400' : 'text-yellow-400'
                        }`} />
                        <div>
                          <h3 className="text-white font-bold">{ticket.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-400 font-bold text-lg">{ticket.price}</span>
                            {ticket.originalPrice && (
                              <span className="text-gray-500 line-through text-sm">{ticket.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedTicketType === ticket.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400'
                      }`}>
                        {selectedTicketType === ticket.id && (
                          <CheckCircle className="w-3 h-3 text-white m-0.5" />
                        )}
                      </div>
                    </div>
                    
                    <ul className="space-y-1">
                      {ticket.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-300">
                          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <User className="w-6 h-6 text-blue-400 mr-2" />
                Informations participant
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={bookingData.attendeeName}
                      onChange={(e) => setBookingData({ ...bookingData, attendeeName: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={bookingData.attendeeEmail}
                      onChange={(e) => setBookingData({ ...bookingData, attendeeEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={bookingData.attendeePhone}
                      onChange={(e) => setBookingData({ ...bookingData, attendeePhone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Entreprise</label>
                    <input
                      type="text"
                      value={bookingData.company}
                      onChange={(e) => setBookingData({ ...bookingData, company: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                      placeholder="Votre entreprise"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Poste actuel</label>
                  <input
                    type="text"
                    value={bookingData.jobTitle}
                    onChange={(e) => setBookingData({ ...bookingData, jobTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                    placeholder="Ex: CEO, Développeur, Marketing Manager..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Objectifs de networking</label>
                  <textarea
                    value={bookingData.networkingGoals}
                    onChange={(e) => setBookingData({ ...bookingData, networkingGoals: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300 resize-none"
                    rows={3}
                    placeholder="Que souhaitez-vous accomplir lors de cet événement ?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Demandes spéciales</label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300 resize-none"
                    rows={2}
                    placeholder="Restrictions alimentaires, accessibilité, etc."
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 text-green-400 mr-2" />
                Conditions et politiques
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-2">Politique d'annulation</h3>
                  <p className="text-gray-400 text-sm">{event.cancellationPolicy}</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-2">Politique de remboursement</h3>
                  <p className="text-gray-400 text-sm">{event.refundPolicy}</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bookingData.agreeToTerms}
                      onChange={(e) => setBookingData({ ...bookingData, agreeToTerms: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-600 text-blue-500 bg-transparent focus:ring-blue-500/20 mt-0.5"
                    />
                    <span className="text-gray-300 text-sm">
                      J'accepte les <a href="#" className="text-blue-400 hover:text-blue-300">conditions générales</a> et la 
                      <a href="#" className="text-blue-400 hover:text-blue-300 ml-1">politique de confidentialité</a>
                    </span>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bookingData.agreeToMarketing}
                      onChange={(e) => setBookingData({ ...bookingData, agreeToMarketing: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-600 text-blue-500 bg-transparent focus:ring-blue-500/20 mt-0.5"
                    />
                    <span className="text-gray-300 text-sm">
                      J'accepte de recevoir des communications marketing sur les futurs événements
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booking Summary */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <CreditCard className="w-6 h-6 text-blue-400 mr-2" />
                Récapitulatif
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-2">{event.title}</h3>
                  <div className="space-y-1 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-2" />
                      {event.date} • {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-2" />
                      {event.location}
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Type de billet:</span>
                    <span className="text-white font-medium">
                      {ticketTypes.find(t => t.id === selectedTicketType)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Prix:</span>
                    <span className="text-green-400 font-bold text-lg">
                      {ticketTypes.find(t => t.id === selectedTicketType)?.price}
                    </span>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <Brain className="w-4 h-4 text-green-400 mr-2" />
                    Insights IA
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Compatibilité:</span>
                      <span className="text-green-400 font-bold">{event.aiMatchScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Matches potentiels:</span>
                      <span className="text-blue-400 font-bold">{event.potentialMatches}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Niveau networking:</span>
                      <span className="text-purple-400 font-bold">{event.networking}</span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <Gift className="w-4 h-4 text-yellow-400 mr-2" />
                    Avantages inclus
                  </h3>
                  <ul className="space-y-1">
                    {event.benefits?.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-300">
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Booking Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (eventId) handleBooking(eventId);
                  }}
                  disabled={isBooking || !bookingData.agreeToTerms}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isBooking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Réservation en cours...</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      <span>Confirmer ma réservation</span>
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-gray-500 text-center">
                  Votre réservation sera confirmée instantanément
                </p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Réservation sécurisée</h3>
              <p className="text-gray-400 text-xs">
                Vos données sont protégées par un chiffrement SSL 256-bit
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal with Download Ticket */}
      <AnimatePresence>
        {showConfirmation && bookingConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 max-w-lg w-full"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4 text-center">
                Réservation confirmée !
              </h2>
              
              <p className="text-gray-300 mb-6 text-center">
                Votre place pour <span className="text-white font-semibold">{event.title}</span> est confirmée. 
                Vous recevrez un email de confirmation sous peu.
              </p>

              <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">ID Réservation:</span>
                  <span className="text-blue-400 font-mono font-bold text-xs">
                    {bookingConfirmation.bookingId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Billet:</span>
                  <span className="text-white font-medium">
                    {bookingConfirmation.ticketType}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white font-medium">{event.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Participant:</span>
                  <span className="text-white font-medium">{bookingConfirmation.attendeeName}</span>
                </div>
              </div>

              {/* Download & Share Buttons */}
              <div className="space-y-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadTicket}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Télécharger mon billet</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareTicket}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Partager l'événement</span>
                </motion.button>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-white mb-1">Important</p>
                    <p>Présentez votre billet (numérique ou imprimé) à l'entrée de l'événement. Un QR code sera généré pour faciliter votre accès.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/my-events')}
                className="w-full px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Voir mes événements
              </button>

              <div className="text-sm text-gray-400 text-center mt-4">
                Redirection automatique dans quelques secondes...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventBooking;