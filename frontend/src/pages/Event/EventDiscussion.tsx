import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Send, Users, Heart, ThumbsUp, Smile, ArrowLeft, Calendar, MapPin, Clock, Hash, Sparkles, Zap, Video, Phone, Settings, MoreVertical, Reply, X } from 'lucide-react';

const EventDiscussionPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [event, setEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get current user from localStorage/sessionStorage
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user from localStorage/sessionStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    console.log("→ User data retrieved:", storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser({
          _id: parsedUser._id,
          name: parsedUser.name || "Unknown User",
          email: parsedUser.email || "No email"
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        setError("Failed to load user data");
      }
    } else {
      setError("User not logged in");
    }
    setUserLoading(false);
  }, []);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
        if (!response.ok) throw new Error('Event not found');
        const eventData = await response.json();
        setEvent(eventData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  // Socket connection
  useEffect(() => {
    if (!eventId || !currentUser?._id || loading || userLoading) return;

    console.log("Connecting to socket with user:", currentUser);

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
      
      newSocket.emit('join_discussion', {
        eventId,
        userId: currentUser._id
      });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('discussion_joined', (data) => {
      setMessages(data.messages);
      setDiscussion(data.discussion);
    });

    newSocket.on('new_message', (data) => {
      setMessages(prev => [...prev, data.message]);
    });

    newSocket.on('active_users_update', (data) => {
      setActiveUsers(data.activeUsers);
    });

    newSocket.on('user_typing', (data) => {
      if (data.userId !== currentUser._id) {
        if (data.isTyping) {
          setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
        } else {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }
      }
    });

    newSocket.on('reaction_updated', (data) => {
      setMessages(prev => prev.map(msg => 
        msg._id === data.messageId 
          ? { ...msg, reactions: data.reactions }
          : msg
      ));
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      setError(error.message);
    });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      newSocket.emit('leave_discussion');
      newSocket.disconnect();
    };
  }, [eventId, currentUser?._id, loading, userLoading]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log("Sending message:", newMessage, "Replying to:", replyingTo);
    
    if (!newMessage.trim() || !socket || !isConnected) return;

    socket.emit('send_message', {
      eventId,
      userId: currentUser._id,
      content: newMessage.trim(),
      replyTo: replyingTo?._id || null
    });

    setNewMessage('');
    setReplyingTo(null);
    console.log("Message sent");
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('typing', { eventId, userId: currentUser._id, isTyping: false });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!socket || !isConnected) return;

    socket.emit('typing', { eventId, userId: currentUser._id, isTyping: true });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { eventId, userId: currentUser._id, isTyping: false });
    }, 2000);
  };

  const handleAddReaction = (messageId, emoji) => {
    if (!socket || !isConnected) return;
    
    socket.emit('add_reaction', {
      messageId,
      emoji,
      userId: currentUser._id
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuthorInitials = (author) => {
    if (!author || !author.name) return 'U';
    return author.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomGradient = (userId) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-purple-500 to-pink-600',
      'from-green-500 to-blue-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-purple-600',
      'from-teal-500 to-cyan-600',
      'from-amber-500 to-orange-600'
    ];
    const index = userId ? userId.charCodeAt(userId.length - 1) % gradients.length : 0;
    return gradients[index];
  };

  const isCurrentUser = (userId) => userId === currentUser?._id;

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-400 text-lg">
            {userLoading ? "Loading user data..." : "Loading event discussion..."}
          </p>
          <p className="text-gray-500 text-sm mt-2">Connecting to the conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <span className="text-red-400 text-3xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Connection Error</h3>
          <p className="text-gray-400 mb-8">
            {error || "Please log in to join the discussion"}
          </p>
          <button 
            onClick={() => navigate('/events')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-blue-500/25"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/events')}
                className="p-3 hover:bg-white/10 rounded-xl transition-all duration-300 group"
              >
                <ArrowLeft size={20} className="text-gray-400 group-hover:text-white transition-colors" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Hash className="w-6 h-6 text-blue-400" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {event?.title}
                  </h1>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{formatDate(event?.date)}</span>
                  </div>
                  {event?.time && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{event.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span className="truncate max-w-[200px]">{event?.location}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              <div className="hidden md:flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-gray-400 hover:text-white">
                  <Video size={18} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-gray-400 hover:text-white">
                  <Phone size={18} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-gray-400 hover:text-white">
                  <Settings size={18} />
                </button>
              </div>

              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                isConnected 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-300'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                <span className="text-sm font-medium">{isConnected ? 'Live' : 'Disconnected'}</span>
              </div>
              
              {/* Active Users Counter */}
              <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 px-4 py-2 rounded-xl">
                <Users size={16} />
                <span className="text-sm font-medium">{activeUsers.length} online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Enhanced Event Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24 space-y-6">
              {/* Event Image with Overlay */}
              <div className="relative">
                <img 
                  src={event?.image || 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                  alt={event?.title}
                  className="w-full h-44 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl"></div>
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm font-medium">Featured Event</span>
                  </div>
                </div>
              </div>
              
              {/* Event Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white text-lg mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    Event Details
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{event?.description}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white font-medium">{event?.category}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-gray-400">Price</span>
                    <span className="text-green-400 font-bold">{event?.price || 'Free'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-gray-400">Capacity</span>
                    <span className="text-white font-medium">{event?.maxAttendees}</span>
                  </div>
                </div>
              </div>

              {/* Active Users List with Enhanced Design */}
              {activeUsers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    Active Participants
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {activeUsers.map(user => (
                      <div key={user._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRandomGradient(user._id)} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                          {getAuthorInitials(user)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-white font-medium truncate block">{user.name}</span>
                          {typingUsers.includes(user._id) && (
                            <span className="text-xs text-blue-400 flex items-center gap-1">
                              <div className="flex gap-1">
                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              typing...
                            </span>
                          )}
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Discussion Stats */}
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-300 font-medium text-sm">Discussion Stats</span>
                  <Hash className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{discussion?.messageCount || messages.length}</div>
                <div className="text-xs text-gray-400">messages exchanged</div>
              </div>
            </div>
          </div>

          {/* Enhanced Discussion Area */}
          <div className="lg:col-span-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col h-[700px]">
              {/* Discussion Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
                      <Hash className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Live Discussion</h2>
                      <p className="text-sm text-gray-400">
                        {discussion?.messageCount || 0} messages • Join the conversation!
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Messages Area with Enhanced Styling */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                      <Users size={32} className="text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Start the Conversation</h3>
                    <p className="text-gray-400">No messages yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message._id}
                      className={`flex gap-3 group animate-fadeIn ${isCurrentUser(message.author._id) ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRandomGradient(message.author._id)} flex items-center justify-center text-white font-medium shadow-lg`}>
                          {getAuthorInitials(message.author)}
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className={`flex-1 max-w-md ${isCurrentUser(message.author._id) ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-300">
                            {isCurrentUser(message.author._id) ? 'You' : message.author.name}
                          </span>
                          <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                          {message.isEdited && (
                            <span className="text-xs text-gray-500 bg-gray-500/20 px-2 py-0.5 rounded-full">edited</span>
                          )}
                        </div>
                        
                        {/* Reply Reference */}
                        {message.replyTo && (
                          <div className={`mb-2 p-2 bg-white/5 border-l-2 border-blue-400/50 rounded text-xs text-gray-400 ${
                            isCurrentUser(message.author._id) ? 'ml-8' : 'mr-8'
                          }`}>
                            <div className="font-medium text-blue-300">
                              Replying to {message.replyTo.author?.name || 'Unknown User'}
                            </div>
                            <div className="truncate">{message.replyTo.content}</div>
                          </div>
                        )}
                        
                        {/* Simplified Message Bubble */}
                        <div className={`relative p-3 rounded-lg transition-all duration-200 ${
                          isCurrentUser(message.author._id)
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white/10 text-gray-100 rounded-bl-none border border-white/20'
                        }`}>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                          
                          {/* Reply Button */}
                          <button
                            onClick={() => setReplyingTo(message)}
                            className={`absolute -bottom-2 ${isCurrentUser(message.author._id) ? '-left-2' : '-right-2'} 
                              w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center 
                              opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg`}
                          >
                            <Reply size={12} className="text-white" />
                          </button>
                        </div>

                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {message.reactions.map((reaction, reactionIndex) => (
                              <button
                                key={reactionIndex}
                                onClick={() => handleAddReaction(message._id, reaction.emoji)}
                                className={`px-2 py-1 rounded-full text-xs border transition-all duration-200 ${
                                  reaction.users.some(user => user._id === currentUser._id)
                                    ? 'bg-blue-500/30 border-blue-400/50 text-blue-300'
                                    : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                                }`}
                              >
                                {reaction.emoji} {reaction.count}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Quick Reactions */}
                        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {['👍', '❤️', '😊'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleAddReaction(message._id, emoji)}
                              className="p-1 hover:bg-white/20 rounded text-sm transition-all duration-200"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Enhanced Typing Indicators */}
                {typingUsers.length > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-blue-300 text-sm font-medium">
                      {typingUsers.length} user{typingUsers.length > 1 ? 's' : ''} typing...
                    </span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Message Input */}
              <div className="p-6 border-t border-white/10 bg-white/5">
                {/* Reply Preview */}
                {replyingTo && (
                  <div className="mb-4 p-3 bg-white/10 rounded-lg border border-white/20 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Reply size={14} className="text-blue-400" />
                        <span className="text-sm font-medium text-blue-300">
                          Replying to {isCurrentUser(replyingTo.author._id) ? 'yourself' : replyingTo.author.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{replyingTo.content}</p>
                    </div>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
                    >
                      <X size={16} className="text-gray-400" />
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder={
                          replyingTo 
                            ? `Reply to ${isCurrentUser(replyingTo.author._id) ? 'yourself' : replyingTo.author.name}...`
                            : isConnected 
                            ? "Share your thoughts..." 
                            : "Connecting..."
                        }
                        disabled={!isConnected}
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:bg-gray-500/20 disabled:cursor-not-allowed transition-all duration-300 pr-16"
                        maxLength={2000}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {newMessage.length}/2000
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || !isConnected}
                      className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:bg-gray-500/50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none group btn-primary"
                    >
                      <Send size={20} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  </div>
                  
                  {/* Quick Actions Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button type="button" className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-gray-400 hover:text-white">
                        <Smile size={18} />
                      </button>
                      <button type="button" className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-gray-400 hover:text-white">
                        <Heart size={18} />
                      </button>
                      <button type="button" className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-gray-400 hover:text-white">
                        <ThumbsUp size={18} />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {replyingTo ? 'Press Enter to reply' : 'Press Enter to send'}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.5) rgba(255, 255, 255, 0.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Glassmorphism effect for better visual appeal */
        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
        }

        /* Smooth hover transitions */
        button, .hover-scale {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        button:hover {
          transform: translateY(-1px);
        }

        /* Enhanced focus states */
        input:focus, textarea:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Custom gradient animations */
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Message bubble hover effects */
        .message-bubble {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .message-bubble:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        /* Active user animation */
        .pulse-ring {
          animation: pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }

        @keyframes pulseRing {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          80%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        /* Typography enhancements */
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        /* Loading animation improvements */
        .loading-gradient {
          background: linear-gradient(-45deg, #1e293b, #334155, #475569, #334155);
          background-size: 400% 400%;
          animation: gradientShift 2s ease infinite;
        }

        /* Enhanced button animations */
        .btn-primary {
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        /* Mobile responsive improvements */
        @media (max-width: 768px) {
          .custom-scrollbar {
            scrollbar-width: auto;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
        }

        /* Improved focus visibility for accessibility */
        button:focus-visible, input:focus-visible {
          outline: 2px solid rgba(59, 130, 246, 0.8);
          outline-offset: 2px;
        }

        /* Enhanced message animations */
        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes messageSlideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .message-left {
          animation: messageSlideIn 0.4s ease-out;
        }

        .message-right {
          animation: messageSlideInRight 0.4s ease-out;
        }

        /* Reaction button animations */
        .reaction-btn {
          transform-origin: center;
          transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .reaction-btn:hover {
          transform: scale(1.2) rotate(-5deg);
        }

        .reaction-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default EventDiscussionPage;