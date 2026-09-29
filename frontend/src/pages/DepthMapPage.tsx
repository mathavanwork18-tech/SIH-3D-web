import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Activity, 
  Info,
  ArrowRight
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface DepthMapPageProps {
  onNavigate: (view: PrototypeView) => void;
}

export const DepthMapPage: React.FC<DepthMapPageProps> = ({ onNavigate }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [colorRamp, setColorRamp] = useState<'turbo' | 'spectral' | 'viridis'>('turbo');
  const [invertDisparity, setInvertDisparity] = useState(false);

  const legendSteps = [
    { label: '0m', color: 'bg-blue-600' },
    { label: '20m', color: 'bg-cyan-500' },
    { label: '40m', color: 'bg-emerald-500' },
    { label: '60m', color: 'bg-yellow-400' },
    { label: '80m', color: 'bg-orange-500' },
    { label: '100m+', color: 'bg-red-600' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Depth Map</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 06
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Dense monocular disparity heatmap computed via Depth-Anything-V2 aerial neural encoder.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('height-elevation')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>Next: Metric Height & DEM</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Main Grid: Heatmap Viewport (8 cols) + Side Statistics (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 cols: Large scientific depth heatmap & Interactive Controls */}
        <div className="lg:col-span-8 bg-[#091222] rounded-2xl border border-[#162744] shadow-xl overflow-hidden p-5 space-y-4">
          
          {/* Top Bar with Tools */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#162744] pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">Scientific Color Scale:</span>
              <div className="flex items-center gap-1 bg-[#060B14] p-1 rounded-lg border border-[#162744] text-[11px] font-mono">
                <button
                  onClick={() => setColorRamp('turbo')}
                  className={`px-2 py-0.5 rounded ${colorRamp === 'turbo' ? 'bg-[#00C8FF] text-slate-950 font-bold' : 'text-[#94A3B8]'}`}
                >
                  Turbo
                </button>
                <button
                  onClick={() => setColorRamp('spectral')}
                  className={`px-2 py-0.5 rounded ${colorRamp === 'spectral' ? 'bg-[#00C8FF] text-slate-950 font-bold' : 'text-[#94A3B8]'}`}
                >
                  Spectral
                </button>
                <button
                  onClick={() => setColorRamp('viridis')}
                  className={`px-2 py-0.5 rounded ${colorRamp === 'viridis' ? 'bg-[#00C8FF] text-slate-950 font-bold' : 'text-[#94A3B8]'}`}
                >
                  Viridis
                </button>
                <button
                  onClick={() => setInvertDisparity(!invertDisparity)}
                  className={`px-2 py-0.5 rounded ${invertDisparity ? 'bg-amber-400 text-slate-950 font-bold' : 'text-[#94A3B8]'}`}
                  title="Invert Disparity Ramp"
                >
                  Invert
                </button>
              </div>
            </div>

            {/* Zoom / Pan / Reset Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                className="p-1.5 rounded-lg bg-[#0C172B] hover:bg-[#142542] border border-[#182C4A] text-slate-200 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs text-[#00C8FF] px-2 py-0.5 rounded bg-[#060B14] border border-[#162744]">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                className="p-1.5 rounded-lg bg-[#0C172B] hover:bg-[#142542] border border-[#182C4A] text-slate-200 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1.5 rounded-lg bg-[#0C172B] hover:bg-[#142542] border border-[#182C4A] text-slate-200 transition-colors ml-1"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Large Scientific Heatmap Canvas Viewport */}
          <div className="relative rounded-xl overflow-hidden border border-[#182C4A] bg-[#050A14] h-[460px] flex items-center justify-center shadow-inner group">
            <div 
              style={{ transform: `scale(${zoomLevel / 100})`, filter: invertDisparity ? 'invert(1)' : 'none' }}
              className="w-full h-full transition-transform duration-200 flex items-center justify-center"
            >
              <img 
                src="/demo/depth_relative_heatmap.png" 
                alt="Depth Heatmap"
                className="w-full h-full object-cover select-none"
              />
            </div>

            {/* Geospatial Crosshair Grid overlay */}
            <div className="absolute inset-0 pointer-events-none grid-bg opacity-30" />

            {/* Depth Probe Indicator (Hover tooltip) */}
            <div className="absolute bottom-16 right-4 p-2.5 rounded-xl bg-[#070D18]/90 backdrop-blur-md border border-cyan-500/40 text-[11px] font-mono text-slate-200 shadow-lg">
              <div className="text-[10px] text-[#64748B] uppercase">Disparity Tensor Value</div>
              <div className="text-cyan-300 font-bold">Relative: 0.842 | Metric: 66.8 m</div>
            </div>

            {/* Color Scale Legend at the bottom of the map */}
            <div className="absolute bottom-3 inset-x-4 p-3 rounded-xl bg-[#070E1B]/95 backdrop-blur-md border border-[#182C4A] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
              <div className="text-[11px] font-mono text-white flex items-center gap-1.5">
                <span className="font-bold text-[#00C8FF]">DEPTH GRADIENT:</span>
                <span className="text-[#94A3B8]">Blue (0m / Far) → Red (100m+ / High Proximity)</span>
              </div>

              {/* Gradient Color Bar & Ticks */}
              <div className="flex items-center gap-1">
                {legendSteps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-8 sm:w-10 h-3 rounded-sm ${step.color} shadow-sm`} />
                    <span className="text-[9px] font-mono text-[#94A3B8] mt-1">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono px-1">
            <span>Disparity tensor size: 1024×1024 float32</span>
            <span className="text-cyan-400">Continuous non-linear disparity normalization</span>
          </div>

        </div>

        {/* Right 4 cols: Side Statistics */}
        <div className="lg:col-span-4 bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
            <Activity className="w-4 h-4 text-[#00C8FF]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Depth Tensor Statistics
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Minimum Depth */}
            <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#15243C]">
              <span className="text-[10px] font-mono text-[#64748B] uppercase block">Minimum Depth (Ground)</span>
              <div className="text-xl font-bold text-white mt-0.5">
                0.120 <span className="text-xs font-normal text-[#94A3B8]">(Relative)</span>
              </div>
              <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                Metric Baseline: ~12.5 m AMSL
              </div>
            </div>

            {/* Maximum Depth */}
            <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#15243C]">
              <span className="text-[10px] font-mono text-[#64748B] uppercase block">Maximum Depth (Peak Roof)</span>
              <div className="text-xl font-bold text-[#00C8FF] mt-0.5">
                0.942 <span className="text-xs font-normal text-[#94A3B8]">(Relative)</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                Metric Elevation: ~74.2 m AMSL
              </div>
            </div>

            {/* Average Depth */}
            <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#15243C]">
              <span className="text-[10px] font-mono text-[#64748B] uppercase block">Average Disparity</span>
              <div className="text-xl font-bold text-white mt-0.5">
                0.384 <span className="text-xs font-normal text-[#94A3B8]">(Relative)</span>
              </div>
              <div className="text-[11px] font-mono text-[#94A3B8] mt-0.5">
                Standard Deviation: ±0.182
              </div>
            </div>

            {/* Confidence */}
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
              <span className="text-[10px] font-mono text-cyan-300 uppercase block font-semibold">
                Confidence Consistency
              </span>
              <div className="text-xl font-bold text-white mt-0.5">
                97.8% <span className="text-xs font-normal text-emerald-400">High Reliability</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                Consistent disparity distribution across textured urban structures and flat terrain.
              </p>
            </div>

          </div>

          <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C] text-[11px] text-[#94A3B8] leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-[#00C8FF] shrink-0 mt-0.5" />
            <span>
              Neural depth provides disparity; the next step applies ESA Copernicus GLO-30 DEM calibration to convert relative disparity into true metric meters.
            </span>
          </div>

          <button
            onClick={() => onNavigate('height-elevation')}
            className="w-full py-3 rounded-xl bg-[#0E1A30] hover:bg-[#16294C] border border-[#1E3658] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Step 07: Height Calibration</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00C8FF]" />
          </button>
        </div>

      </div>

    </div>
  );
};
