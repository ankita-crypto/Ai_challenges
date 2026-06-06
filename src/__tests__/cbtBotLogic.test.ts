import { describe, it, expect } from 'vitest';
import { CBT_FLOWS } from '../utils/cbtBotLogic';

describe('CBT Bot Logic State Machine', () => {
  it('should have a valid start step', () => {
    expect(CBT_FLOWS.start).toBeDefined();
    expect(CBT_FLOWS.start.id).toBe('start');
    expect(CBT_FLOWS.start.options?.length).toBeGreaterThan(0);
  });

  it('should navigate from start to mock_1 on selecting first option', () => {
    const firstOption = CBT_FLOWS.start.options?.[0];
    expect(firstOption?.text).toContain('mock test');
    expect(firstOption?.nextStepId).toBe('mock_1');
    
    const nextStep = CBT_FLOWS[firstOption!.nextStepId];
    expect(nextStep).toBeDefined();
    expect(nextStep.id).toBe('mock_1');
    expect(nextStep.requiresTextInput).toBe(true);
  });

  it('should navigate from start to backlog_1 on selecting second option', () => {
    const secondOption = CBT_FLOWS.start.options?.[1];
    expect(secondOption?.text).toContain('backlog');
    expect(secondOption?.nextStepId).toBe('backlog_1');
    
    const nextStep = CBT_FLOWS[secondOption!.nextStepId];
    expect(nextStep).toBeDefined();
    expect(nextStep.id).toBe('backlog_1');
    expect(nextStep.requiresTextInput).toBe(true);
  });

  it('should resolve action effects on specific steps', () => {
    const breathingStep = CBT_FLOWS.run_breathing;
    expect(breathingStep).toBeDefined();
    expect(breathingStep.actionEffect).toBe('show_breathing');

    const groundingStep = CBT_FLOWS.run_grounding;
    expect(groundingStep).toBeDefined();
    expect(groundingStep.actionEffect).toBe('show_grounding');

    const timerStep = CBT_FLOWS.run_timer;
    expect(timerStep).toBeDefined();
    expect(timerStep.actionEffect).toBe('show_timer');
  });
});
