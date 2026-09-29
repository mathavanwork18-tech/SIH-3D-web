import React from 'react';
import { Code2, Server, BrainCircuit, Globe, Box, Database } from 'lucide-react';

export const TechnologyStack: React.FC = () => {
  const techGroups = [
    {
      group: 'Frontend',
      icon: Code2,
      technologies: [
        { name: 'React', detail: 'Component Architecture & State' },
        { name: 'TypeScript', detail: 'End-to-End Type Safety' },
        { name: 'Vite', detail: 'Optimized Bundling Engine' },
        { name: 'Tailwind CSS', detail: 'Engineered Design System' },
      ],
    },
    {
      group: 'Backend',
      icon: Server,
      technologies: [
        { name: 'FastAPI', detail: 'Asynchronous High-Throughput REST' },
        { name: 'Python', detail: 'Scientific Computing Runtime' },
      ],
    },
    {
      group: 'AI Processing',
      icon: BrainCircuit,
      technologies: [
        { name: 'Monocular Depth Estimation', detail: 'Dense Disparity Prediction' },
        { name: 'Computer Vision', detail: 'Feature Matching & Geometry' },
        { name: 'Object Detection', detail: 'Structure Footprint Segmentation' },
      ],
    },
    {
      group: 'Geospatial Engines',
      icon: Globe,
      technologies: [
        { name: 'MapLibre', detail: 'Vector Tile & Basemap Canvas' },
        { name: 'PostGIS', detail: 'Spatial Indexing & Geometry SQL' },
        { name: 'GDAL', detail: 'Geospatial Raster Translation' },
        { name: 'Rasterio', detail: 'High-Performance GeoTIFF IO' },
      ],
    },
    {
      group: '3D Graphics',
      icon: Box,
      technologies: [
        { name: 'Three.js', detail: 'WebGL Hardware Accelerated Engine' },
        { name: 'React Three Fiber', detail: 'Declarative 3D Canvas Pipeline' },
      ],
    },
    {
      group: 'Database / Cloud',
      icon: Database,
      technologies: [
        { name: 'Supabase', detail: 'Backend-as-a-Service Platform' },
        { name: 'PostgreSQL', detail: 'Relational & Spatial Storage' },
        { name: 'Supabase Storage', detail: 'Scalable Raster & Asset Buckets' },
      ],
    },
  ];

  return (
    <section id="technology" className="py-20 bg-[#070E1A] relative border-t border-[#193450]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0A1220] border border-[#193450] text-[#00C8FF] text-xs font-mono mb-3">
            <span>MODERN STACK ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Built with Modern Geospatial Technology
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#94A3B8]">
            An open, modular stack designed for scalable satellite raster processing, deep learning inference, and interactive WebGL visualization.
          </p>
        </div>

        {/* Technology Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div
                key={group.group}
                className="dw-panel bg-[#0A1220] p-6 rounded-xl border border-[#193450] flex flex-col justify-between hover:border-[#00C8FF] transition-all"
              >
                <div>
                  {/* Header - Transparent Background Icon */}
                  <div className="flex items-center space-x-3 mb-5 pb-3 border-b border-[#193450]">
                    <GroupIcon className="w-5 h-5 text-[#00C8FF] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    <h3 className="text-base font-bold text-[#F8FAFC]">
                      {group.group}
                    </h3>
                  </div>

                  {/* List of Technologies */}
                  <div className="space-y-3">
                    {group.technologies.map((t) => (
                      <div key={t.name} className="flex flex-col">
                        <div className="text-sm font-semibold text-[#F8FAFC] flex items-center justify-between">
                          <span>{t.name}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00C8FF]/50" />
                        </div>
                        <div className="text-xs font-mono text-[#94A3B8] mt-0.5">
                          {t.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#193450]/60 text-[10px] font-mono text-[#00C8FF]">
                  INTEGRATED SUBSYSTEM
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
