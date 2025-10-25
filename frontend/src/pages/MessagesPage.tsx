import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { 
  MessageCircle, 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Check, 
  CheckCheck, 
  Smile, 
  Paperclip, 
  Image,
  ArrowLeft,
  Users
} from 'lucide-react';

const MessagesPage = () => {
  const [socket, setSocket] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load current user
  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser({
          _id: parsedUser._id,
          name: parsedUser.name || "Unknown User",
          email: parsedUser.email || "No email",
          avatar: parsedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedUser.name || 'User')}&background=random`
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        setError("Failed to load user data");
      }
    } else {
      setError("Please log in to access messages");
    }
    setUserLoading(false);
  }, []);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser?._id) return;

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const url = `http://localhost:5000/api/direct-messages/conversations?userId=${currentUser._id}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.error('Response status:', response.status);
          throw new Error('Failed to fetch conversations');
        }

        const data = await response.json();
        console.log('Conversations loaded:', data);
        setConversations(data.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setConversations([]);
        setLoading(false);
      }
    };

    if (currentUser && !userLoading) {
      fetchConversations();
    }
  }, [currentUser, userLoading]);

  // Socket connection
  useEffect(() => {
    if (!currentUser?._id || userLoading) return;

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
      
      newSocket.emit('join_dm_system', {
        userId: currentUser._id
      });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('conversation_joined', (data) => {
      console.log('Conversation joined:', data);
      setMessages(data.messages || []);
    });

    newSocket.on('new_dm', (data) => {
      console.log('New message received:', data);
      setMessages(prev => [...prev, data.message]);
      
      // Update last message in conversations list
      setConversations(prev => prev.map(conv => 
        conv._id === selectedChat?._id
          ? { ...conv, lastMessage: data.message, lastActivity: new Date() }
          : conv
      ));
    });

    newSocket.on('dm_user_typing', (data) => {
      console.log('User typing:', data);
      if (data.isTyping) {
        setTypingUsers(prev => new Set([...prev, data.userId]));
      } else {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }
    });

    newSocket.on('unread_count_update', (data) => {
      console.log('Unread count:', data.unreadCount);
    });

    newSocket.on('dm_error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      newSocket.disconnect();
    };
  }, [currentUser?._id, userLoading, selectedChat]);

  const handleChatSelect = async (conversation) => {
    setSelectedChat(conversation);
    setMessages([]);
    
    if (socket && isConnected) {
      socket.emit('join_conversation', {
        conversationId: conversation._id
      });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !socket || !isConnected) return;

    socket.emit('send_dm', {
      conversationId: selectedChat._id,
      content: newMessage.trim(),
      messageType: 'text'
    });

    setNewMessage('');
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('dm_typing', { 
      conversationId: selectedChat._id, 
      isTyping: false 
    });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!socket || !isConnected || !selectedChat) return;

    socket.emit('dm_typing', { 
      conversationId: selectedChat._id, 
      isTyping: true 
    });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('dm_typing', { 
        conversationId: selectedChat._id, 
        isTyping: false 
      });
    }, 2000);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatLastSeen = (date) => {
    const now = new Date();
    const lastSeen = new Date(date);
    const diffInHours = Math.floor((now - lastSeen) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return lastSeen.toLocaleDateString('en-US');
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p._id !== currentUser._id);
    return otherParticipant && (
      otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (otherParticipant.role && otherParticipant.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== currentUser._id);
  };

  const renderMessageStatus = (message) => {
    if (message.sender._id === currentUser._id) {
      if (message.readBy && message.readBy.length > 1) {
        return <CheckCheck className="w-4 h-4 text-blue-400" />;
      } else {
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      }
    }
    return null;
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-400 text-3xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Error</h3>
          <p className="text-gray-400 mb-8">{error || "Please log in to access messages"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-16">
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversations List */}
        <div className="w-full md:w-1/3 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Messages
              </h1>
              {isConnected && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-300">Live</span>
                </div>
              )}
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No conversations yet</p>
                <p className="text-gray-500 text-sm mt-2">Start chatting with other users!</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                const isSelected = selectedChat?._id === conversation._id;
                
                return (
                  <div
                    key={conversation._id}
                    onClick={() => handleChatSelect(conversation)}
                    className={`p-4 cursor-pointer border-b border-white/5 transition-all duration-300 hover:bg-white/5 ${
                      isSelected ? 'bg-white/10 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={otherParticipant?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant?.name || 'User')}&background=random`}
                          alt={otherParticipant?.name || 'User'}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-white truncate">
                            {otherParticipant?.name || 'Unknown User'}
                          </h3>
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-400">
                              {formatTime(conversation.lastActivity)}
                            </span>
                          )}
                        </div>
                        
                        {otherParticipant?.role && (
                          <p className="text-sm text-gray-400 mb-1">{otherParticipant.role}</p>
                        )}
                        
                        {conversation.lastMessage ? (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-300 truncate flex-1">
                              {conversation.lastMessage.content}
                            </p>
                            {renderMessageStatus(conversation.lastMessage)}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">New conversation</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-6 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 hover:bg-white/10 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <div className="relative">
                    <img
                      src={getOtherParticipant(selectedChat)?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(getOtherParticipant(selectedChat)?.name || 'User')}&background=random`}
                      alt={getOtherParticipant(selectedChat)?.name || 'User'}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    />
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {getOtherParticipant(selectedChat)?.name || 'Unknown User'}
                    </h2>
                    {getOtherParticipant(selectedChat)?.role && (
                      <p className="text-sm text-gray-400">
                        {getOtherParticipant(selectedChat).role}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <Video className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-16">
                    <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No messages yet</h3>
                    <p className="text-gray-400">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwn = message.sender._id === currentUser._id;
                    
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="max-w-xs lg:max-w-md">
                          <div className="flex items-end space-x-2">
                            {!isOwn && (
                              <img
                                src={message.sender?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender?.name || 'User')}&background=random`}
                                alt={message.sender?.name || 'User'}
                                className="w-6 h-6 rounded-full border border-white/20"
                              />
                            )}
                            
                            <div className="flex-1">
                              <div
                                className={`px-4 py-3 rounded-2xl ${
                                  isOwn
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                    : 'bg-white/10 text-gray-100'
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              </div>
                              
                              <div className={`flex items-center mt-1 space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-xs text-gray-500">
                                  {formatTime(message.createdAt)}
                                </span>
                                {renderMessageStatus(message)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {typingUsers.size > 0 && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2 bg-white/10 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-400">typing...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
                <div className="flex items-end space-x-4">
                  <div className="flex space-x-2">
                    <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                      <Paperclip className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                      <Image className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={handleTyping}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder={isConnected ? "Type your message..." : "Connecting..."}
                      disabled={!isConnected}
                      className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300 resize-none"
                      rows={1}
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                      <Smile className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || !isConnected}
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Select a conversation</h2>
                <p className="text-gray-400 max-w-md">
                  Choose a conversation from the list to start exchanging messages.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;