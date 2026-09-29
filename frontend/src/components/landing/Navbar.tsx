import React from 'react';
import { Eye, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onStartAnalysis: () => void;
  onExploreDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartAnalysis, onExploreDemo }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A1220]/90 backdrop-blur-md border-b border-[#193450] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: DepthWizard Brand */}
        <div className="flex items-center space-x-3 hero-anim-logo">
          <a 
            href="#hero" 
            onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
            className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF] rounded-lg p-1"
            aria-label="DepthWizard Home"
          >
            {/* Geospatial Depth Logo Mark - Transparent Background */}
            <svg 
              className="w-7 h-7 text-[#00C8FF] shrink-0" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              aria-hidden="true"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            
            <div className="flex flex-col">
              <div className="text-xl font-bold tracking-tight">
                <span className="text-[#F8FAFC]">Depth</span>
                <span className="text-[#00C8FF]">Wizard</span>
              </div>
              <span className="text-[10px] font-mono text-[#94A3B8] tracking-tight -mt-0.5">
                Single Image → Height Estimation → 3D Flythrough
              </span>
            </div>
          </a>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center space-x-8 hero-anim-nav" aria-label="Main Navigation">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-sm font-medium text-[#94A3B8] hover:text-[#00C8FF] transition-colors focus:outline-none focus-visible:text-[#00C8FF]"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm font-medium text-[#94A3B8] hover:text-[#00C8FF] transition-colors focus:outline-none focus-visible:text-[#00C8FF]"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('technology')}
            className="text-sm font-medium text-[#94A3B8] hover:text-[#00C8FF] transition-colors focus:outline-none focus-visible:text-[#00C8FF]"
          >
            Technology
          </button>
          <button
            onClick={() => scrollToSection('use-cases')}
            className="text-sm font-medium text-[#94A3B8] hover:text-[#00C8FF] transition-colors focus:outline-none focus-visible:text-[#00C8FF]"
          >
            Use Cases
          </button>
        </nav>

        {/* Right: Badge & CTA Buttons */}
        <div className="flex items-center space-x-3.5">
          {/* SIH Badge */}
          <div 
            className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#0E192A] border border-[#193450] text-[#00C8FF]"
            title="Smart India Hackathon Problem ID"
          >
            SIH26175
          </div>

          {/* Button 1: Explore Demo */}
          <button
            type="button"
            onClick={onExploreDemo}
            className="dw-btn-secondary px-3.5 py-2 rounded-md text-xs sm:text-sm"
            aria-label="Explore Demo"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5 text-[#00C8FF]" aria-hidden="true" />
            <span>Explore Demo</span>
          </button>

          {/* Button 2: Start Analysis */}
          <button
            type="button"
            onClick={onStartAnalysis}
            className="dw-btn-primary px-4 py-2 rounded-md text-xs sm:text-sm"
            aria-label="Start Analysis"
          >
            <span>Start Analysis</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
          </button>
        </div>

      </div>
    </header>
  );
};
