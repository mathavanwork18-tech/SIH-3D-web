import React from 'react';
import { ArrowDown, Cpu, Database, Eye, FileText, Layers, MapPin, Scan, Sparkles } from 'lucide-react';

export const WorkflowBlueprint: React.FC = () => {
  const pipelineStages = [
    {
      stage: 'INPUT',
      title: 'Satellite / Aerial Image',
      subtext: ['Single RGB Sensor Ortho', 'Optical Sensor Metadata', 'GeoTIFF / PNG / JPEG'],
      icon: Eye,
      tag: '01 RAW INGESTION',
    },
    {
      stage: 'PREPROCESSING',
      title: 'Image Preprocessing',
      subtext: ['Bilinear Spatial Resize', 'Channel Normalization', 'Exif & GSD Metadata Extraction'],
      icon: Scan,
      tag: '02 SIGNAL PREP',
    },
    {
      stage: 'AI DEPTH',
      title: 'Monocular Depth Estimation',
      subtext: ['Relative Disparity Prediction', 'Scene Geometry Encoding', 'Edge-Preserving Regularization'],
      icon: Cpu,
      tag: '03 NEURAL INFERENCE',
    },
    {
      stage: 'CALIBRATION',
      title: 'Metric Calibration',
      subtext: ['Reference Elevation Data Anchor', 'Scale Factor & Bias Optimization', 'WGS84 / EGM96 Geoid Alignment'],
      icon: MapPin,
      tag: '04 DATUM BINDING',
    },
    {
      stage: 'HEIGHT / DSM',
      title: 'Metric Elevation & Surface Model',
      subtext: ['Digital Surface Model (DSM)', 'Normalized Heights Above Ground', 'Per-Pixel Elevation Confidence'],
      icon: Layers,
      tag: '05 METRIC RASTER',
    },
    {
      stage: 'OBJECT DETECTION',
      title: 'Object & Structure Segmentation',
      subtext: ['Building Footprints', 'Road Networks & Vectors', 'Vegetation & Natural Barriers'],
      icon: Sparkles,
      tag: '06 SEMANTIC PARSING',
    },
    {
      stage: '3D RECONSTRUCTION',
      title: '3D Mesh & Geometry Generation',
      subtext: ['Extruded LOD1/LOD2 Building Geometry', 'Terrain TIN Mesh Surface', 'Dense 3D Point Cloud Export'],
      icon: Database,
      tag: '07 GEOSPATIAL MESHER',
    },
    {
      stage: 'OUTPUT',
      title: 'Measurements, 3D Viewer & Reports',
      subtext: ['Quantitative Height Measurements', 'Interactive 3D WebGL Flythrough', 'Audit-Ready Geospatial Reports'],
      icon: FileText,
      tag: '08 SYSTEM DELIVERABLES',
    },
  ];

  return (
    <section id="workflow" className="py-20 bg-[#070E1A] relative border-t border-[#193450]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0A1220] border border-[#193450] text-[#00C8FF] text-xs font-mono mb-3">
            <span>ENGINEERING ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Scientific Workflow Diagram
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#94A3B8]">
            Technical blueprint representing the black-box processing pipeline from raw imagery to volumetric deliverables.
          </p>
        </div>

        {/* Blueprint Container */}
        <div className="dw-panel bg-[#0A1220]/90 rounded-2xl p-6 sm:p-10 border border-[#193450] relative overflow-hidden dw-corner-tl dw-corner-br">
          
          {/* Blueprint Technical Header */}
          <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-[#193450] font-mono text-xs text-[#94A3B8]">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 bg-[#00C8FF] rounded-sm" />
              <span className="text-[#F8FAFC] font-semibold">DIAGRAM REF: DW-SYS-26175-REV3</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">SPEC: MONOCULAR METRIC RECONSTRUCTION</span>
            </div>
            <div className="mt-2 sm:mt-0 text-[#22D3EE]">
              CLASSIFICATION: PUBLIC SPECIFICATION
            </div>
          </div>

          {/* Workflow Sequence */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {pipelineStages.map((stage, idx) => {
              const IconComp = stage.icon;
              return (
                <React.Fragment key={stage.stage}>
                  <div className="dw-panel-secondary bg-[#0E192A] rounded-xl p-4 sm:p-5 border border-[#193450] hover:border-[#00C8FF]/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left: Stage identity */}
                    <div className="flex items-center space-x-4">
                      <IconComp className="w-6 h-6 text-[#00C8FF] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-[#00C8FF]">
                            {stage.stage}
                          </span>
                          <span className="text-[10px] font-mono text-[#94A3B8] px-1.5 py-0.5 rounded bg-[#0A1220] border border-[#193450]">
                            {stage.tag}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-[#F8FAFC] mt-0.5">
                          {stage.title}
                        </h4>
                      </div>
                    </div>

                    {/* Right: Technical specifications list */}
                    <div className="md:text-right">
                      <div className="flex flex-wrap md:justify-end gap-1.5">
                        {stage.subtext.map((item) => (
                          <span
                            key={item}
                            className="text-[11px] font-mono text-[#94A3B8] bg-[#0A1220] border border-[#193450]/80 px-2.5 py-1 rounded"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Flow Connector Arrow */}
                  {idx < pipelineStages.length - 1 && (
                    <div className="flex justify-center my-1" aria-hidden="true">
                      <ArrowDown className="w-4 h-4 text-[#00C8FF]/70" strokeWidth={1.75} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Blueprint Footer Specifications */}
          <div className="mt-8 pt-6 border-t border-[#193450] flex flex-wrap items-center justify-between text-xs font-mono text-[#94A3B8]">
            <div>
              ENGINEERING NOTE: <span className="text-[#F8FAFC]">Depth calibration decoupled from monocular inference for verifiable error bounds.</span>
            </div>
            <div className="mt-2 sm:mt-0 text-[#00C8FF]">
              SYSTEM ARCHITECTURE READY
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
