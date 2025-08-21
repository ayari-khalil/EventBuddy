import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Search, Send, Phone, Video, MoreVertical, Star, Clock, Check, CheckCheck, Smile, Paperclip, Image } from 'lucide-react';

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      name: "Marie Dubois",
      role: "CEO @ TechFlow AI",
      avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      lastMessage: "Parfait ! On se retrouve demain à 14h pour discuter du partenariat 🚀",
      timestamp: "14:32",
      unread: 2,
      online: true,
      event: "AI Revolution Summit 2025",
      matchScore: 95
    },
    {
      id: 2,
      name: "Thomas Martin",
      role: "CTO @ InnoLab",
      avatar: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=100",
      lastMessage: "Merci pour les conseils sur l'architecture cloud !",
      timestamp: "12:15",
      unread: 0,
      online: false,
      event: "AI Revolution Summit 2025",
      matchScore: 88
    },
    {
      id: 3,
      name: "Sophie Laurent",
      role: "VP Marketing @ GrowthCo",
      avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      lastMessage: "J'ai hâte de voir votre présentation !",
      timestamp: "Hier",
      unread: 1,
      online: true,
      event: "Startup Grind Paris",
      matchScore: 82
    },
    {
      id: 4,
      name: "Alexandre Chen",
      role: "Founder @ BlockChain Ventures",
      avatar: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=100",
      lastMessage: "Intéressant votre approche sur la DeFi",
      timestamp: "Hier",
      unread: 0,
      online: false,
      event: "Blockchain Conference",
      matchScore: 76
    },
    {
      id: 5,
      name: "Emma Rodriguez",
      role: "Head of Design @ DesignFirst",
      avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      lastMessage: "Votre portfolio est impressionnant !",
      timestamp: "2 jours",
      unread: 0,
      online: true,
      event: "Future of Work Summit",
      matchScore: 91
    }
  ];

  const messages = [
    {
      id: 1,
      senderId: 1,
      senderName: "Marie Dubois",
      content: "Salut ! J'ai vu votre profil et je suis très intéressée par votre approche de l'IA dans le fintech 🤖",
      timestamp: "14:20",
      type: "text",
      status: "read"
    },
    {
      id: 2,
      senderId: "me",
      senderName: "Moi",
      content: "Merci Marie ! Votre startup TechFlow AI a l'air passionnante. J'aimerais en savoir plus sur vos projets actuels.",
      timestamp: "14:22",
      type: "text",
      status: "read"
    },
    {
      id: 3,
      senderId: 1,
      senderName: "Marie Dubois",
      content: "Nous développons une plateforme d'IA pour automatiser les décisions d'investissement. Nous cherchons justement des partenaires techniques !",
      timestamp: "14:25",
      type: "text",
      status: "read"
    },
    {
      id: 4,
      senderId: "me",
      senderName: "Moi",
      content: "C'est exactement dans mes cordes ! J'ai 8 ans d'expérience en ML et j'ai travaillé sur des projets similaires chez Google.",
      timestamp: "14:28",
      type: "text",
      status: "read"
    },
    {
      id: 5,
      senderId: 1,
      senderName: "Marie Dubois",
      content: "Parfait ! On se retrouve demain à 14h pour discuter du partenariat 🚀",
      timestamp: "14:32",
      type: "text",
      status: "delivered"
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20 h-screen flex"
    >
      {/* Conversations List */}
      <div className="w-1/3 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Messages
          </h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              onClick={() => setSelectedChat(conversation.id)}
              className={`p-4 cursor-pointer border-b border-white/5 transition-all duration-300 ${
                selectedChat === conversation.id ? 'bg-white/10 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  />
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white truncate">{conversation.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                      {conversation.unread > 0 && (
                        <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{conversation.unread}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-1">{conversation.role}</p>
                  <p className="text-sm text-gray-300 truncate">{conversation.lastMessage}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-blue-400">{conversation.event}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">{conversation.matchScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-6 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  />
                  {selectedConversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedConversation.name}</h2>
                  <p className="text-sm text-gray-400">{selectedConversation.role}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-blue-400">{selectedConversation.event}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">{selectedConversation.matchScore}% match</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <Phone className="w-5 h-5 text-gray-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <Video className="w-5 h-5 text-gray-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.senderId === 'me'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-white/10 text-gray-100'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      
                      <div className={`flex items-center mt-1 space-x-2 ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                        {message.senderId === 'me' && (
                          <div className="flex items-center">
                            {message.status === 'delivered' && <Check className="w-3 h-3 text-gray-400" />}
                            {message.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-400" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            <div className="p-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
              <div className="flex items-end space-x-4">
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <Paperclip className="w-5 h-5 text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <Image className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>
                
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre message..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300 resize-none"
                    rows={1}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <Smile className="w-4 h-4 text-gray-400" />
                  </motion.button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Sélectionnez une conversation</h2>
              <p className="text-gray-400">Choisissez une conversation pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessagesPage;