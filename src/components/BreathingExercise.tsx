import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Play, Volume2, VolumeX, Info, RotateCcw } from 'lucide-react';
import { secureRandom } from '../utils/security';

type BreathingPhase = 'idle' | 'inhale' | 'hold_in' | 'exhale' | 'hold_out';

const PHASE_CONFIG: Record<BreathingPhase, { text: string; duration: number; className: string }> = {
  idle: { text: 'Ready to breathe?', duration: 0, className: 'phase-idle' },
  inhale: { text: 'Breathe In Slowly...', duration: 4, className: 'phase-inhale' },
  hold_in: { text: 'Hold Your Breath...', duration: 4, className: 'phase-hold-in' },
  exhale: { text: 'Exhale Completely...', duration: 4, className: 'phase-exhale' },
  hold_out: { text: 'Hold Empty...', duration: 4, className: 'phase-hold-out' }
};

interface WebkitAudioWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const getNextPhase = (currentPhase: BreathingPhase): BreathingPhase => {
  switch (currentPhase) {
    case 'inhale':
      return 'hold_in';
    case 'hold_in':
      return 'exhale';
    case 'exhale':
      return 'hold_out';
    case 'hold_out':
      return 'inhale';
    default:
      return 'idle';
  }
};

export const BreathingExercise: React.FC = () => {
  const [phase, setPhase] = useState<BreathingPhase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (phase === 'idle') return;

    const timer = window.setTimeout(() => {
      if (timeLeft > 1) {
        setTimeLeft(t => t - 1);
        return;
      }

      const nextPhase = getNextPhase(phase);
      setPhase(nextPhase);
      setTimeLeft(PHASE_CONFIG[nextPhase].duration);

      if (phase === 'hold_out') {
        setCyclesCompleted(c => c + 1);
      }
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [phase, timeLeft]);

  const stopAudio = useCallback(() => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
      } catch {
        console.warn('Audio source was already stopped.');
      }
      noiseSourceRef.current.disconnect();
      noiseSourceRef.current = null;
    }
    if (lfoRef.current) {
      try {
        lfoRef.current.stop();
      } catch {
        console.warn('Audio oscillator was already stopped.');
      }
      lfoRef.current.disconnect();
      lfoRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      void audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsPlayingAudio(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const startBreathing = () => {
    setPhase('inhale');
    setTimeLeft(PHASE_CONFIG.inhale.duration);
    setCyclesCompleted(0);
  };

  const stopBreathing = () => {
    setPhase('idle');
    setTimeLeft(0);
  };

  // Web Audio Synthesis: Synthesizes relaxing brown noise with LFO volume modulation for "ocean waves"
  const startAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as WebkitAudioWindow).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('Web Audio API unavailable');
      }
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // 1. Create Brown Noise Buffer
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = secureRandom() * 2 - 1;
        // Lowpass filter algorithm to turn white noise to brown noise
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate for volume drop
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      noiseSourceRef.current = source;

      // 2. Create Gain Node for volume modulation
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNodeRef.current = mainGain;

      // 3. Create LFO (Low Frequency Oscillator) to modulate gain (waves swelling)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.125, ctx.currentTime); // 8 second cycle (0.125 Hz)
      lfoRef.current = lfo;

      // LFO Gain node to control modulation depth
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.1, ctx.currentTime); // mod amplitude

      // Connect LFO -> LFO Gain -> mainGain.gain (AudioParam modulation)
      lfo.connect(lfoGain);
      lfoGain.connect(mainGain.gain);

      // Connect source -> mainGain -> destination (speakers)
      source.connect(mainGain);
      mainGain.connect(ctx.destination);

      // Start sources
      source.start(0);
      lfo.start(0);
      setIsPlayingAudio(true);
    } catch {
      console.warn('Synthesized audio could not be initialized.');
    }
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  return (
    <div className="breathing-layout slide-in">
      <div className="breathing-content glass-panel">
        <div className="breathing-header">
          <h3>Box Breathing Session</h3>
          <p>The 4-4-4-4 breathing technique is used by athletes and clinical psychologists to reset the nervous system and calm anxiety instantly.</p>
        </div>

        {/* The Breathing Orb Visualizer */}
        <div className="orb-outer-container">
          <div className={`breathing-orb ${phase}`}>
            <div className="orb-core">
              <span className="orb-text">{PHASE_CONFIG[phase].text}</span>
              {phase !== 'idle' && <span className="orb-seconds">{timeLeft}s</span>}
            </div>
          </div>
        </div>

        {/* Statistics and Controls */}
        <div className="breathing-dashboard">
          <div className="session-stats">
            <span className="cycles-count">Cycles Finished: <strong>{cyclesCompleted}</strong></span>
          </div>

          <div className="breathing-controls">
            {phase === 'idle' ? (
              <button onClick={startBreathing} className="glass-btn glass-btn-secondary start-session-btn">
                <Play size={16} /> Start Session
              </button>
            ) : (
              <button onClick={stopBreathing} className="glass-btn stop-session-btn">
                <RotateCcw size={16} /> Stop Session
              </button>
            )}

            <button 
              onClick={toggleAudio} 
              className={`glass-btn audio-toggle-btn ${isPlayingAudio ? 'active' : ''}`}
              title="Toggle Ocean Soundscape"
            >
              {isPlayingAudio ? <Volume2 size={16} className="active-audio-icon" /> : <VolumeX size={16} />}
              Ocean Soundscape
            </button>
          </div>
        </div>

        <section className="breathing-info">
          <Info size={16} className="info-icon" />
          <div className="info-text-box">
            <h4>How it works:</h4>
            <ol>
              <li>Inhale through your nose, expanding your belly for 4 seconds.</li>
              <li>Hold that air in your lungs gently for 4 seconds.</li>
              <li>Exhale slowly through your mouth, relaxing your shoulders for 4 seconds.</li>
              <li>Hold your lungs empty for 4 seconds before the next breath.</li>
            </ol>
          </div>
        </section>
      </div>

      <style>{`
        .breathing-layout {
          max-width: 650px;
          margin: 0 auto;
        }

        .breathing-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          text-align: center;
        }

        .breathing-header h3 {
          font-size: 1.5rem;
          margin-bottom: 6px;
        }

        .breathing-header p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        /* Orb visualization styling */
        .orb-outer-container {
          width: 280px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .breathing-orb {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(13, 148, 136, 0.4) 0%, rgba(13, 148, 136, 0.1) 70%);
          border: 2px solid rgba(13, 148, 136, 0.3);
          box-shadow: 0 0 40px rgba(13, 148, 136, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .orb-core {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 24px;
        }

        .orb-text {
          font-family: var(--font-header);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .orb-seconds {
          font-family: var(--font-header);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-secondary);
        }

        /* Orb transition scales based on phase class */
        .breathing-orb.inhale {
          width: 260px;
          height: 260px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(99, 102, 241, 0.15) 70%);
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 60px rgba(99, 102, 241, 0.4);
          transition-duration: 4s;
        }

        .breathing-orb.hold_in {
          width: 260px;
          height: 260px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(168, 85, 247, 0.15) 70%);
          border-color: rgba(168, 85, 247, 0.5);
          box-shadow: 0 0 60px rgba(168, 85, 247, 0.4);
          transition-duration: 0.1s; /* instant state */
        }

        .breathing-orb.exhale {
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(13, 148, 136, 0.4) 0%, rgba(13, 148, 136, 0.1) 70%);
          border-color: rgba(13, 148, 136, 0.4);
          box-shadow: 0 0 40px rgba(13, 148, 136, 0.2);
          transition-duration: 4s;
        }

        .breathing-orb.hold_out {
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.02) 70%);
          border-color: rgba(239, 68, 68, 0.2);
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.1);
          transition-duration: 0.1s;
        }

        /* Breathing Dashboard & Controls */
        .breathing-dashboard {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }

        .session-stats {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .cycles-count strong {
          color: var(--color-secondary);
          font-size: 1.1rem;
        }

        .breathing-controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .start-session-btn {
          animation: pulse-ring 2s infinite ease-in-out;
        }

        .stop-session-btn {
          border-color: rgba(239, 68, 68, 0.2);
        }

        .stop-session-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }

        .audio-toggle-btn.active {
          background: rgba(13, 148, 136, 0.15);
          border-color: var(--color-secondary);
          color: #2dd4bf;
        }

        .active-audio-icon {
          animation: float 2s infinite ease-in-out;
        }

        /* Informational Footnote */
        .breathing-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          text-align: left;
          padding: 16px;
          border-radius: var(--btn-radius);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          width: 100%;
        }

        .info-icon {
          color: var(--color-primary);
          margin-top: 3px;
          flex-shrink: 0;
        }

        .info-text-box h4 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .info-text-box ol {
          padding-left: 18px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
      `}</style>
    </div>
  );
};
