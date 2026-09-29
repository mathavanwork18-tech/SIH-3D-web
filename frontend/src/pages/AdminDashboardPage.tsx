import React, { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  Cpu, 
  HardDrive, 
  CheckCircle2
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface AdminDashboardPageProps {
  onNavigate: (view: PrototypeView) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [adminTab, setAdminTab] = useState<'users' | 'analyses' | 'models' | 'storage' | 'logs' | 'settings'>('analyses');

  const adminCards = [
    { label: 'Total Users', value: '1,420', subtext: '+18% MoM growth', icon: Users, color: 'text-indigo-400' },
    { label: 'Total Analyses', value: '8,940', subtext: 'Urban & coastal scenes', icon: BarChart3, color: 'text-[#00C8FF]' },
    { label: 'Processing Jobs', value: '6 Active', subtext: 'Across 4 GPU nodes', icon: Cpu, color: 'text-amber-400' },
    { label: 'Storage Usage', value: '642 GB / 2 TB', subtext: '32.1% cluster quota', icon: HardDrive, color: 'text-cyan-300' },
    { label: 'System Status', value: '99.98%', subtext: 'All AI Nodes Operational', icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  const adminNavItems = [
    { id: 'users', label: 'Users' },
    { id: 'analyses', label: 'Analyses' },
    { id: 'models', label: 'AI Models' },
    { id: 'storage', label: 'Storage' },
    { id: 'logs', label: 'Logs' },
    { id: 'settings', label: 'System Settings' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">System Administration</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-semibold">
              STEP 18 (ADMIN)
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Enterprise cluster management, AI inference queue monitoring, user permissions, and telemetry logs.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E1A30] hover:bg-[#152646] border border-[#1E3658] text-white text-xs font-mono transition-all"
        >
          <span>Return to Dashboard (Step 02)</span>
        </button>
      </div>

      {/* 5 Admin Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {adminCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#091222] border border-[#162744] shadow-md hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#94A3B8]">{c.label}</span>
                <div className={`p-2 rounded-xl bg-[#060B14] border border-[#15243C] ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-extrabold text-white mt-3">
                {c.value}
              </div>
              <div className="text-[10px] font-mono text-[#64748B] mt-1 truncate">
                {c.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section: Daily Analyses, Processing Time, Storage Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Daily Analyses Chart Mock */}
        <div className="bg-[#091222] p-5 rounded-2xl border border-[#162744] shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-white">Daily Analyses Volume</span>
            <span className="text-cyan-300">+24 today</span>
          </div>
          
          <div className="h-28 flex items-end gap-2 pt-2 px-1">
            {[45, 62, 80, 55, 90, 75, 110, 95, 130, 142].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  style={{ height: `${(val / 142) * 100}%` }}
                  className="w-full rounded-t bg-gradient-to-t from-blue-600 to-cyan-400 hover:brightness-125 transition-all" 
                />
                <span className="text-[8px] font-mono text-[#64748B]">{idx + 1}</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] font-mono text-[#64748B] text-center">Past 10 days activity peak</div>
        </div>

        {/* Processing Latency Distribution */}
        <div className="bg-[#091222] p-5 rounded-2xl border border-[#162744] shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-white">Processing Latency</span>
            <span className="text-emerald-400">Mean 3.8s</span>
          </div>

          <div className="h-28 flex items-end gap-2 pt-2 px-1">
            {[2.1, 2.5, 3.2, 3.8, 4.1, 3.6, 3.9, 4.2, 3.4, 3.8].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  style={{ height: `${(val / 5.0) * 100}%` }}
                  className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 hover:brightness-125 transition-all" 
                />
                <span className="text-[8px] font-mono text-[#64748B]">{val}s</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] font-mono text-[#64748B] text-center">Inference Latency (seconds)</div>
        </div>

        {/* Storage Usage by Sensor Type */}
        <div className="bg-[#091222] p-5 rounded-2xl border border-[#162744] shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-white">Storage by Sensor</span>
            <span className="text-indigo-300">642 GB</span>
          </div>

          <div className="space-y-2 pt-2 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[11px] text-[#94A3B8] mb-1">
                <span>WorldView-3 / GeoTIFF</span>
                <span>380 GB (59%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#060B14]">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '59%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#94A3B8] mb-1">
                <span>UAV Drone High-Res Orthos</span>
                <span>182 GB (28%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#060B14]">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#94A3B8] mb-1">
                <span>LOD2 3D Meshes (GLB)</span>
                <span>80 GB (13%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#060B14]">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '13%' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Admin Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-[#091222] p-2 rounded-2xl border border-[#162744] text-xs font-mono">
        {adminNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setAdminTab(item.id as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              adminTab === item.id
                ? 'bg-[#00C8FF] text-slate-950 font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#0E1A30]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Dynamic Table based on Admin Tab */}
      <div className="bg-[#091222] rounded-2xl border border-[#162744] shadow-xl overflow-hidden p-6 space-y-4">
        
        {adminTab === 'analyses' || adminTab === 'users' ? (
          <div>
            <div className="flex items-center justify-between border-b border-[#162744] pb-3 mb-3">
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Active Analysis Cluster Jobs (6 Active)
              </h2>
              <span className="text-xs font-mono text-emerald-400">Worker Node Pool: 4/4 Ready</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#060B14] border-b border-[#162744] text-[#94A3B8] uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Job ID</th>
                    <th className="py-2.5 px-3">Analysis Target</th>
                    <th className="py-2.5 px-3">Pipeline Stage</th>
                    <th className="py-2.5 px-3">Worker / GPU</th>
                    <th className="py-2.5 px-3">Elapsed</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#15243C] text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 text-[#00C8FF]">job-viz-001</td>
                    <td className="py-2.5 px-3 text-white">Visakhapatnam Maritime Zone</td>
                    <td className="py-2.5 px-3 text-emerald-400">FINAL_ANALYSIS</td>
                    <td className="py-2.5 px-3">worker-gpu-nv-04 (RTX 4090)</td>
                    <td className="py-2.5 px-3">3.8s</td>
                    <td className="py-2.5 px-3 text-emerald-400">COMPLETED</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-[#00C8FF]">job-del-004</td>
                    <td className="py-2.5 px-3 text-white">New Delhi Central Vista</td>
                    <td className="py-2.5 px-3 text-amber-300">METRIC_CALIBRATION</td>
                    <td className="py-2.5 px-3">worker-gpu-nv-02 (RTX 4090)</td>
                    <td className="py-2.5 px-3">1.9s</td>
                    <td className="py-2.5 px-3 text-amber-400">PROCESSING</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-[#00C8FF]">job-mum-002</td>
                    <td className="py-2.5 px-3 text-white">Mumbai BKC Central</td>
                    <td className="py-2.5 px-3 text-emerald-400">COMPLETED</td>
                    <td className="py-2.5 px-3">worker-gpu-nv-01 (A100 SXM4)</td>
                    <td className="py-2.5 px-3">2.4s</td>
                    <td className="py-2.5 px-3 text-emerald-400">COMPLETED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : adminTab === 'models' ? (
          <div>
            <div className="flex items-center justify-between border-b border-[#162744] pb-3 mb-3">
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Deployed AI Model Registry
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#060B14] border border-[#15243C] space-y-1">
                <div className="text-white font-bold">Depth-Anything-V2-Aerial (v2.0.0)</div>
                <div className="text-[#94A3B8]">Dense relative monocular depth estimation tensor</div>
                <div className="text-emerald-400 text-[10px]">ACTIVE • TensorRT 10.1 FP16 Engine</div>
              </div>
              <div className="p-4 rounded-xl bg-[#060B14] border border-[#15243C] space-y-1">
                <div className="text-white font-bold">YOLOv8x-Geospatial (v2.4.0)</div>
                <div className="text-[#94A3B8]">Footprint polygon instance segmentation & classes</div>
                <div className="text-emerald-400 text-[10px]">ACTIVE • 88.4% Mean IoU</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between border-b border-[#162744] pb-3 mb-3">
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Cluster Telemetry Logs Stream
              </h2>
            </div>
            <div className="font-mono text-xs text-[#94A3B8] space-y-1.5 bg-[#060B14] p-4 rounded-xl">
              <div>[07:15:00] [INFO] Worker worker-gpu-nv-04 claimed job-viz-001. Ingesting GeoTIFF tensor.</div>
              <div>[07:15:01] [INFO] Copernicus GLO-30 DEM tile N17E083 fetched in 120ms.</div>
              <div>[07:15:02] [INFO] RANSAC Huber convergence reached after 48 iterations. Scale = 62.00.</div>
              <div>[07:15:03] [INFO] 3D mesh artifacts exported to client storage. Ready for WebGL.</div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
