import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiMic, FiArrowRight, FiPaperclip, FiUser, FiPlus, FiTrash2, FiMessageCircle, FiHelpCircle, FiChevronLeft, FiChevronRight, FiGlobe, FiMoreHorizontal, FiSquare } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { chatAPI, conversationAPI } from '../api/config';
import TopNav from './TopNav';
import PageTransition from './PageTransition';
import './Chat.css';

// Optimized markdown parser - moved outside component
const parseMarkdown = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  // Quick check if text contains markdown
  if (!/[\*_`\-\n]/.test(text)) return text;
  
  let result = text
    // Bold: **text** and *text*
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^ ][\s\S]*?[^ ]|[^ ])\*/g, '<strong>$1</strong>')
    // Italic: __text__ and _text_
    .replace(/__(.+?)__/g, '<em>$1</em>')
    .replace(/_([^ ][\s\S]*?[^ ]|[^ ])_/g, '<em>$1</em>')
    // Code: `text`
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Line breaks
    .replace(/\n/g, '<br/>')
    // Bullet points
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  return result;
};

// Memoized component to prevent unnecessary re-renders
const MarkdownText = memo(({ text }) => {
  const parsed = useMemo(() => parseMarkdown(text), [text]);
  
  return (
    <div
      dangerouslySetInnerHTML={{ __html: parsed }}
      style={{
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        lineHeight: '1.5'
      }}
    />
  );
});

export default function Chat({ userName, onLogout }) {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = storedUser.id || storedUser.user_id || storedUser.email || 'guest';
  const userFullName = storedUser.first_name ? `${storedUser.first_name} ${storedUser.last_name}` : (userName || 'User');
  const profilePhoto = storedUser.profile_photo_url || null;
  const chatStorageKey = `chatConversationHistory:${userId}`;
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your intelligent assistant. I can help with translations, productivity tips, or answering any questions you have. How can I support you today?",
      sender: 'ai'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showQuestions, setShowQuestions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchQuickQuestions();
    loadConversationHistory();
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  useEffect(() => {
    if (messages.length > 1) {
      saveConversation();
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const loadConversationHistory = async () => {
    try {
      setLoading(true);
      const tempId = localStorage.getItem('userId');
      if (!tempId) return;

      const response = await conversationAPI.getConversations();
      if (response && response.data && response.data.data) {
        setConversationHistory(response.data.data);
        const history = response.data.data;
        if (history.length > 0) {
          loadConversation(history[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading conversation history from DB:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConversation = () => {
    // Left purposefully empty or removed as messages save dynamically on POST /api/chat/message internally via the backend API.
  };

  const startNewChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your intelligent assistant. I can help with translations, productivity tips, or answering any questions you have. How can I support you today?",
        sender: 'ai'
      }
    ]);
    setShowQuestions(true);
    setInputValue('');
    setCurrentConversationId(null);
  };

  const loadConversation = async (convId) => {
    try {
      const response = await conversationAPI.getConversationById(convId);
      if (response && response.data && response.data.data) {
        const data = response.data.data;
        
        // Format DB messages into frontend friendly objects
        const frontendMessages = data.messages.map((m, idx) => ({
          id: idx + 1,
          text: m.content,
          sender: m.role
        }));

        setMessages(frontendMessages);
        setCurrentConversationId(convId);
        setShowQuestions(false);
      }
    } catch (err) {
       console.error("Error loading specific conversation:", err);
    }
  };

  const deleteConversation = async (convId) => {
    try {
      await conversationAPI.deleteConversation(convId);
      setConversationHistory(prev => prev.filter(c => c.id !== convId));
      if (currentConversationId === convId) {
        startNewChat();
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  const fetchQuickQuestions = async () => {
    try {
      console.log('Fetching Quick Questions');
      console.log('  Endpoint: GET /api/chat/quick-questions');
      console.log('  Timestamp:', new Date().toISOString());
      
      // API ENDPOINT: GET /api/chat/quick-questions
      // Uncomment when backend ready:
      // console.log('Sending request to backend...');
      // const response = await chatAPI.getQuickQuestions();
      // console.log('Quick questions received:', response.data.questions);
      // setQuickQuestions(response.data.questions);
    } catch (error) {
      console.error('Quick Questions Fetch Error:', {
        message: error.message,
        endpoint: 'GET /api/chat/quick-questions',
        timestamp: new Date().toISOString()
      });
    }
  };

  const quickQuestions = [
    'How do I translate text?',
    'Voice command guide',
    'Check system status',
    'Manage subscriptions'
  ];

  const sendMessageToAI = async (messageText) => {
    try {
      const response = await chatAPI.sendMessage(messageText, currentConversationId);
      const aiResponse = response?.data?.data?.response;
      const returnedConvId = response?.data?.data?.conversation_id;

      if (!aiResponse) {
        throw new Error('Empty AI response');
      }
      
      // Map returned Conv ID so subseq. messages attach correctly.
      if (returnedConvId && returnedConvId !== currentConversationId) {
        setCurrentConversationId(returnedConvId);
        // Soft refresh conversations list
        loadConversationHistory();
      }

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: aiResponse,
        sender: 'ai'
      }]);
    } catch (error) {
      console.error('Send Message Error:', {
        message: error.message,
        endpoint: 'POST /api/chat/message',
        userMessage: messageText,
        timestamp: new Date().toISOString()
      });
      const status = error?.response?.status;
      const errorCode = error?.response?.data?.error_code;
      let fallback = error?.response?.data?.message || error?.userMessage || 'Failed to get AI response. Please try again.';

      if (status === 401 && errorCode === 'gemini_api_key_invalid') {
        fallback = 'AI service key is invalid or expired. Please update the Gemini API key and restart the backend.';
      } else if (status === 429) {
        const backendMessage = error?.response?.data?.message;
        fallback = backendMessage || 'Too many requests. Please wait a moment and try again.';
      } else if (status === 502 && errorCode === 'gemini_api_error') {
        fallback = 'AI service is temporarily unavailable. Please try again shortly.';
      }

      toast.error(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      toast.error('Please enter a message before sending.');
      return;
    }

    console.log('Sending Chat Message:');
    console.log('  Message:', inputValue);
    console.log('  Timestamp:', new Date().toISOString());

    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    setMessages([...messages, newMessage]);
    setShowQuestions(false);
    setInputValue('');
    setLoading(true);
    await sendMessageToAI(inputValue);
  };

  const handleQuestionClick = async (question) => {
    console.log('Quick Question Selected:');
    console.log('  Question:', question);
    console.log('  Timestamp:', new Date().toISOString());

    const newMessage = {
      id: messages.length + 1,
      text: question,
      sender: 'user'
    };
    setMessages([...messages, newMessage]);
    setShowQuestions(false);
    setLoading(true);
    await sendMessageToAI(question);
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';
    let lastResultIndex = 0;

    recognition.onstart = () => {
      setIsRecording(true);
      setIsTranscribing(true);
      setInputValue(''); // Reset input when starting new recording
      finalTranscript = '';
      lastResultIndex = 0;
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      // Only process new results since the last update
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Update the input field dynamically as they speak
      const currentText = finalTranscript + interimTranscript;
      setInputValue(currentText.trim());
      lastResultIndex = event.results.length;
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast.error('Microphone access was denied. Please allow access and try again.');
      } else if (event.error !== 'aborted') {
        toast.error('Microphone recording error. Please try again.');
      }
      setIsRecording(false);
      setIsTranscribing(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setIsTranscribing(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(false);
    }
  };

  return (
    <PageTransition>
      <div className="d-flex w-100 vh-100 bg-surface overflow-hidden chat-layout">
        {/* Sidebar */}
      <div className={`d-flex flex-column border-end border-subtle flex-shrink-0 z-2 chat-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        {/* New Chat Button */}
        <div className="p-4 pt-5">
          <button 
            onClick={startNewChat}
            className="btn w-100 d-flex justify-content-center align-items-center gap-2 py-3 fw-semibold rounded-3 shadow-sm hover-lift transition-normal"
            title="Start new conversation"
            style={{
              background: 'linear-gradient(135deg, var(--neon-purple) 0%, var(--neon-magenta) 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 0 15px var(--neon-purple), inset 0 0 8px rgba(255, 255, 255, 0.2)',
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 0 25px var(--neon-purple), 0 0 40px var(--neon-purple), inset 0 0 10px rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.boxShadow = '0 0 15px var(--neon-purple), inset 0 0 8px rgba(255, 255, 255, 0.2)'}
          >
            <i className="fa-solid fa-plus icon-glow"></i> New Chat
          </button>
        </div>

        {/* Sidebar Header */}
        <div className="px-4 py-3 border-bottom border-subtle">
          <p className="mb-0 fs-7 fw-semibold text-uppercase letter-spacing-1" style={{ 
            color: 'var(--text-muted)',
            fontWeight: '700'
          }}>
              Conversations
          </p>
        </div>

        {/* Conversations List */}
        <div className="flex-grow-1 overflow-auto px-3 pb-3 custom-scrollbar">
          {conversationHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted fs-7 mt-4">No conversations yet</p>
              <p className="text-muted fs-8 mt-2">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {conversationHistory.map((conv) => (
                <div
                  key={conv.id}
                  className={`surface-card p-3 flex-between gap-2 cursor-pointer group rounded-3 border conversation-item ${currentConversationId === conv.id ? 'active border-primary' : 'border-subtle'}`}
                  onClick={() => loadConversation(conv.id)}
                >
                  <div className="flex-grow-1 overflow-hidden">
                    <p className={`mb-0 fs-7 fw-semibold text-truncate ${currentConversationId === conv.id ? 'text-primary' : 'text-dark'}`}>
                      <i className="fa-regular fa-message me-2 opacity-75"></i>
                      {conv.title}
                    </p>
                    <p className="mb-0 fs-8 text-muted">
                      {new Date(conv.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="btn btn-link text-danger p-1 opacity-0 group-hover-opacity-100 transition-normal"
                    title="Delete conversation"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow-1 d-flex flex-column position-relative z-1 chat-main-area">
        {/* Background Icons - Removed per user request */}
        {/* Top Navigation */}
        <TopNav onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Messages Area */}
        <div className="flex-grow-1 overflow-auto position-relative z-1 d-flex flex-column custom-scrollbar chat-messages-container">
          
          {showQuestions && messages.length === 1 && (
            <>
              {/* Welcome Header */}
              <div className="chat-center-panel welcome-header mb-5 animate-slide-up">
                <h2 className="fs-2 mb-2" style={{ fontWeight: '800' }}>
                  ✨ How can I help you today?
                </h2>
                <p className="fs-6 mb-0">
                  Ask me anything about admissions, academics, campus life, career guidance, or mental wellness support
                </p>
              </div>

              {/* Quick Questions Card */}
              <div className="surface-card gradient-bg-subtle gradient-glow p-4 p-md-5 animate-slide-up chat-center-panel quick-questions-card mb-4" style={{ position: 'relative' }}>
                <p className="gradient-text fs-7 fw-bold letter-spacing-1 text-uppercase mb-4 d-flex align-items-center gap-2">
                  Popular Questions
                </p>
                <div className="d-grid gap-3">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuestionClick(q)}
                      className="btn quick-question-btn p-3 rounded-3 fw-medium"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="flex-center rounded-circle question-icon-circle" style={{ 
                          width: '36px', 
                          height: '36px', 
                          flexShrink: 0,
                          color: 'white'
                        }}>
                          <i className="fa-regular fa-circle-question"></i>
                        </div>
                        <span>{q}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Messages Container */}
          <div className="d-flex flex-column gap-4 pb-4 chat-center-panel">
            {messages.map((msg, idx) => (
              <div key={idx} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} align-items-end gap-2 animate-slide-up`} style={{ animationDelay: `${idx * 0.05}s` }}>
                {msg.sender === 'ai' && (
                  <div className="chat-avatar ai shadow-sm">
                    <i className="fa-solid fa-microchip"></i>
                  </div>
                )}
                
                <div className={`chat-bubble ${msg.sender}`}>
                  <MarkdownText text={msg.text} />
                </div>
                
                {msg.sender === 'user' && (
                  <div 
                    className="chat-avatar user shadow-sm d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      backgroundImage: profilePhoto ? `url(${profilePhoto})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      fontSize: '14px',
                      color: 'white'
                    }}
                  >
                    {!profilePhoto && <i className="fa-solid fa-user"></i>}
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="d-flex justify-content-start align-items-end gap-2">
                <div className="chat-avatar ai shadow-sm">
                  <i className="fa-solid fa-microchip"></i>
                </div>
                <div className="chat-bubble ai loading-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="chat-input-wrapper position-relative">
          <div className="chat-input-container d-flex gap-3 align-items-end">
            <div className="flex-grow-1">
              <div className="position-relative d-flex align-items-center chat-input-box">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder="Type your message here..."
                  className="form-control border-0 shadow-none flex-grow-1 bg-transparent chat-input-field"
                />
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              className="btn btn-primary chat-action-btn"
              title="Send message"
              disabled={loading}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
            <button 
              onClick={() => (isRecording ? stopRecording() : startRecording())}
              className={`btn chat-action-btn ${isRecording ? 'btn-danger recording-pulse' : 'btn-primary'}`}
              title={isRecording ? 'Stop recording' : 'Voice input'}
              disabled={isTranscribing && !isRecording}
              style={{ opacity: (isTranscribing && !isRecording) ? 0.6 : 1 }}
            >
              {isRecording ? <FiSquare size={20} /> : <FiMic size={20} />}
            </button>
          </div>
        </div>
        </div>
      </div>
    </PageTransition>
  );
}
