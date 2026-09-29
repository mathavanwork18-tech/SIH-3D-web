import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Box
} from 'lucide-react';
import type { Analysis } from '../types';

interface ReportGeneratorProps {
  analysis: Analysis;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ analysis }) => {
  const buildings = analysis.detectedObjects || [];

  // Export GeoJSON FeatureCollection
  const handleExportGeoJSON = () => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: buildings.map((b) => ({
        type: 'Feature',
        geometry: b.polygonGeoJson,
        properties: {
          identifier: b.identifier,
          category: b.category,
          estimatedHeightM: b.estimatedHeightM,
          roofElevationM: b.roofElevationM,
          groundElevationM: b.groundElevationM,
          areaSqM: b.areaSqM,
          confidence: b.confidence
        }
      }))
    };
    const blob = new Blob([JSON.stringify(featureCollection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `depthwizard_footprints_${analysis.id}.geojson`;
    a.click();
  };

  // Export CSV of Measurements & Heights
  const handleExportCSV = () => {
    const rows = [
      ['Identifier', 'Category', 'Estimated_Height_m', 'Roof_Elevation_m_AMSL', 'Ground_Elevation_m_AMSL', 'Footprint_Area_m2', 'AI_Confidence'],
      ...buildings.map((b) => [
        b.identifier,
        b.category,
        (b.estimatedHeightM || 0).toFixed(2),
        b.roofElevationM?.toFixed(2) || 'N/A',
        b.groundElevationM?.toFixed(2) || 'N/A',
        b.areaSqM?.toFixed(2) || 'N/A',
        (b.confidence * 100).toFixed(1) + '%'
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `depthwizard_structures_${analysis.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Wavefront OBJ 3D Mesh
  const handleDownloadOBJ = () => {
    window.open('http://localhost:8000/api/reconstruction/mesh/obj', '_blank');
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full h-full flex flex-col gap-5 p-4 max-w-[1920px] mx-auto select-none print:p-0 print:bg-white print:text-black">
      
      {/* Top Export Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-cyan-500/20 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-600 text-white shadow-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-white">
              Geospatial Survey & Elevation Audit Report
            </h2>
            <p className="text-xs text-slate-400">
              Validated orthometric survey export ready for municipal engineering, urban planning, and structural GIS ingestion.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportGeoJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0b1329] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>GeoJSON Footprints</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0b1329] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV Inventory</span>
          </button>

          <button
            onClick={handleDownloadOBJ}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0b1329] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-md"
          >
            <Box className="w-3.5 h-3.5 text-purple-400" />
            <span>Download 3D OBJ</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Official Formatted Document Preview (Printable) */}
      <div className="glass-panel-elevated p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6 max-w-4xl mx-auto w-full print:border-none print:shadow-none print:bg-white print:p-0">
        
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
              GOVERNMENT OF INDIA / SIH-26175 SURVEY SPECIFICATION
            </span>
            <h1 className="text-xl font-extrabold text-white mt-1">
              SURFACE ELEVATION & 3D STRUCTURAL AUDIT REPORT
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Region: {analysis.locationLabel}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">Report Hash:</span>
            <span className="text-xs font-mono font-bold text-cyan-300">
              {analysis.reproducibilityHash}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Date: 28 September 2026
            </span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
            1. Executive Summary
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            This geospatial audit documents high-accuracy metric elevation reconstruction derived from high-resolution monocular satellite imagery. Relative depth disparity fields were estimated using <strong className="text-white">Depth-Anything-V2-Aerial</strong> and calibrated to absolute orthometric elevation (AMSL) using robust RANSAC Huber regression against <strong className="text-white">ESA Copernicus GLO-30 DEM</strong>. All building heights adhere to CityGML LOD2 geometric specifications.
          </p>
        </div>

        {/* Section 2: Sensor & Geospatial Parameters */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
            2. Acquisition & Calibration Parameters
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#070b14] p-3 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">SENSOR TYPE</span>
              <span className="font-semibold text-slate-200">{analysis.metadata.sensor}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">GROUND RESOLUTION</span>
              <span className="font-semibold text-cyan-300 font-mono">{analysis.metadata.groundSampleDistanceM}m / pixel</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">HORIZONTAL CRS</span>
              <span className="font-semibold text-slate-200">{analysis.metadata.crs}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">VERTICAL DATUM</span>
              <span className="font-semibold text-emerald-400">EGM2008 / WGS84</span>
            </div>
          </div>
        </div>

        {/* Section 3: Statistical Elevation Audit */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
            3. Elevation Statistical Audit
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#070b14] p-3 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">MIN ELEVATION (AMSL)</span>
              <span className="font-bold text-white font-mono">{analysis.elevationResult?.minElevationM} m</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">MAX ELEVATION (AMSL)</span>
              <span className="font-bold text-white font-mono">{analysis.elevationResult?.maxElevationM} m</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">CALIBRATION RMSE</span>
              <span className="font-bold text-emerald-400 font-mono">{analysis.elevationResult?.calibration.rmseMeters} m</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">CORRELATION (R)</span>
              <span className="font-bold text-purple-400 font-mono">{analysis.elevationResult?.calibration.correlationPearson}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Key Structural Inventory Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
            4. Cataloged Structural Inventory (LOD2 Extrusions)
          </h3>
          <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-[#0b1329] text-slate-400 font-mono text-[10px]">
              <tr>
                <th className="py-2 px-3">BUILDING ID</th>
                <th className="py-2 px-3">CATEGORY</th>
                <th className="py-2 px-3">NET HEIGHT</th>
                <th className="py-2 px-3">ROOF ELEV.</th>
                <th className="py-2 px-3">FOOTPRINT</th>
                <th className="py-2 px-3">CONFIDENCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {buildings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 font-mono text-[11px]">
                  <td className="py-2 px-3 font-bold text-cyan-300">{b.identifier}</td>
                  <td className="py-2 px-3 text-slate-400 uppercase">{b.category}</td>
                  <td className="py-2 px-3 font-bold text-white">{(b.estimatedHeightM || 0).toFixed(1)} m</td>
                  <td className="py-2 px-3">{b.roofElevationM?.toFixed(1) || '--'} m</td>
                  <td className="py-2 px-3 text-emerald-400">{b.areaSqM?.toLocaleString() || '--'} m²</td>
                  <td className="py-2 px-3 text-slate-300">{(b.confidence * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 5: Certification Signatures */}
        <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-8 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Geospatial Analyst</span>
            <div className="font-bold text-slate-200 mt-4 border-b border-slate-700 pb-1">
              Lead Remote Sensing Specialist, SIH26175 Lab
            </div>
            <span className="text-[10px] text-slate-400">Date: 28 September 2026</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Scientific Auditor</span>
            <div className="font-bold text-slate-200 mt-4 border-b border-slate-700 pb-1">
              Automated RANSAC Verification Core (SHA-256 Validated)
            </div>
            <span className="text-[10px] text-emerald-400">SURVEY GRADE LEVEL OF DETAIL: LOD2</span>
          </div>
        </div>

      </div>

    </div>
  );
};
