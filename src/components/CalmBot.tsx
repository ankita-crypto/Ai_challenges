import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, RefreshCw, Send } from 'lucide-react';
import { CBT_FLOWS, type BotStep } from '../utils/cbtBotLogic';
import type { ToolActionEffect } from '../types/wellness';
import { sanitizePlainText, sanitizeText, SECURITY_LIMITS } from '../utils/security';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

interface CalmBotProps {
  onTriggerAction: (action: ToolActionEffect) => void;
}

export const CalmBot: React.FC<CalmBotProps> = ({ onTriggerAction }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'bot',
      text: CBT_FLOWS.start.text
    }
  ]);
  const [currentStep, setCurrentStep] = useState<BotStep>(CBT_FLOWS.start);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [textInputValue, setTextInputValue] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const messageCounterRef = useRef(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleStepTransition = (nextStepId: string, userResponseText: string) => {
    const safeUserText = sanitizeText(userResponseText, SECURITY_LIMITS.chatMessage);
    messageCounterRef.current += 1;
    const userMsgId = `user_${messageCounterRef.current}`;
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: safeUserText }]);
    
    setIsTyping(true);

    const nextStep = CBT_FLOWS[nextStepId] || CBT_FLOWS.start;

    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);
      
      messageCounterRef.current += 1;
      const botMsgId = `bot_${messageCounterRef.current}`;
      setMessages(prev => [...prev, { id: botMsgId, sender: 'bot', text: nextStep.text }]);
      
      if (nextStep.actionEffect) {
        onTriggerAction(nextStep.actionEffect);
      }

      setCurrentStep(nextStep);
    }, 1000);
  };

  const handleOptionClick = (optionText: string, nextStepId: string) => {
    handleStepTransition(nextStepId, optionText);
  };

  const handleTextInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInputValue.trim()) return;

    const userInput = sanitizeText(textInputValue, SECURITY_LIMITS.chatMessage);
    setTextInputValue('');

    // Determine next step
    // In our state machine:
    // mock_1 -> mock_2 (via its transition option, or next default step in tree)
    // backlog_1 -> backlog_all / backlog_2
    let nextStepId = 'start';
    if (currentStep.id === 'mock_1') {
      nextStepId = 'mock_2';
    } else if (currentStep.id === 'backlog_1') {
      nextStepId = 'backlog_2';
    } else if (currentStep.id === 'backlog_2') {
      nextStepId = 'backlog_action';
    }

    handleStepTransition(nextStepId, userInput);
  };

  const handleReset = () => {
    messageCounterRef.current += 1;
    setMessages([
      {
        id: `reset_${messageCounterRef.current}`,
        sender: 'bot',
        text: CBT_FLOWS.start.text
      }
    ]);
    setCurrentStep(CBT_FLOWS.start);
    setIsTyping(false);
    setTextInputValue('');
  };

  return (
    <div className="calmbot-layout glass-panel slide-in">
      <header className="bot-header">
        <div className="bot-header-title">
          <MessageSquare className="bot-header-icon" size={22} />
          <div className="bot-meta">
            <h3>CalmBot Wellness Coach</h3>
            <span className="bot-status">
              <span className="status-dot animate-pulse" />
              Online • Empathetic CBT Support
            </span>
          </div>
        </div>
        <button 
          onClick={handleReset} 
          className="glass-btn reset-chat-btn"
          aria-label="Restart conversation"
        >
          <RefreshCw size={14} />
          Reset Chat
        </button>
      </header>

      {/* Messages area */}
      <div className="chat-messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
            <div className={`chat-bubble ${msg.sender}`}>
              <p className="bubble-text">{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble-wrapper bot">
            <div className="chat-bubble bot typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input / Options Area */}
      <footer className="chat-footer">
        {/* Render buttons if options exist and not typing */}
        {!isTyping && currentStep.options && currentStep.options.length > 0 && (
          <div className="chat-options-container" role="group" aria-label="CalmBot response options">
            {currentStep.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(opt.text, opt.nextStepId)}
                className="glass-btn chat-option-btn"
              >
                {opt.text}
              </button>
            ))}
          </div>
        )}

        {/* Render text input form if required and not typing */}
        {!isTyping && currentStep.requiresTextInput && (
          <form onSubmit={handleTextInputSubmit} className="chat-input-form">
            <input
              type="text"
              value={textInputValue}
              onChange={(e) => setTextInputValue(sanitizePlainText(e.target.value, SECURITY_LIMITS.chatMessage))}
              placeholder={currentStep.textPlaceholder || "Type your response..."}
              className="glass-input chat-text-input"
              aria-label="CalmBot reflection response"
              maxLength={SECURITY_LIMITS.chatMessage}
              required
            />
            <button type="submit" className="glass-btn glass-btn-primary chat-submit-btn" aria-label="Send message">
              <Send size={18} />
            </button>
          </form>
        )}
      </footer>

      <style>{`
        .calmbot-layout {
          display: flex;
          flex-direction: column;
          height: 600px;
          padding: 0;
          overflow: hidden;
        }

        .bot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--glass-border);
          background: rgba(0, 0, 0, 0.15);
        }

        .bot-header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bot-header-icon {
          color: var(--color-primary);
        }

        .bot-meta h3 {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .bot-status {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: var(--color-success);
          border-radius: 50%;
        }

        .reset-chat-btn {
          padding: 6px 12px;
          font-size: 0.8rem;
          border-radius: 8px;
        }

        /* Chat history area */
        .chat-messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chat-messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .chat-bubble-wrapper {
          display: flex;
          width: 100%;
        }

        .chat-bubble-wrapper.bot {
          justify-content: flex-start;
        }

        .chat-bubble-wrapper.user {
          justify-content: flex-end;
        }

        .chat-bubble {
          max-width: 80%;
          padding: 12px 18px;
          border-radius: 18px;
          font-size: 0.95rem;
          line-height: 1.45;
        }

        .chat-bubble.bot {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-top-left-radius: 4px;
          color: var(--text-primary);
        }

        [data-theme="light"] .chat-bubble.bot {
          background: #f1f5f9;
          border-color: rgba(99, 102, 241, 0.05);
        }

        .chat-bubble.user {
          background: var(--color-primary);
          color: #ffffff;
          border-top-right-radius: 4px;
          box-shadow: 0 4px 10px var(--color-primary-glow);
        }

        .bubble-text {
          white-space: pre-wrap;
        }

        /* Typing indicator styling */
        .typing-bubble {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 20px;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background: var(--text-muted);
          border-radius: 50%;
          display: inline-block;
          animation: typing-bounce 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        /* Footer Options & Input styling */
        .chat-footer {
          padding: 16px 20px;
          border-top: 1px solid var(--glass-border);
          background: rgba(0, 0, 0, 0.1);
        }

        .chat-options-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: flex-start;
        }

        .chat-option-btn {
          font-size: 0.85rem;
          padding: 8px 16px;
          border-radius: 50px;
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.2);
          text-align: left;
          font-weight: 500;
        }

        .chat-option-btn:hover {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }

        .chat-input-form {
          display: flex;
          gap: 10px;
          width: 100%;
        }

        .chat-text-input {
          flex: 1;
        }

        .chat-submit-btn {
          width: 46px;
          height: 46px;
          padding: 0;
          border-radius: var(--btn-radius);
        }
      `}</style>
    </div>
  );
};
