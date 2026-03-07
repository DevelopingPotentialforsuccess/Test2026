import { Theme, StrictRule, AcademicLevel, InstructionTemplate } from './types';

export const INITIAL_MODULES = ['Grammar', 'Reading', 'Vocabulary'];

export const LANGUAGES = ['English', 'Khmer', 'Chinese', 'Korean', 'French'];

export const ACADEMIC_LEVELS: AcademicLevel[] = [
  'Kid' as any, 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 
  'Level 6', 'Level 7', 'Level 8', 'Level 9', 'Level 10', 'Level 11', 'TOEFL' as any, 'IELTS' as any
];

export const THEMES: Theme[] = [
  { id: 'default', name: 'Academic Classic', color: '#ea580c', bg: '#ffffff', accent: '#f97316' },
  { id: 'modern', name: 'Modern Professional', color: '#0f172a', bg: '#ffffff', accent: '#334155' },
  { id: 'royal', name: 'Royal Blueprint', color: '#1e3a8a', bg: '#f8fafc', accent: '#3b82f6' },
  { id: 'forest', name: 'Forest Scholar', color: '#064e3b', bg: '#f0fdf4', accent: '#10b981' },
  { id: 'crimson', name: 'Crimson Archive', color: '#7f1d1d', bg: '#fef2f2', accent: '#ef4444' },
  { id: 'midnight', name: 'Midnight Architect', color: '#1e293b', bg: '#0f172a', accent: '#6366f1' },
  { id: 'beach', name: 'Tropical Beach', color: '#0284c7', bg: 'linear-gradient(to bottom, #bae6fd, #fef3c7)', accent: '#0ea5e9' },
  { id: 'sunset', name: 'Sunset Horizon', color: '#9d174d', bg: 'linear-gradient(to top right, #fdf2f8, #fff7ed)', accent: '#db2777' },
  { id: 'nebula', name: 'Deep Nebula', color: '#7c3aed', bg: 'radial-gradient(circle at center, #2e1065, #0f172a)', accent: '#8b5cf6' },
  { id: 'zen', name: 'Zen Garden', color: '#4d7c0f', bg: '#f7fee7', accent: '#65a30d' },
];

