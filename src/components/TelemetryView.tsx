import React from 'react';
import { ResearchPaper } from '../types';

interface TelemetryViewProps { papers: ResearchPaper[]; activePaper: ResearchPaper; totalCardsCount: number; }

export const TelemetryView: React.FC<TelemetryViewProps> = ({ papers, activePaper, totalCardsCount }) => {
  const averageMastery = Math.round(papers.reduce((sum, p) => sum + p.masteryPercentage, 0) / Math.max(1, papers.length));
  return <div className="max-w-6xl mx-auto px-5 py-8 space-y-6">
    <div><p className="text-xs uppercase tracking-widest text-indigo-600 font-semibold">Comprehension Telemetry</p><h1 className="text-3xl font-bold mt-2">Learning overview</h1><p className="text-sm text-slate-500 mt-2">A snapshot of your current research and recall workspace.</p></div>
    <div className="grid sm:grid-cols-3 gap-4">{[{label:'Research sources', value:papers.length},{label:'Flashcards created',value:totalCardsCount},{label:'Average mastery',value:averageMastery + '%'}].map(x => <div key={x.label} className="bg-white border border-slate-200 rounded-2xl p-5"><p className="text-xs text-slate-500">{x.label}</p><p className="text-3xl font-bold mt-2">{x.value}</p></div>)}</div>
    <section className="bg-white border border-slate-200 rounded-2xl p-6"><h2 className="font-bold mb-4">Research progress</h2>{papers.map(p => <div key={p.id} className="mb-5"><div className="flex justify-between gap-3 text-sm mb-2"><span className="font-medium">{p.title}</span><span>{p.masteryPercentage}%</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-500" style={{width:p.masteryPercentage+'%'}} /></div></div>)}</section>
    <section className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6"><h2 className="font-bold">Current focus</h2><p className="text-sm mt-2 text-slate-700">{activePaper.title}</p><p className="text-xs mt-2 text-slate-500">Use the Recall Deck regularly to reinforce the concepts you have read.</p></section>
  </div>;
};
