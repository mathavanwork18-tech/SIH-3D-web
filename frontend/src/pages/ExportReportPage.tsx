import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Box, 
  Layers, 
  Table, 
  Image as ImageIcon, 
  CheckCircle2, 
  Printer
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface ExportReportPageProps {
  onNavigate?: (view: PrototypeView) => void;
}

export const ExportReportPage: React.FC<ExportReportPageProps> = ({ onNavigate: _onNavigate }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const exportCards = [
    { id: 'pdf', title: 'PDF Executive Report', type: 'PDF Document', size: '4.8 MB', desc: 'Formal geospatial brief with figures, DSM cross-sections, and calibration tables.', icon: FileText, color: 'text-rose-400' },
    { id: 'csv', title: 'CSV Measurements', type: 'Spreadsheet Data', size: '280 KB', desc: '142 building records, estimated heights, roof elevations, and polygon areas.', icon: Table, color: 'text-emerald-400' },
    { id: 'geotiff', title: 'Calibrated GeoTIFF', type: '32-bit Float Raster', size: '18.4 MB', desc: 'Georeferenced metric DSM in EPSG:4326 UTM Zone 44N with orthometric AMSL heights.', icon: Layers, color: 'text-cyan-300' },
    { id: 'glb', title: 'Binary 3D Mesh (GLB)', type: 'Binary 3D Asset', size: '12.2 MB', desc: 'Compact binary glTF 2.0 with LOD2 building geometries, UV coordinates, and PBR shaders.', icon: Box, color: 'text-blue-400' },
    { id: 'gltf', title: 'glTF 2.0 Mesh Package', type: 'JSON 3D Descriptor', size: '14.0 MB', desc: 'glTF JSON scene hierarchy with separate binary vertex and normal buffers.', icon: Box, color: 'text-indigo-400' },
    { id: 'depth', title: 'High-Res Depth Map', type: '16-bit PNG Tensor', size: '6.5 MB', desc: 'Full resolution dense disparity heatmap with continuous floating-point normalization.', icon: ImageIcon, color: 'text-amber-400' },
    { id: 'height', title: 'Colorized Height Map', type: 'GeoTIFF / PNG', size: '8.2 MB', desc: 'Metric elevation raster colorized with scientific turbo elevation gradient.', icon: Layers, color: 'text-[#00C8FF]' },
  ];

  const handleDownload = (id: string, name: string) => {
    setDownloadSuccess(name);
    setTimeout(() => setDownloadSuccess(null), 3500);

    // Create a mock trigger
    const blob = new Blob([`DepthWizard SIH26175 Export Artifact: ${name}\nGenerated: 2026-09-29\nStatus: CALIBRATED`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `depthwizard_${id}_export.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Export Analysis</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 15
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Download GIS-compatible 3D models, GeoTIFF elevation rasters, measurement tables, and executive PDF briefing reports.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload('all', 'Full SIH Artifact Bundle (.ZIP)')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Download className="w-4 h-4 stroke-[3]" />
            <span>Download All Artifacts</span>
          </button>

          <button
            onClick={() => alert('Secure encrypted link generated: https://depthwizard.sih.gov.in/share/viz-001')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#091222] hover:bg-[#111E33] border border-[#162744] text-[#94A3B8] hover:text-white text-xs font-mono transition-all"
          >
            <Share2 className="w-4 h-4 text-[#00C8FF]" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-300 font-mono shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Successfully generated and downloaded: <strong>{downloadSuccess}</strong></span>
          </div>
          <span className="text-[10px] text-emerald-400">SIH26175 VERIFIED</span>
        </div>
      )}

      {/* Main Grid: Export Cards (7 cols) + Live Report Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 cols: Large Export Cards List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
            Available Production Artifact Formats
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exportCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="bg-[#091222] rounded-2xl border border-[#162744] hover:border-cyan-500/40 p-4 shadow-xl flex flex-col justify-between space-y-3 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl bg-[#060B14] border border-[#15243C] ${card.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-[#64748B] bg-[#060B14] px-2 py-0.5 rounded border border-[#15243C]">
                        {card.size}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-xs group-hover:text-[#00C8FF] transition-colors">
                        {card.title}
                      </h3>
                      <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                        {card.type}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(card.id, card.title)}
                    className="w-full py-2 rounded-xl bg-[#060B14] hover:bg-[#0E1A30] border border-[#15243C] hover:border-cyan-500/40 text-slate-200 hover:text-white text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-[#00C8FF]" />
                    <span>Download</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 cols: Live Report Preview Card */}
        <div className="lg:col-span-5 bg-[#091222] rounded-2xl border border-[#162744] shadow-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#162744] pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00C8FF]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Live Report Preview
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              READY FOR PRINT
            </span>
          </div>

          {/* Miniature Document Preview Container */}
          <div className="p-5 rounded-xl bg-[#050A14] border border-[#182C4A] space-y-4 shadow-inner">
            
            {/* Document Header */}
            <div className="border-b border-[#15243C] pb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">DEPTHWIZARD BRIEFING</div>
                <div className="text-[10px] font-mono text-[#64748B]">Document: DW-REP-2026-09-01</div>
              </div>
              <div className="text-[10px] font-mono text-[#00C8FF] text-right">
                SIH26175
                <div className="text-[#94A3B8]">CONFIDENTIAL</div>
              </div>
            </div>

            {/* Document Thumbnail Inset */}
            <div className="relative rounded-lg overflow-hidden border border-[#15243C] h-32">
              <img 
                src="/demo/elevation_metric_dsm.png" 
                alt="Report Map Inset"
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-cyan-300">
                Figure 1: Metric DSM (12.5m - 74.2m)
              </div>
            </div>

            {/* Document Summary Bullets */}
            <div className="space-y-1.5 text-xs text-[#94A3B8] font-mono leading-relaxed">
              <div className="text-white font-bold font-sans text-xs">Executive Findings:</div>
              <div>• Total Analyzed Area: 0.128 km²</div>
              <div>• Detected Structures: 142 LOD2 Footprints</div>
              <div>• Maximum Height: 74.2m (Commercial Tower B-12)</div>
              <div>• Mean Urban Elevation: 22.8m AMSL</div>
              <div>• Calibration Verification: RMSE 1.42m (Copernicus DEM)</div>
            </div>

            {/* Signature Block */}
            <div className="pt-3 border-t border-[#15243C] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
              <span>Evaluated by: DepthWizard AI</span>
              <span className="text-emerald-400">Validated 2026-09-29</span>
            </div>

          </div>

          {/* Action Buttons: Generate, Download, Share */}
          <div className="space-y-2">
            <button
              onClick={() => handleDownload('pdf', 'Executive Briefing Report (PDF)')}
              className="w-full py-3 rounded-xl bg-[#00C8FF] hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Download PDF Executive Report</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-xl bg-[#060B14] hover:bg-[#0E1A30] border border-[#15243C] text-slate-200 text-xs font-mono flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>Print Briefing Sheet</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
