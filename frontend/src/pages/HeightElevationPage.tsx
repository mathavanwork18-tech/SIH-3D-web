import React, { useState } from 'react';
import { 
  Building2, 
  Mountain, 
  TreePine, 
  Car, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface HeightElevationPageProps {
  onNavigate: (view: PrototypeView) => void;
}

export const HeightElevationPage: React.FC<HeightElevationPageProps> = ({ onNavigate }) => {
  const [activeLayerFilter, setActiveLayerFilter] = useState<'all' | 'buildings' | 'terrain' | 'roads' | 'vegetation'>('all');

  const layers = [
    { id: 'all', label: 'All Classes', icon: Layers, count: '100% Surface' },
    { id: 'buildings', label: 'Buildings', icon: Building2, count: '142 structures' },
    { id: 'terrain', label: 'Bare Terrain', icon: Mountain, count: 'Baseline DEM' },
    { id: 'roads', label: 'Road Corridors', icon: Car, count: '18 arterial corridors' },
    { id: 'vegetation', label: 'Vegetation Canopy', icon: TreePine, count: '86 clusters' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Metric Height & Elevation</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 07
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Absolute metric elevation in meters AMSL derived through robust RANSAC Huber calibration against ESA Copernicus GLO-30 DEM.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('object-detection')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>Next: Object Detection</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Main Grid: Elevation Visualization (8 cols) + Side Panel & Calibration (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 cols: Large Elevation Visualization */}
        <div className="lg:col-span-8 bg-[#091222] rounded-2xl border border-[#162744] shadow-xl overflow-hidden p-5 space-y-4">
          
          {/* Layer toggles bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#162744] pb-3 text-xs">
            <span className="font-semibold text-white font-mono">Visible Feature Class:</span>

            <div className="flex flex-wrap items-center gap-1.5">
              {layers.map((l) => {
                const Icon = l.icon;
                const isActive = activeLayerFilter === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setActiveLayerFilter(l.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                        : 'bg-[#060B14] text-[#94A3B8] border border-[#162744] hover:text-white hover:bg-[#0E1A30]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{l.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Large Elevation Map Visualization Container */}
          <div className="relative rounded-xl overflow-hidden border border-[#182C4A] bg-[#050A14] h-[480px] shadow-inner group">
            <img 
              src="/demo/elevation_metric_dsm.png" 
              alt="Metric Elevation DSM"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlaid Contour Lines & Feature Markers */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full opacity-40">
                <circle cx="35%" cy="30%" r="60" fill="none" stroke="#00C8FF" strokeWidth="1" strokeDasharray="3 3" />
                <text x="36%" y="28%" fill="#00C8FF" fontSize="10" fontFamily="monospace">60m Contour</text>
                
                <circle cx="35%" cy="30%" r="35" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" />
                <text x="36%" y="22%" fill="#F59E0B" fontSize="10" fontFamily="monospace">74m Peak (Tower B-12)</text>

                <circle cx="68%" cy="65%" r="70" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" />
                <text x="69%" y="62%" fill="#10B981" fontSize="10" fontFamily="monospace">18m Lowland</text>
              </svg>
            </div>

            {/* Top-right Elevation scale badge */}
            <div className="absolute top-4 right-4 p-3 rounded-xl bg-[#070E1B]/95 backdrop-blur-md border border-cyan-500/40 text-xs font-mono space-y-1 shadow-xl">
              <div className="text-[10px] text-[#00C8FF] uppercase font-bold">Metric Elevation Bar</div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-3 rounded-sm bg-gradient-to-r from-blue-600 via-emerald-500 via-yellow-400 to-red-600" />
              </div>
              <div className="flex justify-between text-[10px] text-[#94A3B8]">
                <span>12.5m (Min)</span>
                <span>74.2m (Max)</span>
              </div>
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-3 inset-x-4 p-3 rounded-xl bg-[#070E1B]/95 backdrop-blur-md border border-[#182C4A] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Active Filter: <strong className="text-cyan-300 uppercase">{activeLayerFilter}</strong></span>
              </div>
              <span className="text-[#94A3B8]">Vertical Datum: EGM2008 / WGS84 Orthometric</span>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono px-1">
            <span>DSM Raster Format: 32-bit Floating Point GeoTIFF</span>
            <span className="text-cyan-400">AMSL Georeferenced</span>
          </div>

        </div>

        {/* Right 4 cols: Side Panel & Calibration Section */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Elevation Metrics Panel */}
          <div className="bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
              <TrendingUp className="w-4 h-4 text-[#00C8FF]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Elevation Metrics
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              
              <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C] flex items-center justify-between">
                <span className="text-[#94A3B8]">Tallest Structure</span>
                <span className="text-base font-bold text-[#00C8FF] font-mono">74.2 m</span>
              </div>

              <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C] flex items-center justify-between">
                <span className="text-[#94A3B8]">Average Height</span>
                <span className="text-base font-bold text-white font-mono">22.8 m</span>
              </div>

              <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C] flex items-center justify-between">
                <span className="text-[#94A3B8]">Minimum Height</span>
                <span className="text-base font-bold text-slate-300 font-mono">12.5 m</span>
              </div>

              <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C] flex items-center justify-between">
                <span className="text-[#94A3B8]">Elevation Dynamic Range</span>
                <span className="text-base font-bold text-emerald-400 font-mono">61.7 m</span>
              </div>

            </div>
          </div>

          {/* Calibration Section */}
          <div className="bg-[#091222] p-6 rounded-2xl border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Calibration Verification
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#64748B] uppercase">Reference Data</span>
                <div className="p-2.5 rounded-lg bg-[#060B14] border border-[#15243C] font-semibold text-white">
                  ESA Copernicus GLO-30 DEM
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-[#060B14] border border-[#15243C]">
                  <span className="text-[10px] text-[#64748B] block">Scale Factor</span>
                  <span className="text-cyan-300 font-bold text-sm">62.00</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#060B14] border border-[#15243C]">
                  <span className="text-[10px] text-[#64748B] block">Offset AMSL</span>
                  <span className="text-white font-bold text-sm">14.00 m</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>Calibration Status:</span>
                  <span>CALIBRATED ✓</span>
                </div>
                <div className="text-slate-300 flex justify-between">
                  <span>RMSE Error:</span>
                  <span className="text-emerald-400 font-bold">1.42 m</span>
                </div>
                <div className="text-slate-300 flex justify-between">
                  <span>MAE Error:</span>
                  <span className="text-emerald-400">1.18 m</span>
                </div>
                <div className="text-slate-300 flex justify-between">
                  <span>Pearson Correlation:</span>
                  <span className="text-cyan-300">r = 0.984</span>
                </div>
              </div>

            </div>

            <button
              onClick={() => onNavigate('object-detection')}
              className="w-full py-3 rounded-xl bg-[#0E1A30] hover:bg-[#16294C] border border-[#1E3658] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>Inspect Object Detection (Step 08)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00C8FF]" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
