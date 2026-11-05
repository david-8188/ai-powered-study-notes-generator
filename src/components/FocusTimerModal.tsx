import React from 'react';
import { FocusSessionState } from '../types';
import { audioEngine } from '../services/audioEngine';
import { X, Play, Pause, RotateCcw, Volume2, Sparkles, Headphones } from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  focusState: FocusSessionState;
  setFocusState: React.Dispatch<React.SetStateAction<FocusSessionState>>;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({ isOpen, onClose, focusState, setFocusState }) => {
  if (!isOpen) return null;

  const handleStart = (minutes: number) => {
    setFocusState(prev => ({ ...prev, isActive: true, isPaused: false, mode: 'focus', durationMinutes: minutes, remainingSeconds: minutes * 60 }));
    audioEngine.playSound(focusState.soundType, focusState.soundVolume);
  };

  const handleTogglePause = () => {
    setFocusState(prev => {
      const nextPaused = !prev.isPaused;
      if (nextPaused) audioEngine.stopSound();
      else audioEngine.playSound(prev.soundType, prev.soundVolume);
      return { ...prev, isPaused: nextPaused };
    });
  };

  const handleReset = () => {
    audioEngine.stopSound();
    setFocusState(prev => ({ ...prev, isActive: false, isPaused: false, remainingSeconds: prev.durationMinutes * 60 }));
  };

  const handleSoundChange = (type: FocusSessionState['soundType']) => {
    setFocusState(prev => ({ ...prev, soundType: type }));
    if (focusState.isActive && !focusState.isPaused) audioEngine.playSound(type, focusState.soundVolume);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setFocusState(prev => ({ ...prev, soundVolume: val }));
    audioEngine.setVolume(val);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-[#767586] hover:text-[#131b2e] rounded-lg transition-colors"><X className="w-5 h-5" /></button>
        <div className="flex items-center gap-2 mb-1"><span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#4648d4]">CognitiveFocus Cadence</span></div>
        <h3 className="font-display font-bold text-xl text-[#131b2e] mb-4">Deep Focus Environment</h3>
        <div className="text-center py-6 bg-[#faf8ff] rounded-xl border border-[#eaedff] mb-6"><div className="text-5xl font-mono font-bold tracking-tight text-[#131b2e] mb-2 tabular-nums">{formatTime(focusState.remainingSeconds)}</div><div className="text-xs text-[#464554] flex items-center justify-center gap-2"><span>Cycle {focusState.completedCycles + 1}</span><span aria-hidden="true">·</span><span className="capitalize">{focusState.mode} Phase</span></div></div>
        <div className="mb-6"><div className="text-xs font-semibold text-[#131b2e] mb-2">Focus Prototypes</div><div className="grid grid-cols-3 gap-2">{[{ label: '50m Deep', mins: 50, desc: 'Academic standard' }, { label: '25m Sprint', mins: 25, desc: 'Active recall sprint' }, { label: '90m Flow', mins: 90, desc: 'Ultradian block' }].map(item => (<button key={item.mins} onClick={() => handleStart(item.mins)} className={`p-2.5 rounded-lg border text-left transition-all ${focusState.durationMinutes === item.mins && focusState.isActive ? 'border-[#4648d4] bg-[#faf8ff] shadow-xs' : 'border-[#e2e7ff] hover:border-[#c7c4d7] bg-white'}`}><div className="font-display text-sm font-bold text-[#131b2e]">{item.label}</div><div className="text-[11px] text-[#767586]">{item.desc}</div></button>))}</div></div>
        <div className="mb-6 p-3.5 bg-[#faf8ff] rounded-xl border border-[#eaedff]"><div className="flex items-center justify-between mb-2.5"><div className="flex items-center gap-1.5 text-xs font-semibold text-[#131b2e]"><Headphones className="w-3.5 h-3.5 text-[#5148d7]" /><span>Acoustic Focus Masking</span></div><div className="text-[11px] text-[#767586] font-mono">WebAudio Synth</div></div><div className="grid grid-cols-4 gap-1.5 mb-3">{[{ id: 'none', label: 'Off' }, { id: 'alpha', label: '10Hz Alpha' }, { id: 'brown', label: 'Brown Noise' }, { id: 'library', label: 'Library' }].map(snd => (<button key={snd.id} onClick={() => handleSoundChange(snd.id as FocusSessionState['soundType'])} className={`py-1.5 px-2 text-xs font-medium rounded-md text-center transition-colors ${focusState.soundType === snd.id ? 'bg-[#4648d4] text-white shadow-xs' : 'bg-white border border-[#e2e7ff] text-[#464554] hover:text-[#131b2e]'}`}>{snd.label}</button>))}</div>{focusState.soundType !== 'none' && (<div className="flex items-center gap-2 pt-1"><Volume2 className="w-3.5 h-3.5 text-[#767586] shrink-0" /><input type="range" min="0.05" max="0.8" step="0.05" value={focusState.soundVolume} onChange={handleVolumeChange} className="w-full h-1 bg-[#dae2fd] rounded-lg appearance-none cursor-pointer accent-[#4648d4]" /><span className="text-[11px] font-mono text-[#767586] w-8 text-right">{Math.round(focusState.soundVolume * 100)}%</span></div>)}</div>
        <div className="flex items-center gap-3">{focusState.isActive ? (<><button onClick={handleTogglePause} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#4648d4] hover:bg-[#3739bf] transition-colors shadow-xs">{focusState.isPaused ? <><Play className="w-4 h-4" /><span>Resume</span></> : <><Pause className="w-4 h-4" /><span>Pause</span></>}</button><button onClick={handleReset} className="p-2.5 rounded-xl border border-[#e2e7ff] text-[#464554] hover:text-[#131b2e] hover:bg-[#faf8ff] transition-colors" title="Reset Session"><RotateCcw className="w-4 h-4" /></button></>) : (<button onClick={() => handleStart(50)} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#4648d4] hover:bg-[#3739bf] transition-colors shadow-xs"><Play className="w-4 h-4" /><span>Begin 50-Minute Cycle</span></button>)}</div>
        <button onClick={() => audioEngine.playChime()} className="mt-3 w-full text-center text-xs text-[#767586] hover:text-[#4648d4] transition-colors">Test Transition Chime (528 Hz)</button>
      </div>
    </div>
  );
};
