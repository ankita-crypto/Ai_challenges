import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Brain, 
  ArrowRight,
  BookOpen,
  Coffee
} from 'lucide-react';
import { EXAMS, examTips, DAILY_AFFIRMATIONS, type WellnessTip } from '../utils/wellnessTips';

interface DashboardProps {
  userName: string;
  setUserName: (name: string) => void;
  targetExam: string;
  setTargetExam: (exam: string) => void;
  moodLogs: any[];
  setActiveTab: (tab: string) => void;
  pomodoroCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userName,
  setUserName,
  targetExam,
  setTargetExam,
  moodLogs,
  setActiveTab,
  pomodoroCount
}) => {
  const [affirmation, setAffirmation] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // Pick a stable affirmation for the day
  useEffect(() => {
    const dayIndex = new Date().getDate() % DAILY_AFFIRMATIONS.length;
    setAffirmation(DAILY_AFFIRMATIONS[dayIndex]);
  }, []);

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setEditingName(false);
    }
  };

  // Calculations for stats
  const checkInStreak = () => {
    if (moodLogs.length === 0) return 0;
    
    // Sort logs descending by date
    const sortedLogs = [...moodLogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let expectedDate = new Date();
    expectedDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date);
      logDate.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(expectedDate.getTime() - logDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        streak++;
        // Prepare expected date as yesterday
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else if (diffDays === 1) {
        streak++;
        expectedDate = logDate;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break; // Streak broken
      }
    }
    return streak;
  };

  const getRecentMood = () => {
    if (moodLogs.length === 0) return 'No check-ins yet';
    const sorted = [...moodLogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const lastMood = sorted[0].mood;
    const moodMap: Record<string, string> = {
      calm: 'Calm & Focused 🌿',
      energetic: 'Energized ⚡',
      stressed: 'Stressed / Anxious 😰',
      burned_out: 'Exhausted / Burned Out 🔋',
      uncertain: 'Uncertain / Doubting 🌫️'
    };
    return moodMap[lastMood] || lastMood;
  };

  const tips: WellnessTip[] = examTips[targetExam] || examTips['GENERAL'];

  return (
    <div className="dashboard-layout slide-in">
      {/* Welcome & Name Setting */}
      <header className="welcome-banner glass-panel">
        <div className="welcome-text-area">
          {editingName ? (
            <form onSubmit={handleNameSave} className="name-form">
              <input 
                type="text" 
                value={tempName} 
                onChange={(e) => setTempName(e.target.value)}
                className="glass-input name-input"
                maxLength={20}
                autoFocus
              />
              <button type="submit" className="glass-btn glass-btn-primary save-btn">Save</button>
            </form>
          ) : (
            <h2 className="welcome-title">
              Welcome, <span className="highlight-text" onClick={() => setEditingName(true)} title="Click to edit name">{userName}</span>!
            </h2>
          )}
          <p className="welcome-sub">
            Your prep journey for <span className="exam-badge">{EXAMS.find(e => e.id === targetExam)?.name || targetExam}</span> is a marathon, not a sprint. Take it one breath at a time.
          </p>
        </div>
        <div className="exam-select-area">
          <label htmlFor="exam-select" className="select-label">Focus Exam:</label>
          <select 
            id="exam-select"
            value={targetExam} 
            onChange={(e) => setTargetExam(e.target.value)}
            className="glass-input exam-dropdown"
          >
            {EXAMS.map(exam => (
              <option key={exam.id} value={exam.id}>{exam.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Daily Affirmation Card */}
      <section className="affirmation-card glass-panel">
        <div className="card-header">
          <Sparkles className="affirmation-icon" size={20} />
          <h3>Affirmation for Today</h3>
        </div>
        <p className="affirmation-text">"{affirmation}"</p>
      </section>

      {/* Grid of Statistics and Quick Actions */}
      <div className="grid-2 dashboard-grid">
        {/* Statistics */}
        <section className="stats-panel glass-panel">
          <h3>Your Wellness Metrics</h3>
          <div className="stats-container">
            <div className="stat-card">
              <Flame className="stat-icon streak-icon" size={24} />
              <div className="stat-data">
                <span className="stat-value">{checkInStreak()} Days</span>
                <span className="stat-label">Check-In Streak</span>
              </div>
            </div>
            
            <div className="stat-card">
              <Brain className="stat-icon mood-icon" size={24} />
              <div className="stat-data">
                <span className="stat-value">{getRecentMood()}</span>
                <span className="stat-label">Last Recorded Mood</span>
              </div>
            </div>

            <div className="stat-card">
              <CheckCircle2 className="stat-icon study-icon" size={24} />
              <div className="stat-data">
                <span className="stat-value">{pomodoroCount} Sessions</span>
                <span className="stat-label">Focus Timers Completed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="actions-panel glass-panel">
          <h3>Quick-Start Tools</h3>
          <div className="quick-actions-list">
            <button onClick={() => setActiveTab('tracker')} className="action-row">
              <div className="action-info">
                <span className="action-title">Log Today's Mood</span>
                <span className="action-desc">Check-in triggers and write your journal</span>
              </div>
              <ArrowRight size={18} />
            </button>
            
            <button onClick={() => setActiveTab('bot')} className="action-row">
              <div className="action-info">
                <span className="action-title">Chat with CalmBot</span>
                <span className="action-desc">Talk through exam anxieties using CBT exercises</span>
              </div>
              <ArrowRight size={18} />
            </button>

            <button onClick={() => setActiveTab('tools')} className="action-row">
              <div className="action-info">
                <span className="action-title">Mindfulness Exercises</span>
                <span className="action-desc">Box breathing, 5-4-3-2-1 technique, study timer</span>
              </div>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </div>

      {/* Custom Exam Tips */}
      <section className="exam-tips-section glass-panel">
        <div className="tips-section-header">
          <BookOpen size={22} className="tips-icon" />
          <h3>Stress Relief Guide for {EXAMS.find(e => e.id === targetExam)?.name}</h3>
        </div>
        <div className="tips-grid">
          {tips.map((tip) => (
            <div key={tip.id} className="tip-card">
              <div className="tip-header-row">
                <span className="tip-category-badge">{tip.category}</span>
                <h4 className="tip-title">{tip.title}</h4>
              </div>
              <p className="tip-content">{tip.content}</p>
              <div className="action-step-container">
                <div className="action-step-header">
                  <Coffee size={14} className="action-icon" />
                  <span>Coping Exercise</span>
                </div>
                <p className="action-step-text">{tip.actionableStep}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .dashboard-layout {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .welcome-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .welcome-text-area {
          flex: 1;
          min-width: 280px;
        }

        .welcome-title {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .highlight-text {
          color: var(--color-primary);
          cursor: pointer;
          border-bottom: 2px dashed var(--color-primary);
          padding-bottom: 2px;
        }

        .highlight-text:hover {
          color: var(--color-accent);
          border-color: var(--color-accent);
        }

        .welcome-sub {
          color: var(--text-secondary);
        }

        .exam-badge {
          font-weight: 600;
          color: var(--color-secondary);
        }

        .name-form {
          display: flex;
          gap: 8px;
          max-width: 350px;
        }

        .name-input {
          font-size: 1.5rem;
          padding: 4px 12px;
          height: auto;
        }

        .save-btn {
          padding: 8px 16px;
        }

        .exam-select-area {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .select-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        .exam-dropdown {
          background: rgba(20, 18, 38, 0.6);
          min-width: 220px;
        }

        .affirmation-card {
          border-left: 4px solid var(--color-accent);
          background: linear-gradient(90deg, rgba(168, 85, 247, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: var(--color-accent);
        }

        .affirmation-text {
          font-family: var(--font-header);
          font-size: 1.25rem;
          font-style: italic;
          font-weight: 400;
          line-height: 1.5;
        }

        .dashboard-grid {
          margin-top: 8px;
        }

        .stats-panel h3, .actions-panel h3, .exam-tips-section h3 {
          font-size: 1.2rem;
          margin-bottom: 18px;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 8px;
        }

        .stats-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px;
          border-radius: var(--btn-radius);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
        }

        .streak-icon {
          background: rgba(245, 158, 11, 0.1);
          color: var(--color-warning);
        }

        .mood-icon {
          background: rgba(99, 102, 241, 0.1);
          color: var(--color-primary);
        }

        .study-icon {
          background: rgba(13, 148, 136, 0.1);
          color: var(--color-secondary);
        }

        .stat-data {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-family: var(--font-header);
          font-size: 1.25rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .quick-actions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-row {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          border-radius: var(--btn-radius);
          padding: 14px 18px;
          color: var(--text-primary);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: var(--transition-smooth);
        }

        .action-row:hover {
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.2);
          transform: translateX(4px);
        }

        .action-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .action-title {
          font-family: var(--font-header);
          font-weight: 600;
          font-size: 1rem;
        }

        .action-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .tips-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .tips-icon {
          color: var(--color-secondary);
        }

        .tips-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .tips-grid {
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          }
        }

        .tip-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--glass-border);
          border-radius: var(--btn-radius);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tip-header-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tip-category-badge {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-primary);
          font-weight: 700;
        }

        .tip-title {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .tip-content {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .action-step-container {
          background: rgba(13, 148, 136, 0.05);
          border-left: 3px solid var(--color-secondary);
          padding: 10px 12px;
          border-radius: 0 var(--btn-radius) var(--btn-radius) 0;
          margin-top: auto;
        }

        .action-step-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-secondary);
          margin-bottom: 4px;
        }

        .action-step-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};
