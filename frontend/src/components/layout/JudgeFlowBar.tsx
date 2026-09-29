import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Satellite
} from 'lucide-react';
import type { PrototypeView } from './DesktopSidebar';

interface JudgeFlowBarProps {
  currentView: PrototypeView;
  onNavigate: (view: PrototypeView) => void;
}

interface StepItem {
  id: PrototypeView;
  stepNum: string;
  shortLabel: string;
  category: 'core' | 'analysis' | 'tools' | 'system';
}

const ORDERED_STEPS: StepItem[] = [
  { id: 'home', stepNum: '01', shortLabel: 'Home', category: 'core' },
  { id: 'dashboard', stepNum: '02', shortLabel: 'Dashboard', category: 'core' },
  { id: 'upload', stepNum: '03', shortLabel: 'Upload', category: 'core' },
  { id: 'processing', stepNum: '04', shortLabel: 'AI Pipeline', category: 'core' },
  { id: 'results', stepNum: '05', shortLabel: 'Results', category: 'analysis' },
  { id: 'depth-map', stepNum: '06', shortLabel: 'Depth Map', category: 'analysis' },
  { id: 'height-elevation', stepNum: '07', shortLabel: 'Height / DEM', category: 'analysis' },
  { id: 'object-detection', stepNum: '08', shortLabel: 'Objects', category: 'analysis' },
  { id: '3d-reconstruction', stepNum: '09', shortLabel: '3D Mesh', category: 'analysis' },
  { id: '3d-flythrough', stepNum: '10', shortLabel: 'Flythrough', category: 'analysis' },
  { id: 'measurements', stepNum: '11', shortLabel: 'Measure', category: 'tools' },
  { id: 'compare', stepNum: '12', shortLabel: 'Compare', category: 'tools' },
  { id: 'history', stepNum: '13', shortLabel: 'History', category: 'tools' },
  { id: 'detail', stepNum: '14', shortLabel: 'Detail', category: 'tools' },
  { id: 'reports', stepNum: '15', shortLabel: 'Export', category: 'tools' },
  { id: 'settings', stepNum: '16', shortLabel: 'Settings', category: 'system' },
  { id: 'help', stepNum: '17', shortLabel: 'Help & Docs', category: 'system' },
  { id: 'admin', stepNum: '18', shortLabel: 'Admin', category: 'system' }
];

export const JudgeFlowBar: React.FC<JudgeFlowBarProps> = ({ currentView, onNavigate }) => {
  const currentIndex = ORDERED_STEPS.findIndex((s) => s.id === currentView);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigate(ORDERED_STEPS[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < ORDERED_STEPS.length - 1) {
      onNavigate(ORDERED_STEPS[currentIndex + 1].id);
    }
  };

  return (
    <div className="bg-[#060D1A]/95 backdrop-blur-md border-b border-[#15243C] px-4 py-2 sticky top-0 z-20 flex flex-col gap-1.5 select-none shadow-md">
      
      {/* Top Banner Row: Problem statement + Transformation summary + Step stepper */}
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: SIH26175 badge and core formula */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-semibold tracking-wider flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#00C8FF]" />
            SIH26175 PROTOTYPE
          </span>

          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-[#94A3B8]">
            <span className="text-white font-medium">2D IMAGE</span>
            <span className="text-[#00C8FF]">→</span>
            <span className="text-cyan-300 font-medium">AI DEPTH</span>
            <span className="text-[#00C8FF]">→</span>
            <span className="text-blue-300 font-medium">METRIC HEIGHT</span>
            <span className="text-[#00C8FF]">→</span>
            <span className="text-white font-bold bg-[#0B1527] px-1.5 py-0.5 rounded border border-[#1E3658]">
              3D WORLD
            </span>
          </div>
        </div>

        {/* Center: Quick Prev/Next buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0C172B] hover:bg-[#13233F] border border-[#182C4A] text-[11px] text-[#94A3B8] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all"
            title="Previous Prototype Screen"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev Step</span>
          </button>

          <span className="text-xs font-mono text-cyan-300 font-bold px-2 py-0.5 rounded bg-[#0A162B] border border-[#1B3254]">
            {ORDERED_STEPS[currentIndex]?.stepNum || '01'} / 18
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex >= ORDERED_STEPS.length - 1}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/40 text-[11px] text-cyan-200 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all"
            title="Next Prototype Screen"
          >
            <span className="hidden sm:inline">Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Live Region indicator */}
        <div className="hidden md:flex items-center gap-2 text-right">
          <Satellite className="w-3.5 h-3.5 text-[#00C8FF]" />
          <span className="text-[11px] font-mono text-[#94A3B8]">
            ROI: <span className="text-white font-medium">Visakhapatnam Port Maritime Zone (0.35m GSD)</span>
          </span>
        </div>

      </div>

      {/* Bottom Row: Horizontal 18-step quick pill bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 pt-0.5 scrollbar-thin scrollbar-thumb-slate-800">
        {ORDERED_STEPS.map((s) => {
          const isActive = currentView === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className={`px-2 py-1 rounded-md text-[10px] font-mono shrink-0 transition-all flex items-center gap-1 border ${
                isActive
                  ? 'bg-[#00C8FF] text-slate-950 font-bold border-[#00C8FF] shadow-sm shadow-[#00C8FF]/30'
                  : 'bg-[#0A1424] text-[#94A3B8] border-[#13233C] hover:text-white hover:bg-[#101F37]'
              }`}
            >
              <span className={`opacity-70 ${isActive ? 'text-slate-900 font-extrabold' : 'text-[#64748B]'}`}>
                {s.stepNum}
              </span>
              <span>{s.shortLabel}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
