import React from 'react';
import { ActiveTab, FocusSessionState } from '../types';
import { Sparkles, Timer, Play, Pause } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  focusState: FocusSessionState;
  onOpenFocusModal: () => void;
  onToggleTimer: () => void;
  unreadRecallCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  focusState,
  onOpenFocusModal,
  onToggleTimer,
  unreadRecallCount
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf8ff]/90 backdrop-blur-md border-b border-[#e2e7ff] px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand wordmark (single line, no subtitle chips) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('reader')}
            className="text-left group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#4648d4] text-white flex items-center justify-center font-display font-bold text-sm shadow-sm">
              CF
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-[#131b2e] group-hover:text-[#4648d4] transition-colors whitespace-nowrap">
              CognitiveFocus
            </span>
          </button>
        </div>

        {/* Zone 2: 5 clean single-line navigation links with clean hover states */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#464554]">
          <button onClick={() => onTabChange('reader')} className={`transition-colors whitespace-nowrap py-1 relative ${activeTab === 'reader' ? 'text-[#4648d4] font-semibold' : 'hover:text-[#131b2e]'}`}>Source Reader{activeTab === 'reader' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4648d4] rounded-full" />}</button>
          <button onClick={() => onTabChange('synthesis')} className={`transition-colors whitespace-nowrap py-1 relative flex items-center gap-1.5 ${activeTab === 'synthesis' ? 'text-[#4648d4] font-semibold' : 'hover:text-[#131b2e]'}`}><Sparkles className="w-3.5 h-3.5 text-[#5148d7]" />Synthesis Lab{activeTab === 'synthesis' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4648d4] rounded-full" />}</button>
          <button onClick={() => onTabChange('recall')} className={`transition-colors whitespace-nowrap py-1 relative flex items-center gap-1.5 ${activeTab === 'recall' ? 'text-[#4648d4] font-semibold' : 'hover:text-[#131b2e]'}`}>Recall Deck{unreadRecallCount > 0 && <span className="text-[11px] font-mono font-medium text-[#006c49] bg-[#eef2ff] px-1.5 py-0.2 rounded">{unreadRecallCount}</span>}{activeTab === 'recall' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4648d4] rounded-full" />}</button>
          <button onClick={() => onTabChange('telemetry')} className={`transition-colors whitespace-nowrap py-1 relative ${activeTab === 'telemetry' ? 'text-[#4648d4] font-semibold' : 'hover:text-[#131b2e]'}`}>Cognitive Telemetry{activeTab === 'telemetry' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4648d4] rounded-full" />}</button>
          <button onClick={() => onTabChange('library')} className={`transition-colors whitespace-nowrap py-1 relative ${activeTab === 'library' ? 'text-[#4648d4] font-semibold' : 'hover:text-[#131b2e]'}`}>Library{activeTab === 'library' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4648d4] rounded-full" />}</button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {focusState.isActive ? (
            <div className="flex items-center gap-2 bg-[#ffffff] border border-[#e2e7ff] rounded-lg px-3 py-1.5 shadow-xs">
              <span className="text-xs font-mono font-medium text-[#4648d4] tabular-nums">{formatTime(focusState.remainingSeconds)}</span>
              <button onClick={onToggleTimer} title={focusState.isPaused ? 'Resume Session' : 'Pause Session'} className="p-1 text-[#464554] hover:text-[#131b2e] rounded transition-colors">{focusState.isPaused ? <Play className="w-3.5 h-3.5 text-[#006c49]" /> : <Pause className="w-3.5 h-3.5 text-[#4648d4]" />}</button>
              <button onClick={onOpenFocusModal} className="text-xs text-[#767586] hover:text-[#131b2e] px-1 border-l border-[#e2e7ff]">Settings</button>
            </div>
          ) : (
            <button onClick={onOpenFocusModal} className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#4648d4] hover:bg-[#3739bf] rounded-lg transition-colors shadow-xs whitespace-nowrap"><Timer className="w-3.5 h-3.5" /><span>Deep Focus Session</span></button>
          )}
        </div>
      </div>
    </header>
  );
};
