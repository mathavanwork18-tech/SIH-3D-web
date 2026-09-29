import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Navigation, 
  Compass, 
  Footprints, 
  Plane, 
  Orbit, 
  ArrowRight
} from 'lucide-react';
import { ThreeDViewer } from '../components/ThreeDViewer';
import { DEMO_ANALYSIS } from '../services/api';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface FlythroughPageProps {
  onNavigate: (view: PrototypeView) => void;
}

export const FlythroughPage: React.FC<FlythroughPageProps> = ({ onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWaypoint, setActiveWaypoint] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [navMode, setNavMode] = useState<'walk' | 'fly' | 'orbit'>('fly');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [timelineSec, setTimelineSec] = useState<number>(0);
  const maxDuration = 24;

  const waypoints = [
    { id: 'A', name: 'Waypoint A: Coastal Ingress', alt: '180m AMSL', heading: '045° NE', description: 'Approach maritime harbor and baseline coastline topography' },
    { id: 'B', name: 'Waypoint B: Commercial Towers Slant', alt: '85m AMSL', heading: '090° E', description: 'Close flyby of high-rise commercial spine (Tower B-12 at 76.3m)' },
    { id: 'C', name: 'Waypoint C: Urban Boulevard Corridor', alt: '42m AMSL', heading: '180° S', description: 'Low-altitude pass through primary arterial highway corridor' },
    { id: 'D', name: 'Waypoint D: Port Terminal Overview', alt: '60m AMSL', heading: '270° W', description: 'Volumetric orbit of cargo gantry structures and dock infrastructure' },
  ];

  // Timeline playback simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimelineSec((t) => {
        const next = +(t + 0.25 * speedMultiplier).toFixed(1);
        if (next >= maxDuration) {
          setIsPlaying(false);
          return 0;
        }
        // Update active waypoint according to progress
        if (next < 6) setActiveWaypoint('A');
        else if (next < 12) setActiveWaypoint('B');
        else if (next < 18) setActiveWaypoint('C');
        else setActiveWaypoint('D');
        return next;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  const handleStartFlythrough = () => {
    setIsPlaying(true);
    setTimelineSec(0);
    setActiveWaypoint('A');
  };

  const handleSeekWaypoint = (wpId: 'A' | 'B' | 'C' | 'D') => {
    setActiveWaypoint(wpId);
    if (wpId === 'A') setTimelineSec(0);
    else if (wpId === 'B') setTimelineSec(6);
    else if (wpId === 'C') setTimelineSec(12);
    else if (wpId === 'D') setTimelineSec(18);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Interactive 3D Flythrough</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 10
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Immersive automated camera trajectory navigation over reconstructed 3D city terrain and LOD2 building models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('measurements')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>Next: Measurements Tool</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Main Grid: Immersive 3D Flythrough Viewport (8 cols) + Flight Waypoints & Telemetry (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 cols: Large 3D Viewport with Bottom Playback Controls */}
        <div className="lg:col-span-8 bg-[#091222] rounded-2xl border border-cyan-500/40 shadow-2xl overflow-hidden p-4 space-y-4">
          
          {/* Top Camera Flight Mode Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#162744] pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold font-mono">Camera Flight Mode:</span>
              <div className="flex items-center gap-1 bg-[#060B14] p-1 rounded-lg border border-[#162744] text-[11px] font-mono">
                {[
                  { id: 'walk', label: 'Walk', icon: Footprints },
                  { id: 'fly', label: 'Fly', icon: Plane },
                  { id: 'orbit', label: 'Orbit', icon: Orbit },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setNavMode(m.id as any)}
                      className={`flex items-center gap-1 px-3 py-1 rounded transition-all ${
                        navMode === m.id
                          ? 'bg-[#00C8FF] text-slate-950 font-bold shadow-sm'
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Waypoint Indicator */}
            <div className="flex items-center gap-1 text-xs font-mono">
              <span className="text-[#94A3B8]">Active Waypoint:</span>
              <span className="w-6 h-6 rounded-full bg-[#00C8FF] text-slate-950 font-bold flex items-center justify-center">
                {activeWaypoint}
              </span>
            </div>
          </div>

          {/* 3D Viewer Container */}
          <div className="relative rounded-xl overflow-hidden border border-[#182C4A] bg-[#050A14] h-[480px] shadow-inner">
            <ThreeDViewer analysis={DEMO_ANALYSIS} />

            {/* In-scene 3D flight trajectory curve overlay representation */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full opacity-60">
                <path 
                  d="M 120 380 Q 240 180 440 220 T 700 160" 
                  fill="none" 
                  stroke="#00C8FF" 
                  strokeWidth="3" 
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Waypoint Markers inside Scene */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { id: 'A', top: '72%', left: '16%' },
                { id: 'B', top: '40%', left: '38%' },
                { id: 'C', top: '48%', left: '58%' },
                { id: 'D', top: '30%', left: '82%' },
              ].map((wp) => (
                <div
                  key={wp.id}
                  style={{ top: wp.top, left: wp.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto cursor-pointer transition-transform ${
                    activeWaypoint === wp.id ? 'scale-125' : 'hover:scale-110 opacity-75'
                  }`}
                  onClick={() => handleSeekWaypoint(wp.id as any)}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold font-mono text-xs shadow-lg ${
                    activeWaypoint === wp.id 
                      ? 'bg-[#00C8FF] text-slate-950 border-white ring-4 ring-cyan-500/40' 
                      : 'bg-[#081326] text-white border-cyan-400'
                  }`}>
                    {wp.id}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-1.5 py-0.5 rounded mt-1 border border-cyan-500/30">
                    Point {wp.id}
                  </span>
                </div>
              ))}
            </div>

            {/* Flight HUD Overlays */}
            <div className="absolute top-4 left-4 p-3 rounded-xl bg-[#070D18]/90 backdrop-blur-md border border-cyan-500/40 text-xs font-mono space-y-1">
              <div className="text-[10px] text-cyan-300 uppercase font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#00C8FF] animate-spin-slow" />
                <span>FLIGHT TELEMETRY HUD</span>
              </div>
              <div className="text-white">Altitude: <span className="font-bold text-cyan-300">85 m AMSL</span></div>
              <div className="text-white">Airspeed: <span className="font-bold text-emerald-400">45 km/h</span></div>
              <div className="text-[#94A3B8]">Heading: 090° East</div>
            </div>

            {/* Start Flythrough Floating Action CTA */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px] flex items-center justify-center">
                <button
                  onClick={handleStartFlythrough}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00C8FF] via-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-sm tracking-wide shadow-2xl shadow-cyan-500/40 flex items-center gap-3 transform hover:scale-105 transition-all"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Flythrough</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Flythrough Playback Controls Bar */}
          <div className="p-4 rounded-xl bg-[#070E1B] border border-[#162744] space-y-3">
            
            {/* Timeline scrubber */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span>Timeline: {timelineSec.toFixed(1)}s / {maxDuration}.0s</span>
                <span className="text-cyan-300 font-bold">{Math.round((timelineSec / maxDuration) * 100)}% Trajectory</span>
              </div>

              <input 
                type="range"
                min="0"
                max={maxDuration}
                step="0.5"
                value={timelineSec}
                onChange={(e) => setTimelineSec(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#0E1A30] rounded-lg appearance-none cursor-pointer accent-[#00C8FF]"
              />
            </div>

            {/* Play, Pause, Speed Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-xl bg-[#00C8FF] hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => { setTimelineSec(0); setActiveWaypoint('A'); }}
                  className="p-2 rounded-xl bg-[#0C172B] hover:bg-[#142542] border border-[#182C4A] text-slate-200 transition-colors"
                  title="Reset to Waypoint A"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-[#94A3B8] mr-1">Speed:</span>
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeedMultiplier(s)}
                    className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${
                      speedMultiplier === s
                        ? 'bg-[#00C8FF] text-slate-950 font-bold border-[#00C8FF]'
                        : 'bg-[#0C172B] text-[#94A3B8] border-[#182C4A] hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* Right 4 cols: Waypoints Detailed List & Telemetry */}
        <div className="lg:col-span-4 space-y-5">
          
          <div className="bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#162744] pb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#00C8FF]" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Flight Path Waypoints
                </h2>
              </div>
              <span className="text-[10px] font-mono text-cyan-300">
                4 Keyframes
              </span>
            </div>

            <div className="space-y-3">
              {waypoints.map((wp) => {
                const isActive = activeWaypoint === wp.id;
                return (
                  <div
                    key={wp.id}
                    onClick={() => handleSeekWaypoint(wp.id as any)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'border-[#00C8FF] bg-[#0E1E38] shadow-md shadow-cyan-500/10'
                        : 'border-[#152744] bg-[#060B14] hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full font-bold font-mono text-xs flex items-center justify-center ${
                          isActive ? 'bg-[#00C8FF] text-slate-950' : 'bg-[#0E1A30] text-[#94A3B8]'
                        }`}>
                          {wp.id}
                        </span>
                        <span className={`text-xs font-bold ${isActive ? 'text-[#00C8FF]' : 'text-white'}`}>
                          {wp.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {wp.alt}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-1.5 leading-relaxed pl-8">
                      {wp.description}
                    </p>
                    <div className="text-[10px] font-mono text-[#64748B] pl-8 mt-1">
                      Heading: {wp.heading}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick next step button */}
          <div className="bg-[#091222] p-6 rounded-2xl border border-cyan-500/30 shadow-xl space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase">
              Metric Spatial Evaluation
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Verify heights, surface footprint areas, and elevation deltas directly on the calibrated 3D terrain.
            </p>
            <button
              onClick={() => onNavigate('measurements')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Open Measurements Workspace (Step 11)</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
