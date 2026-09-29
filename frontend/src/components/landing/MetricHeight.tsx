import React from 'react';
import { ShieldAlert, CheckCircle2, Sliders } from 'lucide-react';

export const MetricHeight: React.FC = () => {
  const calibrationSteps = [
    { label: 'Relative Depth', desc: 'Normalized AI disparity output' },
    { label: 'Reference Data', desc: 'Known ground control or coarse DEM' },
    { label: 'Calibration', desc: 'Scale factor & bias parameter fitting' },
    { label: 'Metric Elevation', desc: 'Surface elevation aligned with datum' },
    { label: 'Height Estimation', desc: 'Extruded structure measurements' },
  ];

  return (
    <section id="metric-height" className="py-20 bg-[#070E1A] relative border-t border-[#193450]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0A1220] border border-[#193450] text-[#00C8FF] text-xs font-mono mb-3">
            <span>SCIENTIFIC RIGOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            From Relative Depth to Metric Height
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Monocular depth is relative by nature. DepthWizard separates depth estimation from metric calibration so height results can be presented with their reference and accuracy context.
          </p>
        </div>

        {/* 5-Stage Scientific Flow Indicator */}
        <div className="mb-12 dw-panel bg-[#0A1220] p-4 sm:p-6 rounded-xl border border-[#193450]">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {calibrationSteps.map((step, idx) => (
              <div 
                key={step.label}
                className="flex flex-col p-3 rounded-lg bg-[#0E192A] border border-[#193450] relative group hover:border-[#00C8FF] transition-all"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#00C8FF] mb-1">
                  <span>STAGE 0{idx + 1}</span>
                  {idx < calibrationSteps.length - 1 && (
                    <span className="hidden sm:inline text-[#94A3B8]">→</span>
                  )}
                </div>
                <div className="text-sm font-semibold text-[#F8FAFC]">
                  {step.label}
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-1">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison: Before (Relative) vs After (Metric Extrusion) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Before vs After Elevation Display */}
          <div className="lg:col-span-7">
            <div className="dw-panel bg-[#0A1220] rounded-xl p-5 border border-[#193450] space-y-4 dw-corner-tl dw-corner-br">
              
              <div className="flex items-center justify-between border-b border-[#193450] pb-3 text-xs font-mono">
                <span className="text-[#F8FAFC] font-semibold">CALIBRATION TRANSFORMATION</span>
                <span className="text-[#00C8FF] bg-[#0E192A] px-2 py-0.5 rounded border border-[#193450]">
                  BEFORE → AFTER
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before: Relative Disparity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                    <span>BEFORE CALIBRATION</span>
                    <span className="text-amber-400">Unitless Disparity</span>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-[#193450] bg-[#070b14]">
                    <img
                      src="/demo/depth_relative_heatmap.png"
                      alt="Before: Relative Depth Heatmap"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
                    <div className="absolute top-2 left-2 bg-[#0A1220]/90 px-2 py-0.5 rounded text-[10px] font-mono text-[#94A3B8] border border-[#193450]">
                      Relative Values [0.0, 1.0]
                    </div>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    Relative proximity across scene geometry without vertical meter scale.
                  </p>
                </div>

                {/* After: Calibrated Metric Height */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                    <span>AFTER CALIBRATION</span>
                    <span className="text-[#22C55E]">Calibrated DSM (m)</span>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-[#193450] bg-[#070b14]">
                    <img
                      src="/demo/elevation_metric_dsm.png"
                      alt="After: Metric Elevation DSM"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-[#0A1220]/90 px-2 py-0.5 rounded text-[10px] font-mono text-[#00C8FF] border border-[#193450]">
                      Digital Surface Model (AMSL)
                    </div>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    Reference-anchored elevation surface with building extrusion bounds.
                  </p>
                </div>
              </div>

              {/* Sample Calibrated Heights Callout */}
              <div className="pt-3 border-t border-[#193450] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[#94A3B8]">SAMPLE BUILDING ESTIMATE:</span>
                <div className="flex items-center space-x-3">
                  <span className="text-[#F8FAFC]">BLD-103 Highrise:</span>
                  <span className="text-[#00C8FF] font-bold">56.2 m AMSL</span>
                  <span className="text-[10px] text-[#22D3EE] bg-[#0E192A] px-1.5 py-0.5 rounded border border-[#193450]">
                    Example Output
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Scientific Principles & Disclaimers */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="dw-panel bg-[#0A1220] p-5 rounded-xl border border-[#193450]">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#00C8FF] mb-2">
                <Sliders className="w-4 h-4" />
                <span>MATHEMATICAL ANCHORING</span>
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">
                Scale Factor Calibration
              </h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                DepthWizard applies linear and piecewise-affine optimization mapping predicted disparity <code className="text-[#00C8FF] font-mono">d</code> to metric elevation <code className="text-[#00C8FF] font-mono">z = α·d + β</code> using geodetic reference control.
              </p>
            </div>

            <div className="dw-panel bg-[#0A1220] p-5 rounded-xl border border-[#193450]">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#22D3EE] mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIDENCE & CONTEXT</span>
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">
                Reference-Dependent Measurement
              </h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Metric heights are always reported with reference datum context (e.g. WGS84, EGM96) and root-mean-square confidence intervals, preventing unwarranted precision assumptions.
              </p>
            </div>

            <div className="bg-[#0E192A] border border-[#193450] p-4 rounded-xl flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="text-xs text-[#94A3B8] leading-relaxed">
                <strong className="text-[#F8FAFC]">Scientific Accuracy Standard:</strong> Single-image monocular pipelines require calibration anchors for true metric scale. Measurements represent estimated heights within stated statistical bounds.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
