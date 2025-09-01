import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Send,
  MessageCircle,
  Users,
  Calendar,
  MapPin,
  Star,
  Heart,
  Reply,
  MoreVertical,
  Sparkles,
  Pin,
  Search
} from 'lucide-react';
import { Button } from '../../components/ui/button';

interface Message {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Message[];
  isOrganizer?: boolean;
  isPinned?: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  organizer: string;
  image?: string;
}

const EventDiscussion = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - Replace with API calls
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setEvent({
          id: eventId!,
          title: "Future of Work Summit",
          description: "Comment l'IA et l'automatisation transforment le monde du travail",
          date: "12 Avril 2025",
          time: "09:30 - 16:30",
          location: "La Défense Arena, Paris",
          attendees: 156,
          maxAttendees: 800,
          organizer: "Future Work Institute"
        });

        setMessages([
          {
            id: '1',
            author: 'Sarah Martin',
            avatar: 'SM',
            content: "Très hâte de participer ! Quelqu'un sait si les sessions seront enregistrées ?",
            timestamp: '2024-12-01 10:30',
            likes: 12,
            isOrganizer: false,
            isPinned: true
          },
          {
            id: '2',
            author: 'Future Work Institute',
            avatar: 'FW',
            content: "Bonjour à tous ! Oui les sessions principales seront enregistrées et disponibles 48h après l'événement pour tous les participants. N'hésitez pas si vous avez d'autres questions !",
            timestamp: '2024-12-01 11:45',
            likes: 8,
            isOrganizer: true,
            replies: [
              {
                id: '2-1',
                author: 'Alex Dupont',
                avatar: 'AD',
                content: "Parfait, merci pour l'info !",
                timestamp: '2024-12-01 12:00',
                likes: 3
              }
            ]
          },
          {
            id: '3',
            author: 'Marie Leroy',
            avatar: 'ML',
            content: "Y aura-t-il des sessions dédiées aux startups ? Je travaille dans une startup EdTech et j'aimerais savoir comment l'IA peut nous aider.",
            timestamp: '2024-12-01 14:20',
            likes: 15
          },
          {
            id: '4',
            author: 'Thomas Chen',
            avatar: 'TC',
            content: "Pour ceux qui viennent de loin, quelqu'un connaît de bons hôtels à proximité ? 🏨",
            timestamp: '2024-12-01 16:15',
            likes: 6
          }
        ]);
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      author: 'Vous',
      avatar: 'YO',
      content: newMessage,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    if (replyingTo) {
      // Add as reply
      setMessages(prev => prev.map(msg => {
        if (msg.id === replyingTo) {
          return {
            ...msg,
            replies: [...(msg.replies || []), message]
          };
        }
        return msg;
      }));
      setReplyingTo(null);
    } else {
      // Add as new message
      setMessages(prev => [...prev, message]);
    }

    setNewMessage('');
  };

  const handleLike = (messageId: string, isReply?: boolean, parentId?: string) => {
    if (isReply && parentId) {
      setMessages(prev => prev.map(msg => {
        if (msg.id === parentId) {
          return {
            ...msg,
            replies: msg.replies?.map(reply => 
              reply.id === messageId 
                ? { ...reply, likes: reply.likes + 1 }
                : reply
            )
          };
        }
        return msg;
      }));
    } else {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, likes: msg.likes + 1 }
          : msg
      ));
    }
  };

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de la discussion...</p>
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
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux événements
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Info Sidebar */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-400" />
                Discussion
              </h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{event?.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{event?.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event?.date} • {event?.time}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event?.location}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    {event?.attendees}/{event?.maxAttendees} participants
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans la discussion..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 glass-input text-sm"
                />
              </div>

              {/* Stats */}
              <div className="border-t border-white/10 pt-4">
                <div className="text-sm text-gray-400 mb-2">Activité</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{messages.length}</div>
                    <div className="text-xs text-gray-400">Messages</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      {new Set(messages.map(m => m.author)).size}
                    </div>
                    <div className="text-xs text-gray-400">Participants</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-card flex flex-col h-[600px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="group"
                  >
                    <div className="flex space-x-3">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        message.isOrganizer 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600'
                      }`}>
                        {message.avatar}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-white">{message.author}</span>
                          {message.isOrganizer && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                              Organisateur
                            </span>
                          )}
                          {message.isPinned && (
                            <Pin className="w-3 h-3 text-yellow-400" />
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(message.timestamp).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        <div className="bg-white/5 rounded-2xl px-4 py-3 mb-2">
                          <p className="text-gray-300">{message.content}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <button
                            onClick={() => handleLike(message.id)}
                            className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            <span>{message.likes}</span>
                          </button>
                          <button
                            onClick={() => setReplyingTo(message.id)}
                            className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            <Reply className="w-4 h-4" />
                            <span>Répondre</span>
                          </button>
                        </div>

                        {/* Replies */}
                        {message.replies && message.replies.length > 0 && (
                          <div className="ml-8 mt-4 space-y-3">
                            {message.replies.map((reply) => (
                              <div key={reply.id} className="flex space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                                  {reply.avatar}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-white text-sm">{reply.author}</span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(reply.timestamp).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  <div className="bg-white/3 rounded-xl px-3 py-2 mb-2">
                                    <p className="text-gray-300 text-sm">{reply.content}</p>
                                  </div>
                                  <button
                                    onClick={() => handleLike(reply.id, true, message.id)}
                                    className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors text-xs"
                                  >
                                    <Heart className="w-3 h-3" />
                                    <span>{reply.likes}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-white/10 p-4">
                {replyingTo && (
                  <div className="mb-3 p-3 bg-blue-500/10 rounded-xl border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-300">
                        Réponse à {messages.find(m => m.id === replyingTo)?.author}
                      </span>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    YO
                  </div>
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Écrivez votre message..."
                      className="flex-1 px-4 py-2 glass-input"
                    />
                    <Button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 gradient-button text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDiscussion;