import React, { useState } from 'react';
import { 
  Smile, 
  Trash2,
  Calendar,
  AlertTriangle,
  FileText,
  Plus
} from 'lucide-react';
import type { MoodId, MoodLog, TriggerId } from '../types/wellness';
import { MOOD_TYPES, TRIGGER_OPTIONS } from '../utils/wellnessData';
import { isValidMoodId, isValidTriggerId, sanitizePlainText, sanitizeText, SECURITY_LIMITS } from '../utils/security';

interface MoodTrackerProps {
  moodLogs: MoodLog[];
  onAddLog: (log: MoodLog) => void;
  onDeleteLog: (id: string) => void;
}

const JOURNAL_TEMPLATES = [
  {
    name: "General CBT Reflection",
    text: "1. What happened to trigger your stress?\n- \n\n2. What is the automatic negative thought you are having?\n- \n\n3. What are the objective facts (not feelings) that challenge this thought?\n- \n\n4. What is a more balanced, realistic way to look at this situation?\n- "
  },
  {
    name: "Mock Test Analysis",
    text: "1. What was your mock test score/result?\n- \n\n2. What does this score make you feel about your worth/future?\n- \n\n3. What specific topics/mistakes does this score highlight for improvement?\n- \n\n4. Action Plan: What 3 things will you revise tomorrow?\n- "
  },
  {
    name: "Gratitude & Control",
    text: "1. What are 3 things within your direct control today?\n- \n\n2. What are 2 things you are grateful for today?\n- \n\n3. What is 1 small win you achieved today?\n- "
  }
];

