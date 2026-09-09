import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Bot, Check, CircleAlert,
  Send, ShieldAlert, Sparkles, X
} from 'lucide-react';
import { extractProfileFromText, getApiErrorMessage, sendChatMessage } from '../../services/api.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export function AIAssistantDrawer({ onAutoFillProfile, currentProfile }) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      textKey: 'welcomeAiMessage',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appliedNotification, setAppliedNotification] = useState(false);

  const drawerRef = useRef(null);
  const triggerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const presetChips = [
    { label: t('chip1'), type: 'chat', query: t('chip1') },
    { label: t('chip2'), type: 'chat', query: t('chip2') },
    { label: t('chip3'), type: 'chat', query: t('chip3') },
    { label: t('chip4'), type: 'extract_prompt', query: 'I want to start a small dairy business, my family income is 3 lakh, and I need 2 lakh rupees.' }
  ];

  // Auto-scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isOpen, loading]);

  // Trap keyboard focus & close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  async function handleSend(customText = null, isExtractionMode = false) {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    setError('');
    const userMsg = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      if (isExtractionMode || isExtractionQuery(textToSend)) {
        const res = await extractProfileFromText(textToSend);
        const extractedData = res.data;

        const assistantMsg = {
          id: `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          sender: 'assistant',
          text: language === 'hi' ? 'मैंने आपके प्रॉम्प्ट से निम्नलिखित विवरण निकाले हैं:' : 'I extracted the following details from your prompt:',
          extracted: extractedData,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const res = await sendChatMessage(textToSend, { currentProfile, language });
        const chatData = res.data;

        const assistantMsg = {
          id: `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          sender: 'assistant',
          text: chatData.reply,
          isFallback: chatData.isFallback,
          suggestedQuestions: chatData.suggestedQuestions,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not process message. Please check your network or try again.'));
    } finally {
      setLoading(false);
    }
  }

  function isExtractionQuery(text) {
    const lower = text.toLowerCase();
    return (
      (lower.includes('income') || lower.includes('lakh') || lower.includes('thousand') || lower.includes('rupees') || lower.includes('need') || lower.includes('cost') || lower.includes('आय') || lower.includes('लाख') || lower.includes('रुपये')) &&
      (lower.includes('start') || lower.includes('business') || lower.includes('dairy') || lower.includes('shop') || lower.includes('extract') || lower.includes('earn') || lower.includes('व्यवसाय') || lower.includes('काम'))
    );
  }

  function handleAutoFill(data) {
    if (onAutoFillProfile) {
      onAutoFillProfile(data);
      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 4000);
      handleClose();
    } else {
      handleClose();
      navigate('/discover', { state: { autoFillProfile: data } });
    }
  }

  return (
    <>
      {/* Floating Support Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        className="ai-widget-trigger focus-ring"
        onClick={handleOpen}
        aria-label="Open AI Assistant Chat"
        aria-expanded={isOpen}
      >
        <span className="ai-widget-icon">
          <Sparkles size={20} />
        </span>
        <span className="ai-widget-label">{t('aiWidgetLabel')}</span>
      </button>

      {/* Slide-out Conversational Drawer Overlay */}
      {isOpen && (
        <div className="ai-drawer-overlay" onClick={handleClose}>
          <div
            ref={drawerRef}
            className="ai-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="ArthSaathi AI Assistant"
          >
            {/* Header */}
            <div className="ai-drawer-header">
              <div className="ai-header-brand">
                <span className="ai-brand-badge">
                  <Bot size={20} />
                </span>
                <div>
                  <h3>{t('aiHeaderTitle')}</h3>
                  <span className="ai-subhead">{t('aiHeaderSubhead')}</span>
                </div>
              </div>
              <button
                type="button"
                className="ai-close-button focus-ring"
                onClick={handleClose}
                aria-label="Close AI Assistant drawer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Disclaimer Banner */}
            <div className="ai-disclaimer-strip">
              <ShieldAlert size={15} />
              <span>{t('aiDisclaimerBanner')}</span>
            </div>

            {/* Auto-fill notification alert if triggered */}
            {appliedNotification && (
              <div className="ai-toast-success">
                <Check size={16} /> {t('autofillSuccessToast')}
              </div>
            )}

            {/* Message Area */}
            <div className="ai-messages-container" aria-live="polite">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`ai-message-row ${msg.sender === 'user' ? 'user-row' : 'assistant-row'}`}
                >
                  <div className={`ai-message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
                    {msg.sender === 'assistant' && (
                      <div className="ai-bubble-header">
                        <Sparkles size={14} />
                        <strong>ArthSaathi AI</strong>
                        {msg.isFallback && (
                          <span className="badge badge-fallback">{t('offlineFallbackBadge')}</span>
                        )}
                      </div>
                    )}
                    <p className="ai-message-text">{msg.textKey ? t(msg.textKey) : msg.text}</p>

                    {/* Extracted Profile CTA Card */}
                    {msg.extracted && (
                      <div className="ai-extracted-card">
                        <div className="extracted-title">
                          <Check size={16} /> Extracted Parameters
                        </div>
                        <div className="extracted-grid">
                          {msg.extracted.projectType && (
                            <div><span>Project Type:</span> <strong>{msg.extracted.projectType}</strong></div>
                          )}
                          {msg.extracted.income !== undefined && (
                            <div><span>Annual Income:</span> <strong>₹{msg.extracted.income.toLocaleString('en-IN')}</strong></div>
                          )}
                          {msg.extracted.requestedLoanAmount !== undefined && (
                            <div><span>Loan Needed:</span> <strong>₹{msg.extracted.requestedLoanAmount.toLocaleString('en-IN')}</strong></div>
                          )}
                          {msg.extracted.projectCost !== undefined && (
                            <div><span>Project Cost:</span> <strong>₹{msg.extracted.projectCost.toLocaleString('en-IN')}</strong></div>
                          )}
                          {msg.extracted.beneficiaryCategory && (
                            <div><span>Category:</span> <strong>{msg.extracted.beneficiaryCategory}</strong></div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="button button-primary button-sm autofill-btn focus-ring"
                          onClick={() => handleAutoFill(msg.extracted)}
                        >
                          {t('autofillCtaBtn')} <ArrowRight size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="ai-message-row assistant-row">
                  <div className="ai-message-bubble assistant-bubble loading-bubble">
                    <Sparkles size={14} className="spin-icon" /> {t('aiThinking')}
                  </div>
                </div>
              )}

              {error && (
                <div className="ai-error-box">
                  <CircleAlert size={16} /> {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Chips */}
            <div className="ai-chips-strip">
              <span className="chips-label">{t('suggestedLabel')}</span>
              <div className="chips-scroll">
                {presetChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="ai-chip-button focus-ring"
                    onClick={() => handleSend(chip.query, chip.type === 'extract_prompt')}
                    disabled={loading}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              className="ai-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                className="ai-chat-input focus-ring"
                placeholder={t('inputPlaceholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                aria-label="Message input"
              />
              <button
                type="submit"
                className="ai-send-button focus-ring"
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
