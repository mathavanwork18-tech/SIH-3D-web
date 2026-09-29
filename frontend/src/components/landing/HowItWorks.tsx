import React from 'react';
import { Upload, Brain, Ruler, Box, Compass } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload Image',
      icon: Upload,
      description: 'Upload a satellite or aerial image.',
    },
    {
      step: '02',
      title: 'AI Depth Estimation',
      icon: Brain,
      description: 'Estimate relative scene depth using AI.',
    },
    {
      step: '03',
      title: 'Metric Calibration',
      icon: Ruler,
      description: 'Convert relative depth into calibrated metric elevation using reference information.',
    },
    {
      step: '04',
      title: '3D Reconstruction',
      icon: Box,
      description: 'Generate terrain and structure geometry.',
    },
    {
      step: '05',
      title: '3D Flythrough',
      icon: Compass,
      description: 'Explore the reconstructed environment interactively.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#050B14] relative border-t border-[#193450]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0A1220] border border-[#193450] text-[#00C8FF] text-xs font-mono mb-3">
            <span>PIPELINE OVERVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            How DepthWizard Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#94A3B8]">
            From a single image to an interactive 3D scene.
          </p>
        </div>

        {/* 5-Step Connected Flow Grid */}
        <div className="relative">
          
          {/* Thin Cyan Connection Line (Desktop) */}
          <div 
            className="hidden lg:block absolute top-1/2 left-8 right-8 h-[2px] -translate-y-10 bg-gradient-to-r from-[#00C8FF]/20 via-[#00C8FF] to-[#22C55E]/30 z-0 pointer-events-none" 
            aria-hidden="true" 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.step}
                  className="dw-panel bg-[#0A1220] p-6 rounded-xl flex flex-col justify-between hover:border-[#00C8FF] transition-all group"
                >
                  <div>
                    {/* Step Number & Icon Header - Transparent Background */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-mono font-bold text-[#00C8FF] bg-[#0E192A] border border-[#193450] px-2.5 py-1 rounded">
                        STEP {item.step}
                      </span>
                      <IconComponent className="w-6 h-6 text-[#00C8FF] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    </div>

                    {/* Step Title */}
                    <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2 group-hover:text-[#00C8FF] transition-colors">
                      {item.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Flow Arrow Indicator for Mobile/Tablet */}
                  {idx < steps.length - 1 && (
                    <div className="lg:hidden mt-4 pt-3 border-t border-[#193450]/60 flex items-center justify-end text-xs font-mono text-[#00C8FF]">
                      <span>Next Step →</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Visual summary indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#94A3B8] bg-[#0A1220] border border-[#193450] px-4 py-2 rounded-full">
            <span>01 Upload</span>
            <span className="text-[#00C8FF]">→</span>
            <span>02 Depth</span>
            <span className="text-[#00C8FF]">→</span>
            <span>03 Calibration</span>
            <span className="text-[#00C8FF]">→</span>
            <span>04 Reconstruction</span>
            <span className="text-[#00C8FF]">→</span>
            <span className="text-[#22C55E]">05 Flythrough</span>
          </div>
        </div>

      </div>
    </section>
  );
};
