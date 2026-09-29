import React, { useState, useEffect } from 'react';
import { Play, Pause, Compass, ArrowRight, Gauge, Navigation } from 'lucide-react';

interface FlythroughPreviewProps {
  onStartAnalysis: () => void;
}

export const FlythroughPreview: React.FC<FlythroughPreviewProps> = ({ onStartAnalysis }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<'1x' | '2x'>('1x');
  const [activeMode, setActiveMode] = useState<'Orbit' | 'Fly' | 'Walk'>('Fly');
  const [currentWaypoint, setCurrentWaypoint] = useState<number>(2);
  const [altitude, setAltitude] = useState<number>(142);
  const [heading, setHeading] = useState<number>(284);

  // Simulated flight telemetry animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAltitude((prev) => {
        const delta = (Math.random() - 0.48) * (speed === '2x' ? 4 : 2);
        return Math.round(Math.max(90, Math.min(220, prev + delta)));
      });
      setHeading((prev) => (prev + (speed === '2x' ? 2 : 1)) % 360);
    }, 400);

    const wpInterval = setInterval(() => {
      setCurrentWaypoint((prev) => (prev % 4) + 1);
    }, speed === '2x' ? 3000 : 5000);

    return () => {
      clearInterval(interval);
      clearInterval(wpInterval);
    };
  }, [isPlaying, speed]);

  return (
    <section id="flythrough" className="py-20 bg-[#070E1A] relative border-t border-[#193450]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtext */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0A1220] border border-[#193450] text-[#00C8FF] text-xs font-mono mb-3">
              <span>CINEMATIC VISUALIZATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
              Explore Your Scene
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#94A3B8]">
              Perform autonomous UAV-style camera sweeps, inspection flythroughs, and waypoint navigations through reconstructed 3D cityscapes.
            </p>
          </div>

          {/* Button 6: Start Analysis (from Section 21 Complete Button Inventory) */}
          <button
            type="button"
            onClick={onStartAnalysis}
            className="dw-btn-primary px-6 py-3 rounded-lg text-sm group shrink-0"
            aria-label="Start Analysis"
          >
            <span>Start Analysis</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        {/* Cinematic Flythrough Container */}
        <div className="relative w-full h-[480px] sm:h-[540px] rounded-2xl overflow-hidden bg-[#050B14] border border-[#193450] shadow-2xl dw-corner-tl dw-corner-br">
          
          {/* Animated 3D City Wireframe & Flythrough Canvas Simulation */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/demo/satellite_scene.png"
              alt="Cinematic 3D Flythrough Scene"
              className={`w-full h-full object-cover transition-transform duration-1000 ${
                isPlaying ? 'scale-105 filter contrast-125' : 'scale-100'
              }`}
            />
            {/* Dark technical overlay with scanlines */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/40 to-transparent" />
            <div className="dw-grid-bg absolute inset-0 opacity-40 pointer-events-none" />
          </div>

          {/* Top HUD: Modes (Orbit, Fly, Walk) & Telemetry */}
          <div className="absolute top-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3">
            
            {/* Mode Switcher */}
            <div className="flex items-center space-x-1 bg-[#0A1220]/90 backdrop-blur-md border border-[#193450] p-1 rounded-lg text-xs font-mono">
              {(['Orbit', 'Fly', 'Walk'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeMode === mode
                      ? 'bg-[#00C8FF] text-[#050B14] font-bold shadow'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Flight Avionics Readout */}
            <div className="flex items-center space-x-3 bg-[#0A1220]/90 backdrop-blur-md border border-[#193450] px-3.5 py-1.5 rounded-lg text-xs font-mono text-[#F8FAFC]">
              <div className="flex items-center space-x-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#00C8FF]" strokeWidth={1.75} />
                <span className="text-[#94A3B8]">ALT:</span>
                <span className="font-bold text-[#00C8FF]">{altitude} m</span>
              </div>
              <span className="text-[#193450]">|</span>
              <div className="flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-[#22D3EE]" strokeWidth={1.75} />
                <span className="text-[#94A3B8]">HDG:</span>
                <span className="font-bold">{heading}°</span>
              </div>
            </div>

          </div>

          {/* Center Crosshair HUD */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className="relative w-36 h-36 border border-[#00C8FF]/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-[#00C8FF] rounded-full animate-ping opacity-60" />
              <div className="w-1.5 h-1.5 bg-[#00C8FF] rounded-full" />
              <div className="absolute top-0 w-px h-3 bg-[#00C8FF]" />
              <div className="absolute bottom-0 w-px h-3 bg-[#00C8FF]" />
              <div className="absolute left-0 h-px w-3 bg-[#00C8FF]" />
              <div className="absolute right-0 h-px w-3 bg-[#00C8FF]" />
            </div>
          </div>

          {/* Bottom Control Overlay: PLAY, PAUSE, SPEED, WAYPOINTS */}
          <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-[#0A1220]/90 backdrop-blur-md border border-[#193450] p-3 rounded-xl text-xs font-mono">
            
            {/* Play/Pause & Speed */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0E192A] border border-[#193450] text-[#00C8FF] hover:border-[#00C8FF] transition-colors"
                title={isPlaying ? 'Pause flythrough' : 'Play flythrough'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>PLAY</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSpeed(speed === '1x' ? '2x' : '1x')}
                className="px-2.5 py-1.5 rounded-lg bg-[#0E192A] border border-[#193450] text-[#F8FAFC] hover:text-[#00C8FF] transition-colors"
                title="Toggle playback speed"
              >
                SPEED: <strong className="text-[#00C8FF]">{speed}</strong>
              </button>
            </div>

            {/* Waypoints Selection */}
            <div className="flex items-center space-x-2">
              <span className="text-[#94A3B8] hidden sm:inline flex items-center">
                <Navigation className="w-3.5 h-3.5 mr-1 text-[#22D3EE]" strokeWidth={1.75} />
                WAYPOINTS:
              </span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4].map((wp) => (
                  <button
                    key={wp}
                    onClick={() => setCurrentWaypoint(wp)}
                    className={`px-2 py-1 rounded text-[11px] transition-colors ${
                      currentWaypoint === wp
                        ? 'bg-[#00C8FF]/20 border border-[#00C8FF] text-[#00C8FF] font-bold'
                        : 'bg-[#0E192A] border border-[#193450] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    WP-0{wp}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
