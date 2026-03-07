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

export const BORDER_FRAME_INSTRUCTION = `### STYLIST FRAME PROTOCOL ###
Wrap content in a double border: border: 4px double #ea580c; padding: 25px; border-radius: 12px;`;
export const GLOBAL_STRICT_COMMAND = `### NEURAL ARCHITECTURAL SPECIFICATION: ANTI-ROBOT PROTOCOL ###
You are the "DPSS ULTIMATE TEST BUILDER" engine. Your primary objective is to destroy robotic testing patterns and enforce situational logic.

1. [NO-FREE-VERB RULE]:
   - In multiple-choice grammar questions, never place the main auxiliary or modal verb directly in the question stem if it reveals the structure being tested.
   - Weak design: "You must ____ a helmet."
   - Stronger design: "You ____ a helmet."
   - The second version forces students to decide between obligation, advice, or external rule (must wear, have to wear, should wear). They must process meaning, not just grammar form.
   - FOR FILL-IN-THE-BLANK (Grammar Only): ALWAYS provide the base verb in parentheses AFTER the blank: "He ____ (go) to school."

1.1. [SITUATIONAL EVIDENCE REQUIREMENT]:
   - Grammar must be inferred from context, not obvious time markers such as yesterday, tomorrow, now, or at the moment.
   - Weak design: "She ____ her homework yesterday."
   - Stronger design: "Her notebook is closed. She ____ her homework."

2. [PURE VOCABULARY CONTROL]:
   - In vocabulary sections, all answer choices must be the same part of speech and grammatical form.

3. [READING & VOCABULARY GRAMMAR BLACKOUT]:
   - In Reading and Vocabulary sections, you are FORBIDDEN from testing grammar.
   - All distractors must be grammatically identical to the correct answer. 

4. [HORIZONTAL MCQ COMPRESSION]:
   - For short options (less than 5 words): You MUST print all four options on a SINGLE horizontal line.
   - Format: A. [text]          B. [text]          C. [text]          D. [text]
   - Use exactly 10 non-breaking spaces between options. 

5. [BLANK STYLE PROTOCOL]:
   - Use the style "____" (Shift + Underscore) consistently.

6. [ANSWER KEY ENTROPY - BUCKET RANDOMIZATION]:
   - Strictly FORBIDDEN from using cycles (A-B-C-D).
   - MANDATORY PRESENCE: Every letter (A, B, C, D) MUST appear at least once in every 10-item set.
   - ANSWER-FIRST RULE: Write the final shuffled answer key at the very top of internal scratchpad.

7. [BALANCED COLUMN DISTRIBUTION]:
   - If using 2-column layout, distribute items evenly.

8. [CROSS-ITEM FIREWALL - ANTI-LEAKING]:
   - FORBIDDEN from using the same sentence or answer in different parts of the test.

9. [NO MARKDOWN]: HTML tags ONLY (<b>, <table>). No asterisks. DO NOT use <u> tags.
10. [CLARITY]: Ban "AI-speak" like "He knows lines". Use natural child-level actions.
11. [ITEM RANDOMIZATION & ENTROPY]:
   - Shuffle all sentence structures, subjects, and contexts. Mix (+), (-), and (?) forms.

12. [LEVEL-BASED ARCHITECTURAL SCALING]:
   - Complexity MUST scale with {{LEVEL}}.

13. [UNIVERSAL SITUATIONAL & POSITIONAL LOGIC]:
   - Apply situational nuance and word-position rules.
   - POSITION RULES: Test tricky word orders like "as good a student as".
   - MODAL TRAP: Always include "must to [verb]" as an incorrect distractor.

14. [INFINITE SCENARIO VARIETY]:
   - Every test must be a fresh set of characters, locations, and situations. No robot patterns.

14.1. [NARRATIVE COHESION PROTOCOL]:
   - Items in a single section should share a "Narrative Arc" or common story theme.

15. [ANTI-ROBOT SENTENCE STARTERS]:
   - FORBIDDEN from using repetitive sentence starters. Randomize all subjects.

16. [FLOATING MARKER PRINCIPLE]:
   - Vary sentence structure position of key grammar signals.

17. [TOTAL RULE EXHAUSTION & PRECISION NODES]:
   - MANDATED to test every sub-rule of {{TOPIC}}, especially rare structures.
   - If testing Adjectives, MUST include: "as good a student as", "the taller of the two", and "the more... the more".

18. [CRITICAL PROTOCOL ENFORCEMENT]:
   - Protocols prioritize all other instructions.

19. [WORD FORM SHIFT RULE]:
   - Reading questions must paraphrase. Text: "renovated" -> Question: "condition was improved."

20. [CRITICAL OBLIGATION LOGIC - MUST VS HAVE TO]:
   - INTERNAL (Opinion/Advice): Use "must". Example: "Angkor Wat is beautiful. You MUST visit it."
   - EXTERNAL (Rules/Laws/Policies): Use "have to/has to". Example: "School policy says students HAS TO wear a tie."
   - TRAP: MUST include "must to" as a wrong option.

21. [STRICT NON-MCQ FORMATTING]:
   - REWRITE: Use long line. COMPLETE: Use _____________ (verb). T/F: Use (_____).

22. [EXPERT HUMAN READING EXAMINER MODE]:
   - RED HERRING PROTOCOL: Include details that distract (multiple days/times mentioned).
   - GLOBAL COMPREHENSION: Always include one question about the overall theme/purpose.

25. [INDENTATION RULE]:
   - Every numbered item MUST be preceded by exactly 6 non-breaking spaces.

30. [RANDOMIZED HEROIC FINALE]:
   - RANDOMIZE between Style A and Style B (50/50 chance):
   - STYLE A (Hero Team-Up): Pick 1 Superhero AND/ OR 1 Three Kingdoms Legend. Format: "Guardian: [Hero] & Strategist: [Legend]".
   - STYLE B (The Symbols): Use ONE or TWO Icons: for example 🛡️ | ⚔️ | 📜.
   - ALWAYS INCLUDE: Heroic quote + "Pre5-Chanthy-S2-20Copies-({{TOPIC}})" in bold. Wrap in double-border HTML box.`;
