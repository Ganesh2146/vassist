import React, { useState } from 'react';

export default function ConversationHistory({ isDarkTheme, onLogout }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [newChatTitle, setNewChatTitle] = useState('');

  const handleStartNewChat = (e) => {
    e.preventDefault();
    if (!newChatTitle.trim()) {
      return;
    }
    
    const newConversation = {
      id: Date.now(),
      title: newChatTitle,
      date: new Date().toLocaleDateString(),
      preview: 'New conversation',
      messages: []
    };
    
    setConversations([newConversation, ...conversations]);
    setNewChatTitle('');
    setShowNewChat(false);
  };

  if (selectedConversation) {
    return (
      <main className="flex-grow d-flex flex-column" style={{backgroundColor: isDarkTheme ? '#0F172A' : '#F9FAFB'}}>
        <div className="container-fluid d-flex flex-column h-100" style={{gap: '10px', padding: '15px'}}>
          
          {/* Conversation Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              onClick={() => setSelectedConversation(null)}
              className="btn btn-sm"
              style={{backgroundColor: 'var(--secondary-color)', color: '#FFFFFF', border: 'none'}}
            >
              ← Back to Conversations
            </button>
            <h5 className="mb-0 fw-700" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
              {selectedConversation.title}
            </h5>
            <div style={{width: '100px'}}></div>
          </div>

          {/* Chat Display */}
          <div
            className="card flex-grow-1 overflow-auto rounded-3"
            style={{
              backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF',
              border: 'none'
            }}
          >
            <div className="card-body p-4"  style={{backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB'}}>
              {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                selectedConversation.messages.map((msg, idx) => (
                  <div key={idx} className={`d-flex mb-4 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    {msg.sender === 'ai' && (
                      <div
                        className="me-3 d-flex align-items-center justify-content-center fw-bold text-white"
                        style={{width: '40px', height: '40px', borderRadius: '50%', backgroundImage: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)', flexShrink: 0}}
                      >
                        AI
                      </div>
                    )}
                    <div
                      className="p-3 rounded-3"
                      style={{
                        backgroundColor: msg.sender === 'user' ? 'var(--primary-color)' : isDarkTheme ? '#1F2937' : '#E5E7EB',
                        color: msg.sender === 'user' ? '#FFFFFF' : isDarkTheme ? '#F1F5F9' : '#1F2937',
                        maxWidth: '60%'
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5" style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  <p>No messages in this conversation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow-1" style={{backgroundColor: isDarkTheme ? '#0F172A' : '#F9FAFB', padding: '20px'}}>
      <div className="container-fluid">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h3 className="fw-700 mb-1" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
              Your Conversations
            </h3>
            <p style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
              {conversations.length === 0 ? 'Start your first conversation' : `You have ${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="btn fw-600"
            style={{backgroundColor: 'var(--danger-color)', color: '#FFFFFF', border: 'none'}}
          >
            Logout
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => setShowNewChat(!showNewChat)}
          className="btn btn-lg fw-600 mb-5"
          style={{backgroundColor: 'var(--primary-color)', color: '#FFFFFF', border: 'none', width: '100%'}}
        >
          {showNewChat ? '✕ Cancel' : '+ Start New Conversation'}
        </button>

        {/* New Chat Form */}
        {showNewChat && (
          <div className="card mb-5 shadow-lg" style={{backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF', border: 'none', borderTop: '4px solid var(--primary-color)'}}>
            <div className="card-body p-4">
              <h5 className="fw-700 mb-3" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Start a New Conversation</h5>
              <form onSubmit={handleStartNewChat} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter conversation title..."
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  style={{
                    backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                    borderColor: 'var(--primary-color)',
                    color: isDarkTheme ? '#F1F5F9' : '#1F2937'
                  }}
                />
                <button type="submit" className="btn btn-lg fw-600" style={{backgroundColor: 'var(--primary-color)', color: '#FFFFFF', border: 'none'}}>
                  Create
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Conversations List or Empty State */}
        {conversations.length === 0 ? (
          <div className="text-center py-5">
            <p className="fs-5 fw-600" style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>No conversations yet</p>
            <p style={{color: isDarkTheme ? '#9CA3AF' : '#9CA3AF'}}>Start a new conversation to begin chatting with V-Assist</p>
          </div>
        ) : (
          /* Conversations List */
          <div className="row g-4">
            {conversations.map((conv) => (
              <div key={conv.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100 shadow-sm cursor-pointer"
                  onClick={() => setSelectedConversation(conv)}
                  style={{
                    backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderTop: '4px solid var(--primary-color)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
                  }}
                >
                  <div className="card-body">
                    <h6 className="card-title fw-700 mb-2" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
                      {conv.title || 'Untitled Conversation'}
                    </h6>
                    <p className="card-text small mb-3" style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                      {conv.preview || 'No preview available'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small style={{color: isDarkTheme ? '#9CA3AF' : '#9CA3AF'}}>
                        📅 {conv.date || 'Recently created'}
                      </small>
                      <span style={{color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 600}}>
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
