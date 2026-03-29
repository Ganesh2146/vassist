import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiMic, FiPaperclip, FiMoreHorizontal, FiUser, FiPlus, FiSmile, FiPhone, FiVideo } from 'react-icons/fi';
import { chatAPI, conversationAPI } from '../api/config';

export default function ChatPremiumV2({ userName, onLogout }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm V-Assist. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
      status: 'delivered'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage({ message: inputValue });
      const aiMessage = {
        id: messages.length + 2,
        text: response.data.message,
        sender: 'ai',
        timestamp: new Date(),
        status: 'delivered'
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  };

  const quickReplies = [
    'Tell me about admissions',
    'Financial aid help',
    'Course recommendations',
    'Campus resources'
  ];

  return (
    <div className="chat-premium-v2-container">
      {/* Sidebar */}
      <div className={`chat-sidebar ${showSidebar ? 'active' : ''}`}>
        <div className="sidebar-header glass-card">
          <h2>Conversations</h2>
          <button className="btn-icon">
            <FiPlus />
          </button>
        </div>
        
        <div className="conversations-list">
          {conversationHistory.length === 0 ? (
            <div className="empty-state">
              <p>No conversations yet</p>
              <p className="text-sm">Start chatting to begin</p>
            </div>
          ) : (
            conversationHistory.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''}`}
                onClick={() => setCurrentConversationId(conv.id)}
              >
                <div className="conversation-title">{conv.title}</div>
                <div className="conversation-date">{new Date(conv.lastUpdated).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-main-area">
        {/* Chat Header */}
        <div className="chat-header glass-card">
          <div className="header-content">
            <div className="avatar-with-status">
              <div className="avatar-circle">V</div>
              <span className="status-indicator online"></span>
            </div>
            <div className="header-info">
              <h3>V-Assist</h3>
              <span className="status-text">Online</span>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="btn-icon hover-lift" title="Call">
              <FiPhone />
            </button>
            <button className="btn-icon hover-lift" title="Video Call">
              <FiVideo />
            </button>
            <button className="btn-icon hover-lift" title="More">
              <FiMoreHorizontal />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-area">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-wrapper ${message.sender}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {message.sender === 'ai' && (
                <div className="message-avatar">
                  <div className="avatar-circle sm">V</div>
                </div>
              )}
              
              <div className="message-content">
                <div className={`message-bubble ${message.sender}`}>
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {message.sender === 'user' && (
                  <span className="message-status">{message.status}</span>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-wrapper ai">
              <div className="message-avatar">
                <div className="avatar-circle sm">V</div>
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <div className="quick-replies-section">
            <p>Get started with:</p>
            <div className="quick-replies">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  className="quick-reply-btn"
                  onClick={() => {
                    setInputValue(reply);
                    setMessages(prev => [...prev, {
                      id: prev.length + 1,
                      text: reply,
                      sender: 'user',
                      timestamp: new Date(),
                      status: 'sent'
                    }]);
                  }}
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Area */}
        <div className="chat-input-area glass-card">
          <form onSubmit={handleSendMessage} className="input-form">
            <div className="input-actions">
              <button type="button" className="btn-icon" title="Attach file">
                <FiPaperclip />
              </button>
              <button type="button" className="btn-icon" title="Emoji">
                <FiSmile />
              </button>
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="chat-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleSendMessage(e);
                }
              }}
            />

            <div className="input-actions">
              <button type="button" className="btn-icon" title="Voice message">
                <FiMic />
              </button>
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="btn-icon send-btn"
                title="Send message"
              >
                <FiSend />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
