import React, { useState, useRef, useEffect } from 'react';
import './ChatPremium.css';

const ChatPremium = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm V-Assist, your AI companion. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(Date.now() - 5000)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "That's a great question! I'm here to help you with academic support, counseling, and personal growth. Feel free to ask me anything!",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const quickReplies = [
    "Academic Help",
    "Counseling Services",
    "Appointment Booking",
    "Career Guidance"
  ];

  return (
    <div className="chat-premium-container">
      {/* Chat Header */}
      <div className="chat-premium-header">
        <div className="header-left">
          <div className="avatar-circle">
            <i className="fas fa-robot"></i>
          </div>
          <div className="header-info">
            <h2>V-Assist</h2>
            <span className="status-indicator">
              <i className="fas fa-circle"></i> Online
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="header-btn">
            <i className="fas fa-phone"></i>
          </button>
          <button className="header-btn">
            <i className="fas fa-video"></i>
          </button>
          <button className="header-btn">
            <i className="fas fa-info-circle"></i>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-premium-messages">
        {messages.map((message, index) => (
          <div key={message.id} className={`message-wrapper ${message.sender}`}>
            <div className={`message-bubble ${message.sender}`}>
              <p>{message.text}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-wrapper bot">
            <div className="message-bubble bot">
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

      {/* Quick Replies */}
      {messages.length === 1 && (
        <div className="quick-replies">
          <p>Quick start:</p>
          <div className="quick-reply-buttons">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                className="quick-reply-btn"
                onClick={() => setInputValue(reply)}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="chat-premium-input">
        <div className="input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="chat-input-field"
          />
          <div className="input-actions">
            <button type="button" className="action-btn">
              <i className="fas fa-paperclip"></i>
            </button>
            <button type="button" className="action-btn">
              <i className="fas fa-smile"></i>
            </button>
            <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatPremium;