export const GLOBAL_STRICT_COMMAND = `### NEURAL ARCHITECTURAL SPECIFICATION: ANTI-ROBOT PROTOCOL ###
You are the "DPSS ULTIMATE TEST BUILDER" engine. Your objective is to destroy robotic patterns and enforce situational logic.

1. [NO-FREE-VERB RULE]:
   - Never place the main modal/auxiliary in the stem if it reveals the answer.
   - Weak: "You must ____ a helmet." | Strong: "You ____ a helmet."
   - FOR FILL-IN-THE-BLANK: ALWAYS provide base verb in parentheses: "He ____ (go) to school."

1.1. [SITUATIONAL EVIDENCE REQUIREMENT]:
   - Grammar must be inferred from context, not time markers like yesterday/now.

2. [PURE VOCABULARY CONTROL]:
   - All answer choices must be the same part of speech and grammatical form.

3. [READING & VOCABULARY GRAMMAR BLACKOUT]:
   - FORBIDDEN from testing grammar in Reading/Vocab sections. Distractors must be grammatically identical.

4. [HORIZONTAL MCQ COMPRESSION]:
   - Short options MUST be on ONE horizontal line: A. [text]          B. [text]          C. [text]          D. [text]
   - Use exactly 10 non-breaking spaces between options.

5. [BLANK STYLE PROTOCOL]:
   - Use the style "____" (Shift + Underscore). No brackets.

6. [ANSWER KEY ENTROPY]:
   - Assign keys BEFORE content. Max streak of 2 identical answers. Use all letters (A-D) in every 10 items.

7. [BALANCED COLUMN DISTRIBUTION]:
   - If using 2-column layout, distribute items evenly (5/5 split).

8. [CROSS-ITEM FIREWALL]:
   - FORBIDDEN from repeating sentences or correct answers across different parts.

9. [NO MARKDOWN]: HTML tags ONLY (<b>, <table>). No asterisks. No <u> tags.

10. [CLARITY]: Ban "AI-speak" (e.g., "views print"). Use natural child-level actions.

11. [ITEM RANDOMIZATION]: Shuffle all structures and subjects. Mix (+), (-), and (?) forms.

12. [LEVEL-BASED SCALING]: Complexity MUST scale with {{LEVEL}}.

13. [UNIVERSAL SITUATIONAL & POSITIONAL LOGIC]:
   - Adjective Comparison Traps: Test "as good a student as" (correct) vs "as a good student as" (incorrect).
   - Test "the taller of the two" vs "the tallest of the two".
   - MODAL TRAP: Always include "must to [verb]" as an incorrect distractor.

14. [INFINITE SCENARIO VARIETY]: Every test must be a fresh set of characters and locations.

14.1. [NARRATIVE COHESION]: Items in a section should share a "Narrative Arc" or story theme.

15. [ANTI-ROBOT STARTERS]: FORBIDDEN from repeating sentence starters like "I think".

16. [FLOATING MARKER]: Vary position of key grammar signals.

17. [TOTAL RULE EXHAUSTION & PRECISION NODES]:
   - MANDATED to test every sub-rule of {{TOPIC}}, including rare structures like "the more... the more".

18. [CRITICAL PROTOCOL ENFORCEMENT]: Prioritize protocols over all other instructions.

19. [WORD FORM SHIFT]: Reading questions must paraphrase. Text: "renovated" -> Question: "condition was improved."

20. [MUST VS HAVE TO LOGIC]:
   - INTERNAL (Opinion/Advice): Use "must". (e.g., "Angkor Wat is beautiful. You MUST visit it.")
   - EXTERNAL (Rules/Policies): Use "have to/has to". (e.g., "School policy says students HAVE TO wear ties.")
   - TRAP: MUST include "must to" as a wrong option.

21. [STRICT NON-MCQ FORMATTING]: Rewrite (long line), Complete (13 underscores), T/F (parentheses).

22. [EXPERT HUMAN READING EXAMINER]:
   - RED HERRING: Include distracting details (e.g. mention multiple dates/times).
   - GLOBAL COMPREHENSION: Always include one "Main Purpose" or "Best Title" question.

25. [INDENTATION]: Every numbered item MUST have exactly 6 non-breaking spaces before it.

30. [RANDOMIZED HEROIC FINALE]:
   - Randomize between Style A and Style B (50/50 chance):
   - STYLE A (Hero Team-Up): Visual Pictures, not words" Pick 1 Superhero (e.g. Batman, Superman) AND 1 Three Kingdoms Legend (e.g. Liu Bei, Guan Yu). 
     Format: "Guardian: [Hero] & Strategist: [Legend]"
   - STYLE B (The Symbols): Use Icons: 🛡️ | ⚔️ | 📜
   - MANDATORY: Powerful hero quote + "Pre5-Chanthy-S2-20Copies-({{TOPIC}})" in bold. Wrap in double-border HTML box.`;

export const BORDER_FRAME_INSTRUCTION = `### STYLIST FRAME PROTOCOL ###
Wrap content in a double border: border: 4px double #ea580c; padding: 25px; border-radius: 12px;`;

