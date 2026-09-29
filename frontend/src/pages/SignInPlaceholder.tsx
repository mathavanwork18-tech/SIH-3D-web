import React from 'react';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

interface SignInPlaceholderProps {
  onBackToHome: () => void;
}

export const SignInPlaceholder: React.FC<SignInPlaceholderProps> = ({ onBackToHome }) => {
  return (
    <div className="landing-root min-h-screen bg-[#050B14] text-[#F8FAFC] flex flex-col justify-between p-6">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center space-x-3">
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
          <div>
            <div className="text-lg font-bold">
              <span className="text-[#F8FAFC]">Depth</span>
              <span className="text-[#00C8FF]">Wizard</span>
            </div>
            <div className="text-[10px] font-mono text-[#94A3B8]">
              SIH Problem ID: SIH26175
            </div>
          </div>
        </div>

        <button
          onClick={onBackToHome}
          className="dw-btn-secondary px-3.5 py-2 rounded-md text-xs font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.75} />
          <span>Back to Landing</span>
        </button>
      </div>

      {/* Main Placeholder Container */}
      <div className="max-w-md mx-auto w-full dw-panel bg-[#0A1220] p-8 rounded-2xl border border-[#193450] shadow-2xl text-center space-y-5 my-12">
        <Lock className="w-8 h-8 text-[#00C8FF] mx-auto" strokeWidth={1.75} />

        <div>
          <span className="text-[11px] font-mono text-[#00C8FF] bg-[#0E192A] px-2.5 py-1 rounded border border-[#193450]">
            ROUTE: /signin
          </span>
          <h1 className="text-xl font-bold text-[#F8FAFC] mt-3">
            Authentication Gateway
          </h1>
          <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
            DepthWizard analysis workspace access is reserved for authenticated operators. Direct authentication routing and pipeline sessions will be connected in subsequent phases.
          </p>
        </div>

        <div className="p-3.5 bg-[#0E192A] rounded-lg border border-[#193450] text-left text-xs font-mono text-[#94A3B8] space-y-1.5">
          <div className="flex items-center space-x-2 text-[#F8FAFC]">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>Target Pipeline: SIH26175</span>
          </div>
          <div>• Monocular AI Depth Estimation</div>
          <div>• Metric Elevation Calibration</div>
          <div>• 3D Volumetric Scene Generation</div>
        </div>

        <button
          onClick={onBackToHome}
          className="dw-btn-primary w-full py-2.5 rounded-lg text-sm"
        >
          Return to Home
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-xs font-mono text-[#94A3B8] pb-4">
        © 2026 DepthWizard • AI-Powered Geospatial Analysis
      </div>

    </div>
  );
};
