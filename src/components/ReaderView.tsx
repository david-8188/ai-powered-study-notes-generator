import React from 'react';
import { ResearchPaper, Highlight, Flashcard } from '../types';

interface ReaderViewProps {
  paper: ResearchPaper;
  papers: ResearchPaper[];
  onSelectPaper: (paper: ResearchPaper) => void;
  highlights: Highlight[];
  onAddHighlight: (highlight: Highlight) => void;
  onRemoveHighlight: (id: string) => void;
  onGenerateFlashcard: (card: Flashcard) => void;
  onNavigateToSynthesis: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ paper, papers, onSelectPaper, highlights, onAddHighlight, onRemoveHighlight, onGenerateFlashcard, onNavigateToSynthesis }) => {
  const addHighlight = (text: string, sectionId: string) => {
    onAddHighlight({ id: 'hl-' + Date.now(), text, category: 'core-thesis', sectionId, timestamp: new Date().toLocaleTimeString() });
  };
  const makeCard = (text: string) => {
    onGenerateFlashcard({
      id: 'fc-' + Date.now(), paperId: paper.id, question: 'Explain this key idea from ' + paper.title + ': ' + text.slice(0, 100),
      answer: text, explanation: 'Created from a passage in the research reader.', citationRef: paper.doi,
      category: 'definition', repetitionCount: 0, intervalDays: 1, easeFactor: 2.5, nextReviewDate: 'Today'
    });
  };

  return <div className="max-w-6xl mx-auto px-5 py-8 space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="text-xs uppercase tracking-widest text-indigo-600 font-semibold">Source Reader / Research Library</p><h1 className="text-3xl font-bold mt-2">{paper.title}</h1><p className="text-sm text-slate-500 mt-2">{paper.authors.join(', ')} · {paper.institution} · {paper.readTimeMinutes} min read</p></div>
      <button onClick={onNavigateToSynthesis} className="rounded-xl bg-indigo-600 text-white px-4 py-3 text-sm font-semibold">Open Synthesis Lab →</button>
    </div>
    {papers.length > 1 && <div className="flex flex-wrap gap-2">{papers.map(p => <button key={p.id} onClick={() => onSelectPaper(p)} className={'rounded-lg px-3 py-2 text-sm border ' + (p.id === paper.id ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-slate-200')}>{p.title}</button>)}</div>}
    <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-6">
      <article className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-7">
        <section><h2 className="font-bold text-lg mb-3">Abstract</h2><p className="leading-7 text-slate-700">{paper.abstract}</p></section>
        {paper.sections.map(section => <section key={section.id} className="border-t border-slate-100 pt-5">
          <h2 className="font-bold text-lg mb-3">{section.title}</h2>
          {section.content.map((paragraph, i) => <div key={i} className="mb-4"><p className="leading-7 text-slate-700">{paragraph}</p><div className="flex gap-2 mt-2"><button onClick={() => addHighlight(paragraph, section.id)} className="text-xs text-indigo-700 hover:underline">Highlight passage</button><button onClick={() => makeCard(paragraph)} className="text-xs text-emerald-700 hover:underline">Create flashcard</button></div></div>)}
          {section.subsections?.map(sub => <div key={sub.id} className="ml-4 mt-5 border-l-2 border-indigo-100 pl-4"><h3 className="font-semibold mb-2">{sub.title}</h3>{sub.content.map((p, i) => <p key={i} className="text-sm text-slate-600 mb-2">{p}</p>)}{sub.equations?.map(eq => <code key={eq} className="block bg-slate-50 p-3 rounded-lg text-sm">{eq}</code>)}</div>)}
        </section>)}
        <section className="border-t border-slate-100 pt-5"><h2 className="font-bold mb-3">References</h2>{paper.citations.map(c => <p key={c.id} className="text-sm text-slate-600 mb-2">[{c.number}] {c.authors} ({c.year}). {c.title}. {c.journal}. {c.doi}</p>)}</section>
      </article>
      <aside className="space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5"><h2 className="font-semibold mb-3">Reading summary</h2><p className="text-sm text-slate-600 mb-3">{paper.executiveSummary.thesis}</p><p className="text-xs text-slate-500">Mastery indicator: {paper.masteryPercentage}%</p><div className="h-2 bg-slate-100 rounded-full mt-2"><div className="h-2 bg-indigo-500 rounded-full" style={{width: paper.masteryPercentage + '%'}} /></div></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5"><h2 className="font-semibold mb-3">Your highlights ({highlights.length})</h2>{highlights.map(h => <div key={h.id} className="border-t border-slate-100 py-3"><p className="text-xs leading-5 text-slate-600">{h.text}</p><button onClick={() => onRemoveHighlight(h.id)} className="text-xs text-rose-600 mt-2">Remove</button></div>)}</div>
      </aside>
    </div>
  </div>;
};