export const MoodTracker: React.FC<MoodTrackerProps> = ({
  moodLogs,
  onAddLog,
  onDeleteLog
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodId | ''>('');
  const [selectedTriggers, setSelectedTriggers] = useState<TriggerId[]>([]);
  const [journalNote, setJournalNote] = useState<string>('');
  const [activeTemplate, setActiveTemplate] = useState<number>(-1);
  const [formError, setFormError] = useState<string>('');

  const handleMoodSelect = (moodId: MoodId) => {
    if (!isValidMoodId(moodId)) {
      setFormError('Invalid mood selection.');
      return;
    }

    setSelectedMood(moodId);
    setFormError('');
  };

  const handleTriggerToggle = (triggerId: TriggerId) => {
    if (!isValidTriggerId(triggerId)) {
      return;
    }

    setSelectedTriggers(prev => 
      prev.includes(triggerId) 
        ? prev.filter(t => t !== triggerId) 
        : [...prev, triggerId]
    );
  };

  const applyTemplate = (index: number) => {
    if (index === -1) {
      setJournalNote('');
    } else {
      setJournalNote(sanitizePlainText(JOURNAL_TEMPLATES[index].text, SECURITY_LIMITS.journalNote));
    }
    setActiveTemplate(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      setFormError('Please select a mood that represents your state.');
      return;
    }

    const moodObj = MOOD_TYPES.find(m => m.id === selectedMood);

    const safeNotes = sanitizeText(journalNote, SECURITY_LIMITS.journalNote);
    const newLog: MoodLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood: selectedMood,
      rating: moodObj ? moodObj.rating : 3,
      triggers: selectedTriggers,
      notes: safeNotes
    };

    onAddLog(newLog);

    // Reset Form
    setSelectedMood('');
    setSelectedTriggers([]);
    setJournalNote('');
    setActiveTemplate(-1);
    setFormError('');
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mood-tracker-layout slide-in">
      <div className="grid-2">
        {/* Check-In Form */}
        <section className="form-panel glass-panel">
          <h2 className="panel-title">Daily Mental Check-In</h2>
          <p className="panel-subtitle">Pause for a moment to evaluate your current state. Tracking helps identify patterns.</p>

          <form onSubmit={handleSubmit} className="checkin-form">
            {/* Mood selector */}
            <div className="form-section">
              <label className="section-label" id="mood-selector-label">1. How are you feeling right now?</label>
              <div className="mood-options-grid" role="radiogroup" aria-labelledby="mood-selector-label">
                {MOOD_TYPES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleMoodSelect(m.id)}
                    className={`mood-card-btn ${selectedMood === m.id ? 'active' : ''}`}
                    style={{ '--mood-color': m.color } as React.CSSProperties}
                    role="radio"
                    aria-checked={selectedMood === m.id}
                  >
                    <span className="mood-emoji" role="img" aria-label={m.label}>{m.emoji}</span>
                    <span className="mood-btn-label">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Triggers Checklist */}
            <div className="form-section">
              <label className="section-label" id="trigger-selector-label">2. Identify what is contributing to your stress (Triggers):</label>
              <div className="triggers-flex" aria-labelledby="trigger-selector-label">
                {TRIGGER_OPTIONS.map((t) => {
                  const isChecked = selectedTriggers.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTriggerToggle(t.id)}
                      className={`trigger-tag-btn ${isChecked ? 'active' : ''}`}
                      aria-pressed={isChecked}
                    >
                      {isChecked && <Plus size={12} className="tag-icon" />}
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CBT Journal */}
            <div className="form-section">
              <div className="journal-header-row">
                <label className="section-label">3. Emotion Reflection & Journaling</label>
                <div className="template-selectors">
                  <span className="template-label">Use Guide:</span>
                  {JOURNAL_TEMPLATES.map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyTemplate(idx)}
                      className={`template-btn ${activeTemplate === idx ? 'active' : ''}`}
                    >
                      {tpl.name.split(' ')[0]}
                    </button>
                  ))}
                  {activeTemplate !== -1 && (
                    <button
                      type="button"
                      onClick={() => applyTemplate(-1)}
                      className="template-btn clear-tpl"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={journalNote}
                onChange={(e) => setJournalNote(sanitizePlainText(e.target.value, SECURITY_LIMITS.journalNote))}
                placeholder="Write down your thoughts. If using a guide above, answer the prompts to challenge stressful thoughts..."
                className="glass-input journal-textarea"
                aria-label="Emotion reflection journal"
                maxLength={SECURITY_LIMITS.journalNote}
                rows={8}
              />
            </div>

            {formError && (
              <div className="error-message">
                <AlertTriangle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <button type="submit" className="glass-btn glass-btn-primary submit-checkin">
              Save Check-In Entry
            </button>
          </form>
        </section>

        {/* History Log */}
        <section className="history-panel glass-panel">
          <h2 className="panel-title">Your Wellness History</h2>
          <p className="panel-subtitle">Review your past logs to see how your emotions evolve over time.</p>

          <div className="logs-history-list">
            {moodLogs.length === 0 ? (
              <div className="empty-history">
                <Smile size={48} className="empty-icon" />
                <p>No check-in logs recorded yet.</p>
                <span>Logs you save will appear here in reverse chronological order.</span>
              </div>
            ) : (
              [...moodLogs]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((log) => {
                  const moodObj = MOOD_TYPES.find(m => m.id === log.mood);
                  return (
                    <div key={log.id} className="history-card">
                      <div className="history-card-header">
                        <div className="history-mood-badge">
                          <span className="history-emoji">{moodObj?.emoji || '📝'}</span>
                          <div className="history-mood-meta">
                            <span className="history-mood-name">{moodObj?.label || log.mood}</span>
                            <span className="history-date-span">
                              <Calendar size={12} className="meta-icon" />
                              {formatDate(log.date)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteLog(log.id)}
                          className="delete-log-btn"
                          aria-label="Delete check-in log"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {log.triggers && log.triggers.length > 0 && (
                        <div className="history-card-triggers">
                          {log.triggers.map((tId) => {
                            const trg = TRIGGER_OPTIONS.find(o => o.id === tId);
                            return (
                              <span key={tId} className="history-trigger-badge">
                                {trg ? trg.label : tId}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {log.notes && (
                        <div className="history-card-notes">
                          <FileText size={12} className="note-icon" />
                          <p className="note-text-preview">{log.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </section>
      </div>

      <style>{`
        .mood-tracker-layout {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .panel-title {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .panel-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .checkin-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .section-label {
          font-family: var(--font-header);
          font-weight: 600;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .mood-options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (min-width: 480px) {
          .mood-options-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .mood-card-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          border-radius: var(--btn-radius);
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: var(--text-secondary);
          transition: var(--transition-smooth);
        }

        .mood-card-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }

        .mood-card-btn.active {
          color: var(--text-primary);
          background: var(--color-primary-glow);
          border-color: var(--mood-color);
          box-shadow: 0 0 12px var(--mood-color);
        }

        .mood-emoji {
          font-size: 1.8rem;
        }

        .mood-btn-label {
          font-size: 0.75rem;
          font-weight: 500;
          text-align: center;
        }

        .triggers-flex {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .trigger-tag-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 8px 14px;
          border-radius: 50px;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition-smooth);
        }

        .trigger-tag-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-primary);
        }

        .trigger-tag-btn.active {
          background: rgba(13, 148, 136, 0.15);
          border-color: var(--color-secondary);
          color: #2dd4bf;
        }

        .tag-icon {
          animation: pulse-ring 1.5s infinite;
        }

        .journal-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .template-selectors {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .template-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .template-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .template-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
        }

        .template-btn.active {
          background: rgba(168, 85, 247, 0.15);
          border-color: var(--color-accent);
          color: #c084fc;
        }

        .clear-tpl {
          color: var(--color-danger);
          border-color: rgba(239, 68, 68, 0.2);
        }

        .clear-tpl:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .journal-textarea {
          font-size: 0.9rem;
          line-height: 1.5;
          resize: vertical;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: var(--btn-radius);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          font-size: 0.85rem;
        }

        .submit-checkin {
          padding: 14px 20px;
          font-size: 1rem;
        }

        .logs-history-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 550px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .logs-history-list::-webkit-scrollbar {
          width: 6px;
        }

        .logs-history-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .empty-history {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 48px 24px;
          color: var(--text-muted);
          gap: 12px;
        }

        .empty-icon {
          color: var(--glass-border);
        }

        .empty-history p {
          font-family: var(--font-header);
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .empty-history span {
          font-size: 0.8rem;
        }

        .history-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--glass-border);
          border-radius: var(--btn-radius);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: var(--transition-smooth);
        }

        .history-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.03);
        }

        .history-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .history-mood-badge {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .history-emoji {
          font-size: 1.5rem;
        }

        .history-mood-meta {
          display: flex;
          flex-direction: column;
        }

        .history-mood-name {
          font-family: var(--font-header);
          font-weight: 600;
          font-size: 0.95rem;
        }

        .history-date-span {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        .delete-log-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: var(--transition-smooth);
        }

        .delete-log-btn:hover {
          color: var(--color-danger);
          background: rgba(239, 68, 68, 0.1);
        }

        .history-card-triggers {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .history-trigger-badge {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 50px;
          color: var(--text-secondary);
        }

        .history-card-notes {
          background: rgba(0, 0, 0, 0.15);
          padding: 10px 12px;
          border-radius: 8px;
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }

        .note-icon {
          color: var(--color-primary);
          margin-top: 3px;
          flex-shrink: 0;
        }

        .note-text-preview {
          font-size: 0.85rem;
          color: var(--text-secondary);
          white-space: pre-line;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};
