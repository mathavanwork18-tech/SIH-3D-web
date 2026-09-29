import React from 'react';
import { 
  Plus, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  Box, 
  FileText, 
  Eye, 
  ArrowUpRight, 
  Satellite
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface DashboardPageProps {
  onNavigate: (view: PrototypeView) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Total Analyses', value: '148', change: '+12% this month', icon: BarChart3, color: 'text-[#00C8FF]' },
    { label: 'Completed', value: '142', change: '95.9% success rate', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Processing', value: '4', change: '2 GPU worker nodes', icon: Clock, color: 'text-amber-400' },
    { label: 'Storage Used', value: '2.4 GB', change: 'of 10.0 GB quota (24%)', icon: HardDrive, color: 'text-indigo-400' },
  ];

  const recentAnalyses = [
    {
      id: 'viz-001',
      name: 'Visakhapatnam Urban Maritime Zone',
      location: 'Visakhapatnam Port & Commercial District, AP',
      date: '2026-09-28 07:15',
      status: 'COMPLETED',
      structures: 142,
      maxHeight: '74.2 m',
      resolution: '0.35m GSD',
      thumbnail: '/demo/thumbnail.png'
    },
    {
      id: 'mum-002',
      name: 'Mumbai BKC Financial Center Spine',
      location: 'Bandra Kurla Complex, Mumbai, MH',
      date: '2026-09-27 14:20',
      status: 'COMPLETED',
      structures: 218,
      maxHeight: '128.5 m',
      resolution: '0.30m GSD',
      thumbnail: '/demo/satellite_scene.png'
    },
    {
      id: 'blr-003',
      name: 'Bengaluru Tech Corridor Phase 1',
      location: 'Electronic City, Bengaluru, KA',
      date: '2026-09-26 11:45',
      status: 'COMPLETED',
      structures: 96,
      maxHeight: '62.0 m',
      resolution: '0.40m GSD',
      thumbnail: '/demo/elevation_metric_dsm.png'
    },
    {
      id: 'del-004',
      name: 'New Delhi Central Vista Urban Zone',
      location: 'Rajpath / Central Vista, New Delhi, DL',
      date: '2026-09-29 09:10',
      status: 'PROCESSING',
      structures: 64,
      maxHeight: 'Pending...',
      resolution: '0.50m GSD',
      thumbnail: '/demo/depth_relative_heatmap.png'
    },
    {
      id: 'hyd-005',
      name: 'Hyderabad HITEC City Cyber Park',
      location: 'Madhapur High-Tech Zone, Hyderabad, TS',
      date: '2026-09-25 16:30',
      status: 'COMPLETED',
      structures: 184,
      maxHeight: '94.8 m',
      resolution: '0.35m GSD',
      thumbnail: '/demo/satellite_scene.png'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome to DepthWizard
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              SIH26175
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Single Image → Height Estimation → 3D Flythrough | Autonomous Geospatial Analysis
          </p>
        </div>

        <button
          onClick={() => onNavigate('upload')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* 4 Simple Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#091222] border border-[#162744] hover:border-cyan-500/40 transition-all shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#94A3B8]">{s.label}</span>
                <div className={`p-2 rounded-xl bg-[#0E1A30] border border-[#1A3052] ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white mt-3 tracking-tight">
                {s.value}
              </div>
              <div className="text-[11px] font-mono text-[#64748B] mt-1">
                {s.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Quick Benchmark Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B172E] via-[#0E1D3A] to-[#0A162B] border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00C8FF]">
            <Satellite className="w-4 h-4" />
            <span>ACTIVE CALIBRATED BENCHMARK SCENE</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Visakhapatnam Urban Maritime Zone (0.35m GSD)
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-2xl leading-relaxed">
            Monocular neural depth disparity calibrated against Copernicus GLO-30 DEM. 142 building footprints with 3D continuous terrain reconstruction and interactive flight corridor.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono text-[#64748B]">
            <span className="px-2 py-0.5 rounded bg-[#101F37] text-slate-300">Lat: 17.6868° N</span>
            <span className="px-2 py-0.5 rounded bg-[#101F37] text-slate-300">Long: 83.2185° E</span>
            <span className="px-2 py-0.5 rounded bg-[#101F37] text-emerald-300">RMSE: 1.42m</span>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-2 shrink-0 z-10 w-full md:w-auto">
          <button
            onClick={() => onNavigate('results')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00C8FF] hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Results</span>
          </button>
          <button
            onClick={() => onNavigate('3d-reconstruction')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E1A30] hover:bg-[#152646] border border-[#1E365C] text-white text-xs font-medium transition-all"
          >
            <Box className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span>Launch 3D World</span>
          </button>
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Recent Analyses</h2>
            <span className="text-xs font-mono text-[#64748B]">(Showing 5 latest)</span>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-mono text-[#00C8FF] hover:underline flex items-center gap-1"
          >
            <span>View All History</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="rounded-2xl border border-[#162744] bg-[#08101E] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1527] border-b border-[#162744] text-[#94A3B8] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Analysis Name</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Structures / Max Ht</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#122038] text-slate-300">
                {recentAnalyses.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#0E1B33] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={rec.thumbnail} 
                          alt={rec.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#1A3052] shrink-0" 
                        />
                        <div>
                          <div className="font-semibold text-white">{rec.name}</div>
                          <div className="text-[10px] font-mono text-[#64748B]">{rec.id} • {rec.resolution}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#94A3B8] max-w-xs truncate">
                      {rec.location}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#64748B]">
                      {rec.date}
                    </td>
                    <td className="py-3 px-4">
                      {rec.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          COMPLETED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
                          <Clock className="w-3 h-3 animate-spin" />
                          PROCESSING
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className="text-white font-medium">{rec.structures}</span> blds / <span className="text-cyan-300">{rec.maxHeight}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onNavigate('results')}
                          className="p-1.5 rounded-lg bg-[#0E1A30] hover:bg-[#182C50] text-[#00C8FF] transition-colors"
                          title="View Analysis Results"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onNavigate('3d-reconstruction')}
                          className="p-1.5 rounded-lg bg-[#0E1A30] hover:bg-[#182C50] text-blue-400 transition-colors"
                          title="Open 3D Viewer"
                        >
                          <Box className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onNavigate('reports')}
                          className="p-1.5 rounded-lg bg-[#0E1A30] hover:bg-[#182C50] text-slate-300 transition-colors"
                          title="Export Report"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