export const DEFAULT_STRICT_RULES: StrictRule[] = [
  { id: 'rule-precision-1', label: 'PRECISION TRAP LOGIC', description: 'Forces secondary grammar nuances.', promptInjection: 'STRICT: Every item must test a primary rule and a secondary nuance.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'rule-logic-1', label: 'PATTERN DESTRUCTION', description: 'Rotate sentence structures.', promptInjection: 'STRICT: Max 2 identical structures in a row.', active: true, priority: 'High', category: 'General' },
  { id: 'rule-no-ai-speak', label: 'RULE 1: NO AI-SPEAK', description: 'Ban robotic phrases.', promptInjection: 'Ban "AI-speak" like "views print". Use natural actions.', active: true, priority: 'High', category: 'General' },
  { id: 'rule-no-markdown', label: 'RULE 2: NO MARKDOWN', description: 'HTML tags only.', promptInjection: 'STRICT: HTML tags ONLY. No asterisks.', active: true, priority: 'High', category: 'General' }
];

export const DEFAULT_MASTER_PROTOCOLS: StrictRule[] = [
  { id: 'mp-1', label: 'NO-FREE-VERB RULE', description: 'Prevents giving away verb.', promptInjection: 'Never place main auxiliary directly in stem.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-2', label: 'SITUATIONAL EVIDENCE', description: 'Inference from context.', promptInjection: 'Grammar must be inferred from situational evidence.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-3', label: 'HIGH-FIDELITY POOLING', description: 'Near-miss distractors.', promptInjection: 'Generate at least one Near-Miss distractor.', active: true, priority: 'Medium', category: 'General' },
  { id: 'mp-advanced-comparison', label: 'ADVANCED COMPARISON', description: 'Tests "as good a student as".', promptInjection: 'STRICT: Test rare structures. distractor MUST include "as a good student as" (incorrect).', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-reference-logic', label: 'PRONOUN REFERENCE TESTING', description: 'Tests "What does IT refer to?".', promptInjection: 'Include one "Reference Resolution" question per passage.', active: true, priority: 'High', category: 'Reading' },
  { id: 'mp-human-test', label: 'HUMAN-TEST ARCHITECTURE', description: 'Exforces expert design.', promptInjection: 'STRICT: 1. Simple vocab. 2. High thinking depth. 3. Global Comprehension questions.', active: true, priority: 'High', category: 'Reading' },
  { id: 'mp-pragmatic-boundary', label: 'STRICT OBLIGATION (ANGKOR WAT)', description: 'Must (Opinion) vs Have to (Rule).', promptInjection: 'STRICT RULE: Personal opinion = MUST (Angkor Wat). Official rules = HAVE TO (Policy). Trap: "must to".', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-interference-trap', label: 'L1 INTERFERENCE TRAP', description: 'Common learner mistakes.', promptInjection: 'STRICT: Use common mistakes like "I am boring" as distractors.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-answer-key', label: 'CHAOTIC ANSWER KEYS', description: 'Bucket randomization.', promptInjection: 'ANSWER-FIRST RULE: Assign keys BEFORE content.', active: true, priority: 'High', category: 'General' },
  { id: 'mp-mcq-layout', label: 'MCQ LAYOUT PROTOCOL', description: 'Horizontal formatting.', promptInjection: 'MCQ FORMATTING: Short options MUST be on ONE horizontal line with 10 spaces.', active: true, priority: 'Medium', category: 'General' }
];

export const INITIAL_TEMPLATES: InstructionTemplate[] = [
  { id: 'g_full_mastery', category: 'GRAMMAR', label: 'FULL GRAMMAR TEST', prompt: 'PART: FULL GRAMMAR TEST. 1. C/I, 2. MCQ, 3. Circle, 4. Double-Gap. ITEM COUNT: {{COUNT}} each.', columnCount: 0 },
  { id: 'r_full_mastery', category: 'READING', label: 'FULL READING TEST', prompt: 'PART: FULL READING TEST. Generate 6-part test. Apply Human-Test Architecture. Apply Global Comprehension.', columnCount: 0 },
  { id: 'v_full_mastery', category: 'VOCABULARY', label: 'FULL VOCABULARY TEST', prompt: 'PART: FULL VOCABULARY TEST. 1. Matching, 2. T/F, 3. MCQ, 4. Speaking Practice. {{COUNT}} items each.', columnCount: 0 },
  { id: 'g_mcq', category: 'GRAMMAR', label: 'MCQ', prompt: 'Part: Precision MCQ for {{TOPIC}}. Apply MUST vs HAVE TO logic. Include "must to" trap.', columnCount: 0 },
  { id: 'g_correct_incorrect', category: 'GRAMMAR', label: 'WRITE C (CORRECT) OR I (INCORRECT).', prompt: 'Part: Correct or Incorrect assessment for {{TOPIC}}. Use style "1. _____" (5 underscores).', columnCount: 0 },
  { id: 'g_teacher_mode', category: 'GRAMMAR', label: 'TEACHER MODE: ERROR CORRECTION', prompt: 'Generate paragraph with 5 deliberate errors for {{TOPIC}}. Student must rewrite correctly.', columnCount: 0 },
  { id: 'r_short_answer', category: 'READING', label: 'SHORT ANSWER (2 WORDS)', prompt: 'Generate text about {{TOPIC}}. Follow with short-answer questions (Max 2 words).', columnCount: 0 },
  { id: 'v_matching', category: 'VOCABULARY', label: 'DEFINITION MATCHING', prompt: 'MATCHING. Match words for {{TOPIC}} with definitions.', columnCount: 0 },
  { id: 'v_study_table', category: 'VOCABULARY', label: 'VOCABULARY STUDY', prompt: 'VOCABULARY TABLE. Column 1: Number+Word. Column 2: Easy Definition.', columnCount: 2 }
];
