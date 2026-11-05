/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ResearchPaper, Highlight, Flashcard, ActiveTab, FocusSessionState } from './types';
import { PAPERS } from './data/mockPapers';
import { Header } from './components/Header';
import { ReaderView } from './components/ReaderView';
import { SynthesisView } from './components/SynthesisView';
import { RecallView } from './components/RecallView';
import { TelemetryView } from './components/TelemetryView';
import { LibraryView } from './components/LibraryView';
import { FocusTimerModal } from './components/FocusTimerModal';
import { audioEngine } from './services/audioEngine';

// Seed initial flashcards from PAPERS
const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-seed-1',
    paperId: 'paper-sae-mechanistic',
    question: 'What is linear superposition and why do neural networks employ it?',
    answer: 'Linear superposition is the projection of exp(O(n)) weakly correlated features into n orthogonal dimensions. Models employ it because real-world features are conditionally sparse, optimizing representational capacity under dimensionality constraints.',
    explanation: 'From §1 Introduction: Superposition Hypothesis in language models.',
    citationRef: '10.48550/arXiv.2209.10652',
    category: 'definition',
    repetitionCount: 2,
    intervalDays: 4,
    easeFactor: 2.5,
    nextReviewDate: 'Tomorrow'
  },
  {
    id: 'fc-seed-2',
    paperId: 'paper-sae-mechanistic',
    question: 'How does JumpReLU eliminate shrinkage bias compared to standard L1 regularization?',
    answer: 'Standard L1 applies a constant gradient penalty ∂|f|/∂f = ±1 for all f ≠ 0, depressing high-amplitude activations. JumpReLU uses a discontinuous threshold θ: sub-threshold noise is clamped to 0, while signals above θ maintain their true unattenuated magnitude.',
    explanation: 'From §2.1 JumpReLU Regularization Invariant Formulation.',
    citationRef: '10.48550/arXiv.2511.08492',
    category: 'theorem',
    repetitionCount: 1,
    intervalDays: 2,
    easeFactor: 2.3,
    nextReviewDate: 'In 2 days'
  },
  {
    id: 'fc-seed-3',
    paperId: 'paper-sae-mechanistic',
    question: 'State the formal bounds on the number of weakly correlated features N in d dimensions with interference bound ε.',
    answer: 'According to the Johnson-Lindenstrauss lemma and spherical code theory, N ≥ exp(c · d · ε²). The maximum number of nearly-orthogonal directions scales exponentially with the vector dimension d.',
    explanation: 'From §4 Mathematical Bounds on Superposition Capacity.',
    citationRef: '10.1090/conm/026/737400',
    category: 'empirical',
    repetitionCount: 3,
    intervalDays: 7,
    easeFactor: 2.6,
    nextReviewDate: 'In 5 days'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('reader');
  const [papers, setPapers] = useState<ResearchPaper[]>(PAPERS);
  const [activePaper, setActivePaper] = useState<ResearchPaper>(PAPERS[0]);
  
  const [highlights, setHighlights] = useState<Highlight[]>([
    {
      id: 'hl-seed-1',
      text: 'Rather than reserving a dedicated orthogonal dimension for every distinct conceptual feature, the network projects semantic features into linear superposition [1].',
      category: 'core-thesis',
      sectionId: 'sec-1',
      timestamp: '10:42 AM'
    },
    {
      id: 'hl-seed-2',
      text: 'f_i(x) = JumpReLU(W_enc(x - b_dec) + b_enc, θ) eliminates continuous shrinkage bias while preserving sparsity.',
      category: 'invariant',
      sectionId: 'sub-2-1',
      timestamp: '10:48 AM'
    }
  ]);

  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);

  // Focus Timer Session State
  const [focusState, setFocusState] = useState<FocusSessionState>({
    isActive: false,
    isPaused: false,
    mode: 'focus',
    durationMinutes: 50,
    remainingSeconds: 50 * 60,
    soundType: 'none',
    soundVolume: 0.25,
    completedCycles: 0
  });

  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);

  // Active Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (focusState.isActive && !focusState.isPaused) {
      interval = setInterval(() => {
        setFocusState(prev => {
          if (prev.remainingSeconds <= 1) {
            // Cycle finished!
            audioEngine.playChime();
            const nextMode = prev.mode === 'focus' ? 'break' : 'focus';
            const nextMins = nextMode === 'focus' ? 50 : 10;
            return {
              ...prev,
              mode: nextMode,
              durationMinutes: nextMins,
              remainingSeconds: nextMins * 60,
              completedCycles: prev.mode === 'focus' ? prev.completedCycles + 1 : prev.completedCycles
            };
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusState.isActive, focusState.isPaused]);

  const handleToggleTimer = () => {
    setFocusState(prev => {
      const nextPaused = !prev.isPaused;
      if (nextPaused) {
        audioEngine.stopSound();
      } else {
        audioEngine.playSound(prev.soundType, prev.soundVolume);
      }
      return { ...prev, isPaused: nextPaused };
    });
  };

  const handleAddHighlight = (hl: Highlight) => {
    setHighlights(prev => [hl, ...prev]);
  };

  const handleRemoveHighlight = (id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  const handleAddFlashcard = (card: Flashcard) => {
    setFlashcards(prev => [card, ...prev]);
  };

  const handleUpdateFlashcard = (updated: Flashcard) => {
    setFlashcards(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const handleAddCustomPaper = (newPaper: ResearchPaper) => {
    setPapers(prev => [newPaper, ...prev]);
    setActivePaper(newPaper);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col selection:bg-[#c7d2fe] selection:text-[#131b2e]">
      
      {/* Universal Top Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        focusState={focusState}
        onOpenFocusModal={() => setIsFocusModalOpen(true)}
        onToggleTimer={handleToggleTimer}
        unreadRecallCount={flashcards.filter(c => c.paperId === activePaper.id).length}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {activeTab === 'reader' && (
          <ReaderView
            paper={activePaper}
            papers={papers}
            onSelectPaper={setActivePaper}
            highlights={highlights}
            onAddHighlight={handleAddHighlight}
            onRemoveHighlight={handleRemoveHighlight}
            onGenerateFlashcard={handleAddFlashcard}
            onNavigateToSynthesis={() => setActiveTab('synthesis')}
          />
        )}

        {activeTab === 'synthesis' && (
          <SynthesisView
            paper={activePaper}
            onNavigateToRecall={() => setActiveTab('recall')}
          />
        )}

        {activeTab === 'recall' && (
          <RecallView
            paper={activePaper}
            flashcards={flashcards}
            onUpdateFlashcard={handleUpdateFlashcard}
          />
        )}

        {activeTab === 'telemetry' && (
          <TelemetryView
            papers={papers}
            activePaper={activePaper}
            totalCardsCount={flashcards.length}
          />
        )}

        {activeTab === 'library' && (
          <LibraryView
            papers={papers}
            onSelectPaper={(p) => {
              setActivePaper(p);
              setActiveTab('reader');
            }}
            onAddCustomPaper={handleAddCustomPaper}
          />
        )}
      </main>

      {/* Deep Focus Session Modal */}
      <FocusTimerModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        focusState={focusState}
        setFocusState={setFocusState}
      />

      {/* Quiet Academic Footer */}
      <footer className="border-t border-[#e2e7ff] bg-white py-6 px-6 mt-16 text-xs text-[#767586]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-[#131b2e]">CognitiveFocus</span>
            <span aria-hidden="true">·</span>
            <span>Academic Rigor & Generative Synthesis</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Calibrated Daylight Palette</span>
            <span>SuperMemo SM-2 Interval Engine</span>
            <span>Binaural Audio Synthesis</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
