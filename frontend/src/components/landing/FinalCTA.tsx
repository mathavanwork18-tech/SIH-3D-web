import React from 'react';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onStartAnalysis: () => void;
  onExploreDemo: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartAnalysis, onExploreDemo }) => {
  return (
    <section className="py-24 bg-[#070E1A] relative border-t border-[#193450] overflow-hidden">
      
      {/* Background radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00C8FF]/10 rounded-full blur-[150px] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* SIH Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0A1220] border border-[#193450] text-[#00C8FF] text-xs font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span className="font-semibold tracking-wide">PROBLEM ID: SIH26175</span>
        </div>

        {/* Large Heading */}
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F8FAFC] tracking-tight max-w-3xl mx-auto leading-tight">
          Ready to Turn Images Into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C8FF] via-[#22D3EE] to-[#1677FF]">
            3D Insights?
          </span>
        </h2>

        {/* Supporting Text */}
        <p className="mt-5 text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
          Upload a satellite or aerial image and explore DepthWizard's AI-powered geospatial workflow.
        </p>

        {/* Action Buttons (Buttons 6 & 7 in inventory) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          
          {/* Button 6: Start Analysis */}
          <button
            type="button"
            onClick={onStartAnalysis}
            className="dw-btn-primary px-7 py-3.5 rounded-lg text-sm sm:text-base group"
            aria-label="Start Analysis"
          >
            <span>Start Analysis</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={1.75} aria-hidden="true" />
          </button>

          {/* Button 7: Explore Demo */}
          <button
            type="button"
            onClick={onExploreDemo}
            className="dw-btn-secondary px-6 py-3.5 rounded-lg text-sm sm:text-base group"
            aria-label="Explore Demo"
          >
            <Eye className="w-4 h-4 mr-2 text-[#00C8FF]" strokeWidth={1.75} aria-hidden="true" />
            <span>Explore Demo</span>
          </button>

        </div>

        {/* Bottom Tagline */}
        <div className="mt-10 text-xs font-mono text-[#94A3B8]">
          <span>Single Image → Height Estimation → 3D Flythrough</span>
        </div>

      </div>
    </section>
  );
};
