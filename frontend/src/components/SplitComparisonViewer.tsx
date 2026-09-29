import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import type { Analysis } from '../types';

interface SplitComparisonViewerProps {
  analysis: Analysis;
}

export type CompareMode = 
  | 'satellite_vs_depth' 
  | 'satellite_vs_elevation' 
  | 'baseline_vs_difference';

export const SplitComparisonViewer: React.FC<SplitComparisonViewerProps> = ({ analysis }) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const [compareMode, setCompareMode] = useState<CompareMode>('satellite_vs_elevation');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Setup Left & Right Image URLs & Labels
  let leftImg = analysis.imageUrl || '/demo/satellite_scene.png';
  let leftLabel = 'Aerial Satellite RGB';
  let rightImg = analysis.elevationResult?.visualArtifactUrl || '/demo/elevation_metric_dsm.png';
  let rightLabel = 'Metric Elevation DSM (AMSL)';

  if (compareMode === 'satellite_vs_depth') {
    leftImg = analysis.imageUrl || '/demo/satellite_scene.png';
    leftLabel = 'Aerial Satellite RGB';
    rightImg = analysis.depthResult?.visualArtifactUrl || '/demo/depth_relative_heatmap.png';
    rightLabel = 'Relative Monocular Disparity (Plasma)';
  } else if (compareMode === 'baseline_vs_difference') {
    leftImg = analysis.imageUrl || '/demo/satellite_scene.png';
    leftLabel = 'Baseline Aerial Orthomosaic';
    rightImg = '/demo/elevation_difference_map.png';
    rightLabel = 'Difference Map (Pre vs Post Event)';
  }

  // Handle Dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = (x / rect.width) * 100;
    setSliderPos(pct);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const pct = (x / rect.width) * 100;
    setSliderPos(pct);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 max-w-[1920px] mx-auto select-none">
      
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-white">
              Dual-Layer Spatial Split Comparator
            </h2>
            <p className="text-xs text-slate-400">
              Drag the interactive vertical divider to inspect raster alignment, building boundaries, and elevation displacement.
            </p>
          </div>
        </div>

        {/* Comparison Preset Modes */}
        <div className="flex items-center gap-1.5 bg-[#070b14] p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setCompareMode('satellite_vs_elevation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              compareMode === 'satellite_vs_elevation'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite vs Metric DSM
          </button>
          <button
            onClick={() => setCompareMode('satellite_vs_depth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              compareMode === 'satellite_vs_depth'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite vs Disparity
          </button>
          <button
            onClick={() => setCompareMode('baseline_vs_difference')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              compareMode === 'baseline_vs_difference'
                ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Change Detection (Pre/Post)
          </button>
        </div>
      </div>

      {/* Main Split Image Canvas */}
      <div 
        ref={containerRef}
        className="relative flex-1 w-full min-h-[580px] rounded-2xl overflow-hidden glass-panel-elevated border border-cyan-500/20 shadow-2xl cursor-ew-resize"
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* Right Layer (Background) */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={rightImg} 
            alt={rightLabel}
            className="w-full h-full object-contain pointer-events-none"
          />
          {/* Right Label Badge */}
          <div className="absolute top-4 right-4 z-10 glass-panel px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-mono text-cyan-300 font-semibold shadow-lg">
            {rightLabel}
          </div>
        </div>

        {/* Left Layer (Clipped to Slider Percentage) */}
        <div 
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img 
            src={leftImg} 
            alt={leftLabel}
            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none max-w-none"
            style={{ width: containerWidth ? `${containerWidth}px` : '100%' }}
          />
          {/* Left Label Badge */}
          <div className="absolute top-4 left-4 z-10 glass-panel px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-mono text-white font-semibold shadow-lg">
            {leftLabel}
          </div>
        </div>

        {/* Vertical Split Divider Line */}
        <div 
          className="absolute top-0 bottom-0 z-20 w-1 bg-gradient-to-b from-cyan-400 via-white to-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.8)]"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={() => setIsDragging(true)}
        >
          {/* Grab Handle */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-cyan-500/30 cursor-ew-resize"
          >
            <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Change Detection Legend (If in difference mode) */}
        {compareMode === 'baseline_vs_difference' && (
          <div className="absolute bottom-4 left-4 z-20 glass-panel p-3 rounded-xl border border-rose-500/30 text-xs space-y-1.5 font-mono shadow-2xl">
            <span className="font-bold text-rose-300 block">ELEVATION DELTA CLASSIFICATION:</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-slate-300">+12.4m New Construction (South Zone)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-300">-4.2m Structural Demolition / Subsidence</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-600" />
              <span className="text-slate-400">0.0m Unchanged Baseline</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
