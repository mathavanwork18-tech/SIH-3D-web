import React, { useState } from 'react';
import { 
  Building2, 
  Car, 
  TreePine, 
  Layers, 
  Crosshair, 
  Box, 
  ArrowRight
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface ObjectDetectionPageProps {
  onNavigate: (view: PrototypeView) => void;
}

interface DetectedItem {
  id: string;
  name: string;
  category: 'building' | 'road' | 'tree' | 'structure';
  height: string;
  area: string;
  confidence: string;
  top: string;
  left: string;
  width: string;
  heightBox: string;
  color: string;
}

export const ObjectDetectionPage: React.FC<ObjectDetectionPageProps> = ({ onNavigate }) => {
  const [selectedObjectId, setSelectedObjectId] = useState<string>('BLD-B12');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const objects: DetectedItem[] = [
    { id: 'BLD-B12', name: 'Building B-12 (Commercial High-Rise)', category: 'building', height: '76.3 m', area: '1,240 m²', confidence: '98.4%', top: '22%', left: '38%', width: '22%', heightBox: '26%', color: '#00C8FF' },
    { id: 'BLD-A04', name: 'Building A-04 (Maritime Office)', category: 'building', height: '48.5 m', area: '2,520 m²', confidence: '97.2%', top: '15%', left: '12%', width: '18%', heightBox: '20%', color: '#00C8FF' },
    { id: 'BLD-C08', name: 'Building C-08 (Logistics Complex)', category: 'building', height: '32.0 m', area: '1,600 m²', confidence: '96.5%', top: '55%', left: '16%', width: '24%', heightBox: '22%', color: '#00C8FF' },
    { id: 'RD-01', name: 'Coastal Arterial Highway', category: 'road', height: '14.2 m AMSL', area: '18,400 m²', confidence: '99.1%', top: '78%', left: '5%', width: '85%', heightBox: '12%', color: '#3B82F6' },
    { id: 'TR-44', name: 'Maritime Park Tree Canopy', category: 'tree', height: '9.4 m', area: '4,200 m²', confidence: '94.8%', top: '45%', left: '68%', width: '22%', heightBox: '25%', color: '#10B981' },
    { id: 'STR-02', name: 'Port Gantry Crane Terminal', category: 'structure', height: '42.0 m', area: '850 m²', confidence: '95.6%', top: '18%', left: '72%', width: '18%', heightBox: '18%', color: '#F59E0B' },
  ];

  const selectedObject = objects.find((o) => o.id === selectedObjectId) || objects[0];

  const filteredObjects = filterCategory === 'all' 
    ? objects 
    : objects.filter((o) => o.category === filterCategory);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Object Detection</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 08
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            YOLOv8x-Geospatial polygon instance segmentation with automated height assignment and footprint estimation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('3d-reconstruction')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>Next: 3D Reconstruction</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Main Layout: Interactive Aerial Detection Canvas (8 cols) + Side Statistics & Inspector (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 cols: Large Aerial Image with professional bounding boxes */}
        <div className="lg:col-span-8 bg-[#091222] rounded-2xl border border-[#162744] shadow-xl overflow-hidden p-5 space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#162744] pb-3 text-xs">
            <span className="font-semibold text-white font-mono">Detection Filters:</span>
            <div className="flex items-center gap-1.5 bg-[#060B14] p-1 rounded-lg border border-[#162744] text-[11px] font-mono">
              {['all', 'building', 'road', 'tree', 'structure'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded capitalize transition-all ${
                    filterCategory === cat
                      ? 'bg-[#00C8FF] text-slate-950 font-bold'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All Classes' : cat + 's'}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Bounding Box Viewport */}
          <div className="relative rounded-xl overflow-hidden border border-[#182C4A] bg-[#050A14] h-[480px] group shadow-inner">
            <img 
              src="/demo/satellite_scene.png" 
              alt="Aerial Object Detection"
              className="w-full h-full object-cover select-none"
            />

            {/* Render bounding boxes */}
            {filteredObjects.map((obj) => {
              const isSelected = obj.id === selectedObjectId;
              return (
                <div
                  key={obj.id}
                  onClick={() => setSelectedObjectId(obj.id)}
                  style={{
                    top: obj.top,
                    left: obj.left,
                    width: obj.width,
                    height: obj.heightBox,
                    borderColor: obj.color
                  }}
                  className={`absolute border-2 rounded-sm cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'ring-2 ring-white bg-[#00C8FF]/20 shadow-lg' 
                      : 'bg-[#00C8FF]/5 hover:bg-[#00C8FF]/15'
                  }`}
                >
                  {/* Floating Box Tag */}
                  <div 
                    style={{ backgroundColor: obj.color }}
                    className="absolute -top-6 left-0 text-slate-950 font-extrabold font-mono text-[10px] px-1.5 py-0.5 rounded shadow flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>{obj.id}</span>
                    <span>•</span>
                    <span>{obj.height}</span>
                  </div>

                  {/* Corner Crosshairs */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white" />
                </div>
              );
            })}

            {/* Bottom active object banner */}
            <div className="absolute bottom-3 inset-x-4 p-3 rounded-xl bg-[#070E1B]/95 backdrop-blur-md border border-[#182C4A] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-white">
                <Crosshair className="w-4 h-4 text-[#00C8FF] animate-pulse" />
                <span>Selected Object: <strong className="text-[#00C8FF]">{selectedObject.name}</strong></span>
              </div>
              <span className="text-emerald-400 font-bold">{selectedObject.height} Extruded</span>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono px-1">
            <span>Model: YOLOv8x-Geospatial v2 (TensorRT)</span>
            <span className="text-cyan-400">142 Polygons Segmented • Click any box to inspect</span>
          </div>

        </div>

        {/* Right 4 cols: Side Statistics & Selected Object Inspector */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Side Statistics Panel */}
          <div className="bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
              <Layers className="w-4 h-4 text-[#00C8FF]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Detected Class Statistics
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              
              <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Buildings</span>
                </div>
                <div className="text-xl font-bold text-white mt-1">142</div>
                <span className="text-[10px] text-[#64748B]">Heights: 14m - 74m</span>
              </div>

              <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Car className="w-3.5 h-3.5" />
                  <span>Roads</span>
                </div>
                <div className="text-xl font-bold text-white mt-1">18</div>
                <span className="text-[10px] text-[#64748B]">Arterial corridors</span>
              </div>

              <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <TreePine className="w-3.5 h-3.5" />
                  <span>Trees / Canopy</span>
                </div>
                <div className="text-xl font-bold text-white mt-1">86</div>
                <span className="text-[10px] text-[#64748B]">Canopy clusters</span>
              </div>

              <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Box className="w-3.5 h-3.5" />
                  <span>Other Structures</span>
                </div>
                <div className="text-xl font-bold text-white mt-1">12</div>
                <span className="text-[10px] text-[#64748B]">Port towers & cranes</span>
              </div>

            </div>
          </div>

          {/* Selected Object Detail Inspector */}
          <div className="bg-[#091222] p-6 rounded-2xl border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#162744] pb-3">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-[#00C8FF]" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Selected Object Inspector
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-500/40">
                {selectedObject.id}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              
              <div>
                <span className="text-[10px] font-mono text-[#64748B] uppercase">Entity Name</span>
                <div className="font-bold text-white text-sm mt-0.5">
                  {selectedObject.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                
                <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
                  <span className="text-[10px] text-[#64748B] block">Estimated Height</span>
                  <span className="text-lg font-bold text-[#00C8FF]">{selectedObject.height}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C]">
                  <span className="text-[10px] text-[#64748B] block">Footprint Area</span>
                  <span className="text-lg font-bold text-white">{selectedObject.area}</span>
                </div>

              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between font-mono">
                <span className="text-[#94A3B8]">AI Confidence</span>
                <span className="text-emerald-400 font-bold">{selectedObject.confidence}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C] text-[11px] font-mono text-[#94A3B8] space-y-1">
                <div className="flex justify-between">
                  <span>Roof Elevation AMSL:</span>
                  <span className="text-white">90.3 m</span>
                </div>
                <div className="flex justify-between">
                  <span>Ground Elevation AMSL:</span>
                  <span className="text-white">14.0 m</span>
                </div>
                <div className="flex justify-between">
                  <span>GSD Precision:</span>
                  <span className="text-cyan-300">±0.35m</span>
                </div>
              </div>

            </div>

            <button
              onClick={() => onNavigate('3d-reconstruction')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>View in 3D Volumetric Mesh (Step 09)</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
