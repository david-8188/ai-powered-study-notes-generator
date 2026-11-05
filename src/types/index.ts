export interface Citation {
  id: string;
  number: number;
  authors: string;
  title: string;
  journal: string;
  year: number;
  doi?: string;
  snippet?: string;
}

export interface PaperSection {
  id: string;
  title: string;
  content: string[];
  subsections?: {
    id: string;
    title: string;
    content: string[];
    equations?: string[];
  }[];
}

export interface Highlight {
  id: string;
  text: string;
  note?: string;
  category: 'core-thesis' | 'methodology' | 'invariant' | 'question';
  sectionId: string;
  timestamp: string;
}

export interface ConceptNode {
  id: string;
  label: string;
  category: 'mechanism' | 'metric' | 'theory' | 'challenge';
  description: string;
  connectedTo: string[];
  sourceSection: string;
}

export interface Flashcard {
  id: string;
  paperId: string;
  question: string;
  answer: string;
  explanation: string;
  citationRef: string;
  category: 'definition' | 'theorem' | 'mechanism' | 'empirical';
  repetitionCount: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: string;
  lastScore?: 'again' | 'hard' | 'good' | 'easy';
}

export interface ClozeItem {
  id: string;
  prompt: string;
  missingWord: string;
  hint: string;
  context: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  citationNumber: number;
}

export interface ResearchPaper {
  id: string;
  title: string;
  subtitle: string;
  authors: string[];
  institution: string;
  publishedDate: string;
  doi: string;
  readTimeMinutes: number;
  category: string;
  abstract: string;
  executiveSummary: {
    thesis: string;
    coreBreakthrough: string;
    frictionPoints: string[];
    keyEquations: { label: string; formula: string; implication: string }[];
  };
  sections: PaperSection[];
  citations: Citation[];
  concepts: ConceptNode[];
  clozeItems: ClozeItem[];
  retrievalQuestions: QuizQuestion[];
  masteryPercentage: number;
}

export type ActiveTab = 'reader' | 'synthesis' | 'recall' | 'telemetry' | 'library';

export interface FocusSessionState {
  isActive: boolean;
  isPaused: boolean;
  mode: 'focus' | 'break';
  durationMinutes: number;
  remainingSeconds: number;
  soundType: 'none' | 'alpha' | 'brown' | 'library';
  soundVolume: number;
  completedCycles: number;
}
