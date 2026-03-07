import { Theme, StrictRule, AcademicLevel, InstructionTemplate } from './types';

export const INITIAL_MODULES = ['Grammar', 'Reading', 'Vocabulary'];

export const LANGUAGES = ['English', 'Khmer', 'Chinese', 'Korean', 'French'];

export const ACADEMIC_LEVELS: AcademicLevel[] = [
  'Kid' as any, 'Level 1', 'Level 1', 'Level 3', 'Level 4', 'Level 5', 
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
You are the "DPSS ULTIMATE TEST BUILDER" engine. Your objective is to destroy robotic testing patterns and enforce human-level situational logic.

1. [NO-FREE-VERB RULE]:
   - Never place the main modal/auxiliary in the stem if it reveals the answer.
   - Weak: "You must ____ a helmet." | Strong: "You ____ a helmet."
   - FOR FILL-IN-THE-BLANK: ALWAYS provide base verb in parentheses: "He ____ (go) to school."

2. [MUST VS HAVE TO - ANGKOR WAT RULE]:
   - INTERNAL OBLIGATION (Opinion/Personal Advice): Use "must". Example: "Angkor Wat is beautiful. You MUST visit it."
   - EXTERNAL OBLIGATION (Official Rules/Policies/Laws): Use "have to/has to". Example: "School policy says every student HAS TO wear a tie."
   - MANDATORY TRAP: Include "must to [verb]" as an incorrect option for all modal questions to test structural knowledge.

3. [PRECISION SYNTAX & RARE RULES]:
   - Test "as good a student as" (correct) vs "as a good student as" (incorrect).
   - Test "the taller of the two" (comparative with 'the' for 2 people) vs "the tallest".

4. [HUMAN-EXAM READING ARCHITECTURE]:
   - WORD FORM SHIFT: Paraphrase all questions. Text: "building renovated" -> Question: "structure was improved."
   - RED HERRINGS: Include details in the text that distract (multiple dates/times) to stop keyword matching.
   - GLOBAL COMPREHENSION: Always include one "Main Purpose" or "Best Title" question.

5. [HORIZONTAL MCQ COMPRESSION]:
   - Short options MUST be on ONE horizontal line: A. [text]          B. [text]          C. [text]          D. [text]
   - Use exactly 10 non-breaking spaces between options.

6. [ANSWER KEY ENTROPY]:
   - Assign keys BEFORE content. Max streak of 2 identical. Use all letters (A-D) in every 10 items.

7. [INDENTATION & FORMATTING]:
   - Every numbered item MUST have exactly 6 non-breaking spaces (&nbsp;) before it.
   - NO MARKDOWN: HTML tags ONLY (<b>, <table>). No asterisks. No <u> tags.

30. [THE GUARDIAN FINALE - RANDOMIZED VISUAL FOOTER]:
   - For every generation, pick ONLY ONE style (Style A or Style B):
   
   - STYLE A (THE HERO PORTRAIT):
     - Pick ONE random Legend: Liu Bei, Guan Yu, Batman, Superman, or Zhao Yun.
     - You MUST use an <img> tag with an iconic silhouette or character URL.
     - Text: "<b>Guardian of Excellence: [Hero Name]</b>"
     
   - STYLE B (THE HERALDRY SYMBOLS):
     - You MUST display three large visual icons: 🛡️ | ⚔️ | 📜
     - Text: "<b>Mastery through Strategy. Honor through Learning.</b>"

   - FOOTER MANDATE: Wrap in a centered HTML box with double borders. Include a random heroic quote and "<b>Pre5-Chanthy-S2-20Copies-({{TOPIC}})</b>" in bold at the bottom.`;

export const BORDER_FRAME_INSTRUCTION = `### STYLIST FRAME PROTOCOL ###
Wrap content in a double border: border: 4px double #ea580c; padding: 25px; border-radius: 12px;`;

export const DEFAULT_STRICT_RULES: StrictRule[] = [
  { id: 'rule-precision-1', label: 'PRECISION TRAP LOGIC', description: 'Forces secondary grammar nuances.', promptInjection: 'STRICT: Every item must test a primary rule and a secondary nuance.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'rule-logic-1', label: 'PATTERN DESTRUCTION', description: 'Rotate sentence structures.', promptInjection: 'STRICT: Max 2 identical structures in a row.', active: true, priority: 'High', category: 'General' },
  { id: 'rule-no-ai-speak', label: 'RULE 1: NO AI-SPEAK', description: 'Ban robotic phrases.', promptInjection: 'Ban "AI-speak" like "views print". Use natural actions.', active: true, priority: 'High', category: 'General' },
  { id: 'rule-no-markdown', label: 'RULE 2: NO MARKDOWN', description: 'HTML tags only.', promptInjection: 'STRICT: HTML tags ONLY. No asterisks.', active: true, priority: 'High', category: 'General' }
];

export const DEFAULT_MASTER_PROTOCOLS: StrictRule[] = [
  { id: 'mp-1', label: 'NO-FREE-VERB RULE', description: 'Prevents giving away the verb.', promptInjection: 'Never place the main auxiliary directly in the question stem.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-pragmatic-boundary', label: 'STRICT OBLIGATION (ANGKOR WAT)', description: 'Must (Opinion) vs Have to (Rule).', promptInjection: 'STRICT: Opinion = Must (Angkor Wat). Rules = Have to (School Policy). Trap: "must to".', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-advanced-comparison', label: 'ADVANCED COMPARISON', description: 'Tests rare structures like "as good a student as".', promptInjection: 'STRICT: Test "as good a student as" and "the taller of the two".', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-human-test', label: 'HUMAN-TEST ARCHITECTURE', description: 'Enforces expert design.', promptInjection: 'STRICT: 1. Simple vocab. 2. Thinking depth. 3. Global Comprehension. 4. Red Herrings.', active: true, priority: 'High', category: 'Reading' },
  { id: 'mp-interference-trap', label: 'L1 INTERFERENCE TRAP', description: 'Common learner mistakes.', promptInjection: 'STRICT: Use common mistakes like "I am boring" as distractors.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-reference-logic', label: 'PRONOUN REFERENCE TESTING', description: 'Tests pronoun tracking.', promptInjection: 'Include "Reference Resolution" questions (e.g., "What does IT refer to?").', active: true, priority: 'High', category: 'Reading' }
];

export const INITIAL_TEMPLATES: InstructionTemplate[] = [
  // --- FULL TEST COMBINATIONS ---
  { id: 'g_full_mastery', category: 'GRAMMAR', label: 'FULL GRAMMAR TEST', prompt: 'PART: FULL GRAMMAR TEST. Generate 4 parts: 1. C/I, 2. MCQ, 3. Circle, 4. Double-Gap. ITEM COUNT: {{COUNT}} each.', columnCount: 0 },
  { id: 'v_full_mastery', category: 'VOCABULARY', label: 'FULL VOCABULARY TEST', prompt: 'PART: FULL VOCABULARY TEST. PARTS: 1. MATCHING, 2. T/F, 3. MCQ, 4. SPEAKING. Apply Grammar Blackout.', columnCount: 0 },
  { id: 'r_full_mastery', category: 'READING', label: 'FULL READING TEST', prompt: 'PART: FULL READING TEST. Generate 6 parts. Apply Human-Test Architecture Logic.', columnCount: 0 },

  // --- GRAMMAR MODULE ---
  { id: 'g_complete_sentences', category: 'GRAMMAR', label: 'COMPLETE THE FOLLOWING SENTENCES.', prompt: 'Part: Write correct verb form for {{TOPIC}}. Use style _____________ (13 underscores) and base verb in ().', columnCount: 0 },
  { id: 'g_complete_task', category: 'GRAMMAR', label: 'COMPLETE THE FOLLOWING SENTENCES (WRITING).', prompt: 'Part: Writing task about {{TOPIC}}. Use style _____________ (13 underscores). No MCQ.', columnCount: 0 },
  { id: 'g_correct_incorrect', category: 'GRAMMAR', label: 'WRITE C (CORRECT) OR I (INCORRECT).', prompt: 'Part: Correct/Incorrect for {{TOPIC}}. Write C or I. Use style "1. _____" (5 underscores).', columnCount: 0 },
  { id: 'g_rewrite_sentences', category: 'GRAMMAR', label: 'REWRITE THE FOLLOWING SENTENCES.', prompt: 'Part: Rewrite sentences about {{TOPIC}}. Provide long blank line (____________________________________).', columnCount: 0 },
  { id: 'g_mcq', category: 'GRAMMAR', label: 'MCQ', prompt: 'Part: MCQ for {{TOPIC}}. Apply MUST vs HAVE TO and PRECISION logic. Include "must to" traps.', columnCount: 0 },
  { id: 'g_spelling', category: 'GRAMMAR', label: 'SPELLING RULES', prompt: 'Part: Spelling rules table for {{TOPIC}}. Use singular/plural/comparative columns.', columnCount: 0 },
  { id: 'g_circle', category: 'GRAMMAR', label: 'CIRCLE THE CORRECT OPTION.', prompt: 'Part: Circle the correct choice in parentheses for {{TOPIC}}.', columnCount: 0 },
  { id: 'g_box', category: 'GRAMMAR', label: 'WORDS IN THE BOX.', prompt: 'Part: Complete sentences using a word box for {{TOPIC}}.', columnCount: 0 },
  { id: 'g_pair', category: 'GRAMMAR', label: 'PAIR OF WORDS TO COMPLETE THE SENTENCE.', prompt: 'Part: Double-gap MCQ for {{TOPIC}}.', columnCount: 0 },
  { id: 'g_copy', category: 'GRAMMAR', label: 'COPY FROM THE BOOK.', prompt: 'Part: Copy exercises for {{TOPIC}} and randomize numbering.', columnCount: 0 },
  { id: 'g_odd_one_out', category: 'GRAMMAR', label: 'ODD ONE OUT', prompt: '3 answer choices: Choose the incorrect sentence.', columnCount: 0 },
  { id: 'g_editing', category: 'GRAMMAR', label: 'EDITING A PARAGRAPH (ERROR HUNT)', prompt: 'Editing: Correct all grammar mistakes in the paragraph.', columnCount: 0 },
  { id: 'g_reduce', category: 'GRAMMAR', label: 'REDUCE THE SENTENCE', prompt: 'Rewrite using fewer words.', columnCount: 0 },
  { id: 'g_best_rewrite', category: 'GRAMMAR', label: 'CHOOSE THE BEST REWRITE', prompt: 'Choose the most accurate rewrite of the sentence.', columnCount: 0 },
  { id: 'g_cloze_paragraph', category: 'GRAMMAR', label: 'CLOZE PASSAGE (FULL PARAGRAPH)', prompt: 'Cloze Passage: Fill in the blanks in a full paragraph.', columnCount: 0 },
  { id: 'g_teacher_mode', category: 'GRAMMAR', label: 'TEACHER MODE: ERROR CORRECTION', prompt: 'Generate paragraph with 5 deliberate errors. Student must rewrite correctly.', columnCount: 0 },

  // --- READING MODULE ---
  { id: 'r_mcq_rule7', category: 'READING', label: 'READING MCQ (RULE 7)', prompt: 'Reading passage. Apply Human-Test Logic: No keyword overlap.', columnCount: 0 },
  { id: 'r_tfng', category: 'READING', label: 'A: READING TRUE/FALSE/NOT GIVEN', prompt: 'Short notice text. T/F/NG questions. Use style "1. (_____)"', columnCount: 0 },
  { id: 'r_tf_stmt', category: 'READING', label: 'B: TRUE/ FALSE STATEMENT', prompt: 'Personal blog post. T/F statements with synonyms.', columnCount: 0 },
  { id: 'r_matching_heading', category: 'READING', label: 'C: MATCHING HEADING', prompt: '4-paragraph informational text. Matching headings task.', columnCount: 0 },
  { id: 'r_short_answer', category: 'READING', label: 'D: WRITE NO MORE THAN TWO WORDS', prompt: 'Process text. Fill-in-the-blank summary requiring exact words.', columnCount: 0 },
  { id: 'r_inferential', category: 'READING', label: 'E: INFERENTIAL COMPREHENSION', prompt: 'Opinion piece. Questions testing author attitude.', columnCount: 0 },
  { id: 'r_mcq_reading', category: 'READING', label: 'F: MCQ', prompt: 'Long complex narrative. MCQ testing inference.', columnCount: 0 },
  { id: 'r_ket', category: 'READING', label: 'G: KET FULL TEST', prompt: 'Full Cambridge KET style Reading test.', columnCount: 0 },
  { id: 'r_matching_info', category: 'READING', label: 'MATCHING INFORMATION', prompt: 'Which paragraph contains specific information.', columnCount: 0 },
  { id: 'r_inference_qs', category: 'READING', label: 'INFERENCE QUESTIONS', prompt: 'Inference questions testing intent.', columnCount: 0 },
  { id: 'r_critical_thinking', category: 'READING', label: 'CRITICAL THINKING', prompt: 'Short logic-based reading items.', columnCount: 0 },

  // --- VOCABULARY MODULE ---
  { id: 'v_study_table', category: 'VOCABULARY', label: 'VOCABULARY STUDY', prompt: 'Study Table. Col 1: Word. Col 2: Easy Definition.', columnCount: 2 },
  { id: 'v_sentence_study', category: 'VOCABULARY', label: 'SENTENCE STUDY', prompt: 'Study vocab through context sentences.', columnCount: 0 },
  { id: 'v_supply_terms', category: 'VOCABULARY', label: 'SUPPLY KEY TERMS', prompt: 'Definition in Col 1, Blank for term in Col 2.', columnCount: 2 },
  { id: 'v_box', category: 'VOCABULARY', label: 'VOCABULARY BOX', prompt: 'Fill-in-the-blank using a box of words.', columnCount: 0 },
  { id: 'v_matching', category: 'VOCABULARY', label: 'DEFINITION MATCHING', prompt: 'Match vocab with correct definitions.', columnCount: 0 },
  { id: 'v_copy', category: 'VOCABULARY', label: 'COPY EXERCISES', prompt: 'Copy the following sentences into your notebook.', columnCount: 0 },
  { id: 'v_synonym_swap', category: 'VOCABULARY', label: 'REWRITE WITH A SYNONYM', prompt: 'Rewrite sentences using a synonym for the underlined word.', columnCount: 0 },
  { id: 'v_mcq', category: 'VOCABULARY', label: 'PART C6: MCQ', prompt: 'MCQ for vocab. Apply Grammar Blackout.', columnCount: 0 },
  { id: 'v_tf', category: 'VOCABULARY', label: 'TRUE/FALSE', prompt: 'True/False testing word meaning.', columnCount: 0 },
  { id: 'v_speaking', category: 'VOCABULARY', label: 'SPEAKING (DISCUSS)', prompt: 'Open-ended discussion questions for vocab.', columnCount: 0 },
  { id: 'v_synonyms_table', category: 'VOCABULARY', label: 'SYNONYMS', prompt: '5-column table for vocab and synonyms.', columnCount: 5 },
  { id: 'v_circle', category: 'VOCABULARY', label: 'CIRCLE THE CORRECT WORD', prompt: 'Circle the correct word choice.', columnCount: 0 },
  { id: 'v_cloze', category: 'VOCABULARY', label: 'CLOZE PASSAGE', prompt: 'Cloze passage for vocabulary.', columnCount: 0 }
];
