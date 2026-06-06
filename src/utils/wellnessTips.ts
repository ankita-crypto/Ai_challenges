export interface WellnessTip {
  id: string;
  category: string;
  title: string;
  content: string;
  actionableStep: string;
}

export const EXAMS = [
  { id: 'JEE', name: 'JEE (Engineering)' },
  { id: 'NEET', name: 'NEET (Medical)' },
  { id: 'UPSC', name: 'UPSC Civil Services' },
  { id: 'BOARD', name: 'Board Exams (10th/12th)' },
  { id: 'CAT_GATE', name: 'CAT / GATE / Graduate Tests' },
  { id: 'GENERAL', name: 'General Student Life' }
];

export const DAILY_AFFIRMATIONS = [
  "My exam score does not define my intelligence, worth, or future success.",
  "I am doing the best I can, and my efforts are enough.",
  "One day, one topic, one question at a time. I can handle this.",
  "Breathing in, I calm my mind. Breathing out, I release my anxiety.",
  "I have overcome academic challenges before, and I will navigate this one too.",
  "Mistakes in mock tests are just opportunities to learn before the final day.",
  "My physical and mental health are just as important as my preparation.",
  "I trust my preparation and give myself permission to rest when tired."
];

export const examTips: Record<string, WellnessTip[]> = {
  JEE: [
    {
      id: 'jee_1',
      category: 'Mock Test Stress',
      title: 'De-linking Scores from Self-Worth',
      content: 'JEE mock tests are notoriously difficult and designed to test extreme cases. Fluctuating scores can trigger deep anxiety, making you feel unprepared.',
      actionableStep: 'Write down: "A mock test is a diagnostic tool, not a final judgment." For every incorrect question, label it as "conceptual gap", "calculation error", or "silly mistake" to make it objective rather than emotional.'
    },
    {
      id: 'jee_2',
      category: 'Problem Solving Burnout',
      title: 'The "20-Minute Block" Rule',
      content: 'Struggling with complex Physics or Maths problems for hours can lead to intense frustration and feeling "stuck".',
      actionableStep: 'If a problem takes more than 20 minutes without progress, circle it, close the book, and stand up. Walk for 2 minutes or drink water. Restoring circulation helps clear mental blocks.'
    },
    {
      id: 'jee_3',
      category: 'Competition Anxiety',
      title: 'Muting the Peer Noise',
      content: 'Hearing peer progress on syllabus completion or high mock percentiles can trigger intense comparison and panic.',
      actionableStep: 'Limit exam-related discussions with friends to 15 minutes a day. Focus on your daily targets. Your competition is only with yesterday\'s version of yourself.'
    },
    {
      id: 'jee_result',
      category: 'Result Season Anxiety',
      title: 'Navigating Cutoffs and Ranks',
      content: 'JEE results release with percentiles and rank lists that determine college entry. Seeing a rank below expectations can induce catastrophic thoughts about career options.',
      actionableStep: 'Remind yourself: "Your JEE rank determines your first college, not your career trajectory." Create a list of 5 successful software engineers/founders who graduated from local non-IIT colleges.'
    }
  ],
  NEET: [
    {
      id: 'neet_1',
      category: 'Memorization Fatigue',
      title: 'Active Recall Over passive Reading',
      content: 'The massive Biology and Chemistry syllabus leads to visual fatigue and fear of forgetting key facts.',
      actionableStep: 'Instead of re-reading chapters, close the book and write down everything you remember in a mind map, or teach the concept to an imaginary student. This active retrieval builds long-term confidence.'
    },
    {
      id: 'neet_2',
      category: 'Speed Panic',
      title: 'Managing the 200-Minute Clock',
      content: 'NEET requires rapid decision-making (180 questions in 200 minutes). This speed pressure often induces physical panic during practice.',
      actionableStep: 'Practice 10-minute speed runs with 10 easy questions. Train your nervous system to remain calm while working quickly. If a question takes over 60 seconds, skip it immediately.'
    },
    {
      id: 'neet_3',
      category: 'Physical Exhaustion',
      title: 'Restoring Oxygen and Posture',
      content: 'Long hours of sitting bent over textbooks restrict oxygen flow to the brain, causing brain fog and sleepiness.',
      actionableStep: 'Every 45 minutes, do 5 shoulder rolls and take 3 deep belly breaths. Sit up straight to keep your energy levels steady.'
    },
    {
      id: 'neet_result',
      category: 'Result Season Anxiety',
      title: 'The Score vs Rank Shock',
      content: 'NEET ranks can fluctuate wildly even for the same score due to intense competition. This can make you feel like your hard work was wasted.',
      actionableStep: 'Sit down and write down: "I did my best under extreme pressure. My rank is a reflection of competition density, not my intelligence." Discuss drop vs backup options with an objective advisor, not peer groups.'
    }
  ],
  UPSC: [
    {
      id: 'upsc_1',
      category: 'Long-term Burnout',
      title: 'The Marathon Mindset',
      content: 'Preparing for UPSC takes 1-2 years. The lack of immediate feedback and social isolation often leads to depression and feeling directionless.',
      actionableStep: 'Set strict weekly boundaries. Dedicate Sunday evenings entirely to non-exam activities. Treat this as a 9-to-5 job rather than a 24/7 obsession.'
    },
    {
      id: 'upsc_2',
      category: 'Syllabus Overwhelm',
      title: 'The "One Newspaper, One Book" Filter',
      content: 'The endless sea of current affairs and study materials creates information overload and chronic self-doubt.',
      actionableStep: 'Define your resource list and stick to it. Tell yourself: "I do not need to know everything; I need to know how to structure what I do know."'
    },
    {
      id: 'upsc_3',
      category: 'Uncertainty Panic',
      title: 'Focusing on the Input, Letting go of Output',
      content: 'With low success rates, the fear of "wasting years" can freeze your ability to study.',
      actionableStep: 'Shift your goals from output ("I must pass") to inputs ("I will complete these 3 answer-writing practices today"). Celebrate input completion.'
    },
    {
      id: 'upsc_result',
      category: 'Result Season Anxiety',
      title: 'Dealing with the "PDF Filter"',
      content: 'When the UPSC final PDF results come out, not seeing your roll number after months of interviews can trigger absolute grief and identity crisis.',
      actionableStep: 'Give yourself 48 hours to grieve without making any decision about the next attempt. Remember: "Not clearing UPSC is not a failure of intelligence; it is a statistical filter. My GS knowledge makes me an asset anywhere."'
    }
  ],
  BOARD: [
    {
      id: 'board_1',
      category: 'Parental Expectations',
      title: 'Communicating Boundaries Gently',
      content: 'Pressure from parents, teachers, and relatives to score "95%+" can feel like a crushing weight.',
      actionableStep: 'Have a calm conversation with your parents when you are *not* studying. Share: "I am working hard. When you ask me about scores constantly, it makes me anxious and decreases my productivity. I need your support instead."'
    },
    {
      id: 'board_2',
      category: 'Exam Day Fear',
      title: 'Writing Room Grounding',
      content: 'The sight of the large exam hall, strict invigilators, and rustling papers triggers high anxiety right before paper distribution.',
      actionableStep: 'As soon as you sit down, place both feet flat on the floor. Touch the wooden desk and notice its temperature. Breathe out slowly. Remind yourself: "This is just a paper with questions I have seen before."'
    },
    {
      id: 'board_result',
      category: 'Result Season Anxiety',
      title: 'Managing Relatives and Comparison',
      content: 'Board exam result days are often accompanied by calls from relatives and comparison with neighbor scores, which can feel deeply intrusive.',
      actionableStep: 'Prepare a standard polite reply: "I scored X% and I am satisfied with my efforts. Thank you for asking!" Instruct your parents to handle calls if you feel overwhelmed.'
    }
  ],
  CAT_GATE: [
    {
      id: 'cat_gate_1',
      category: 'Career Pressure',
      title: 'Defusing the "Make or Break" Trap',
      content: 'Often written by students with jobs or final-year college stress, these exams carry heavy career stakes.',
      actionableStep: 'Make a backup list of 3 other viable career routes. Knowing you have alternatives immediately reduces test-day performance anxiety.'
    },
    {
      id: 'cat_gate_2',
      category: 'Sectional Failure Anxiety',
      title: 'Resetting Between Sections',
      content: 'A bad performance in one section (like QA or VARC) can ruin your mindset for subsequent sections.',
      actionableStep: 'Develop a mental "flush" routine. When a section ends, take a deep breath, close your eyes for 5 seconds, and mentally "flush" those questions away. Focus 100% on the fresh section.'
    },
    {
      id: 'cat_gate_result',
      category: 'Result Season Anxiety',
      title: 'Handling Shortlist Rejections',
      content: 'Result season is followed by shortlisting for interviews (IIMs/IITs). Getting rejected from top-choice programs can feel like a professional dead end.',
      actionableStep: 'Create a spreadsheet of "Plan B" programs and direct corporate roles. Remember that 70% of business/technical leaders did not attend tier-1 schools but grew through consistent industry execution.'
    }
  ],
  GENERAL: [
    {
      id: 'general_1',
      category: 'Sleep Deprivation',
      title: 'The Sleep-First Rule',
      content: 'Cutting sleep to 4-5 hours to study more actually degrades cognitive retention, memory retrieval, and increases baseline anxiety.',
      actionableStep: 'Commit to at least 7 hours of sleep. An extra hour of sleep is worth more than two hours of late-night groggy reading.'
    },
    {
      id: 'general_2',
      category: 'Panic Attacks',
      title: 'Riding the Wave of Panic',
      content: 'Anxiety peaks as physical symptoms: racing heart, sweaty palms, and shallow breathing.',
      actionableStep: 'Do not fight the panic; acknowledge it: "My body is releasing adrenaline. It is temporary. It will peak and pass in 10 minutes." Engage in 4-4-4-4 box breathing.'
    },
    {
      id: 'general_3',
      category: 'Lack of Focus',
      title: 'Dopamine Reset for Study Desk',
      content: 'Constantly checking social media or exam forums for notifications ruins focus and fuels anxiety.',
      actionableStep: 'Put your phone in another room or turn it completely off during study sessions. Clear your desk of everything except the subject you are currently studying.'
    },
    {
      id: 'general_result',
      category: 'Result Season Anxiety',
      title: 'Managing Result Day Panic',
      content: 'The days leading up to result release are filled with extreme anxiety, physical symptoms, and sleeplessness.',
      actionableStep: 'Keep your routine identical to any normal day. Limit time on social media forums that speculate on result timings. Engage in visual grounding when heart rate rises.'
    }
  ]
};
