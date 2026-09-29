import React, { useState } from 'react';
import { 
  Building, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Box, 
  ArrowRight,
  Compass,
  FileText
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface ResultsPageProps {
  onNavigate: (view: PrototypeView) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'depth' | 'height' | 'objects' | '3d' | 'measurements'>('depth');

  const topCards = [
    { label: 'Tallest Structure', value: '74.2 m', subtext: 'Commercial Tower BLD-B12', icon: Building, color: 'text-[#00C8FF]' },
    { label: 'Average Height', value: '22.8 m', subtext: 'Standard dev: ±8.4m', icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Structures Detected', value: '142', subtext: 'Footprints segmented', icon: Layers, color: 'text-indigo-400' },
    { label: 'AI Confidence', value: '98.4%', subtext: 'Copernicus DEM validated', icon: ShieldCheck, color: 'text-cyan-300' },
  ];

  // Visual mapping for each tab
  const getTabVisual = () => {
    switch (activeTab) {
      case 'depth':
        return {
          img: '/demo/depth_relative_heatmap.png',
          title: 'Neural Disparity Depth Heatmap',
          desc: 'Dense monocular depth tensor computed with Depth-Anything-V2-Aerial. Color ramp reflects relative proximity.',
          tag: 'MONOCULAR DEPTH TENSOR'
        };
      case 'height':
        return {
          img: '/demo/elevation_metric_dsm.png',
          title: 'Calibrated Metric Height / Elevation DSM',
          desc: 'Calibrated with Copernicus GLO-30 DEM reference. Dynamic range: 12.5m to 74.2m above sea level.',
          tag: 'METRIC DSM RASTER'
        };
      case 'objects':
        return {
          img: '/demo/satellite_scene.png',
          title: 'Polygon Instance Footprints Overlay',
          desc: '142 segmented building footprints with bounding polygons and metric height extrusions.',
          tag: 'YOLOV8X INSTANCES'
        };
      case '3d':
        return {
          img: '/demo/elevation_metric_dsm.png',
          title: '3D Volumetric Mesh Preview',
          desc: 'LOD2 continuous terrain displaced mesh with textured architectural geometries.',
          tag: '3D CONTINUOUS MESH'
        };
      case 'measurements':
        return {
          img: '/demo/satellite_scene.png',
          title: 'Metric Measurement Survey Workspace',
          desc: 'Geodesic distances, surface areas, and vertical elevation deltas calibrated against GSD.',
          tag: 'GEODESIC SURVEY'
        };
    }
  };

  const visual = getTabVisual();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Analysis Results</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 05
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Visakhapatnam Urban Maritime Zone (SIH26175) • Autonomous Monocular AI Reconstruction
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#091222] hover:bg-[#111F36] border border-[#162744] text-[#94A3B8] hover:text-white text-xs font-medium transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span>Generate Report</span>
          </button>

          <button
            onClick={() => onNavigate('3d-reconstruction')}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Open in 3D Viewer</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#091222] border border-[#162744] shadow-md hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#94A3B8]">{c.label}</span>
                <div className={`p-2 rounded-xl bg-[#0E1A30] border border-[#1A3052] ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white mt-3">
                {c.value}
              </div>
              <div className="text-[11px] font-mono text-[#64748B] mt-1">
                {c.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analysis Display: Center Visual & Navigation Tabs (8 cols) + Right Metadata Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 cols: Large aerial analysis image with tabs */}
        <div className="lg:col-span-8 bg-[#091222] rounded-2xl border border-[#162744] shadow-xl overflow-hidden space-y-4 p-5">
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#162744]">
            {[
              { id: 'depth', label: 'Depth Map', page: 'depth-map' as PrototypeView },
              { id: 'height', label: 'Height / DEM', page: 'height-elevation' as PrototypeView },
              { id: 'objects', label: 'Objects (142)', page: 'object-detection' as PrototypeView },
              { id: '3d', label: '3D Model', page: '3d-reconstruction' as PrototypeView },
              { id: 'measurements', label: 'Measurements', page: 'measurements' as PrototypeView },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#0E1A30]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}

            <div className="ml-auto">
              <button
                onClick={() => {
                  if (activeTab === 'depth') onNavigate('depth-map');
                  else if (activeTab === 'height') onNavigate('height-elevation');
                  else if (activeTab === 'objects') onNavigate('object-detection');
                  else if (activeTab === '3d') onNavigate('3d-reconstruction');
                  else onNavigate('measurements');
                }}
                className="text-[11px] font-mono text-[#00C8FF] hover:underline flex items-center gap-1 px-2 py-1"
              >
                <span>Full View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Large Image Viewport */}
          <div className="relative rounded-xl overflow-hidden border border-[#1A3052] bg-[#050A14] h-[440px] group shadow-inner">
            <img 
              src={visual.img} 
              alt={visual.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />

            {/* Overlaid bounding box mockup when on objects tab */}
            {activeTab === 'objects' && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[18%] left-[22%] w-[24%] h-[30%] border-2 border-[#00C8FF] bg-[#00C8FF]/10 rounded-sm">
                  <span className="absolute -top-6 left-0 bg-[#00C8FF] text-slate-950 font-bold font-mono text-[10px] px-1.5 py-0.5 rounded shadow">
                    BLD-B12 | 76.3m (98.4%)
                  </span>
                </div>
                <div className="absolute top-[52%] left-[45%] w-[18%] h-[22%] border-2 border-emerald-400 bg-emerald-400/10 rounded-sm">
                  <span className="absolute -top-6 left-0 bg-emerald-400 text-slate-950 font-bold font-mono text-[10px] px-1.5 py-0.5 rounded shadow">
                    BLD-A04 | 48.5m
                  </span>
                </div>
                <div className="absolute top-[12%] right-[20%] w-[26%] h-[20%] border-2 border-cyan-400 bg-cyan-400/10 rounded-sm">
                  <span className="absolute -top-6 left-0 bg-cyan-400 text-slate-950 font-bold font-mono text-[10px] px-1.5 py-0.5 rounded shadow">
                    BLD-C08 | 32.0m
                  </span>
                </div>
              </div>
            )}

            {/* Top-left Tag Badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#070D18]/90 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
              {visual.tag}
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#070D18] via-[#070D18]/80 to-transparent p-4 flex items-end justify-between">
              <div>
                <div className="text-sm font-bold text-white">{visual.title}</div>
                <div className="text-xs text-[#94A3B8] max-w-lg mt-0.5">{visual.desc}</div>
              </div>

              <button
                onClick={() => {
                  if (activeTab === 'depth') onNavigate('depth-map');
                  else if (activeTab === 'height') onNavigate('height-elevation');
                  else if (activeTab === 'objects') onNavigate('object-detection');
                  else if (activeTab === '3d') onNavigate('3d-reconstruction');
                  else onNavigate('measurements');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#00C8FF] hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0"
              >
                Inspect Dedicated Screen →
              </button>
            </div>
          </div>

        </div>

        {/* Right 4 cols: Detailed Metadata Panel */}
        <div className="lg:col-span-4 bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
            <Compass className="w-4 h-4 text-[#00C8FF]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Scene Metadata & Science
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Location */}
            <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
              <span className="text-[10px] font-mono text-[#64748B] uppercase block">Location</span>
              <div className="text-white font-semibold mt-0.5">
                Visakhapatnam Port Maritime Zone
              </div>
              <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                17.6868° N, 83.2185° E (UTM 44N)
              </div>
            </div>

            {/* Resolution */}
            <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
              <span className="text-[10px] font-mono text-[#64748B] uppercase block">Image Resolution / GSD</span>
              <div className="text-white font-semibold mt-0.5">
                0.35m / pixel Ground Sample Distance
              </div>
              <div className="text-[11px] font-mono text-[#94A3B8] mt-0.5">
                Raster Dimensions: 1024 × 1024 px
              </div>
            </div>

            {/* Processing Time */}
            <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
              <span className="text-[10px] font-mono text-[#64748B] uppercase block">Processing Latency</span>
              <div className="text-white font-semibold mt-0.5 flex items-center justify-between">
                <span>3.84s (End-to-End)</span>
                <span className="text-emerald-400 font-mono text-[11px]">Real-Time</span>
              </div>
              <div className="text-[11px] font-mono text-[#94A3B8] mt-0.5">
                GPU TensorRT inference: 760ms
              </div>
            </div>

            {/* Model Version */}
            <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
              <span className="text-[10px] font-mono text-[#64748B] uppercase block">Model Architecture</span>
              <div className="text-white font-semibold mt-0.5">
                Depth-Anything-V2-Aerial v2.4.0
              </div>
              <div className="text-[11px] font-mono text-[#94A3B8] mt-0.5">
                Metric Reference: Copernicus GLO-30 DEM
              </div>
            </div>

            {/* Calibration Summary */}
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
              <div className="text-[10px] font-mono text-[#00C8FF] uppercase font-semibold">
                Calibration Metric Verification
              </div>
              <div className="text-[11px] text-slate-300">
                • Scale Factor: <span className="font-mono text-white">62.00</span>
              </div>
              <div className="text-[11px] text-slate-300">
                • Offset: <span className="font-mono text-white">14.00 m</span> AMSL
              </div>
              <div className="text-[11px] text-slate-300">
                • RMSE Accuracy: <span className="font-mono text-emerald-400">1.42 m</span>
              </div>
            </div>

          </div>

          <button
            onClick={() => onNavigate('detail')}
            className="w-full py-3 rounded-xl bg-[#0E1A30] hover:bg-[#16294C] border border-[#1E3658] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>Open Comprehensive Detail View</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00C8FF]" />
          </button>
        </div>

      </div>

    </div>
  );
};
