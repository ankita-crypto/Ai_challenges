import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { MoodTracker } from './components/MoodTracker';
import { Analytics } from './components/Analytics';
import { CalmBot } from './components/CalmBot';
import { WellnessTools } from './components/WellnessTools';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeSubTool, setActiveSubTool] = useState<'breathing' | 'grounding' | 'timer'>('breathing');
  
  // Persisted state using our local storage hook
  const [userName, setUserName] = useLocalStorage<string>('zenstudy_username', 'Student');
  const [targetExam, setTargetExam] = useLocalStorage<string>('zenstudy_exam', 'JEE');
  const [moodLogs, setMoodLogs] = useLocalStorage<any[]>('zenstudy_moodlogs', []);
  const [pomodoroCount, setPomodoroCount] = useLocalStorage<number>('zenstudy_pomodoros', 0);
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('zenstudy_theme', 'dark');

  // Sync theme with HTML document attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAddLog = (newLog: any) => {
    setMoodLogs(prev => [newLog, ...prev]);
  };

  const handleDeleteLog = (id: string) => {
    setMoodLogs(prev => prev.filter(log => log.id !== id));
  };

  const handlePomodoroComplete = () => {
    setPomodoroCount(prev => prev + 1);
  };

  const handleTriggerAction = (actionEffect: string) => {
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
    <div className="app-shell">
      <div className="app-container">
        {/* Navigation Bar */}
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />

        {/* Tab Routing content */}
        <main className="app-main-content">
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
      `}</style>
    </div>
  );
}
