import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BreathingExercise } from '../components/BreathingExercise';
import { GroundingTool } from '../components/GroundingTool';
import { StudyTimer } from '../components/StudyTimer';

describe('Mindfulness & Focus Tools', () => {
  it('should render and run Box Breathing Exercise', () => {
    render(<BreathingExercise />);
    expect(screen.getByText('Box Breathing Session')).toBeInTheDocument();
    
    const startBtn = screen.getByText('Start Session');
    fireEvent.click(startBtn);
    expect(screen.getByText('Breathe In Slowly...')).toBeInTheDocument();

    const audioBtn = screen.getByText('Ocean Soundscape');
    fireEvent.click(audioBtn);
    expect(audioBtn).toHaveClass('active');
  });

  it('should render and run Grounding Tool Wizard', () => {
    render(<GroundingTool />);
    expect(screen.getByText('5-4-3-2-1 Sensory Grounding')).toBeInTheDocument();

    const beginBtn = screen.getByText('Begin Grounding Wizard');
    fireEvent.click(beginBtn);

    expect(screen.getByText(/Identify 5 separate items/i)).toBeInTheDocument();
    
    // Step through all 5 senses in the wizard
    for (let i = 0; i < 5; i++) {
      const nextBtn = screen.getByText(i === 4 ? 'Finish' : 'Next');
      fireEvent.click(nextBtn);
    }

    expect(screen.getByText('Grounding Complete')).toBeInTheDocument();
  });

  it('should render and run Pomodoro Study Timer', () => {
    const onComplete = vi.fn();
    render(<StudyTimer onPomodoroComplete={onComplete} />);
    
    expect(screen.getByText('Mindful Study Timer')).toBeInTheDocument();
    expect(screen.getByText('25:00')).toBeInTheDocument();

    const startBtn = screen.getByText('Start');
    fireEvent.click(startBtn);
    expect(screen.getByText('Pause')).toBeInTheDocument();
  });
});
