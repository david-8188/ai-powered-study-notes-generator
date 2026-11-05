import React, { useState } from 'react';
import { ResearchPaper, Flashcard } from '../types';

interface RecallViewProps { paper: ResearchPaper; flashcards: Flashcard[]; onUpdateFlashcard: (card: Flashcard) => void; }

export const RecallView: React.FC<RecallViewProps> = ({ paper, flashcards, onUpdateFlashcard }) => {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [clozeAnswers, setClozeAnswers] = useState<Record<string, string>>({});
  const cards = flashcards.filter(c => c.paperId === paper.id);
  const card = cards[index];

  const score = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!card) return;
    const intervals = { again: 1, hard: 2, good: 5, easy: 12 };
    onUpdateFlashcard({ ...card, repetitionCount: card.repetitionCount + 1, intervalDays: intervals[rating], easeFactor: Math.max(1.3, card.easeFactor + (rating === 'easy' ? 0.15 : rating === 'again' ? -0.2 : 0)), nextReviewDate: 'In ' + intervals[rating] + ' days', lastScore: rating });
    setRevealed(false); setIndex((index + 1) % Math.max(1, cards.length));
  };

  return <div className="max-w-5xl mx-auto px-5 py-8 space-y-6">
    <div><p className="text-xs uppercase tracking-widest text-indigo-600 font-semibold">Active Recall Engine</p><h1 className="text-3xl font-bold mt-2">Recall Deck</h1><p className="text-sm text-slate-500 mt-2">Retrieve concepts instead of just rereading them · {paper.title}</p></div>
    <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
      <div className="flex justify-between text-xs text-slate-500 mb-4"><span>Flashcards</span><span>{cards.length ? index + 1 : 0} / {cards.length}</span></div>
      {card ? <><button onClick={() => setRevealed(!revealed)} className="w-full min-h-52 bg-indigo-50 border border-indigo-100 rounded-2xl p-7 text-left"><p className="text-xs uppercase text-indigo-700 font-semibold mb-3">{revealed ? 'Answer' : 'Question'} · Tap to flip</p><p className="text-xl font-semibold leading-8">{revealed ? card.answer : card.question}</p>{revealed && <p className="text-sm text-slate-500 mt-4">{card.explanation}</p>}</button><div className="flex flex-wrap gap-2 mt-5">{(['again', 'hard', 'good', 'easy'] as const).map(r => <button key={r} onClick={() => score(r)} disabled={!revealed} className="capitalize rounded-lg px-4 py-2 text-sm border border-slate-200 disabled:opacity-40">{r}</button>)}</div></> : <p className="text-slate-500">No flashcards yet. Create some from the Source Reader.</p>}
    </section>
    <section className="bg-white border border-slate-200 rounded-2xl p-6"><h2 className="font-bold mb-4">Cloze deletion</h2>{paper.clozeItems.map(item => <div key={item.id} className="border-t border-slate-100 py-4"><p className="text-sm">{item.prompt}</p><input value={clozeAnswers[item.id] || ''} onChange={e => setClozeAnswers({ ...clozeAnswers, [item.id]: e.target.value })} placeholder="Enter missing term" className="mt-3 border border-slate-200 rounded-lg px-3 py-2 text-sm" /><p className="text-xs text-slate-500 mt-2">Hint: {item.hint}</p><p className="text-xs text-emerald-700 mt-2">{clozeAnswers[item.id]?.trim().toLowerCase() === item.missingWord.toLowerCase() ? 'Correct retrieval!' : ''}</p></div>)}</section>
    <section className="bg-white border border-slate-200 rounded-2xl p-6"><h2 className="font-bold mb-4">Retrieval exam</h2>{paper.retrievalQuestions.map(q => <div key={q.id} className="border-t border-slate-100 py-4"><p className="font-medium text-sm mb-3">{q.question}</p>{q.options.map((o, i) => <p key={i} className="text-sm text-slate-600 py-1">{String.fromCharCode(65 + i)}. {o}</p>)}<details className="mt-2 text-sm"><summary className="cursor-pointer text-indigo-700">Show answer and explanation</summary><p className="mt-2 text-emerald-700">Answer: {q.options[q.correctIndex]}</p><p className="text-slate-500">{q.explanation}</p></details></div>)}</section>
  </div>;
};
