import React from 'react';
import { Building2, AlertTriangle, Radio, Mountain } from 'lucide-react';

export const UseCases: React.FC = () => {
  const cases = [
    {
      id: '01',
      title: 'Urban Planning',
      icon: Building2,
      description: 'Fast 3D city model generation and zoning density analysis from single-pass imagery.',
    },
    {
      id: '02',
      title: 'Disaster Management',
      icon: AlertTriangle,
      description: 'Rapid structural damage assessment, flood height modeling, and terrain obstruction identification.',
    },
    {
      id: '03',
      title: 'Infrastructure Analysis',
      icon: Radio,
      description: 'Height clearance checks, asset monitoring, and telecom line-of-sight analysis.',
    },
    {
      id: '04',
      title: 'Terrain & Environmental Assessment',
      icon: Mountain,
      description: 'Digital Surface Model generation, slope stability, and coastal elevation tracking.',
    },
  ];

  return (
    <section id="use-cases" className="py-20 bg-[#050B14] relative border-t border-[#193450]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0A1220] border border-[#193450] text-[#00C8FF] text-xs font-mono mb-3">
            <span>OPERATIONAL DOMAINS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Built for Geospatial Intelligence
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#94A3B8]">
            Engineered for high-impact decision making across civil engineering, disaster response, and municipal administration.
          </p>
        </div>

        {/* Exactly 4 Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="dw-panel bg-[#0A1220] p-6 rounded-xl border border-[#193450] flex flex-col justify-between hover:border-[#00C8FF] transition-all group dw-corner-tl"
              >
                <div>
                  {/* Top: ID & Icon - Transparent Background */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold text-[#00C8FF] bg-[#0E192A] border border-[#193450] px-2.5 py-1 rounded">
                      USE CASE {item.id}
                    </span>
                    <IconComponent className="w-6 h-6 text-[#00C8FF] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#F8FAFC] mb-3 group-hover:text-[#00C8FF] transition-colors">
                    {item.title}
                  </h3>

                  {/* One-Line Description */}
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Subtle telemetry footmark */}
                <div className="mt-6 pt-4 border-t border-[#193450]/60 flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                  <span>DOMAIN CODE</span>
                  <span className="text-[#F8FAFC]">GEO-{item.id}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
