import React from 'react';
import { Lock, ShieldCheck, Key, HardDrive, CheckSquare, History } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityItems = [
    {
      title: 'Authentication',
      desc: 'Token-based session management with role-based operator authorization and audit logging.',
      icon: Key,
    },
    {
      title: 'Row Level Security',
      desc: 'PostgreSQL RLS policies ensuring project spatial geometries and rasters remain strictly tenant-isolated.',
      icon: ShieldCheck,
    },
    {
      title: 'Secure API Access',
      desc: 'Rate-limited, cryptographically verified FastAPI endpoints over TLS encryption.',
      icon: Lock,
    },
    {
      title: 'Storage Policies',
      desc: 'Segmented access control policies for raw input imagery, processed DSMs, and 3D asset caches.',
      icon: HardDrive,
    },
    {
      title: 'Input Validation',
      desc: 'Rigorous raster dimension checking, coordinate reference system verification, and header sanitization.',
      icon: CheckSquare,
    },
    {
      title: 'Data Provenance',
      desc: 'Verifiable processing logs tracking calibration anchor origins, sensor parameters, and confidence metrics.',
      icon: History,
    },
  ];

  return (
    <section id="security" className="py-20 bg-[#050B14] relative border-t border-[#193450]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0A1220] border border-[#193450] text-[#00C8FF] text-xs font-mono mb-3">
            <span>DATA GOVERNANCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Designed for Secure Geospatial Data Handling
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#94A3B8]">
            Architected to safeguard proprietary spatial data, municipal imagery, and computational deliverables through strict zero-trust standards.
          </p>
        </div>

        {/* 6 Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityItems.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.title}
                className="dw-panel bg-[#0A1220] p-6 rounded-xl border border-[#193450] hover:border-[#00C8FF]/70 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <IconComp className="w-5 h-5 text-[#00C8FF] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    <h3 className="text-base font-bold text-[#F8FAFC]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#193450]/60 flex items-center justify-between text-[10px] font-mono text-[#22D3EE]">
                  <span>STANDARD IMPLEMENTED</span>
                  <span>VERIFIED</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
