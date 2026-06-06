import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Heart } from 'lucide-react';
import { secureRandom } from '../utils/security';

interface StudyTimerProps {
  onPomodoroComplete: () => void;
}

const MINDFUL_BREAK_TIPS = [
  "Stand up, stretch your arms overhead, and gently roll your shoulders back.",
  "Follow the 20-20-20 rule: look at something 20 feet away for 20 seconds to rest your eyes.",
  "Walk to the kitchen, grab a glass of water, and drink it slowly, noting its cool temperature.",
  "Do a 1-minute box breathing cycle: inhale 4s, hold 4s, exhale 4s, hold 4s.",
  "Step away from your desk completely. Do not check your phone or notifications during this break."
];

interface WebkitAudioWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ onPomodoroComplete }) => {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [breakTipIdx, setBreakTipIdx] = useState(0);

  const initialSeconds = mode === 'focus' ? 25 * 60 : 5 * 60;

  // Synthesize beep sound via Web Audio API
  const playBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as WebkitAudioWindow).webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime); // E5 note
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      console.warn('Timer audio cue could not be played.');
    }
  };

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const interval: ReturnType<typeof window.setInterval> = window.setInterval(() => {
      setSecondsLeft((currentSeconds) => {
        if (currentSeconds > 1) {
          return currentSeconds - 1;
        }

        playBeep();
        if (mode === 'focus') {
          onPomodoroComplete();
          setMode('break');
          setBreakTipIdx(Math.floor(secureRandom() * MINDFUL_BREAK_TIPS.length));
          setIsActive(false);
          return 5 * 60;
        }

        setMode('focus');
        setIsActive(false);
        return 25 * 60;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isActive, mode, onPomodoroComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(initialSeconds);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setIsActive(false);
    setMode(newMode);
    setSecondsLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // SVG circular progress calculations
  const progress = (initialSeconds - secondsLeft) / initialSeconds;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="study-timer-layout slide-in">
      <div className="study-timer-card glass-panel">
        <h3 className="timer-title">Mindful Study Timer</h3>
        <p className="timer-desc">Maintain high focus without running into mental exhaustion. Study in structured blocks.</p>

        {/* Mode switch pills */}
        <div className="mode-toggle-container">
          <button 
            onClick={() => switchMode('focus')} 
            className={`mode-btn ${mode === 'focus' ? 'active focus-mode' : ''}`}
          >
            <Clock size={16} /> Focus Session (25m)
          </button>
          <button 
            onClick={() => switchMode('break')} 
            className={`mode-btn ${mode === 'break' ? 'active break-mode' : ''}`}
          >
            <Coffee size={16} /> Calm Break (5m)
          </button>
        </div>

        {/* Visual Progress Timer Circle */}
        <div className="circular-timer-container">
          <svg className="progress-ring-svg" width="220" height="220">
            <circle
              className="progress-ring-bg"
              stroke="var(--glass-border)"
              strokeWidth="8"
              fill="transparent"
              r={radius}
              cx="110"
              cy="110"
            />
            <circle
              className={`progress-ring-bar ${mode}`}
              strokeWidth="8"
              fill="transparent"
              r={radius}
              cx="110"
              cy="110"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="timer-digits-container">
            <span className="timer-digits">{formatTime(secondsLeft)}</span>
            <span className="timer-mode-label">{mode === 'focus' ? 'STUDYING' : 'RESTING'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="timer-controls">
          <button onClick={toggleTimer} className={`glass-btn play-pause-btn ${isActive ? 'active' : ''}`}>
            {isActive ? <Pause size={18} /> : <Play size={18} />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button onClick={resetTimer} className="glass-btn reset-btn" aria-label="Reset Timer">
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        {/* Dynamic Break Screen Tip */}
        {mode === 'break' && (
          <div className="break-tips-box">
            <div className="tips-box-header">
              <Heart size={16} className="tip-icon" />
              <span>Recommended Mindful Break</span>
            </div>
            <p className="tips-box-text">{MINDFUL_BREAK_TIPS[breakTipIdx]}</p>
          </div>
        )}
      </div>

      <style>{`
        .study-timer-layout {
          max-width: 500px;
          margin: 0 auto;
        }

        .study-timer-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
        }

        .timer-title {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .timer-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .mode-toggle-container {
          display: flex;
          background: rgba(0, 0, 0, 0.15);
          border: 1px solid var(--glass-border);
          border-radius: 50px;
          padding: 4px;
          gap: 4px;
          width: 100%;
        }

        .mode-btn {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 8px 12px;
          border-radius: 50px;
          cursor: pointer;
          font-family: var(--font-header);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 500;
          transition: var(--transition-smooth);
        }

        .mode-btn.active {
          color: var(--text-primary);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .mode-btn.active.focus-mode {
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: #818cf8;
        }

        .mode-btn.active.break-mode {
          background: rgba(13, 148, 136, 0.15);
          border: 1px solid rgba(13, 148, 136, 0.3);
          color: #2dd4bf;
        }

        /* Circular Timer SVG styling */
        .circular-timer-container {
          position: relative;
          width: 220px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-ring-svg {
          transform: rotate(-90deg);
        }

        .progress-ring-bar {
          transition: stroke-dashoffset 1s linear;
        }

        .progress-ring-bar.focus {
          stroke: var(--color-primary);
          filter: drop-shadow(0 0 8px var(--color-primary-glow));
        }

        .progress-ring-bar.break {
          stroke: var(--color-secondary);
          filter: drop-shadow(0 0 8px var(--color-secondary-glow));
        }

        .timer-digits-container {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .timer-digits {
          font-family: var(--font-header);
          font-size: 2.8rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .timer-mode-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--text-muted);
        }

        /* Controls */
        .timer-controls {
          display: flex;
          gap: 12px;
        }

        .play-pause-btn.active {
          background: rgba(99, 102, 241, 0.1);
          border-color: var(--color-primary);
        }

        /* Break Tips Box */
        .break-tips-box {
          width: 100%;
          background: rgba(13, 148, 136, 0.05);
          border: 1px solid rgba(13, 148, 136, 0.2);
          border-radius: var(--btn-radius);
          padding: 14px 18px;
          text-align: left;
          animation: slideIn 0.3s ease-out;
        }

        .tips-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-secondary);
          margin-bottom: 6px;
        }

        .tips-box-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};
