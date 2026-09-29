import React, { useState } from 'react';
import { 
  Ruler, 
  MoveHorizontal, 
  Square, 
  ArrowUpDown, 
  Plus, 
  Trash2, 
  Download, 
  Crosshair, 
  Building2, 
  ArrowRight
} from 'lucide-react';
import { ThreeDViewer } from '../components/ThreeDViewer';
import { DEMO_ANALYSIS } from '../services/api';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface MeasurementsPageProps {
  onNavigate: (view: PrototypeView) => void;
}

interface MeasurementRecord {
  id: string;
  target: string;
  type: 'Height' | 'Distance' | 'Area' | 'Elevation Delta';
  value: string;
  uncertainty: string;
  timestamp: string;
}

export const MeasurementsPage: React.FC<MeasurementsPageProps> = ({ onNavigate }) => {
  const [activeTool, setActiveTool] = useState<'height' | 'distance' | 'area' | 'elevation_diff'>('height');
  
  const [measurements, setMeasurements] = useState<MeasurementRecord[]>([
    { id: 'M-101', target: 'Building B-12 (Tower)', type: 'Height', value: '76.3 m', uncertainty: '±0.45m', timestamp: '07:15:10' },
    { id: 'M-102', target: 'Building B-12 Roof Polygon', type: 'Area', value: '1,240 m²', uncertainty: '±12m²', timestamp: '07:15:22' },
    { id: 'M-103', target: 'Coastal Boulevard Corridor', type: 'Distance', value: '284.5 m', uncertainty: '±0.35m', timestamp: '07:15:45' },
    { id: 'M-104', target: 'Harbor Base to Peak Tower', type: 'Elevation Delta', value: '62.3 m', uncertainty: '±0.50m', timestamp: '07:16:02' },
  ]);

  const tools = [
    { id: 'height', label: 'Height', icon: Ruler, description: 'Vertical structure height from ground level' },
    { id: 'distance', label: 'Distance', icon: MoveHorizontal, description: 'Horizontal geodesic surface ground distance' },
    { id: 'area', label: 'Area', icon: Square, description: '2D footprint polygon or roof surface area' },
    { id: 'elevation_diff', label: 'Elevation Difference', icon: ArrowUpDown, description: 'AMSL height delta between two arbitrary points' },
  ];

  const handleAddMeasurement = () => {
    const newRecord: MeasurementRecord = {
      id: `M-${105 + measurements.length}`,
      target: `Sample Point Pin #${measurements.length + 1}`,
      type: activeTool === 'height' ? 'Height' : activeTool === 'distance' ? 'Distance' : activeTool === 'area' ? 'Area' : 'Elevation Delta',
      value: activeTool === 'height' ? '48.2 m' : activeTool === 'distance' ? '128.0 m' : activeTool === 'area' ? '860 m²' : '34.8 m',
      uncertainty: '±0.35m',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMeasurements([newRecord, ...measurements]);
  };

  const handleClear = () => {
    setMeasurements([]);
  };

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,ID,Target,Type,Value,Uncertainty,Timestamp\n' +
      measurements.map((m) => `${m.id},"${m.target}",${m.type},"${m.value}","${m.uncertainty}",${m.timestamp}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'depthwizard_measurements.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Measurements</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 11
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Precision metric engineering tools: height estimation, geodesic distances, polygon areas, and elevation deltas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('compare')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>Next: Compare Analyses</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive 3D Measurement Workspace (8 cols) + Tool Selector & Inspector (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 cols: Large 3D / Map Workspace */}
        <div className="lg:col-span-8 bg-[#091222] rounded-2xl border border-[#162744] shadow-xl overflow-hidden p-4 space-y-4">
          
          {/* Active Tool Sub-Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#162744] pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold font-mono">Measurement Tool:</span>
              <div className="flex items-center gap-1 bg-[#060B14] p-1 rounded-lg border border-[#162744] text-[11px] font-mono">
                {tools.map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTool === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTool(t.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                        isActive
                          ? 'bg-[#00C8FF] text-slate-950 font-bold shadow-sm'
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddMeasurement}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Measurement</span>
              </button>
            </div>
          </div>

          {/* Large Workspace Container */}
          <div className="relative rounded-xl overflow-hidden border border-[#182C4A] bg-[#050A14] h-[480px] shadow-inner">
            <ThreeDViewer analysis={DEMO_ANALYSIS} />

            {/* Overlaid Measurement Crosshair & Dimension Line */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                {/* Vertical measurement line on Building B-12 */}
                <line x1="42%" y1="18%" x2="42%" y2="58%" stroke="#00C8FF" strokeWidth="2.5" strokeDasharray="4 2" />
                <circle cx="42%" cy="18%" r="5" fill="#00C8FF" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="42%" cy="58%" r="5" fill="#00C8FF" stroke="#FFFFFF" strokeWidth="1.5" />
                
                {/* Dimension callout label */}
                <rect x="44%" y="36%" width="130" height="28" rx="6" fill="#070E1B" stroke="#00C8FF" strokeWidth="1" />
                <text x="45.5%" y="41%" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  ΔH: 76.3 m (AMSL)
                </text>
              </svg>
            </div>

            {/* Top Workspace Badge */}
            <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-[#070D18]/90 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-slate-200 pointer-events-none flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#00C8FF] animate-pulse" />
              <span>ACTIVE TOOL: <strong className="text-cyan-300 uppercase">{activeTool.replace('_', ' ')}</strong></span>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono px-1">
            <span>Calibrated against Copernicus GLO-30 DEM (Scale = 62.00, Offset = 14.00m)</span>
            <span className="text-emerald-400">RMSE Uncertainty: ±0.35m</span>
          </div>

        </div>

        {/* Right 4 cols: Selected Object Card & Actions */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Selected Object Detail Card */}
          <div className="bg-[#091222] p-6 rounded-2xl border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#162744] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00C8FF]" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Selected Object
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-500/40">
                BLD-B12
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-[#94A3B8]">Structure Identifier</span>
                <div className="text-base font-bold text-white mt-0.5">
                  Building B-12
                </div>
                <div className="text-[11px] font-mono text-[#64748B]">Commercial Tower Spine</div>
              </div>

              {/* 2 Primary Metrics */}
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#15243C]">
                  <span className="text-[10px] text-[#64748B] uppercase block">Estimated Height</span>
                  <div className="text-2xl font-extrabold text-[#00C8FF] mt-1">
                    76.3 m
                  </div>
                  <span className="text-[10px] text-emerald-400 mt-1 block">±0.45m margin</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#15243C]">
                  <span className="text-[10px] text-[#64748B] uppercase block">Footprint Area</span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    1,240 m²
                  </div>
                  <span className="text-[10px] text-[#94A3B8] mt-1 block">Polygon surface</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C] text-[11px] font-mono text-[#94A3B8] space-y-1">
                <div className="flex justify-between">
                  <span>Roof Elevation AMSL:</span>
                  <span className="text-white font-bold">90.3 m</span>
                </div>
                <div className="flex justify-between">
                  <span>Ground Elevation AMSL:</span>
                  <span className="text-white">14.0 m</span>
                </div>
                <div className="flex justify-between">
                  <span>Aspect Ratio:</span>
                  <span className="text-cyan-300">1:1.6 (Slender)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons: Add, Clear, Export */}
          <div className="bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase mb-2">
              Survey Action Controls
            </h3>

            <button
              onClick={handleAddMeasurement}
              className="w-full py-2.5 rounded-xl bg-[#00C8FF] hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Measurement Record</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="w-full py-2.5 rounded-xl bg-[#0E1A30] hover:bg-[#152646] border border-[#1E3658] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Measurements (CSV)</span>
            </button>

            <button
              onClick={handleClear}
              className="w-full py-2 rounded-xl bg-[#060B14] hover:bg-rose-950/30 border border-[#15243C] hover:border-rose-500/40 text-[#94A3B8] hover:text-rose-400 text-xs font-mono flex items-center justify-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

        </div>

      </div>

      {/* Measurement History Table Below */}
      <div className="bg-[#091222] rounded-2xl border border-[#162744] shadow-xl overflow-hidden space-y-3 p-5">
        <div className="flex items-center justify-between border-b border-[#162744] pb-3">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#00C8FF]" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Measurement Survey History ({measurements.length} Records)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#64748B]">Export ready: CSV / GeoJSON</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1527] border-b border-[#162744] text-[#94A3B8] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Record ID</th>
                <th className="py-2.5 px-4">Target Entity</th>
                <th className="py-2.5 px-4">Measurement Type</th>
                <th className="py-2.5 px-4">Metric Value</th>
                <th className="py-2.5 px-4">Uncertainty</th>
                <th className="py-2.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#122038] text-slate-300 font-mono text-[11px]">
              {measurements.map((m) => (
                <tr key={m.id} className="hover:bg-[#0E1B33] transition-colors">
                  <td className="py-2.5 px-4 font-bold text-cyan-300">{m.id}</td>
                  <td className="py-2.5 px-4 text-white font-sans">{m.target}</td>
                  <td className="py-2.5 px-4 text-[#94A3B8]">{m.type}</td>
                  <td className="py-2.5 px-4 font-bold text-white">{m.value}</td>
                  <td className="py-2.5 px-4 text-emerald-400">{m.uncertainty}</td>
                  <td className="py-2.5 px-4 text-[#64748B]">{m.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
