export interface BotOption {
  text: string;
  nextStepId: string;
}

export interface BotStep {
  id: string;
  text: string;
  options?: BotOption[];
  requiresTextInput?: boolean;
  textPlaceholder?: string;
  textSubmitButtonText?: string;
  textInputKey?: string;
  actionEffect?: ToolActionEffect;
}

export const CBT_FLOWS: Record<string, BotStep> = {
  // START STATE
  start: {
    id: 'start',
    text: "Hello! I'm CalmBot, your wellness companion. Preparing for major exams can be incredibly draining, both mentally and physically. What's on your mind right now? Select the topic that resonates most with your current feelings:",
    options: [
      { text: "I scored poorly on a mock test / practice exam.", nextStepId: 'mock_1' },
      { text: "I'm overwhelmed by my syllabus backlog.", nextStepId: 'backlog_1' },
      { text: "I feel like I will fail and disappoint my family/peers.", nextStepId: 'pressure_1' },
      { text: "I feel completely exhausted and burned out.", nextStepId: 'burnout_1' },
      { text: "I just need a quick breathing or grounding exercise.", nextStepId: 'exercise_choice' }
    ]
  },

  // FLOW A: MOCK TEST FAILURE
  mock_1: {
    id: 'mock_1',
    text: "A low mock score can feel like a punch in the stomach. It often triggers the automatic thought: 'This score proves I am going to fail the real exam.' In CBT, we call this 'fortune-telling' or catastrophizing. Tell me: what is the main negative thought you're having about this score?",
    requiresTextInput: true,
    textPlaceholder: "e.g., I won't clear the cutoff, I am not smart enough...",
    textSubmitButtonText: "Submit Thought",
    textInputKey: "automatic_thought",
    options: [
      { text: "I'd rather select a common thought.", nextStepId: 'mock_select_thought' }
    ]
  },
  mock_select_thought: {
    id: 'mock_select_thought',
    text: "Select the thought that feels closest to what you're feeling:",
    options: [
      { text: "I am consistently scoring low, so I will never clear the cutoffs.", nextStepId: 'mock_2' },
      { text: "I made silly mistakes again, I have no exam temperament.", nextStepId: 'mock_2' },
      { text: "Everyone else is scoring better than me, I am falling behind.", nextStepId: 'mock_2' }
    ]
  },
  mock_2: {
    id: 'mock_2',
    text: "Thank you for sharing that. Let's look at the facts. In CBT, we separate *feelings* from *facts*. Is a mock test designed to mirror your absolute final limit, or is it a diagnostic tool designed to reveal gaps?",
    options: [
      { text: "It's a diagnostic tool, but seeing low marks still hurts.", nextStepId: 'mock_3' },
      { text: "I feel like it reflects my actual ability on the final day.", nextStepId: 'mock_4' }
    ]
  },
  mock_3: {
    id: 'mock_3',
    text: "Exactly. It is a diagnostic tool. Every mistake you make in a mock test is a bug caught *before* production—it is a question you will get *right* in the actual exam because you learned from it today. Let's write down a more balanced thought: 'This mock test showed me what I need to revise. It does not dictate my future score.' How does that thought feel?",
    options: [
      { text: "It makes sense. I can focus on revising the weak areas.", nextStepId: 'mock_action' },
      { text: "It's hard to believe it fully, but it helps.", nextStepId: 'mock_action' }
    ]
  },
  mock_4: {
    id: 'mock_4',
    text: "It is normal to feel that way. Let's look at past toppers: almost every single one of them had terrible mock test scores at some point. The difference is they used those scores to patch their weaknesses rather than giving up. Let's write down a balanced alternative: 'My score today is a snapshot of my current knowledge, not a prediction of my final result. I have time to learn.' Ready to take a constructive action?",
    options: [
      { text: "Yes, what should I do?", nextStepId: 'mock_action' }
    ]
  },
  mock_action: {
    id: 'mock_action',
    text: "Excellent. Your action step: Choose exactly THREE questions you got wrong in that mock test. Write down their solutions in a 'mistake journal'. Do not look at the rest of the paper today. Can you commit to just doing this one task?",
    options: [
      { text: "Yes, I will do that now.", nextStepId: 'finish_flow' },
      { text: "I'd like to do a quick breathing exercise first to calm down.", nextStepId: 'run_breathing' }
    ]
  },

  // FLOW B: SYLLABUS BACKLOG
  backlog_1: {
    id: 'backlog_1',
    text: "Syllabus backlog is the #1 stressor for students. Looking at a mountain of unread chapters triggers 'all-or-nothing thinking': 'If I cannot complete 100% of the syllabus, I will fail.' Let's break this down. What is the biggest backlog topic that is stressing you out right now?",
    requiresTextInput: true,
    textPlaceholder: "e.g., Organic chemistry, Rotational mechanics, UPSC GS Paper 3...",
    textSubmitButtonText: "Define Backlog",
    textInputKey: "backlog_topic",
    options: [
      { text: "It's just everything. The whole syllabus is a mess.", nextStepId: 'backlog_all' }
    ]
  },
  backlog_all: {
    id: 'backlog_all',
    text: "When everything feels like a mess, we experience mental paralysis. Let's challenge the idea that you need 100% syllabus coverage. In most competitive exams, you can secure an excellent rank by scoring 60-70% if you do it with high accuracy. Do you think it's better to do 70% of the syllabus thoroughly, or 100% in a rush?",
    options: [
      { text: "Doing 70% thoroughly is definitely better.", nextStepId: 'backlog_2' },
      { text: "I feel like I still need 100% to clear the cutoffs.", nextStepId: 'backlog_3' }
    ]
  },
  backlog_2: {
    id: 'backlog_2',
    text: "Spot on! Accuracy beats coverage. Let's reframe: 'I do not need to study everything to succeed. I will focus on high-yield topics first.' Let's create an actionable micro-task. What is one high-yield topic from your backlog you can study for just 25 minutes today?",
    requiresTextInput: true,
    textPlaceholder: "e.g. Modern Physics, Cell biology, Indian Polity intro...",
    textSubmitButtonText: "Submit Micro-task",
    textInputKey: "micro_task",
    options: [
      { text: "I want to start with a small revision instead.", nextStepId: 'backlog_action' }
    ]
  },
  backlog_3: {
    id: 'backlog_3',
    text: "It is a common fear, but statistical analysis of cutoffs shows that absolute perfection is never required. Let's shift our focus from the massive backlog to the present moment. You cannot study 5 chapters today, but you *can* study 1 topic. Let's reframe: 'I will focus on what I can do today, rather than stressing about what I didn't do in the past.' Ready to do a 25-minute Pomodoro focus session?",
    options: [
      { text: "Yes, let's start a study session.", nextStepId: 'run_timer' },
      { text: "I want a quick action tip first.", nextStepId: 'backlog_action' }
    ]
  },
  backlog_action: {
    id: 'backlog_action',
    text: "Your action step: Open your study materials for just ONE specific topic from your backlog. Put away all other books. Set a timer for 25 minutes and study ONLY that topic. When the timer rings, you are free to stop. Would you like to use our Pomodoro Timer for this?",
    options: [
      { text: "Yes, take me to the Study Timer.", nextStepId: 'run_timer' },
      { text: "I'll do it on my own. Thank you!", nextStepId: 'finish_flow' }
    ]
  },

  // FLOW C: FAMILY/PEER PRESSURE
  pressure_1: {
    id: 'pressure_1',
    text: "Fear of disappointing parents or feeling inferior to peers is a heavy burden. It triggers 'mind-reading': 'If I don't clear this, my parents will think I am a failure and my friends will look down on me.' Have you talked to your family about how this pressure makes you feel?",
    options: [
      { text: "No, they wouldn't understand or it might stress them more.", nextStepId: 'pressure_2' },
      { text: "Yes, but they still continue to push me.", nextStepId: 'pressure_3' },
      { text: "My biggest pressure is actually comparing myself to my top-scoring peers.", nextStepId: 'pressure_peer' }
    ]
  },
  pressure_2: {
    id: 'pressure_2',
    text: "That's understandable. Often, parents push because they are anxious about your future, not because they will stop loving you if you fail. Let's write down a balanced perspective: 'My parents' anxiety is about their care for my future, but my performance is my own journey. I can only do my best.' Does this shift how you look at their words?",
    options: [
      { text: "Yes, it helps me separate their anxiety from my worth.", nextStepId: 'pressure_action' },
      { text: "It's still hard, but I see the logic.", nextStepId: 'pressure_action' }
    ]
  },
  pressure_3: {
    id: 'pressure_3',
    text: "It is incredibly tough when family pushes despite your explanations. Remember: you are the one sitting in the exam, not them. You cannot control their reaction, but you *can* control how much of their expectations you carry. Let's establish a mental boundary: 'I am writing this exam for my growth, not to purchase my parents' approval. My worth is non-negotiable.' Ready to try a grounding exercise to release this external tension?",
    options: [
      { text: "Yes, let's do a grounding exercise.", nextStepId: 'run_grounding' },
      { text: "I'd like to see the action step for expectations.", nextStepId: 'pressure_action' }
    ]
  },
  pressure_peer: {
    id: 'pressure_peer',
    text: "Peer comparison is a trap. In the social media/WhatsApp era, everyone shares their best scores and hides their struggles. You are comparing your *insides* (your anxiety, doubts, backlogs) with their polished *outsides*. Let's reframe: 'I am on my own track. Their speed has nothing to do with my success.' How does that feel?",
    options: [
      { text: "It's true. I don't know their real struggles.", nextStepId: 'pressure_action' },
      { text: "I need to stop asking them about their scores.", nextStepId: 'pressure_action' }
    ]
  },
  pressure_action: {
    id: 'pressure_action',
    text: "Your action step: Write down on a piece of paper: 'I am doing this exam for myself. My worth is not tied to a rank.' Fold it and keep it on your desk. For the next 24 hours, mute all exam-related peer group chats. Can you do this for your peace of mind?",
    options: [
      { text: "Yes, I will mute the groups and write the note.", nextStepId: 'finish_flow' },
      { text: "Let's do a quick box breathing to seal this boundary.", nextStepId: 'run_breathing' }
    ]
  },

  // FLOW D: BURNOUT & EXHAUSTION
  burnout_1: {
    id: 'burnout_1',
    text: "Burnout is physical and mental defense. Your brain is telling you: 'I have reached my capacity, and I need rest.' When we force ourselves to study through burnout, our efficiency drops to near-zero, and we feel guilt. What physical symptoms of burnout are you feeling?",
    options: [
      { text: "Constant headaches, eye strain, and general physical tiredness.", nextStepId: 'burnout_2' },
      { text: "I sit with my books open but cannot process a single sentence.", nextStepId: 'burnout_2' },
      { text: "Insomnia, racing thoughts, and waking up tired.", nextStepId: 'burnout_sleep' }
    ]
  },
  burnout_sleep: {
    id: 'burnout_sleep',
    text: "Exam insomnia is highly common. The racing mind prevents the brain from entering recovery mode. Remember: 1 hour of sleep is worth 3 hours of half-awake midnight studying. Let's make a deal. If you cannot sleep, will you try box breathing instead of looking at your phone or textbooks?",
    options: [
      { text: "Yes, I will try breathing next time.", nextStepId: 'burnout_2' },
      { text: "It's hard, but I will try to keep books away before sleep.", nextStepId: 'burnout_2' }
    ]
  },
  burnout_2: {
    id: 'burnout_2',
    text: "Rest is not a reward for studying; it is a *requirement* for studying. Just like a phone needs charging, your brain needs downtime to consolidate memories. Let's reframe: 'Resting is productive because it restores my brain's capability to learn.' Can you give yourself permission to take a guilt-free rest today?",
    options: [
      { text: "Yes, I need to take a break.", nextStepId: 'burnout_action' },
      { text: "I feel too guilty when I don't study.", nextStepId: 'burnout_guilt' }
    ]
  },
  burnout_guilt: {
    id: 'burnout_guilt',
    text: "Guilt is just a habit. Look at it mathematically: 2 hours of focused study with a refreshed brain yields *more* retention than 6 hours of staring blankly at a page while exhausted. Resting *is* preparing. Let's reframe: 'Taking a break now ensures I don't crash before the exam.' Ready to take a break?",
    options: [
      { text: "Yes, let's take a break.", nextStepId: 'burnout_action' }
    ]
  },
  burnout_action: {
    id: 'burnout_action',
    text: "Your action step: Shut down your books, close all tabs, and do a 15-minute screen-free break. Take a shower, lay down, or listen to instrumental music. No phones, no studying. Can you do this right now?",
    options: [
      { text: "Yes, I'm closing my books now.", nextStepId: 'finish_flow' },
      { text: "Let's do a box breathing exercise together to ease into the break.", nextStepId: 'run_breathing' }
    ]
  },

  // UTILITY FLOWS
  exercise_choice: {
    id: 'exercise_choice',
    text: "Great choice. Taking a physical pause is the fastest way to shut down high-intensity anxiety. Which exercise would you like to try?",
    options: [
      { text: "Guided Box Breathing (4-4-4-4 technique)", nextStepId: 'run_breathing' },
      { text: "5-4-3-2-1 Sensory Grounding Wizard", nextStepId: 'run_grounding' }
    ]
  },
  run_breathing: {
    id: 'run_breathing',
    text: "Opening the Guided Box Breathing tool for you. Focus on the expanding bubble and let your body settle.",
    actionEffect: 'show_breathing'
  },
  run_grounding: {
    id: 'run_grounding',
    text: "Opening the 5-4-3-2-1 Grounding Wizard. This will help bring your awareness back to the physical room.",
    actionEffect: 'show_grounding'
  },
  run_timer: {
    id: 'run_timer',
    text: "Opening the Pomodoro Study Timer. We will set a 25-minute focus session with a calming break.",
    actionEffect: 'show_timer'
  },
  finish_flow: {
    id: 'finish_flow',
    text: "You've taken a wonderful step for your mental wellness today. Remember that exams are a test of persistence, and being kind to yourself is key to staying persistent. You can check back here anytime you feel overwhelmed. Wish you all the best!",
    options: [
      { text: "Back to starting options", nextStepId: 'start' }
    ]
  }
};
import type { ToolActionEffect } from '../types/wellness';