export const DEFAULT_STRICT_RULES: StrictRule[] = [
  { id: 'rule-precision-1', label: 'PRECISION TRAP LOGIC', description: 'Forces secondary grammar nuances.', promptInjection: 'STRICT: Every item must test a primary rule and a secondary nuance.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'rule-no-markdown', label: 'RULE 2: NO MARKDOWN', description: 'Ban asterisks. Use HTML tags only.', promptInjection: 'STRICT: HTML tags ONLY (<b>, <table>). No asterisks.', active: true, priority: 'High', category: 'General' }
];

export const DEFAULT_MASTER_PROTOCOLS: StrictRule[] = [
  { id: 'mp-1', label: 'NO-FREE-VERB RULE', description: 'Prevents giving away verb.', promptInjection: 'Never place the main auxiliary or modal verb directly in the question stem.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-advanced-comparison', label: 'ADVANCED COMPARISON STRUCTURES', description: 'Tests "as good a student as" and "the taller of the two".', promptInjection: 'STRICT: Test rare structures. distractor MUST include "as a good student as" (incorrect).', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-human-test', label: 'HUMAN-TEST ARCHITECTURE', description: 'Enforces exam-writer logic.', promptInjection: 'STRICT: 1. Simple vocab. 2. Thinking depth. 3. Global Comprehension: Always include a "Main Purpose" or "Best Title" question.', active: true, priority: 'High', category: 'Reading' },
  { id: 'mp-reference-logic', label: 'PRONOUN REFERENCE TESTING', description: 'Tests "What does IT refer to?".', promptInjection: 'Include at least one Reference Resolution question per passage.', active: true, priority: 'High', category: 'Reading' },
  { id: 'mp-pragmatic-boundary', label: 'STRICT OBLIGATION (ANGKOR WAT)', description: 'Must (Opinion) vs Have to (Rule).', promptInjection: 'STRICT: Personal opinion = MUST (Angkor Wat). Official rules = HAVE TO (Policy). Trap: "must to".', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-interference-trap', label: 'L1 INTERFERENCE TRAP', description: 'Common mistakes.', promptInjection: 'STRICT: Use common mistakes like "I am boring" as distractors.', active: true, priority: 'High', category: 'Grammar' }
];

export const INITIAL_TEMPLATES: InstructionTemplate[] = [
  { id: 'g_full_mastery', category: 'GRAMMAR', label: 'FULL GRAMMAR TEST', prompt: 'PART: FULL GRAMMAR TEST. 1. C/I, 2. MCQ, 3. Circle, 4. Double-Gap. {{COUNT}} items each.', columnCount: 0 },
  { id: 'r_full_mastery', category: 'READING', label: 'FULL READING TEST', prompt: 'Generate 6-part test. Apply Human-Test Architecture. Apply Global Comprehension.', columnCount: 0 },
  { id: 'g_mcq', category: 'GRAMMAR', label: 'MCQ', prompt: 'Part: Precision MCQ testing {{TOPIC}}. Apply MUST vs HAVE TO logic. Include "must to" trap.', columnCount: 0 },
  { id: 'g_teacher_mode', category: 'GRAMMAR', label: 'TEACHER MODE: ERROR CORRECTION', prompt: 'Generate paragraph with 5 deliberate errors for {{TOPIC}}. Student must rewrite correctly.', columnCount: 0 }
];
export const INITIAL_TEMPLATES: InstructionTemplate[] = [
  // --- FULL TEST COMBINATIONS ---
  { id: 'g_full_mastery', category: 'GRAMMAR', label: 'FULL GRAMMAR TEST', prompt: 'PART: FULL GRAMMAR TEST. Generate a 4-part test. ITEM COUNT: Generate exactly {{COUNT}} items for EACH part. NUMBERING: Number every single item in each part starting from 1. PARTS: 1. Write C (correct) or I (incorrect), 2. MCQ, 3. Circle the correct answers, 4. Double-Gap MCQ. Apply NO-FREE-VERB mandate.', columnCount: 0 },
  { id: 'v_full_mastery', category: 'VOCABULARY', label: 'FULL VOCABULARY TEST', prompt: 'PART: FULL VOCABULARY TEST. Generate a 4-part test. ITEM COUNT: Generate exactly {{COUNT}} items for EACH part. NUMBERING: Number every single item in each part starting from 1. PARTS: 1. MATCHING, 2. TRUE/FALSE (Definition-based), 3. MCQ, 4. SPEAKING Practice. Apply Pure Vocabulary Firewall. STRICT: NO Reading passages.', columnCount: 0 },
  { id: 'r_full_mastery', category: 'READING', label: 'FULL READING TEST', prompt: 'PART: FULL READING TEST. Generate a 6-part test. ITEM COUNT: Generate exactly {{COUNT}} items for EACH part. NUMBERING: Number every single item in each part starting from 1. PARTS: 1. Reading MCQ, 2. WRITE NO MORE THAN TWO WORDS or/and Number, 3. MCQ, 4. Inferential Comprehension, 5. MATCHING HEADING, 6. TRUE/FALSE/NOT GIVEN. Apply Reading Logic Firewall.', columnCount: 0 },

  // GRAMMAR
  { id: 'g_complete_sentences', category: 'GRAMMAR', label: 'COMPLETE THE FOLLOWING SENTENCES.', prompt: 'Part: Write the correct form of the word in brackets for {{TOPIC}}. Use the style _____________ (13 underscores) and provide the base verb in parentheses at the end of the blank. Apply Result-Based Tense logic. STRICT: No MCQ options.', columnCount: 0 },
  { id: 'g_complete_task', category: 'GRAMMAR', label: 'COMPLETE THE FOLLOWING SENTENCES.', prompt: 'Part: Complete the following sentences about {{TOPIC}}. Use the style _____________ (13 underscores) for all items. Rotate structures. STRICT: No MCQ options. This is a writing task.', columnCount: 0 },
  { id: 'g_correct_incorrect', category: 'GRAMMAR', label: 'WRITE C (CORRECT) OR I (INCORRECT).', prompt: 'Part: Correct or Incorrect assessment for {{TOPIC}}. Write C for correct and I for incorrect. Randomize to Use the style for the whole test"1. _____" or "1. _____"  (5 underscores). Apply PRAGMATIC BOUNDARY logic (Must vs Have to). STRICT: No MCQ options.', columnCount: 0 },
  { id: 'g_rewrite_sentences', category: 'GRAMMAR', label: 'REWRITE THE FOLLOWING SENTENCES.', prompt: 'Part: Rewrite the sentences about {{TOPIC}}. Use Rule 7 Conceptual Paraphrasing. STRICT: No MCQ options. Provide a long blank line (_____________________________________________________) for each item.', columnCount: 0 },
  { id: 'g_mcq', category: 'GRAMMAR', label: 'MCQ', prompt: 'Part: Precision MCQ testing {{TOPIC}}. Apply PRAGMATIC BOUNDARY logic. Stems must be situational (e.g., "Grandfather is alone"). Options MUST include correct and incorrect forms (e.g., must visit vs must visits) AND the pragmatically wrong modal (e.g., have to visit).', columnCount: 0 },
  { id: 'g_spelling', category: 'GRAMMAR', label: 'SPELLING RULES', prompt: 'Part: Spelling rules and common errors related to {{TOPIC}}. STRICT: No MCQ options.\nFor example, \nPlural Nouns\n4 columns: 1 singular, 2 plural, 3 singular, 4 plural\n\nif \nAdjective comparison\n6 columns: 1 positive, 2comparative, 3 superlative, 4, 5, 6...', columnCount: 0 },
  { id: 'g_circle', category: 'GRAMMAR', label: 'CIRCLE THE CORRECT OPTION.', prompt: 'Part: Circle the correct option between two choices in parentheses for {{TOPIC}}. STRICT: No MCQ options.', columnCount: 0 },
  { id: 'g_box', category: 'GRAMMAR', label: 'WORDS IN THE BOX.', prompt: 'Part: Complete the following sentences using the words/ phrases in the box. Check the correct forms of grammar for {{TOPIC}}. STRICT: No MCQ options.', columnCount: 0 },
  { id: 'g_pair', category: 'GRAMMAR', label: 'PAIR OF WORDS TO COMPLETE THE SENTENCE.', prompt: 'Part: Double-gap MCQ testing two different aspects of {{TOPIC}} in one sentence.', columnCount: 0 },
  { id: 'g_copy', category: 'GRAMMAR', label: 'COPY FROM THE BOOK.', prompt: 'Part: Copy exercises from the source material for {{TOPIC}}, but randomize the exercise numbers and order. STRICT: No MCQ options.', columnCount: 0 },
  { id: 'g_odd_one_out', category: 'GRAMMAR', label: 'ODD ONE OUT', prompt: '3 answer choices: Choose the incorrect sentence.', columnCount: 0 },
  { id: 'g_editing', category: 'GRAMMAR', label: 'EDITING A PARAGRAPH (ERROR HUNT)', prompt: 'Editing a Paragraph (Error Hunt): This is the mixed grammar test. The answer can be any types of grammar lessons. Correct all the mistakes.', columnCount: 0 },
  { id: 'g_reduce', category: 'GRAMMAR', label: 'REDUCE THE SENTENCE', prompt: 'Reduce the Sentence: Rewrite using fewer words.', columnCount: 0 },
  { id: 'g_best_rewrite', category: 'GRAMMAR', label: 'CHOOSE THE BEST REWRITE', prompt: 'Choose the Best Rewrite', columnCount: 0 },
  { id: 'g_cloze_paragraph', category: 'GRAMMAR', label: 'CLOZE PASSAGE (FULL PARAGRAPH)', prompt: 'Cloze Passage (Full Paragraph): Fill in the blanks.', columnCount: 0 },
  { 
    id: 'g_teacher_mode', 
    category: 'GRAMMAR', 
    label: 'TEACHER MODE: ERROR CORRECTION', 
    prompt: 'PART: TEACHER MODE. Generate a paragraph that looks like it was written by a student. It must contain exactly 5 deliberate grammar errors related to {{TOPIC}}. Underneath, provide 5 lines for the student to rewrite the sentences correctly. This tests the ability to "Edit" like a teacher.', 
    columnCount: 0 
  },
  
  // READING
  { id: 'r_mcq_rule7', category: 'READING', label: 'READING MCQ (RULE 7)', prompt: 'Part: Reading passage about {{TOPIC}}. Apply Rule 7 Zero Overlap. Apply Reading Logic Firewall. Apply [HUMAN-TEST ARCHITECTURE].', columnCount: 0 },
  { id: 'r_tfng', category: 'READING', label: 'A: READING TRUE/FALSE/NOT GIVEN', prompt: 'Part: Generate a short (~120 words) public notice or rules text about {{TOPIC}}. Follow with True/False/Not Given questions testing information boundaries. Use style "1. (_____)" (5 underscores). STRICT: No MCQ options.', columnCount: 0 },
  { id: 'r_tf_stmt', category: 'READING', label: 'B: TRUE/ FALSE STATEMENT', prompt: 'Part: Generate a short-medium (~150 words) personal recount or blog post about {{TOPIC}}. Follow with True/ False statements using heavy synonyms and word-form changes. Use style "1. (_____)" (5 underscores). STRICT: No MCQ options.', columnCount: 0 },
  { id: 'r_matching_heading', category: 'READING', label: 'C: MATCHING HEADING', prompt: 'Part: Generate a medium (~250 words) informational article with 4-5 distinct paragraphs about {{TOPIC}}. Follow with a Matching Headings task. STRICT: No MCQ options.', columnCount: 0 },
  { id: 'r_short_answer', category: 'READING', label: 'D: WRITE NO MORE THAN TWO WORDS OR/AND NUMBER', prompt: 'Part: Generate a medium (~200 words) process or factual description about {{TOPIC}}. Follow with fill-in-the-blank summary sentences requiring exact words from the text. STRICT: No MCQ options.', columnCount: 0 },
  { id: 'r_inferential', category: 'READING', label: 'E: INFERENTIAL COMPREHENSION', prompt: 'Part: Generate a medium-long (~300 words) opinion piece or review about {{TOPIC}}. Follow with discussion questions testing author attitude and implications. STRICT: No MCQ options.', columnCount: 0 },
  { id: 'r_mcq', category: 'READING', label: 'F: MCQ', prompt: 'Part: Generate a long (~400 words) complex narrative about {{TOPIC}}. Follow with MCQ testing critical thinking.', columnCount: 0 },
  { id: 'r_ket', category: 'READING', label: 'G: KET FULL TEST', prompt: 'Part: Generate a full Cambridge KET (A2 Key) Reading test about {{TOPIC}}. Ensure non-MCQ parts follow the strict formatting rules.', columnCount: 0 },
  { id: 'r_matching_info', category: 'READING', label: 'MATCHING INFORMATION', prompt: 'Which paragraph mentions:', columnCount: 0 },
  { id: 'r_inference_qs', category: 'READING', label: 'INFERENCE QUESTIONS', prompt: 'Inference Questions: \nWhat can we infer about the writer’s attitude?\n\nWhy did she hesitate?\n....?', columnCount: 0 },
  { id: 'r_critical_thinking', category: 'READING', label: 'CRITICAL THINKING', prompt: 'short sometimes can be long based on the level independence Paragraph ending or questions from the full paragraph.\n\nFor example, \n1- she is a great student. she pays attention to her friends. What the girl is likely to do...?\n2- \nCritical Thinking: Do you? \nThe girl is likely to....?\nSok bought her sister a pencil because __________', columnCount: 0 },
  
  // VOCABULARY
  { id: 'v_study_table', category: 'VOCABULARY', label: 'VOCABULARY STUDY', prompt: 'VOCABULARY TABLE. Instructions: Study the following words and their definitions. Use a 2-column HTML table. Column 1: Number + Word/Phrase. Column 2: Easy Definition. STRICT: No MCQ options.', columnCount: 2 },
  { id: 'v_sentence_study', category: 'VOCABULARY', label: 'SENTENCE STUDY', prompt: 'VOCBAULARY STUDY: Study this vocabulary in the sentences. STRICT: No MCQ options. These are example sentences for learning.', columnCount: 0 },
  { id: 'v_supply_terms', category: 'VOCABULARY', label: 'SUPPLY KEY TERMS', prompt: 'SUPPLY KEY TERMS: Instructions: Read the definition and write the correct key term. Use a 2-column HTML table. Column 1: Easy Definition. Column 2: Blank line for Key Term. Randomize order. STRICT: No MCQ options.', columnCount: 2 },
  { id: 'v_box', category: 'VOCABULARY', label: 'VOCABULARY BOX', prompt: 'FILL-IN-THE-BLANK. Instruction: Choose the correct words/phrases from the box to complete the following sentences. Use long blanks. STRICT: No MCQ options.', columnCount: 0 },
  { id: 'v_matching', category: 'VOCABULARY', label: 'DEFINITION MATCHING', prompt: 'MATCHING. Instruction: Match the following vocabulary words with their correct definitions. Use a standard list format. STRICT: No MCQ options.', columnCount: 0 },
  { id: 'v_copy', category: 'VOCABULARY', label: 'COPY EXERCISES', prompt: '4. Copy: Copy the following exercises into your notebook. STRICT: No MCQ options.', columnCount: 0 },
  { id: 'v_synonym_swap', category: 'VOCABULARY', label: 'REWRITE WITH A SYNONYM', prompt: 'CONTEXTUAL SYNONYM SWAP . Instruction: Rewrite each sentence using a synonym for the underlined word. Use a long blank line. STRICT: No MCQ options.', columnCount: 0 },
  { id: 'v_mcq', category: 'VOCABULARY', label: 'PART C6: MCQ', prompt: 'MCQ. Instructions: Choose the best option (A, B, C, or D) to complete each sentence. Apply Grammar Blackout.', columnCount: 0 },
  { id: 'v_tf', category: 'VOCABULARY', label: 'TRUE/FALSE', prompt: 'True/False (Vocabulary Meaning): Instruction: Read the statements and write T (True) or F (False). Use style "1. (_____)" (5 underscores). STRICT: No MCQ options.', columnCount: 0 },
  { id: 'v_speaking', category: 'VOCABULARY', label: 'SPEAKING (DISCUSS WITH A PARTNER)', prompt: 'SPEAKING. Instruction: Discuss the following questions with your partner. Generate open-ended discussion questions related to {{TOPIC}}. STRICT: No MCQ options.', columnCount: 0 },
  { id: 'v_synonyms', category: 'VOCABULARY', label: 'SYNONYMS', prompt: 'SYNONYMS WRITING \nWrite the following synonyms\n5 columns: 1 vocabulary, 2 synonym 1, 3, syn 2, ....\nIf there are more than 5 synonyms, please have another row.', columnCount: 5 },
  { id: 'v_synonym_writing', category: 'VOCABULARY', label: 'SYNONYM WRITING', prompt: 'SYNONYM WRITING \nWrite the following synonyms\n5 columns: 1 vocabulary, 2 synonym 1, 3, syn 2, ....\nIf there are more than 5 synonyms, please have another row.', columnCount: 5 },
  { id: 'v_circle', category: 'VOCABULARY', label: 'CIRCLE THE CORRECT WORD', prompt: 'CIRLCE: \nCircle the Correct Word', columnCount: 0 },
  { id: 'v_cloze', category: 'VOCABULARY', label: 'CLOZE PASSAGE', prompt: 'CLOZE PASSAGE\nCloze Passage', columnCount: 0 }
];
