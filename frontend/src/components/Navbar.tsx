import React from 'react';
import { 
  Box, 
  Layers, 
  Building2, 
  BarChart3, 
  Terminal, 
  FileText, 
  Compass, 
  Satellite,
  SlidersHorizontal
} from 'lucide-react';

export type ViewTab = '3d-view' | 'split-compare' | 'footprints' | 'analytics' | 'pipeline' | 'reports';

interface NavbarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  onOpenUpload: () => void;
  locationLabel?: string;
  isBackendConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  locationLabel = 'Visakhapatnam Urban Maritime Zone',
  isBackendConnected
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#070b14]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 py-2.5">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/25 border border-cyan-400/40">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070b14] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                DEPTHWIZARD
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-semibold">
                SIH26175
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <Satellite className="w-3 h-3 text-cyan-400" />
              <span>Satellite Monocular AI & 3D Metric Elevation Engine</span>
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#0b1329]/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('3d-view')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === '3d-view'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Geospatial</span>
          </button>

          <button
            onClick={() => setActiveTab('split-compare')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'split-compare'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Split Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab('footprints')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'footprints'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Footprints (10)</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>DEM Calibration</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'pipeline'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>AI Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'reports'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </nav>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3">
          {/* Active scene badge */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] text-slate-400 font-mono">SCENE ROI</span>
            <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
              {locationLabel}
            </span>
          </div>

          {/* Backend Status indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0b1329] border border-slate-800 text-[11px] font-mono">
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 ring-2 ring-emerald-500/20' : 'bg-cyan-400 ring-2 ring-cyan-500/20'}`} />
            <span className="text-slate-300">
              {isBackendConnected ? 'FASTAPI LIVE' : 'CLIENT DEMO'}
            </span>
          </div>

          {/* Upload / Scene load button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-medium transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Upload Scene</span>
          </button>
        </div>

      </div>
    </header>
  );
};
