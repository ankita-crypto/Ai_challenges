import React, { useState } from 'react';
import { Eye, Touchpad, Volume2, Flower, Droplet, ArrowRight, ArrowLeft, RefreshCw, Smile } from 'lucide-react';

interface GroundingStep {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  count: number;
  instruction: string;
  prompt: string;
}

const GROUNDING_STEPS: GroundingStep[] = [
  {
    title: "Sight (See)",
    icon: Eye,
    color: "#6366f1",
    count: 5,
    instruction: "Look around you. Slow your breathing down. Identify 5 separate items you can see. Describe them briefly below.",
    prompt: "Name 5 things you see in the room..."
  },
  {
    title: "Touch (Feel)",
    icon: Touchpad,
    color: "#0d9488",
    count: 4,
    instruction: "Focus on your physical body. Touch 4 different things around you and pay attention to their textures, weights, and temperatures.",
    prompt: "Name 4 textures/objects you can feel right now..."
  },
  {
    title: "Sound (Hear)",
    icon: Volume2,
    color: "#a855f7",
    count: 3,
    instruction: "Close your eyes for 10 seconds. Listen carefully to your surroundings. Identify 3 distinct sounds, no matter how faint.",
    prompt: "Name 3 sounds you can hear..."
  },
  {
    title: "Smell (Sense)",
    icon: Flower,
    color: "#f59e0b",
    count: 2,
    instruction: "Inhale deeply. Notice the smells in the air around you. It could be books, a pencil eraser, food, soap, or coffee.",
    prompt: "Name 2 scents you can smell..."
  },
  {
    title: "Taste (Awareness)",
    icon: Droplet,
    color: "#ef4444",
    count: 1,
    instruction: "Take a sip of water or focus on the taste inside your mouth right now. What is 1 taste you can identify?",
    prompt: "Name 1 taste you notice..."
  }
];

export const GroundingTool: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [inputs, setInputs] = useState<string[]>(Array(5).fill(''));

  const handleNext = () => {
    if (currentStepIdx < GROUNDING_STEPS.length - 1) {
      setCurrentStepIdx(c => c + 1);
    } else {
      // Completed state
      setCurrentStepIdx(GROUNDING_STEPS.length);
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(c => c - 1);
    } else {
      setCurrentStepIdx(-1);
    }
  };

  const handleInputChange = (value: string) => {
    setInputs(prev => {
      const copy = [...prev];
      copy[currentStepIdx] = value;
      return copy;
    });
  };

  const resetGrounding = () => {
    setCurrentStepIdx(-1);
    setInputs(Array(5).fill(''));
  };

  if (currentStepIdx === -1) {
    return (
      <div className="grounding-intro glass-panel slide-in">
        <div className="intro-header">
          <Smile className="intro-icon" size={48} />
          <h3>5-4-3-2-1 Sensory Grounding</h3>
        </div>
        <p className="intro-desc">
          When exam anxiety peaks, our brains get stuck in a loop of future-oriented panic ("What if I fail?"). 
          Grounding pulls your awareness out of your head and anchors it back in the physical room. 
          It takes less than 3 minutes.
        </p>
        <button onClick={() => setCurrentStepIdx(0)} className="glass-btn glass-btn-primary start-grounding-btn">
          Begin Grounding Wizard
        </button>
      </div>
    );
  }

  if (currentStepIdx === GROUNDING_STEPS.length) {
    return (
      <div className="grounding-complete glass-panel slide-in">
        <Smile className="complete-icon" size={48} />
        <h3>Grounding Complete</h3>
        <p>Your nervous system has had a chance to regulate. Take a slow, deep breath. The panic is temporary, and you are safe in the present moment.</p>
        
        <div className="summary-list">
          <h4>Your Anchor Points:</h4>
          <ul>
            {GROUNDING_STEPS.map((step, idx) => (
              <li key={idx}>
                <strong>{step.title}:</strong> {inputs[idx] || 'Reflected quietly'}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={resetGrounding} className="glass-btn reset-grounding-btn">
          <RefreshCw size={14} /> Repeat Exercise
        </button>
      </div>
    );
  }

  const step = GROUNDING_STEPS[currentStepIdx];
  const Icon = step.icon;

  return (
    <div className="grounding-wizard glass-panel slide-in" style={{ '--step-color': step.color } as React.CSSProperties}>
      <header className="wizard-header">
        <span className="step-indicator">Step {currentStepIdx + 1} of 5</span>
        <div className="step-title-row">
          <Icon className="step-icon animate-bounce" size={28} />
          <h3>Identify {step.count} things you can {step.title.split(' ')[1].replace(/[()]/g, '')}</h3>
        </div>
      </header>

      <div className="wizard-body">
        <p className="step-instruction">{step.instruction}</p>
        <textarea
          value={inputs[currentStepIdx]}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={step.prompt}
          className="glass-input step-textarea"
          rows={3}
        />
      </div>

      <footer className="wizard-footer">
        <button onClick={handleBack} className="glass-btn back-btn">
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={handleNext} className="glass-btn glass-btn-primary next-btn">
          {currentStepIdx === GROUNDING_STEPS.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={16} />
        </button>
      </footer>

      <style>{`
        .grounding-intro, .grounding-complete, .grounding-wizard {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: center;
        }

        .intro-header, .wizard-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .intro-icon {
          color: var(--color-primary);
        }

        .intro-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .start-grounding-btn {
          margin: 10px auto 0 auto;
          width: fit-content;
        }

        /* Wizard Mode Styles */
        .step-indicator {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .step-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--step-color);
        }

        .step-icon {
          filter: drop-shadow(0 0 8px var(--step-color));
        }

        .wizard-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .step-instruction {
          font-size: 0.95rem;
          color: var(--text-secondary);
          text-align: left;
        }

        .step-textarea {
          font-size: 0.9rem;
          resize: none;
        }

        .wizard-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        .back-btn {
          border-color: transparent;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .next-btn {
          background: var(--step-color) !important;
          border: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
        }

        .next-btn:hover {
          opacity: 0.9;
        }

        /* Completed State */
        .complete-icon {
          color: var(--color-success);
        }

        .summary-list {
          text-align: left;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          border-radius: var(--btn-radius);
          padding: 16px 20px;
        }

        .summary-list h4 {
          font-size: 1rem;
          margin-bottom: 12px;
          color: var(--color-success);
        }

        .summary-list ul {
          list-style: none;
          font-size: 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .reset-grounding-btn {
          width: fit-content;
          margin: 10px auto 0 auto;
        }
      `}</style>
    </div>
  );
};
