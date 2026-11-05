import React, { useState } from 'react';
import { ResearchPaper } from '../types';
import { askPaperQuestion } from '../services/aiService';

interface SynthesisViewProps { paper: ResearchPaper; onNavigateToRecall: () => void; }

export const SynthesisView: React.FC<SynthesisViewProps> = ({ paper, onNavigateToRecall }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true); setError(''); setAnswer('');
    try {
      const result = await askPaperQuestion(paper, question);
      setAnswer(result.answer + '\n\nCited sections: ' + result.citedSections.join('; '));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to generate an answer.');
    } finally { setLoading(false); }
  };

  return <div className="max-w-6xl mx-auto px-5 py-8 space-y-6">
    <div><p className="text-xs uppercase tracking-widest text-indigo-600 font-semibold">Generative Synthesis Lab</p><h1 className="text-3xl font-bold mt-2">Connect ideas. Test understanding.</h1><p className="text-slate-500 mt-2 text-sm">Explore the concepts and ask questions about the selected source: {paper.title}</p></div>
    <div className="grid md:grid-cols-2 gap-5">
      <section className="bg-white border border-slate-200 rounded-2xl p-6"><h2 className="font-bold text-lg mb-4">Concept graph</h2><div className="space-y-3">{paper.concepts.map(c => <div key={c.id} className="rounded-xl bg-indigo-50 border border-indigo-100 p-4"><div className="text-xs uppercase text-indigo-700 font-semibold">{c.category}</div><h3 className="font-semibold mt-1">{c.label}</h3><p className="text-sm text-slate-600 mt-1">{c.description}</p><p className="text-xs text-slate-400 mt-2">Source: {c.sourceSection}</p></div>)}</div></section>
      <section className="bg-white border border-slate-200 rounded-2xl p-6"><h2 className="font-bold text-lg mb-2">Verified paper Q&A</h2><p className="text-sm text-slate-500 mb-4">Ask about the paper's methods, claims, or equations.</p><textarea value={question} onChange={e => setQuestion(e.target.value)} rows={4} placeholder="Ask a question about this research..." className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" /><button onClick={ask} disabled={loading || !question.trim()} className="mt-3 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50">{loading ? 'Thinking…' : 'Ask Gemini'}</button>{error && <p className="text-sm text-rose-600 mt-3">{error}</p>}{answer && <div className="mt-4 bg-slate-50 rounded-xl p-4 whitespace-pre-wrap text-sm leading-6">{answer}</div>}</section>
    </div>
    <section className="bg-white border border-slate-200 rounded-2xl p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-lg">Executive synthesis</h2><p className="text-sm text-slate-600 mt-2">{paper.executiveSummary.thesis}</p></div><button onClick={onNavigateToRecall} className="rounded-xl bg-emerald-700 text-white px-4 py-2 text-sm font-semibold">Practice active recall →</button></div><div className="grid md:grid-cols-2 gap-4 mt-5">{paper.executiveSummary.keyEquations.map(eq => <div key={eq.label} className="bg-slate-50 rounded-xl p-4"><p className="text-xs text-indigo-700 font-semibold">{eq.label}</p><code className="block my-2">{eq.formula}</code><p className="text-sm text-slate-600">{eq.implication}</p></div>)}</div></section>
  </div>;
};
