import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiArrowLeft, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { chatAPI } from '../api/config';
import TopNav from './TopNav';
import PageTransition from './PageTransition';
import './Chat.css';

// Optimized markdown parser
const parseMarkdown = (text) => {
  if (!text || typeof text !== 'string') return text;
  if (!/[\*_`\-\n]/.test(text)) return text;
  
  let result = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^ ][\s\S]*?[^ ]|[^ ])\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<em>$1</em>')
    .replace(/_([^ ][\s\S]*?[^ ])_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  return result;
};

// Memoized markdown component
const MarkdownText = memo(({ text }) => {
  const parsed = useMemo(() => parseMarkdown(text), [text]);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: parsed }}
      style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}
    />
  );
});

export default function MentalHealthChat({ userName, onLogout }) {
  const navigate = useNavigate();

  const MAX_QUESTIONS = 6; // Number of questions before analysis

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [assessmentPhase, setAssessmentPhase] = useState('questions');
  const [questionCount, setQuestionCount] = useState(0);
  const [conversationId, setConversationId] = useState(null);
  const [userResponses, setUserResponses] = useState([]);
  const messagesEndRef = useRef(null);

  // Initialize with first question on component mount
  useEffect(() => {
    initializeAssessment();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const initializeAssessment = async () => {
    try {
      setLoading(true);
      
      // Display initial greeting and first question
      const firstQuestion = "How have you been feeling lately?";
      
      setMessages([{
        id: 1,
        text: "Hello! I'm your mental health assistant. I'd like to understand your current mental wellness by asking a few thoughtful questions. This is a confidential, supportive assessment.\n\n" + firstQuestion,
        sender: 'ai'
      }]);
      setQuestionCount(0);
      setConversationId(null); // Will be created on first message
    } catch (error) {
      console.error('Error initializing assessment:', error);
      toast.error('Failed to start assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getNextDynamicQuestion = async () => {
    if (!conversationId) {
      console.warn('Conversation ID not yet established');
      return;
    }
    
    try {
      setLoading(true);
      const response = await chatAPI.getNextMentalHealthQuestion(conversationId, questionCount);
      
      if (response.data && response.data.status === 'success') {
        const nextQuestion = response.data.data.question;
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: nextQuestion,
          sender: 'ai'
        }]);
        setQuestionCount(response.data.data.questionCount || questionCount + 1);
      } else {
        throw new Error('Failed to get next question');
      }
    } catch (error) {
      console.error('Error getting next question:', error);
      toast.error('Failed to generate next question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeResponses = async () => {
    try {
      setLoading(true);
      
      const analysisPrompt = `Based on the following student responses during a mental health assessment, provide a comprehensive and compassionate analysis:

${userResponses.map((r, i) => `Exchange ${i + 1}:\nQ: ${r.question}\nA: ${r.response}`).join('\n\n')}

Please provide:
1. Overall Mental Health Assessment (brief summary - 2-3 sentences)
2. Key Findings (2-3 main observations about their mental state)
3. Positive Strengths (what seems to be working well for them)
4. Areas of Concern (if any, presented compassionately)
5. Personalized Recommendations (2-3 actionable suggestions)
6. Resources/Support Suggestions (campus resources or general support options)

Format the response in a warm, supportive manner suitable for a student. Use **bold** for important points and break into clear sections.`;

      console.log('🧠 Sending mental health analysis request...');
      const response = await chatAPI.sendMessage(analysisPrompt, conversationId, 'mental_health_analysis');

      if (response.data && response.data.status === 'success') {
        const analysisText = response.data.data.response;
        setAssessmentPhase('analysis');
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: "Thank you for sharing so openly. Here's your personalized mental health assessment:\n\n" + analysisText,
          sender: 'ai'
        }]);
        toast.success('Assessment complete! 💚');
      } else {
        throw new Error(response.data?.message || 'Failed to get analysis');
      }
    } catch (error) {
      console.error('❌ Analysis error:', error);
      toast.error(error.userMessage || error.message || 'Failed to analyze responses. Please try again.');
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "I apologize, but I encountered an error while analyzing your responses. Please try again or contact support.",
        sender: 'ai'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessageText = inputValue.trim();
    setInputValue('');

    // Add user message to display
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: userMessageText,
      sender: 'user'
    }]);

    // Get the last AI message (the question)
    const lastAIMessage = [...messages].reverse().find(m => m.sender === 'ai');
    const question = lastAIMessage?.text || 'Assessment question';

    // Store the response
    const newResponses = [...userResponses, {
      question: question,
      response: userMessageText
    }];
    setUserResponses(newResponses);

    // Store message to database via API to establish conversation
    try {
      const response = await chatAPI.sendMessage(userMessageText, conversationId, 'mental_health_analysis');
      
      // Update conversation ID if this is the first message
      if (response.data && response.data.data.conversation_id && !conversationId) {
        setConversationId(response.data.data.conversation_id);
      }
    } catch (error) {
      console.error('Error storing message:', error);
    }

    // Check if assessment is complete
    if (questionCount < MAX_QUESTIONS) {
      // Get next dynamic question
      setTimeout(() => {
        getNextDynamicQuestion();
      }, 800);
    } else {
      // Assessment complete - analyze
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Thank you for sharing your thoughts. Let me analyze your responses and provide personalized insights...",
        sender: 'ai'
      }]);
      
      setTimeout(() => {
        analyzeResponses();
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <PageTransition>
      <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
        <TopNav />

        <main className="flex-grow-1 d-flex flex-column" style={{ paddingTop: '80px' }}>
          {/* Header */}
          <div className="bg-light border-bottom p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-link text-primary p-0 d-flex align-items-center gap-2"
                >
                  <FiArrowLeft size={20} />
                  Back
                </button>
                <div>
                  <h2 className="mb-0 fw-bold text-dark">Mental Health Assessment</h2>
                  <p className="text-muted mb-0 small mt-1">
                    {assessmentPhase === 'questions' 
                      ? `Personalized Assessment - Adaptive Questions`
                      : 'Assessment Complete - Your Analysis'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-light rounded-circle p-2"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column" style={{ backgroundColor: 'var(--bg-main)' }}>
            <div className="mb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div
                    className={`p-3 rounded-3 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'surface-card text-dark border border-subtle'
                    }`}
                    style={{
                      maxWidth: '75%',
                      wordWrap: 'break-word',
                      backgroundColor: msg.sender === 'user' ? 'var(--primary-color)' : 'var(--bg-surface)',
                    }}
                  >
                    {msg.sender === 'ai' ? <MarkdownText text={msg.text} /> : msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="p-3 rounded-3 surface-card border border-subtle">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-top p-4" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <div className="d-flex gap-3 align-items-flex-end">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={assessmentPhase === 'analysis' 
                  ? "Assessment complete. Feel free to ask follow-up questions..." 
                  : "Share your thoughts..."}
                className="form-control rounded-3"
                rows="3"
                disabled={loading}
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-main)',
                  resize: 'none'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputValue.trim()}
                className="btn btn-primary rounded-3 p-3 flex-shrink-0"
              >
                <FiArrowRight size={20} />
              </button>
            </div>
            {assessmentPhase === 'analysis' && (
              <div className="mt-3 d-flex gap-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-outline-primary rounded-pill flex-grow-1"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => {
                    setMessages([]);
                    setQuestionCount(0);
                    setUserResponses([]);
                    setAssessmentPhase('questions');
                    setInputValue('');
                    initializeAssessment();
                  }}
                  className="btn btn-outline-secondary rounded-pill flex-grow-1"
                >
                  New Assessment
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
