import React from 'react';
import { Info, Sparkles } from 'lucide-react';

export const DepthEstimation: React.FC = () => {

  return (
    <section id="depth-estimation" className="py-20 bg-[#050B14] relative border-t border-[#193450]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtext */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0A1220] border border-[#193450] text-[#00C8FF] text-xs font-mono mb-3">
            <span>CORE AI CAPABILITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            AI Depth Estimation
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            DepthWizard estimates relative depth from a single satellite or aerial image using a monocular depth estimation pipeline.
          </p>
        </div>

        {/* Comparison Grid: Satellite vs Depth Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Visual Display (Left / Center) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="dw-panel bg-[#0A1220] rounded-xl border border-[#193450] p-4 overflow-hidden relative dw-corner-tl dw-corner-br">
              
              {/* Header Badges */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#193450] text-xs font-mono">
                <div className="flex items-center space-x-2 text-[#F8FAFC]">
                  <Sparkles className="w-3.5 h-3.5 text-[#00C8FF]" />
                  <span>MONOCULAR INFERENCE COMPARISON</span>
                </div>
                <div className="text-[11px] text-[#22D3EE] font-semibold bg-[#0E192A] px-2 py-0.5 rounded border border-[#193450]">
                  EXAMPLE OUTPUT (DEMO)
                </div>
              </div>

              {/* Side-by-Side Satellite & Depth Views */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Left: Satellite Image */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                    <span>01 SATELLITE INPUT</span>
                    <span className="text-[#F8FAFC]">RGB Optical</span>
                  </div>
                  <div className="relative aspect-square rounded-lg overflow-hidden border border-[#193450] bg-[#070b14]">
                    <img
                      src="/demo/satellite_scene.png"
                      alt="Input Satellite Aerial Scene"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-[#0A1220]/90 text-[10px] font-mono text-[#F8FAFC] border border-[#193450]">
                      Raw Ortho Sensor
                    </div>
                  </div>
                </div>

                {/* Right: AI Estimated Depth Map */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                    <span>02 RELATIVE DEPTH MAP</span>
                    <span className="text-[#00C8FF]">Inferenced Disparity</span>
                  </div>
                  <div className="relative aspect-square rounded-lg overflow-hidden border border-[#193450] bg-[#070b14]">
                    <img
                      src="/demo/depth_relative_heatmap.png"
                      alt="AI Relative Depth Heatmap"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-[#0A1220]/90 text-[10px] font-mono text-[#00C8FF] border border-[#193450]">
                      Relative Disparity Field
                    </div>
                  </div>
                </div>

              </div>

              {/* Scientific Depth Map Legend */}
              <div className="mt-5 pt-4 border-t border-[#193450]">
                <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1.5">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#1e3a8a]" />
                    <span>Near (Low relative distance)</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>Far (High relative height/distance)</span>
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#ef4444]" />
                  </span>
                </div>
                {/* Scientific Blue → Cyan → Green → Yellow → Red colormap bar */}
                <div className="h-3 w-full rounded-md depth-colormap-gradient border border-[#193450]/80 shadow-inner" />
                <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] mt-1 px-1">
                  <span>0.0 (Base Plane)</span>
                  <span>0.25</span>
                  <span>0.50</span>
                  <span>0.75</span>
                  <span>1.0 (Peak Disparity)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Metric Cards (Right Column) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            
            {/* Card 1: Relative Depth */}
            <div className="dw-panel bg-[#0A1220] p-5 rounded-xl border border-[#193450]">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1">
                <span>METRIC PROPERTY</span>
                <span className="text-[#00C8FF] font-semibold">DEMO</span>
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">
                Relative Depth
              </h3>
              <div className="text-2xl font-mono font-bold text-[#00C8FF] mt-2">
                0.12 — 0.94
              </div>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Normalized monocular disparity scale representing structural foreground-to-background proximity.
              </p>
            </div>

            {/* Card 2: Confidence */}
            <div className="dw-panel bg-[#0A1220] p-5 rounded-xl border border-[#193450]">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1">
                <span>ESTIMATED RELIABILITY</span>
                <span className="text-[#22C55E] font-semibold">DEMO</span>
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">
                Model Confidence
              </h3>
              <div className="text-2xl font-mono font-bold text-[#22C55E] mt-2">
                91.4%
              </div>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                High-gradient edge confidence across urban building contours and road segment boundaries.
              </p>
            </div>

            {/* Card 3: Resolution */}
            <div className="dw-panel bg-[#0A1220] p-5 rounded-xl border border-[#193450]">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1">
                <span>SPATIAL SAMPLE</span>
                <span className="text-[#22D3EE] font-semibold">DEMO</span>
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">
                Processed Resolution
              </h3>
              <div className="text-2xl font-mono font-bold text-[#22D3EE] mt-2">
                1024 × 1024 px
              </div>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Ground Sampling Distance (GSD) approx. 0.3 m/pixel preserved across inference channels.
              </p>
            </div>

            {/* Scientific Distinction Notice */}
            <div className="bg-[#0E192A] border border-[#193450] p-4 rounded-xl flex items-start space-x-3">
              <Info className="w-5 h-5 text-[#00C8FF] shrink-0 mt-0.5" />
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                <strong className="text-[#F8FAFC]">Scientific Notice:</strong> Monocular depth values represent relative disparity without absolute physical unit grounding. Metric height requires reference calibration.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
