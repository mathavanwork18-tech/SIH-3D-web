import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Box, 
  FileText, 
  ArrowRight
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface HistoryPageProps {
  onNavigate: (view: PrototypeView) => void;
}

interface HistoryItem {
  id: string;
  name: string;
  location: string;
  date: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  objects: number;
  thumbnail: string;
  resolution: string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'processing' | 'failed'>('all');

  const historyRecords: HistoryItem[] = [
    { id: 'VIZ-001', name: 'Visakhapatnam Urban Maritime Zone', location: 'Visakhapatnam Port & Commercial District, AP', date: '2026-09-28 07:15', status: 'COMPLETED', objects: 142, thumbnail: '/demo/thumbnail.png', resolution: '0.35m GSD' },
    { id: 'MUM-002', name: 'Mumbai BKC Commercial Central Spine', location: 'Bandra Kurla Complex, Mumbai, MH', date: '2026-09-27 14:20', status: 'COMPLETED', objects: 218, thumbnail: '/demo/satellite_scene.png', resolution: '0.30m GSD' },
    { id: 'BLR-003', name: 'Bengaluru Tech Corridor Phase 1', location: 'Electronic City, Bengaluru, KA', date: '2026-09-26 11:45', status: 'COMPLETED', objects: 96, thumbnail: '/demo/elevation_metric_dsm.png', resolution: '0.40m GSD' },
    { id: 'DEL-004', name: 'New Delhi Central Vista Urban Zone', location: 'Rajpath / Central Vista, New Delhi, DL', date: '2026-09-29 09:10', status: 'PROCESSING', objects: 64, thumbnail: '/demo/depth_relative_heatmap.png', resolution: '0.50m GSD' },
    { id: 'HYD-005', name: 'Hyderabad HITEC City Cyber Park', location: 'Madhapur High-Tech Zone, Hyderabad, TS', date: '2026-09-25 16:30', status: 'COMPLETED', objects: 184, thumbnail: '/demo/satellite_scene.png', resolution: '0.35m GSD' },
    { id: 'CHN-006', name: 'Chennai Port Container Terminal', location: 'Chennai Harbor Maritime Gateway, TN', date: '2026-09-24 10:15', status: 'COMPLETED', objects: 112, thumbnail: '/demo/thumbnail.png', resolution: '0.38m GSD' },
    { id: 'KOL-007', name: 'Kolkata New Town Central Sector', location: 'Rajarhat Sector V, Kolkata, WB', date: '2026-09-23 18:00', status: 'FAILED', objects: 0, thumbnail: '/demo/depth_relative_heatmap.png', resolution: '1.20m GSD' },
  ];

  const filtered = historyRecords.filter((rec) => {
    const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rec.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Analysis History</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 13
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Historical repository of processed monocular aerial scenes, elevation rasters, and 3D volumetric models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('detail')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>Next: Analysis Detail</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#091222] p-4 rounded-2xl border border-[#162744] flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by analysis name, location, or ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#060B14] border border-[#162744] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-cyan-400 font-medium"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#060B14] p-1 rounded-xl border border-[#162744] text-xs font-mono">
          {[
            { id: 'all', label: 'All', count: historyRecords.length },
            { id: 'completed', label: 'Completed', count: 5 },
            { id: 'processing', label: 'Processing', count: 1 },
            { id: 'failed', label: 'Failed', count: 1 },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                statusFilter === f.id
                  ? 'bg-[#00C8FF] text-slate-950 font-bold shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <span>{f.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === f.id ? 'bg-slate-950 text-cyan-300' : 'bg-[#101F37] text-[#64748B]'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-[#162744] bg-[#08101E] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1527] border-b border-[#162744] text-[#94A3B8] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Thumbnail</th>
                <th className="py-3.5 px-4">Analysis Name</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Objects</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#122038] text-slate-300">
              {filtered.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#0E1B33] transition-colors">
                  <td className="py-3 px-4">
                    <img 
                      src={rec.thumbnail} 
                      alt={rec.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#1A3052] shrink-0" 
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{rec.name}</div>
                    <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                      {rec.id} • {rec.resolution}
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
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        COMPLETED
                      </span>
                    ) : rec.status === 'PROCESSING' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-medium">
                        <Clock className="w-3 h-3 animate-spin" />
                        PROCESSING
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-300 text-[10px] font-mono font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        FAILED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <span className="text-white font-medium">{rec.objects}</span> structures
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 font-mono text-xs">
                      <button
                        onClick={() => onNavigate('results')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0E1A30] hover:bg-[#182C50] text-[#00C8FF] border border-[#1E3658] transition-all flex items-center gap-1"
                        title="View Analysis"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </button>

                      <button
                        onClick={() => onNavigate('3d-reconstruction')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0E1A30] hover:bg-[#182C50] text-blue-400 border border-[#1E3658] transition-all flex items-center gap-1"
                        title="3D Viewer"
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">3D</span>
                      </button>

                      <button
                        onClick={() => onNavigate('reports')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0E1A30] hover:bg-[#182C50] text-slate-300 border border-[#1E3658] transition-all flex items-center gap-1"
                        title="Export Report"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Report</span>
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
  );
};
