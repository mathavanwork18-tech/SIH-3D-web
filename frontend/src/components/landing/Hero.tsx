import React from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { HeroVisualization } from './HeroVisualization';

interface HeroProps {
  onStartAnalysis: () => void;
  onExploreDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAnalysis, onExploreDemo }) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden dw-grid-bg">
      {/* Background ambient radial glow */}
      <div 
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#00C8FF]/10 rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#1677FF]/10 rounded-full blur-[130px] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Taglines & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            
            {/* Small Badge: AI-Powered Geospatial Analysis */}
            <div className="hero-anim-heading inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-[#0A1220] border border-[#193450] w-max">
              <span className="w-2 h-2 rounded-full bg-[#00C8FF] animate-pulse" />
              <span className="text-xs font-mono font-semibold tracking-wider text-[#00C8FF] uppercase">
                AI-POWERED GEOSPATIAL ANALYSIS
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-anim-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.12]">
              Turn Satellite Images{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C8FF] via-[#22D3EE] to-[#1677FF]">
                Into 3D Insights
              </span>
            </h1>

            {/* Main Tagline */}
            <div className="hero-anim-desc flex items-center space-x-2 text-xs sm:text-sm font-mono text-[#22D3EE] bg-[#0E192A]/80 border border-[#193450] px-3.5 py-2 rounded-md w-max">
              <Sparkles className="w-4 h-4 text-[#00C8FF]" aria-hidden="true" />
              <span className="font-semibold">Single Image → Height Estimation → 3D Flythrough</span>
            </div>

            {/* Alternative Supporting Line */}
            <p className="hero-anim-desc text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-xl">
              Estimate depth, measure building heights, reconstruct terrain, and explore your scene in an interactive 3D environment.
            </p>

            {/* CTA Row (Buttons 3 & 4) */}
            <div className="hero-anim-cta pt-2 flex flex-wrap items-center gap-4">
              {/* Button 3: Start Analysis */}
              <button
                type="button"
                onClick={onStartAnalysis}
                className="dw-btn-primary px-6 py-3.5 rounded-lg text-sm sm:text-base group"
                aria-label="Start Analysis"
              >
                <span>Start Analysis</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>

              {/* Button 4: Explore Demo */}
              <button
                type="button"
                onClick={onExploreDemo}
                className="dw-btn-secondary px-5 py-3.5 rounded-lg text-sm sm:text-base group"
                aria-label="Explore Demo"
              >
                <Play className="w-4 h-4 mr-2 text-[#00C8FF]" strokeWidth={1.75} aria-hidden="true" />
                <span>Explore Demo</span>
              </button>
            </div>

            {/* Secondary Trust Line */}
            <div className="hero-anim-cta pt-1 flex items-center space-x-2 text-xs font-mono text-[#94A3B8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              <span>No complex GIS workflow required.</span>
            </div>

          </div>

          {/* Right Column: Large Professional Satellite / 3D Visualization */}
          <div className="lg:col-span-6 hero-anim-visual">
            <HeroVisualization />
          </div>

        </div>
      </div>
    </section>
  );
};
