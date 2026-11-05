import React, { useMemo, useState } from 'react';
import { ResearchPaper } from '../types';

interface LibraryViewProps { papers: ResearchPaper[]; onSelectPaper: (paper: ResearchPaper) => void; onAddCustomPaper: (paper: ResearchPaper) => void; }

export const LibraryView: React.FC<LibraryViewProps> = ({ papers, onSelectPaper, onAddCustomPaper }) => {
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [category, setCategory] = useState('Research Notes');
  const [body, setBody] = useState('');
  const filtered = useMemo(() => papers.filter(p => (p.title + ' ' + p.abstract + ' ' + p.authors.join(' ')).toLowerCase().includes(query.toLowerCase())), [papers, query]);

  const addSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const paper: ResearchPaper = {
      id: 'custom-' + Date.now(), title, subtitle: 'User-ingested source material', authors: authors.split(',').map(a => a.trim()).filter(Boolean), institution: 'Personal Library', publishedDate: new Date().toLocaleDateString(), doi: 'custom', readTimeMinutes: Math.max(1, Math.ceil(body.split(/\s+/).length / 200)), category, abstract: body.slice(0, 500),
      executiveSummary: { thesis: 'User-added source awaiting review and synthesis.', coreBreakthrough: 'Source text added to the CognitiveFocus library.', frictionPoints: [], keyEquations: [] },
      sections: [{ id: 'custom-sec', title: 'Source text', content: body.split('\n\n').filter(Boolean) }],
      citations: [], concepts: [], clozeItems: [], retrievalQuestions: [], masteryPercentage: 0
    };
    onAddCustomPaper(paper); onSelectPaper(paper); setTitle(''); setAuthors(''); setBody('');
  };

  return <div className="max-w-6xl mx-auto px-5 py-8 space-y-6">
    <div><p className="text-xs uppercase tracking-widest text-indigo-600 font-semibold">Research Library & Ingestion</p><h1 className="text-3xl font-bold mt-2">Curated Source Archive</h1><p className="text-sm text-slate-500 mt-2">Search the sample collection or add your own paper and notes.</p></div>
    <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search papers, concepts, or authors..." className="w-full max-w-xl bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" />
    <div className="grid md:grid-cols-2 gap-4">{filtered.map(p => <article key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5"><p className="text-xs text-indigo-700 uppercase">{p.category}</p><h2 className="font-bold mt-2">{p.title}</h2><p className="text-sm text-slate-600 mt-2 line-clamp-3">{p.abstract}</p><button onClick={() => onSelectPaper(p)} className="mt-4 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm">Open in reader</button></article>)}</div>
    <form onSubmit={addSource} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"><h2 className="font-bold text-lg">Ingest a custom source</h2><input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Document title" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" /><input value={authors} onChange={e => setAuthors(e.target.value)} placeholder="Authors (comma separated)" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" /><input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" /><textarea required rows={6} value={body} onChange={e => setBody(e.target.value)} placeholder="Paste paper text, abstract, or lecture notes…" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" /><button className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold">Add source to library</button></form>
  </div>;
};
