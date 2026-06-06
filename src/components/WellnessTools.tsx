import React from 'react';
import { BreathingExercise } from './BreathingExercise';
import { GroundingTool } from './GroundingTool';
import { StudyTimer } from './StudyTimer';
import { Wind, Anchor, Timer } from 'lucide-react';

interface WellnessToolsProps {
  activeSubTool: 'breathing' | 'grounding' | 'timer';
  setActiveSubTool: (tool: 'breathing' | 'grounding' | 'timer') => void;
  onPomodoroComplete: () => void;
}

export const WellnessTools: React.FC<WellnessToolsProps> = ({
  activeSubTool,
  setActiveSubTool,
  onPomodoroComplete
}) => {
  return (
    <div className="wellness-tools-layout slide-in">
      {/* Sub-navigation tabs */}
      <header className="tools-subnav glass-panel">
        <button 
          onClick={() => setActiveSubTool('breathing')}
          className={`subnav-btn ${activeSubTool === 'breathing' ? 'active' : ''}`}
        >
          <Wind size={16} /> Box Breathing
        </button>
        <button 
          onClick={() => setActiveSubTool('grounding')}
          className={`subnav-btn ${activeSubTool === 'grounding' ? 'active' : ''}`}
        >
          <Anchor size={16} /> 5-4-3-2-1 Grounding
        </button>
        <button 
          onClick={() => setActiveSubTool('timer')}
          className={`subnav-btn ${activeSubTool === 'timer' ? 'active' : ''}`}
        >
          <Timer size={16} /> Focus Study Timer
        </button>
      </header>

      {/* Render Active Tool */}
      <div className="tools-active-component">
        {activeSubTool === 'breathing' && <BreathingExercise />}
        {activeSubTool === 'grounding' && <GroundingTool />}
        {activeSubTool === 'timer' && <StudyTimer onPomodoroComplete={onPomodoroComplete} />}
      </div>

      <style>{`
        .wellness-tools-layout {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .tools-subnav {
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 50px;
          flex-wrap: wrap;
        }

        .subnav-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 50px;
          font-family: var(--font-header);
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .subnav-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }

        .subnav-btn.active {
          background: var(--color-primary-glow);
          border: 1px solid var(--color-primary);
          color: var(--text-primary);
        }

        [data-theme="light"] .subnav-btn.active {
          background: rgba(99, 102, 241, 0.08);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .tools-active-component {
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};
