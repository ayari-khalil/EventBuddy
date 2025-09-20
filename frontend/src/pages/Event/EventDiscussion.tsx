/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft,
  Send,
  MessageCircle,
  Users,
  Calendar,
  MapPin,
  Heart,
  Reply,
  Pin,
  Search,
  Smile,
  Edit3,
  Trash2,
  Volume2,
  VolumeX,
  UserCheck,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import io from 'socket.io-client';

// Define types
interface User {
  id: string;
  name: string;
  avatar: string;
  initials: string;
}

interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

interface Message {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  reactions: Reaction[];
  isOrganizer: boolean;
  isPinned: boolean;
  replies: Message[];
  isEdited?: boolean;
  editedAt?: string;
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
  image: string;
}

// Real socket connection (you'll need to replace this with your actual socket.io setup)
const useSocket = () => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected] = useState(false);
  const [activeUsers] = useState<Set<string>>(new Set());
  const [typingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
   
    const socket = io( "http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
});

    
   
    
    setSocket(socket);
    
    // Join the event room
    setTimeout(() => {
      socket.emit('join_event', { eventId: '1', userId: 'current-user' });
    }, 500);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return { socket, isConnected, activeUsers, typingUsers };
};

// Simple motion component replacement
const Motion: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  initial?: any; 
  animate?: any; 
  exit?: any; 
  transition?: any; 
  [key: string]: any; 
}> = ({ children, className = '', ...props }) => (
  <div className={`transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

const EventDiscussion: React.FC = () => {
  const { socket, isConnected, activeUsers, typingUsers } = useSocket();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Common emojis for reactions
  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '👏', '🔥', '✨', '🎉'];

  // Mock data initialization
  useEffect(() => {
    const fetchEventData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEvent({
        id: '1',
        title: "Future of Work Summit",
        description: "Comment l'IA et l'automatisation transforment le monde du travail",
        date: "12 Avril 2025",
        time: "09:30 - 16:30",
        location: "La Défense Arena, Paris",
        attendees: 156,
        maxAttendees: 800,
        organizer: "Future Work Institute",
        image: "/api/placeholder/600/300"
      });

      const initialMessages: Message[] = [
        {
          id: '1',
          author: {
            id: 'u1',
            name: 'Sarah Martin',
            avatar: '/api/placeholder/40/40',
            initials: 'SM'
          },
          content: "Très hâte de participer ! Quelqu'un sait si les sessions seront enregistrées ?",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          reactions: [
            { emoji: '👍', users: ['u2', 'u3'], count: 2 },
            { emoji: '❤️', users: ['u4'], count: 1 }
          ],
          isOrganizer: false,
          isPinned: true,
          replies: []
        },
        {
          id: '2',
          author: {
            id: 'organizer',
            name: 'Future Work Institute',
            avatar: '/api/placeholder/40/40',
            initials: 'FW'
          },
          content: "Bonjour à tous ! Oui les sessions principales seront enregistrées et disponibles 48h après l'événement pour tous les participants. N'hésitez pas si vous avez d'autres questions !",
          timestamp: new Date(Date.now() - 82800000).toISOString(),
          reactions: [
            { emoji: '👍', users: ['u1', 'u3', 'u5'], count: 3 }
          ],
          isOrganizer: true,
          isPinned: false,
          replies: [
            {
              id: '2-1',
              author: {
                id: 'u2',
                name: 'Alex Dupont',
                avatar: '/api/placeholder/40/40',
                initials: 'AD'
              },
              content: "Parfait, merci pour l'info !",
              timestamp: new Date(Date.now() - 82000000).toISOString(),
              reactions: [
                { emoji: '👍', users: ['u1'], count: 1 }
              ],
              isOrganizer: false,
              isPinned: false,
              replies: []
            }
          ]
        },
        {
          id: '3',
          author: {
            id: 'u3',
            name: 'Marie Leroy',
            avatar: '/api/placeholder/40/40',
            initials: 'ML'
          },
          content: "Y aura-t-il des sessions dédiées aux startups ? Je travaille dans une startup EdTech et j'aimerais savoir comment l'IA peut nous aider.",
          timestamp: new Date(Date.now() - 50400000).toISOString(),
          reactions: [
            { emoji: '🚀', users: ['u1', 'u2', 'u4'], count: 3 },
            { emoji: '💡', users: ['u5'], count: 1 }
          ],
          isOrganizer: false,
          isPinned: false,
          replies: []
        }
      ];
      
      setMessages(initialMessages);
      setLoading(false);
    };

    fetchEventData();
  }, []);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages from other users
    socket.on('new_message', (messageData: Message) => {
      setMessages(prev => [...prev, messageData]);
      if (soundEnabled) {
        // Play notification sound
        // new Audio('/notification.mp3').play().catch(() => {});
      }
    });

    // Listen for message updates
    socket.on('message_updated', (updatedMessage: Message) => {
      setMessages(prev => prev.map(msg => 
        msg.id === updatedMessage.id ? updatedMessage : msg
      ));
    });

    // Listen for new reactions
    socket.on('reaction_added', ({ messageId, reaction }: { messageId: string; reaction: Reaction }) => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const existingReactionIndex = msg.reactions.findIndex(r => r.emoji === reaction.emoji);
          if (existingReactionIndex >= 0) {
            const updatedReactions = [...msg.reactions];
            updatedReactions[existingReactionIndex] = reaction;
            return { ...msg, reactions: updatedReactions };
          } else {
            return { ...msg, reactions: [...msg.reactions, reaction] };
          }
        }
        return msg;
      }));
    });

    // Cleanup listeners
    return () => {
      socket.off('new_message');
      socket.off('message_updated');
      socket.off('reaction_added');
    };
  }, [socket, soundEnabled]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle typing indicators
  const handleTyping = () => {
    if (socket && event) {
      socket.emit('typing_start', { eventId: event.id, userId: 'current-user' });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { eventId: event.id, userId: 'current-user' });
      }, 3000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !event) return;

    const messageData: Message = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        name: 'Vous',
        avatar: '/api/placeholder/40/40',
        initials: 'YO'
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      reactions: [],
      isOrganizer: false,
      isPinned: false,
      replies: []
    };

    if (editingMessage) {
      // Update existing message
      const updatedMessage = { 
        ...editingMessage, 
        content: newMessage, 
        isEdited: true, 
        editedAt: new Date().toISOString() 
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === editingMessage.id ? updatedMessage : msg
      ));
      
      if (socket) {
        socket.emit('update_message', {
          eventId: event.id,
          messageId: editingMessage.id,
          content: newMessage
        });
      }
      
      setEditingMessage(null);
    } else if (replyingTo) {
      // Add as reply
      const replyData: Message = {
        ...messageData,
        id: `${replyingTo}-${Date.now()}`
      };
      
      setMessages(prev => prev.map(msg => {
        if (msg.id === replyingTo) {
          return {
            ...msg,
            replies: [...msg.replies, replyData]
          };
        }
        return msg;
      }));
      
      if (socket) {
        socket.emit('send_reply', {
          eventId: event.id,
          parentMessageId: replyingTo,
          content: newMessage,
          author: messageData.author
        });
      }
      
      setReplyingTo(null);
    } else {
      // Add new message
      setMessages(prev => [...prev, messageData]);
      
      if (socket) {
        socket.emit('send_message', {
          eventId: event.id,
          content: newMessage,
          author: messageData.author,
          timestamp: messageData.timestamp
        });
      }
    }

    setNewMessage('');
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleReaction = (messageId: string, emoji: string, isReply = false, parentId: string | null = null) => {
    const currentUserId = 'current-user';
    
    if (isReply && parentId) {
      setMessages(prev => prev.map(msg => {
        if (msg.id === parentId) {
          return {
            ...msg,
            replies: msg.replies.map(reply => {
              if (reply.id === messageId) {
                const existingReaction = reply.reactions.find(r => r.emoji === emoji);
                if (existingReaction) {
                  if (existingReaction.users.includes(currentUserId)) {
                    // Remove reaction
                    return {
                      ...reply,
                      reactions: reply.reactions.map(r => 
                        r.emoji === emoji 
                          ? { ...r, users: r.users.filter(u => u !== currentUserId), count: r.count - 1 }
                          : r
                      ).filter(r => r.count > 0)
                    };
                  } else {
                    // Add reaction
                    return {
                      ...reply,
                      reactions: reply.reactions.map(r => 
                        r.emoji === emoji 
                          ? { ...r, users: [...r.users, currentUserId], count: r.count + 1 }
                          : r
                      )
                    };
                  }
                } else {
                  // New reaction
                  return {
                    ...reply,
                    reactions: [...reply.reactions, { emoji, users: [currentUserId], count: 1 }]
                  };
                }
              }
              return reply;
            })
          };
        }
        return msg;
      }));
    } else {
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            if (existingReaction.users.includes(currentUserId)) {
              // Remove reaction
              return {
                ...msg,
                reactions: msg.reactions.map(r => 
                  r.emoji === emoji 
                    ? { ...r, users: r.users.filter(u => u !== currentUserId), count: r.count - 1 }
                    : r
                ).filter(r => r.count > 0)
              };
            } else {
              // Add reaction
              return {
                ...msg,
                reactions: msg.reactions.map(r => 
                  r.emoji === emoji 
                    ? { ...r, users: [...r.users, currentUserId], count: r.count + 1 }
                    : r
                )
              };
            }
          } else {
            // New reaction
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, users: [currentUserId], count: 1 }]
            };
          }
        }
        return msg;
      }));
    }

    if (socket && event) {
      socket.emit('add_reaction', { 
        eventId: event.id,
        messageId, 
        emoji,
        userId: currentUserId,
        isReply,
        parentId 
      });
    }

    setShowEmojiPicker(null);
  };

  const toggleReplies = (messageId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MessageComponent: React.FC<{ 
    message: Message; 
    isReply?: boolean; 
    parentId?: string | null; 
  }> = ({ message, isReply = false, parentId = null }) => (
    <Motion className={`group ${isReply ? 'ml-12 mt-3' : 'mb-6'}`}>
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          message.isOrganizer 
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600'
        }`}>
          {message.author.initials}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-1">
            <span className={`font-medium text-white ${isReply ? 'text-sm' : ''}`}>
              {message.author.name}
            </span>
            {message.isOrganizer && (
              <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                Organisateur
              </span>
            )}
            {message.isPinned && !isReply && (
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
            {message.isEdited && (
              <span className="text-xs text-gray-500 italic">modifié</span>
            )}
            <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
              <button 
                onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                className="p-1 text-gray-400 hover:text-white rounded"
              >
                <Smile className="w-3 h-3" />
              </button>
              {message.author.id === 'current-user' && (
                <>
                  <button 
                    onClick={() => {
                      setEditingMessage(message);
                      setNewMessage(message.content);
                      messageInputRef.current?.focus();
                    }}
                    className="p-1 text-gray-400 hover:text-blue-400 rounded"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => {
                      if (socket && window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
                        socket.emit('delete_message', { messageId: message.id });
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className={`bg-white/5 rounded-2xl px-4 py-3 mb-2 ${isReply ? 'text-sm' : ''}`}>
            <p className="text-gray-300">{message.content}</p>
          </div>
          
          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {message.reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  onClick={() => handleReaction(message.id, reaction.emoji, isReply, parentId)}
                  className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 transition-colors ${
                    reaction.users.includes('current-user')
                      ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300'
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker === message.id && (
            <div className="absolute z-10 bg-gray-800 border border-white/10 rounded-xl p-3 shadow-xl mb-2">
              <div className="grid grid-cols-5 gap-2">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(message.id, emoji, isReply, parentId)}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Actions */}
          {!isReply && (
            <div className="flex items-center space-x-4 text-sm">
              <button
                onClick={() => setReplyingTo(message.id)}
                className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Reply className="w-4 h-4" />
                <span>Répondre</span>
              </button>
              {message.replies && message.replies.length > 0 && (
                <button
                  onClick={() => toggleReplies(message.id)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                >
                  {expandedReplies.has(message.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>{message.replies.length} réponse{message.replies.length > 1 ? 's' : ''}</span>
                </button>
              )}
            </div>
          )}

          {/* Replies */}
          {!isReply && message.replies && message.replies.length > 0 && expandedReplies.has(message.id) && (
            <div className="mt-4 space-y-3">
              {message.replies.map((reply) => (
                <MessageComponent 
                  key={reply.id} 
                  message={reply} 
                  isReply={true} 
                  parentId={message.id} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Motion>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Motion className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de la discussion...</p>
        </Motion>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <Motion className="mb-6">
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux événements</span>
          </button>
        </Motion>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Event Info Sidebar */}
          <Motion className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 sticky top-8">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-white/10">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xs text-gray-400">
                  {isConnected ? 'En ligne' : 'Hors ligne'}
                </span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="ml-auto p-1 text-gray-400 hover:text-white"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

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
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              {/* Active Users */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <UserCheck className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">
                    {activeUsers.size} utilisateur{activeUsers.size > 1 ? 's' : ''} en ligne
                  </span>
                </div>
                {typingUsers.size > 0 && (
                  <div className="text-xs text-gray-500 italic">
                    Quelqu'un écrit...
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="border-t border-white/10 pt-4">
                <div className="text-sm text-gray-400 mb-2">Statistiques</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{messages.length}</div>
                    <div className="text-xs text-gray-400">Messages</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      {new Set(messages.map(m => m.author.id)).size}
                    </div>
                    <div className="text-xs text-gray-400">Participants</div>
                  </div>
                </div>
              </div>
            </div>
          </Motion>

          {/* Chat Area */}
          <Motion className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl flex flex-col h-[700px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {filteredMessages.map((message) => (
                  <MessageComponent key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-white/10 p-4">
                {/* Reply/Edit Context */}
                {(replyingTo || editingMessage) && (
                  <div className="mb-3 p-3 bg-blue-500/10 rounded-xl border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-300">
                        {editingMessage
                          ? 'Modification du message'
                          : `Réponse à ${messages.find(m => m.id === replyingTo)?.author.name}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingTo(null);
                          setEditingMessage(null);
                          setNewMessage('');
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center space-x-3 relative">
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onInput={handleTyping}
                    placeholder={editingMessage ? "Modifier votre message..." : "Écrire un message..."}
                    maxLength={2000}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
                  />
                  
                  {/* Input Emoji Picker Button */}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(showEmojiPicker === 'input' ? null : 'input')}
                    className="p-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  {/* Input Emoji Picker */}
                  {showEmojiPicker === 'input' && (
                    <div className="absolute bottom-full right-16 mb-2 bg-gray-800 border border-white/10 rounded-xl p-3 shadow-xl z-20">
                      <div className="grid grid-cols-5 gap-2">
                        {commonEmojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setNewMessage(prev => prev + emoji);
                              setShowEmojiPicker(null);
                            }}
                            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-lg transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{editingMessage ? 'Modifier' : 'Envoyer'}</span>
                  </button>
                </form>

                {/* Character Count */}
                <div className="mt-2 text-right">
                  <span className={`text-xs ${newMessage.length > 1800 ? 'text-red-400' : 'text-gray-500'}`}>
                    {newMessage.length}/2000
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <Motion className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 text-center">
                <MessageCircle className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Messages</div>
                <div className="text-xs text-gray-400">{messages.length} total</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 text-center">
                <Pin className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Épinglés</div>
                <div className="text-xs text-gray-400">{messages.filter(m => m.isPinned).length} message{messages.filter(m => m.isPinned).length > 1 ? 's' : ''}</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 text-center">
                <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Réactions</div>
                <div className="text-xs text-gray-400">
                  {messages.reduce((total, msg) => total + (msg.reactions?.reduce((sum, r) => sum + r.count, 0) || 0), 0)} total
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 text-center">
                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Activité</div>
                <div className="text-xs text-gray-400">Temps réel</div>
              </div>
            </Motion>

            {/* Notification Banner */}
            {!isConnected && (
              <div className="fixed top-4 right-4 bg-red-500/90 backdrop-blur-lg text-white px-4 py-2 rounded-lg border border-red-400/50 flex items-center space-x-2 z-50">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Connexion interrompue</span>
              </div>
            )}
          </Motion>
        </div>
      </div>
    </div>
  );
};

export default EventDiscussion;