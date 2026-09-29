import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ArrowRight,
  BarChart2
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface ComparePageProps {
  onNavigate: (view: PrototypeView) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ onNavigate }) => {
  const [compareMetric, setCompareMetric] = useState<'elevation' | 'depth' | 'height' | 'objects' | 'terrain' | '3d'>('elevation');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side'>('split');

  const metrics = [
    { id: 'elevation', label: 'Elevation Δ' },
    { id: 'depth', label: 'Depth Disparity' },
    { id: 'height', label: 'Metric Height' },
    { id: 'objects', label: 'Objects & Footprints' },
    { id: 'terrain', label: 'Terrain Relief' },
    { id: '3d', label: '3D Mesh' },
  ];

  const getVisualA = () => {
    switch (compareMetric) {
      case 'elevation': return '/demo/elevation_metric_dsm.png';
      case 'depth': return '/demo/depth_relative_heatmap.png';
      case 'objects': return '/demo/satellite_scene.png';
      default: return '/demo/satellite_scene.png';
    }
  };

  const getVisualB = () => {
    switch (compareMetric) {
      case 'elevation': return '/demo/elevation_difference_map.png';
      case 'depth': return '/demo/elevation_metric_dsm.png';
      case 'objects': return '/demo/elevation_metric_dsm.png';
      default: return '/demo/elevation_difference_map.png';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Compare Analyses</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 12
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Differential change detection and volumetric verification between baseline reference and current monocular AI reconstruction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('history')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>Next: Analysis History</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Metric Mode Selector Bar */}
      <div className="p-4 rounded-2xl bg-[#091222] border border-[#162744] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-white font-bold">Comparison Layer:</span>
          <div className="flex flex-wrap items-center gap-1.5 bg-[#060B14] p-1 rounded-xl border border-[#162744] font-mono text-[11px]">
            {metrics.map((m) => (
              <button
                key={m.id}
                onClick={() => setCompareMetric(m.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  compareMetric === m.id
                    ? 'bg-[#00C8FF] text-slate-950 font-bold shadow-sm'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'split' ? 'side-by-side' : 'split')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C172B] hover:bg-[#142542] border border-[#182C4A] text-slate-200 text-xs font-mono transition-all"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span>Mode: {viewMode === 'split' ? 'Interactive Split Slider' : 'Side-by-Side'}</span>
          </button>
        </div>
      </div>

      {/* Main Comparison Viewport Area */}
      <div className="space-y-4">
        
        {viewMode === 'split' ? (
          /* Interactive Split Slider Container */
          <div className="bg-[#091222] rounded-2xl border border-cyan-500/30 p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between text-xs font-mono px-2">
              <span className="text-[#00C8FF] font-bold">← Analysis A: Baseline Pre-Event Survey (2024 DEM)</span>
              <span className="text-emerald-400 font-bold">Analysis B: Current AI Monocular 3D (2026) →</span>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-[#182C4A] h-[500px] select-none shadow-inner group">
              {/* Analysis A Layer */}
              <img 
                src={getVisualA()} 
                alt="Analysis A"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Analysis B Clipped Layer */}
              <div 
                style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                className="absolute inset-0 w-full h-full"
              >
                <img 
                  src={getVisualB()} 
                  alt="Analysis B"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Vertical Divider Line */}
              <div 
                style={{ left: `${sliderPosition}%` }}
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#00C8FF] text-slate-950 flex items-center justify-center font-bold shadow-xl border-2 border-white">
                  <ArrowLeftRight className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {/* Native range slider for drag */}
              <input 
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                title="Drag left and right to inspect differences"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-[#070D18]/90 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-cyan-300 pointer-events-none">
                ANALYSIS A • COPERNICUS GLO-30
              </div>
              <div className="absolute top-4 right-4 p-2.5 rounded-xl bg-[#070D18]/90 backdrop-blur-md border border-emerald-500/40 text-xs font-mono text-emerald-300 pointer-events-none">
                ANALYSIS B • MONOCULAR AI CALIBRATED
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] px-2">
              <span>Drag slider across viewport to reveal volumetric discrepancies</span>
              <span className="text-cyan-400">Position: {sliderPosition}%</span>
            </div>
          </div>
        ) : (
          /* Side-by-Side Dual View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Panel A */}
            <div className="bg-[#091222] rounded-2xl border border-[#162744] p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-cyan-300">Analysis A: Baseline Pre-Event (2024)</span>
                <span className="text-[#64748B]">ESA Copernicus GLO-30</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-[#182C4A] h-96">
                <img src={getVisualA()} alt="Panel A" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs font-mono text-[#94A3B8] space-y-1">
                <div>• Mean Elevation: 21.4 m AMSL</div>
                <div>• Valid Coverage: 100%</div>
              </div>
            </div>

            {/* Panel B */}
            <div className="bg-[#091222] rounded-2xl border border-[#162744] p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-emerald-300">Analysis B: Current Drone AI (2026)</span>
                <span className="text-[#64748B]">Depth-Anything-V2</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-[#182C4A] h-96">
                <img src={getVisualB()} alt="Panel B" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs font-mono text-[#94A3B8] space-y-1">
                <div>• Mean Elevation: 22.8 m AMSL (+1.4m delta)</div>
                <div>• 142 Newly Extruded Structures</div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Visual Difference Statistics Map Card */}
      <div className="bg-[#091222] rounded-2xl border border-[#162744] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#162744] pb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#00C8FF]" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Visual Difference Statistics & Elevation Delta
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400">Alignment: High Precision</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#15243C]">
            <span className="text-[#64748B] block text-[10px] uppercase">Mean Elevation Delta</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">+1.42 m</div>
            <span className="text-[#94A3B8] text-[10px]">Natural variance</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#15243C]">
            <span className="text-[#64748B] block text-[10px] uppercase">Max Elevation Discrepancy</span>
            <div className="text-xl font-bold text-cyan-300 mt-1">+61.7 m</div>
            <span className="text-[#94A3B8] text-[10px]">New high-rise towers</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#15243C]">
            <span className="text-[#64748B] block text-[10px] uppercase">Structures Count Delta</span>
            <div className="text-xl font-bold text-white mt-1">+142</div>
            <span className="text-cyan-400 text-[10px]">Segmented footprints</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#15243C]">
            <span className="text-[#64748B] block text-[10px] uppercase">Co-registration Status</span>
            <div className="text-xl font-bold text-[#00C8FF] mt-1">ALIGNED</div>
            <span className="text-emerald-400 text-[10px]">EPSG:4326 Orthometric</span>
          </div>
        </div>
      </div>

    </div>
  );
};
