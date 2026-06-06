import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { MoodTracker } from './components/MoodTracker';
import { Analytics } from './components/Analytics';
import { CalmBot } from './components/CalmBot';
import { WellnessTools } from './components/WellnessTools';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useLocalStorage } from './hooks/useLocalStorage';
import { appConfig } from './config/env';
import type { AppTab, MoodLog, ThemeMode, ToolActionEffect, WellnessToolId } from './types/wellness';
import {
  sanitizeExamId,
  sanitizeMoodLog,
  sanitizeMoodLogs,
  sanitizePomodoroCount,
  sanitizeTheme,
  sanitizeUserName
} from './utils/security';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [activeSubTool, setActiveSubTool] = useState<WellnessToolId>('breathing');
  
  const [userName, setUserName] = useLocalStorage('zenstudy_username', 'Student', { sanitize: sanitizeUserName });
  const [targetExam, setTargetExam] = useLocalStorage('zenstudy_exam', 'JEE', { sanitize: sanitizeExamId });
  const [moodLogs, setMoodLogs] = useLocalStorage<MoodLog[]>('zenstudy_moodlogs', [], { sanitize: sanitizeMoodLogs });
  const [pomodoroCount, setPomodoroCount] = useLocalStorage('zenstudy_pomodoros', 0, { sanitize: sanitizePomodoroCount });
  const [theme, setTheme] = useLocalStorage<ThemeMode>('zenstudy_theme', 'dark', { sanitize: sanitizeTheme });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.title = `${appConfig.appName} — Student Mental Wellness Tracker`;
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAddLog = (newLog: MoodLog) => {
    const sanitizedLog = sanitizeMoodLog(newLog);

    if (sanitizedLog) {
      setMoodLogs(prev => sanitizeMoodLogs([sanitizedLog, ...prev]));
    }
  };

  const handleDeleteLog = (id: string) => {
    setMoodLogs(prev => prev.filter(log => log.id !== id));
  };

  const handlePomodoroComplete = () => {
    setPomodoroCount(prev => prev + 1);
  };

  const handleTriggerAction = (actionEffect: ToolActionEffect) => {
    if (actionEffect === 'show_breathing') {
      setActiveTab('tools');
      setActiveSubTool('breathing');
    } else if (actionEffect === 'show_grounding') {
      setActiveTab('tools');
      setActiveSubTool('grounding');
    } else if (actionEffect === 'show_timer') {
      setActiveTab('tools');
      setActiveSubTool('timer');
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-shell">
      <div className="app-container">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />

        <main className="app-main-content" id="main-content">
          {activeTab === 'dashboard' && (
            <Dashboard 
              userName={userName}
              setUserName={setUserName}
              targetExam={targetExam}
              setTargetExam={setTargetExam}
              moodLogs={moodLogs}
              setActiveTab={setActiveTab}
              pomodoroCount={pomodoroCount}
            />
          )}

          {activeTab === 'tracker' && (
            <MoodTracker 
              moodLogs={moodLogs} 
              onAddLog={handleAddLog} 
              onDeleteLog={handleDeleteLog} 
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics moodLogs={moodLogs} />
          )}

          {activeTab === 'bot' && (
            <CalmBot onTriggerAction={handleTriggerAction} />
          )}

          {activeTab === 'tools' && (
            <WellnessTools 
              activeSubTool={activeSubTool}
              setActiveSubTool={setActiveSubTool}
              onPomodoroComplete={handlePomodoroComplete}
            />
          )}
        </main>
      </div>

      <style>{`
        .app-shell {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .app-main-content {
          margin-top: 10px;
        }

        .app-error-boundary {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 32px;
          text-align: center;
          color: var(--text-primary);
        }
      `}</style>
    </div>
    </ErrorBoundary>
  );
}
