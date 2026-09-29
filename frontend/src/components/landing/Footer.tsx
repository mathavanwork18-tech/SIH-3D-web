import React from 'react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050B14] border-t border-[#193450] text-xs font-mono text-[#94A3B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Top 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#193450]/80">
          
          {/* Left Column: Brand & Main Tagline */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2.5">
              {/* Geospatial Depth Logo Mark - Transparent Background */}
              <svg 
                className="w-6 h-6 text-[#00C8FF] shrink-0" 
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
              <span className="text-lg font-bold font-sans">
                <span className="text-[#F8FAFC]">Depth</span>
                <span className="text-[#00C8FF]">Wizard</span>
              </span>
            </div>
            
            <p className="text-xs text-[#94A3B8] font-mono max-w-sm leading-relaxed">
              Single Image → Height Estimation → 3D Flythrough
            </p>

            <p className="text-[11px] text-[#94A3B8]/70 pt-2 font-mono">
              AI-driven monocular depth and metric height estimation platform for geospatial reconnaissance, urban density modeling, and terrain analysis.
            </p>
          </div>

          {/* Center Column: Navigation */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Navigation
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-[#00C8FF] transition-colors focus:outline-none"
                >
                  Product
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-[#00C8FF] transition-colors focus:outline-none"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('technology')}
                  className="hover:text-[#00C8FF] transition-colors focus:outline-none"
                >
                  Technology
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('use-cases')}
                  className="hover:text-[#00C8FF] transition-colors focus:outline-none"
                >
                  Use Cases
                </button>
              </li>
            </ul>
          </div>

          {/* Right Column: Resources & Contact */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Resources
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollTo('workflow')}
                  className="hover:text-[#00C8FF] transition-colors focus:outline-none"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('security')}
                  className="hover:text-[#00C8FF] transition-colors focus:outline-none"
                >
                  Help
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('hero')}
                  className="hover:text-[#00C8FF] transition-colors focus:outline-none"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, SIH Badge, Secondary Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#94A3B8]">
          <div className="flex items-center space-x-3">
            <span>© 2026 DepthWizard</span>
            <span>•</span>
            <span className="text-[#00C8FF] font-medium">SIH26175</span>
          </div>

          <div className="text-[#94A3B8]">
            AI-Powered Geospatial Analysis
          </div>
        </div>

      </div>
    </footer>
  );
};
