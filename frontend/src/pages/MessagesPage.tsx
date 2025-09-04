import React, { useState, useEffect, useRef } from 'react';
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
  Mic,
  MicOff,
  Play,
  Pause,
  Volume2,
  ArrowLeft
} from 'lucide-react';

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [playingVoice, setPlayingVoice] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentUser = { 
    _id: 'user123', 
    name: 'John Doe', 
    avatar: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=100' 
  };

  // Mock data for demonstration
  const mockConversations = [
    {
      _id: 'conv1',
      participants: [
        currentUser,
        {
          _id: 'user456',
          name: 'Sarah Johnson',
          avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100',
          role: 'Designer',
          isOnline: true,
          lastSeen: new Date(Date.now() - 300000) // 5 minutes ago
        }
      ],
      lastMessage: {
        _id: 'msg1',
        content: 'Hey! How are you doing?',
        type: 'text',
        sender: { _id: 'user456', name: 'Sarah Johnson' },
        createdAt: new Date(Date.now() - 120000), // 2 minutes ago
        readAt: null,
        deliveredAt: new Date(Date.now() - 60000)
      },
      lastActivity: new Date(Date.now() - 120000),
      messageCount: 15
    },
    {
      _id: 'conv2',
      participants: [
        currentUser,
        {
          _id: 'user789',
          name: 'Mike Chen',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
          role: 'Developer',
          isOnline: false,
          lastSeen: new Date(Date.now() - 3600000) // 1 hour ago
        }
      ],
      lastMessage: {
        _id: 'msg2',
        content: 'The project looks great!',
        type: 'text',
        sender: { _id: 'user123', name: 'John Doe' },
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
        readAt: new Date(Date.now() - 7140000),
        deliveredAt: new Date(Date.now() - 7180000)
      },
      lastActivity: new Date(Date.now() - 7200000),
      messageCount: 8
    }
  ];

  const mockMessages = [
    {
      _id: 'msg1',
      content: 'Hey there! How are you?',
      type: 'text',
      sender: { 
        _id: 'user456', 
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      createdAt: new Date(Date.now() - 300000),
      readAt: new Date(Date.now() - 240000),
      deliveredAt: new Date(Date.now() - 280000)
    },
    {
      _id: 'msg2',
      content: 'I\'m doing great! Working on some exciting projects.',
      type: 'text',
      sender: currentUser,
      createdAt: new Date(Date.now() - 240000),
      readAt: new Date(Date.now() - 180000),
      deliveredAt: new Date(Date.now() - 220000)
    },
    {
      _id: 'msg3',
      type: 'voice',
      sender: { 
        _id: 'user456', 
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      voiceUrl: '/audio/voice-sample.webm',
      voiceDuration: 15,
      createdAt: new Date(Date.now() - 120000),
      readAt: null,
      deliveredAt: new Date(Date.now() - 100000)
    }
  ];

  // Initialize component
  useEffect(() => {
    const initializeComponent = () => {
      // Simulate loading
      setTimeout(() => {
        setConversations(mockConversations);
        setOnlineUsers(new Set(['user456'])); // Sarah is online
        
        if (mockConversations.length > 0) {
          setSelectedChat(mockConversations[0]);
          setMessages(mockMessages);
        }
        
        setLoading(false);
      }, 1000);
    };

    initializeComponent();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChatSelect = (conversation) => {
    setSelectedChat(conversation);
    // In a real app, this would load messages for the selected conversation
    setMessages(mockMessages);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageData = {
      _id: `msg_${Date.now()}`,
      content: newMessage,
      type: 'text',
      sender: currentUser,
      createdAt: new Date(),
      readAt: null,
      deliveredAt: new Date()
    };

    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
  };

  const handleTyping = () => {
    // Simulate typing indicator logic
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      // Clear typing indicator
    }, 1000);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        await sendVoiceMessage(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting voice recording:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendVoiceMessage = async (blob) => {
    try {
      const duration = Math.floor(blob.size / 1000); // Rough estimate
      
      const voiceMessage = {
        _id: `voice_${Date.now()}`,
        type: 'voice',
        sender: currentUser,
        voiceUrl: URL.createObjectURL(blob),
        voiceDuration: duration,
        createdAt: new Date(),
        readAt: null,
        deliveredAt: new Date()
      };
      
      setMessages(prev => [...prev, voiceMessage]);
    } catch (error) {
      console.error('Error sending voice message:', error);
    }
  };

  const playVoiceMessage = (messageId, voiceUrl) => {
    if (playingVoice === messageId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingVoice(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = voiceUrl;
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setPlayingVoice(null);
        });
        setPlayingVoice(messageId);
        
        audioRef.current.onended = () => setPlayingVoice(null);
        audioRef.current.onerror = () => {
          console.error('Error playing audio');
          setPlayingVoice(null);
        };
      }
    }
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
    
    if (diffInHours < 1) return 'Less than an hour ago';
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
      if (message.readAt) {
        return <CheckCheck className="w-4 h-4 text-blue-400" />;
      } else if (message.deliveredAt) {
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      } else {
        return <Check className="w-4 h-4 text-gray-400" />;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 h-screen flex bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Hidden audio element for voice messages */}
      <audio ref={audioRef} />

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
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            const isSelected = selectedChat?._id === conversation._id;
            const isOnline = onlineUsers.has(otherParticipant?._id);
            
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
                      src={otherParticipant?.avatar || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={otherParticipant?.name || 'User'}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    />
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {otherParticipant?.name || 'Unknown User'}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-400">
                            {formatTime(conversation.lastActivity)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-1">{otherParticipant?.role || 'User'}</p>
                    
                    {conversation.lastMessage ? (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-300 truncate flex-1">
                          {conversation.lastMessage.type === 'voice' ? (
                            <span className="flex items-center">
                              <Volume2 className="w-3 h-3 mr-1" />
                              Voice message
                            </span>
                          ) : conversation.lastMessage.type === 'image' ? (
                            <span className="flex items-center">
                              <Image className="w-3 h-3 mr-1" />
                              Image
                            </span>
                          ) : (
                            conversation.lastMessage.content
                          )}
                        </p>
                        {renderMessageStatus(conversation.lastMessage)}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">New conversation</p>
                    )}
                    
                    {conversation.relatedEvent && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-blue-400">
                          {conversation.relatedEvent.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                </button>
                
                <div className="relative">
                  <img
                    src={getOtherParticipant(selectedChat)?.avatar || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={getOtherParticipant(selectedChat)?.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  />
                  {onlineUsers.has(getOtherParticipant(selectedChat)?._id) && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {getOtherParticipant(selectedChat)?.name || 'Unknown User'}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {getOtherParticipant(selectedChat)?.role || 'User'}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {onlineUsers.has(getOtherParticipant(selectedChat)?._id) ? (
                      <span className="text-xs text-green-400">Online</span>
                    ) : (
                      <span className="text-xs text-gray-500">
                        {formatLastSeen(getOtherParticipant(selectedChat)?.lastSeen)}
                      </span>
                    )}
                  </div>
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
              {messages.map((message, index) => {
                const isOwn = message.sender._id === currentUser._id;
                const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;
                
                return (
                  <div
                    key={message._id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                      <div className="flex items-end space-x-2">
                        {!isOwn && showAvatar && (
                          <img
                            src={message.sender?.avatar || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100'}
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
                            {message.type === 'text' && (
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            )}
                            
                            {message.type === 'voice' && (
                              <div className="flex items-center space-x-3 min-w-0">
                                <button
                                  onClick={() => playVoiceMessage(message._id, message.voiceUrl)}
                                  className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                                    isOwn 
                                      ? 'bg-white/20 hover:bg-white/30' 
                                      : 'bg-blue-500 hover:bg-blue-600'
                                  }`}
                                >
                                  {playingVoice === message._id ? (
                                    <Pause className="w-3 h-3" />
                                  ) : (
                                    <Play className="w-3 h-3" />
                                  )}
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <Volume2 className="w-3 h-3 flex-shrink-0" />
                                    <div className="flex-1 bg-white/20 rounded-full h-1">
                                      <div className="bg-white rounded-full h-1 w-1/3"></div>
                                    </div>
                                    <span className="text-xs flex-shrink-0">
                                      {message.voiceDuration || 0}s
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {message.type === 'image' && (
                              <div className="space-y-2">
                                <img
                                  src={message.fileUrl ? `http://localhost:5000${message.fileUrl}` : 'https://via.placeholder.com/200'}
                                  alt="Shared image"
                                  className="rounded-lg max-w-full border border-white/10"
                                />
                                {message.fileName && (
                                  <p className="text-xs opacity-75">{message.fileName}</p>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className={`flex items-center mt-1 space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-xs text-gray-500">
                              {formatTime(message.createdAt)}
                            </span>
                            {renderMessageStatus(message)}
                          </div>
                        </div>
                        
                        {!isOwn && !showAvatar && (
                          <div className="w-6"></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Typing indicators */}
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
                  <button
                    onMouseDown={startVoiceRecording}
                    onMouseUp={stopVoiceRecording}
                    onMouseLeave={stopVoiceRecording}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      isRecording 
                        ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/25' 
                        : 'bg-white/5 hover:bg-white/10 text-gray-400'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={isRecording ? "Recording..." : "Type your message..."}
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300 resize-none"
                    rows={1}
                    disabled={isRecording}
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <Smile className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isRecording}
                  className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {isRecording && (
                <div className="mt-3 text-center">
                  <div className="flex items-center justify-center space-x-2 text-red-400">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Recording... Release to send</span>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Select a conversation</h2>
              <p className="text-gray-400 max-w-md">
                Choose a conversation from the list to start exchanging messages, 
                voice messages and much more.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;