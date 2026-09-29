import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  RotateCw, 
  ZoomIn, 
  Move, 
  RotateCcw, 
  Building2, 
  Mountain, 
  TreePine, 
  Droplets, 
  Car, 
  Check, 
  ArrowRight,
  Compass
} from 'lucide-react';
import { ThreeDViewer } from '../components/ThreeDViewer';
import { DEMO_ANALYSIS } from '../services/api';
import type { PrototypeView } from '../components/layout/DesktopSidebar';
import type { DetectedObject } from '../types';

interface Reconstruction3DPageProps {
  onNavigate: (view: PrototypeView) => void;
}

export const Reconstruction3DPage: React.FC<Reconstruction3DPageProps> = ({ onNavigate }) => {
  const [displayMode, setDisplayMode] = useState<'textured' | 'solid' | 'wireframe'>('textured');
  const [showBuildings, setShowBuildings] = useState(true);
  const [showTerrain, setShowTerrain] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showVegetation, setShowVegetation] = useState(true);
  const [showWater, setShowWater] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<DetectedObject | null>(null);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">3D Reconstruction</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 09
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Real-time interactive WebGL 3D volumetric scene synthesized from single monocular aerial imagery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('3d-flythrough')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>Next: Interactive 3D Flythrough</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Main 3D Viewport & Control Layout: 3D Scene (8 cols) + Right-Side Layer & Display Controls (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 cols: Large 3D Scene Viewport */}
        <div className="lg:col-span-8 bg-[#091222] rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden p-3 space-y-3">
          
          {/* Top 3D Viewport Bar */}
          <div className="flex items-center justify-between px-2 pt-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white font-mono">THREE.JS WEBGL RENDERER</span>
              <span className="text-[10px] font-mono text-[#64748B] hidden sm:inline">60 FPS • 142 LOD2 Geometries</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#94A3B8]">
              <span className="px-2 py-0.5 rounded bg-[#060B14] border border-[#162744]">
                Mode: <strong className="text-cyan-300 uppercase">{displayMode}</strong>
              </span>
            </div>
          </div>

          {/* Interactive Three.js 3D Viewer Container */}
          <div className="relative rounded-xl overflow-hidden border border-[#182C4A] bg-[#050A14] h-[540px] shadow-inner">
            <ThreeDViewer 
              analysis={DEMO_ANALYSIS}
              selectedBuildingId={selectedBuilding?.id}
              onSelectBuilding={(b) => setSelectedBuilding(b)}
            />

            {/* Overlaid Floating Quick Instruction Chip */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-[#070D18]/90 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-slate-200 pointer-events-none flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>Left Click + Drag: Orbit • Right Click + Drag: Pan • Scroll: Zoom</span>
            </div>

            {/* Selected building hover overlay */}
            {selectedBuilding && (
              <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-[#070E1B]/95 backdrop-blur-md border border-cyan-500/50 text-xs font-mono space-y-1 shadow-2xl">
                <div className="text-[10px] text-cyan-300 uppercase font-bold">Selected 3D Entity</div>
                <div className="text-white font-bold">{selectedBuilding.identifier}</div>
                <div className="text-emerald-400">Height: {selectedBuilding.estimatedHeightM?.toFixed(1)} m</div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono px-2 pb-1">
            <span>Terrain Displaced with Metric Copernicus DEM Equation</span>
            <span className="text-cyan-400">PBR Building Shaders</span>
          </div>

        </div>

        {/* Right 4 cols: Right-side Layer Controls & Display Modes */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Display Mode Toggles */}
          <div className="bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
              <Box className="w-4 h-4 text-[#00C8FF]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Display Shading Mode
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: 'textured', label: 'Textured' },
                { id: 'solid', label: 'Solid' },
                { id: 'wireframe', label: 'Wireframe' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setDisplayMode(m.id as any)}
                  className={`py-2.5 px-2 rounded-xl text-center font-bold transition-all border ${
                    displayMode === m.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-[#060B14] text-[#94A3B8] border-[#162744] hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right-Side Layer Controls */}
          <div className="bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
              <Layers className="w-4 h-4 text-[#00C8FF]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                3D Scene Layers
              </h2>
            </div>

            <div className="space-y-2.5 text-xs">
              
              {/* Buildings */}
              <button
                onClick={() => setShowBuildings(!showBuildings)}
                className="w-full p-3 rounded-xl bg-[#060B14] border border-[#15243C] flex items-center justify-between hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Building2 className="w-4 h-4 text-[#00C8FF]" />
                  <span className="font-semibold">Buildings (LOD2)</span>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  showBuildings ? 'bg-[#00C8FF] border-[#00C8FF] text-slate-950' : 'border-[#1E3658] bg-[#0A1424]'
                }`}>
                  {showBuildings && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* Terrain */}
              <button
                onClick={() => setShowTerrain(!showTerrain)}
                className="w-full p-3 rounded-xl bg-[#060B14] border border-[#15243C] flex items-center justify-between hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Mountain className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Terrain Elevation Mesh</span>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  showTerrain ? 'bg-[#00C8FF] border-[#00C8FF] text-slate-950' : 'border-[#1E3658] bg-[#0A1424]'
                }`}>
                  {showTerrain && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* Roads */}
              <button
                onClick={() => setShowRoads(!showRoads)}
                className="w-full p-3 rounded-xl bg-[#060B14] border border-[#15243C] flex items-center justify-between hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Car className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">Roads & Arteries</span>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  showRoads ? 'bg-[#00C8FF] border-[#00C8FF] text-slate-950' : 'border-[#1E3658] bg-[#0A1424]'
                }`}>
                  {showRoads && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* Vegetation */}
              <button
                onClick={() => setShowVegetation(!showVegetation)}
                className="w-full p-3 rounded-xl bg-[#060B14] border border-[#15243C] flex items-center justify-between hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-slate-200">
                  <TreePine className="w-4 h-4 text-green-400" />
                  <span className="font-semibold">Vegetation Canopy</span>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  showVegetation ? 'bg-[#00C8FF] border-[#00C8FF] text-slate-950' : 'border-[#1E3658] bg-[#0A1424]'
                }`}>
                  {showVegetation && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* Water */}
              <button
                onClick={() => setShowWater(!showWater)}
                className="w-full p-3 rounded-xl bg-[#060B14] border border-[#15243C] flex items-center justify-between hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold">Water & Harbor Plane</span>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  showWater ? 'bg-[#00C8FF] border-[#00C8FF] text-slate-950' : 'border-[#1E3658] bg-[#0A1424]'
                }`}>
                  {showWater && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

            </div>
          </div>

          {/* Interactive Camera Controls */}
          <div className="bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
              <RotateCw className="w-4 h-4 text-[#00C8FF]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Camera Controls
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('dw-orbit-rotate'))}
                className="p-2.5 rounded-xl bg-[#060B14] border border-[#15243C] hover:border-cyan-500/40 text-slate-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#00C8FF]" />
                <span>Rotate</span>
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('dw-orbit-zoom-in'))}
                className="p-2.5 rounded-xl bg-[#060B14] border border-[#15243C] hover:border-cyan-500/40 text-slate-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#00C8FF]" />
                <span>Zoom In</span>
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('dw-orbit-pan'))}
                className="p-2.5 rounded-xl bg-[#060B14] border border-[#15243C] hover:border-cyan-500/40 text-slate-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <Move className="w-3.5 h-3.5 text-[#00C8FF]" />
                <span>Pan</span>
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('dw-orbit-reset'))}
                className="p-2.5 rounded-xl bg-[#060B14] border border-[#15243C] hover:border-cyan-500/40 text-slate-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#00C8FF]" />
                <span>Reset View</span>
              </button>
            </div>

            <button
              onClick={() => onNavigate('3d-flythrough')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Launch 3D Flythrough (Step 10)</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
