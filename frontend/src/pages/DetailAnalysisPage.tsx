import React from 'react';
import { 
  FileText, 
  Compass, 
  ArrowRight
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface DetailAnalysisPageProps {
  onNavigate: (view: PrototypeView) => void;
}

export const DetailAnalysisPage: React.FC<DetailAnalysisPageProps> = ({ onNavigate }) => {
  const panels = [
    { title: '1. Original Aerial Scene', desc: '1024×1024 nadir optical RGB', img: '/demo/satellite_scene.png', target: 'upload' as PrototypeView },
    { title: '2. AI Neural Depth Map', desc: 'Disparity tensor (Depth-Anything-V2)', img: '/demo/depth_relative_heatmap.png', target: 'depth-map' as PrototypeView },
    { title: '3. Calibrated Metric Height Map', desc: 'Copernicus GLO-30 calibrated DSM', img: '/demo/elevation_metric_dsm.png', target: 'height-elevation' as PrototypeView },
    { title: '4. Detected Objects & Footprints', desc: '142 YOLOv8x polygons & height tags', img: '/demo/satellite_scene.png', target: 'object-detection' as PrototypeView },
    { title: '5. Metric Survey Measurements', desc: 'Geodesic distances & roof areas', img: '/demo/elevation_difference_map.png', target: 'measurements' as PrototypeView },
    { title: '6. 3D Volumetric Mesh Preview', desc: 'LOD2 continuous terrain & extrusions', img: '/demo/thumbnail.png', target: '3d-reconstruction' as PrototypeView },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Analysis Detail</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 14
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Comprehensive multi-modal synchronization: 2D Imagery → AI Disparity → Metric DSM → 3D Volumetric Model.
          </p>
        </div>

        <button
          onClick={() => onNavigate('reports')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] via-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Comprehensive 6-Panel Visual Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {panels.map((p, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate(p.target)}
            className="group bg-[#091222] rounded-2xl border border-[#162744] hover:border-cyan-500/50 shadow-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between"
          >
            <div className="p-4 border-b border-[#162744] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-xs group-hover:text-[#00C8FF] transition-colors">
                  {p.title}
                </h3>
                <span className="text-[10px] font-mono text-[#64748B]">{p.desc}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#00C8FF] group-hover:translate-x-1 transition-all" />
            </div>

            <div className="relative h-48 bg-[#050A14] overflow-hidden">
              <img 
                src={p.img} 
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-[#070D18]/90 text-[10px] font-mono text-cyan-300 border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to inspect →
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comprehensive Metadata Section */}
      <div className="bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-5">
        <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
          <Compass className="w-4 h-4 text-[#00C8FF]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Comprehensive Analysis Metadata & Calibration Ledger
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
          
          <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
            <span className="text-[#64748B] block text-[10px] uppercase">Location</span>
            <div className="text-white font-bold mt-1">Visakhapatnam Port</div>
            <span className="text-cyan-400 text-[10px]">17.6868° N, 83.2185° E</span>
          </div>

          <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
            <span className="text-[#64748B] block text-[10px] uppercase">Resolution / GSD</span>
            <div className="text-white font-bold mt-1">0.35m / px GSD</div>
            <span className="text-[#94A3B8] text-[10px]">1024 × 1024 Grid</span>
          </div>

          <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
            <span className="text-[#64748B] block text-[10px] uppercase">Processing Time</span>
            <div className="text-emerald-400 font-bold mt-1">3.84s End-to-End</div>
            <span className="text-[#94A3B8] text-[10px]">760ms GPU Latency</span>
          </div>

          <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
            <span className="text-[#64748B] block text-[10px] uppercase">Model Version</span>
            <div className="text-white font-bold mt-1">v2.4-Aerial-Geo</div>
            <span className="text-[#94A3B8] text-[10px]">YOLOv8x + TensorRT</span>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
            <span className="text-cyan-300 block text-[10px] uppercase font-bold">Calibration Status</span>
            <div className="text-white font-bold mt-1">CALIBRATED ✓</div>
            <span className="text-emerald-400 text-[10px]">RMSE: 1.42m (Copernicus)</span>
          </div>

        </div>

        {/* Primary Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onNavigate('reports')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00C8FF] via-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
          >
            <span>Proceed to Step 15: Export Report & 3D Assets</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

    </div>
  );
};
