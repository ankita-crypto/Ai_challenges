import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('ZenStudy Main Application Flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should render the navigation logo and start on the Dashboard', () => {
    render(<App />);
    
    // Check navigation logo text
    expect(screen.getByText('ZenStudy')).toBeInTheDocument();
    
    // Check dashboard elements
    expect(screen.getByText(/Your prep journey/i)).toBeInTheDocument();
    expect(screen.getByText('Affirmation for Today')).toBeInTheDocument();
    expect(screen.getByText('Your Wellness Metrics')).toBeInTheDocument();
  });

  it('should switch tabs when navigation items are clicked', () => {
    render(<App />);
    
    // Switch to Check-In (Mood Tracker)
    const checkInBtn = screen.getByLabelText('Navigate to Check-In');
    fireEvent.click(checkInBtn);
    expect(screen.getByText('Daily Mental Check-In')).toBeInTheDocument();
    expect(screen.getByText(/Pause for a moment/i)).toBeInTheDocument();

    // Switch to Insights (Analytics)
    const insightsBtn = screen.getByLabelText('Navigate to Insights');
    fireEvent.click(insightsBtn);
    // Should show empty state as we have no logs
    expect(screen.getByText('Not Enough Data Yet')).toBeInTheDocument();

    // Switch to CalmBot
    const calmBotBtn = screen.getByLabelText('Navigate to CalmBot');
    fireEvent.click(calmBotBtn);
    expect(screen.getByText('CalmBot Wellness Coach')).toBeInTheDocument();

    // Switch to Wellness Tools
    const toolsBtn = screen.getByLabelText('Navigate to Wellness Tools');
    fireEvent.click(toolsBtn);
    expect(screen.getByText('Box Breathing Session')).toBeInTheDocument();
  });
});
