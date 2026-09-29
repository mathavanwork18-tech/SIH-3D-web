import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  ArrowUpDown, 
  Box, 
  Layers, 
  TrendingUp 
} from 'lucide-react';
import type { Analysis, DetectedObject } from '../types';

interface FootprintInspectorProps {
  analysis: Analysis;
  onSelectBuilding: (building: DetectedObject) => void;
  onSwitchTo3D: () => void;
}

export const FootprintInspector: React.FC<FootprintInspectorProps> = ({
  analysis,
  onSelectBuilding,
  onSwitchTo3D
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'height' | 'area' | 'confidence' | 'roof'>('height');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const buildings = analysis.detectedObjects || [];

  // Filter & Sort
  const filtered = buildings.filter((b) => {
    const matchesSearch = b.identifier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  filtered.sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortField === 'height') {
      valA = a.estimatedHeightM || 0;
      valB = b.estimatedHeightM || 0;
    } else if (sortField === 'area') {
      valA = a.areaSqM || 0;
      valB = b.areaSqM || 0;
    } else if (sortField === 'roof') {
      valA = a.roofElevationM || 0;
      valB = b.roofElevationM || 0;
    } else {
      valA = a.confidence;
      valB = b.confidence;
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  // Aggregate Stats
  const totalBuildings = buildings.length;
  const maxHeight = Math.max(...buildings.map((b) => b.estimatedHeightM || 0), 0);
  const meanHeight = buildings.length > 0 ? (buildings.reduce((acc, b) => acc + (b.estimatedHeightM || 0), 0) / buildings.length).toFixed(1) : '0';
  const totalArea = buildings.reduce((acc, b) => acc + (b.areaSqM || 0), 0);

  return (
    <div className="w-full h-full flex flex-col gap-5 p-4 max-w-[1920px] mx-auto select-none">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border border-cyan-500/20">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Cataloged Structures</span>
            <div className="text-2xl font-extrabold text-white font-mono">{totalBuildings} Units</div>
            <span className="text-[11px] text-cyan-400">100% LOD2 Extruded</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border border-emerald-500/20">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Max Building Height</span>
            <div className="text-2xl font-extrabold text-emerald-300 font-mono">{maxHeight.toFixed(1)} m</div>
            <span className="text-[11px] text-slate-400">BLD-103 Highrise</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border border-blue-500/20">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Average Structure Height</span>
            <div className="text-2xl font-extrabold text-blue-300 font-mono">{meanHeight} m</div>
            <span className="text-[11px] text-slate-400">Urban Canopy Mean</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border border-purple-500/20">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Built Footprint</span>
            <div className="text-2xl font-extrabold text-purple-300 font-mono">{(totalArea / 1000).toFixed(1)}k m²</div>
            <span className="text-[11px] text-purple-400">Dense Commercial Zone</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-3 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#070b14] px-3 py-2 rounded-xl border border-slate-800 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search identifier (e.g. BLD-103)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
          />
        </div>

        {/* Category & Sorting Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Filter:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#070b14] border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="building">Commercial / Residential</option>
              <option value="structure">Infrastructure / Terminal</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Sort By:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-[#070b14] border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none"
            >
              <option value="height">Building Height</option>
              <option value="area">Footprint Area</option>
              <option value="roof">Roof Elevation</option>
              <option value="confidence">AI Confidence</option>
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-1.5 rounded-lg bg-[#070b14] border border-slate-800 text-slate-300 hover:text-white"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Buildings Table & Grid */}
      <div className="glass-panel-elevated rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1329] text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">IDENTIFIER</th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">NET HEIGHT (m)</th>
                <th className="py-3 px-4">ROOF ELEV. (AMSL)</th>
                <th className="py-3 px-4">GROUND ELEV.</th>
                <th className="py-3 px-4">FOOTPRINT AREA</th>
                <th className="py-3 px-4">EST. STOREYS</th>
                <th className="py-3 px-4">CONFIDENCE</th>
                <th className="py-3 px-4 text-right">3D ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((b) => (
                <tr 
                  key={b.id}
                  className="hover:bg-cyan-500/5 transition-colors cursor-pointer group"
                  onClick={() => {
                    onSelectBuilding(b);
                    onSwitchTo3D();
                  }}
                >
                  <td className="py-3.5 px-4 font-extrabold text-cyan-300 font-mono flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>{b.identifier}</span>
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[10px] font-mono text-slate-400">
                    {b.category}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                    {(b.estimatedHeightM || 0).toFixed(1)} m
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {b.roofElevationM?.toFixed(1) || '--'} m
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {b.groundElevationM?.toFixed(1) || '--'} m
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400">
                    {b.areaSqM?.toLocaleString() || '--'} m²
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">
                    ~{Math.round((b.estimatedHeightM || 0) / 3.2)} floors
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-semibold">
                      {(b.confidence * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBuilding(b);
                        onSwitchTo3D();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-all"
                    >
                      Focus in 3D
                    </button>
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
