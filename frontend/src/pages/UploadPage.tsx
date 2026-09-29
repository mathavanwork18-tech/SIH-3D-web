import React, { useState } from 'react';
import { 
  UploadCloud, 
  Compass, 
  Sparkles, 
  FileCheck, 
  ArrowRight,
  Info
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface UploadPageProps {
  onNavigate: (view: PrototypeView) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState<string>('/demo/satellite_scene.png');
  const [locationName, setLocationName] = useState('Visakhapatnam Urban Maritime Zone');
  const [latitude, setLatitude] = useState('17.6868');
  const [longitude, setLongitude] = useState('83.2185');
  const [resolution, setResolution] = useState('0.35m / px GSD (High-Res)');
  const [captureDate, setCaptureDate] = useState('2026-09-28');
  const [sensorType, setSensorType] = useState('WorldView-3 / High-Res UAV');
  const [isDragOver, setIsDragOver] = useState(false);

  const sampleDatasets = [
    {
      name: 'Visakhapatnam Port Maritime Zone',
      image: '/demo/satellite_scene.png',
      lat: '17.6868',
      lon: '83.2185',
      res: '0.35m / px GSD (High-Res)',
      date: '2026-09-28',
      sensor: 'WorldView-3 / High-Res UAV'
    },
    {
      name: 'Mumbai BKC Commercial Spine',
      image: '/demo/satellite_scene.png',
      lat: '19.0657',
      lon: '72.8687',
      res: '0.30m / px GSD (Sub-meter)',
      date: '2026-09-27',
      sensor: 'Pleiades Neo 30cm'
    },
    {
      name: 'New Delhi Urban Grid Corridor',
      image: '/demo/satellite_scene.png',
      lat: '28.6129',
      lon: '77.2295',
      res: '0.50m / px GSD (Orthomosaic)',
      date: '2026-09-25',
      sensor: 'Cartosat-3 Optical Panchromatic'
    }
  ];

  const handleSelectSample = (sample: typeof sampleDatasets[0]) => {
    setSelectedImage(sample.image);
    setLocationName(sample.name);
    setLatitude(sample.lat);
    setLongitude(sample.lon);
    setResolution(sample.res);
    setCaptureDate(sample.date);
    setSensorType(sample.sensor);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
      setLocationName(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 select-none">
      
      {/* Title */}
      <div className="border-b border-[#15243C] pb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">New Analysis</h1>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
            STEP 03
          </span>
        </div>
        <p className="text-sm text-[#94A3B8] mt-1">
          Upload Satellite or Aerial imagery for monocular height estimation, metric DEM calibration, and 3D reconstruction.
        </p>
      </div>

      {/* Main Grid: Upload Zone + Metadata Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 cols: Drag-and-Drop + Image Preview */}
        <div className="lg:col-span-7 space-y-4">
          
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                setSelectedImage(URL.createObjectURL(file));
                setLocationName(file.name.replace(/\.[^/.]+$/, ''));
              }
            }}
            className={`relative rounded-2xl border-2 border-dashed p-8 transition-all flex flex-col items-center justify-center text-center overflow-hidden bg-[#08101E] ${
              isDragOver ? 'border-[#00C8FF] bg-[#0A172B]' : 'border-[#1B2F4E] hover:border-cyan-500/50'
            }`}
          >
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.tif,.tiff" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
              title="Upload Satellite or Aerial Image"
            />

            {selectedImage ? (
              <div className="w-full space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 max-h-72 shadow-xl group">
                  <img 
                    src={selectedImage} 
                    alt="Upload Preview"
                    className="w-full h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <span>IMAGE LOADED • 1024×1024 RGB 8-BIT</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#94A3B8] px-1 font-mono">
                  <span>Click or drag another image to replace</span>
                  <span className="text-cyan-400">Supported: JPG, PNG, TIFF</span>
                </div>
              </div>
            ) : (
              <div className="py-12 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#0D1A30] border border-[#1E3658] flex items-center justify-center text-[#00C8FF] mx-auto shadow-lg shadow-cyan-500/10">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Upload Satellite / Aerial Image</h3>
                  <p className="text-xs text-[#94A3B8] mt-1 max-w-sm">
                    Drag and drop your high-resolution nadir or oblique image here, or browse files from disk
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#64748B]">
                  <span className="px-2 py-0.5 rounded bg-[#101E35]">JPG</span>
                  <span className="px-2 py-0.5 rounded bg-[#101E35]">PNG</span>
                  <span className="px-2 py-0.5 rounded bg-[#101E35]">GeoTIFF</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Benchmark Preset Chooser for SIH Judges */}
          <div className="p-4 rounded-xl bg-[#091222] border border-[#162744] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Sparkles className="w-3.5 h-3.5" />
                SIH 2026 Sample Benchmarks (1-Click Load)
              </span>
              <span className="text-[10px] text-[#64748B]">Pre-calibrated</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {sampleDatasets.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    locationName === sample.name
                      ? 'border-cyan-400 bg-cyan-950/40 text-white'
                      : 'border-[#162744] bg-[#0C172B] text-[#94A3B8] hover:text-white hover:border-[#1E3658]'
                  }`}
                >
                  <div className="font-semibold truncate">{sample.name}</div>
                  <div className="text-[10px] font-mono text-[#64748B] mt-0.5 truncate">{sample.res}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right 5 cols: Metadata Input & Start Analysis Trigger */}
        <div className="lg:col-span-5 space-y-5 bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
            <Compass className="w-4 h-4 text-[#00C8FF]" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Geospatial Metadata Calibration
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Location */}
            <div>
              <label className="block text-[#94A3B8] font-mono text-[11px] mb-1">
                Location Label / Target Region
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B14] border border-[#1B2F4E] text-white focus:outline-none focus:border-cyan-400 font-medium"
                placeholder="e.g. Visakhapatnam Port & Maritime Zone"
              />
            </div>

            {/* Lat / Long */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#94A3B8] font-mono text-[11px] mb-1">
                  Latitude (°N)
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060B14] border border-[#1B2F4E] text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-[#94A3B8] font-mono text-[11px] mb-1">
                  Longitude (°E)
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060B14] border border-[#1B2F4E] text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label className="block text-[#94A3B8] font-mono text-[11px] mb-1">
                Ground Sample Distance (Resolution)
              </label>
              <input
                type="text"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#060B14] border border-[#1B2F4E] text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Capture Date & Sensor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#94A3B8] font-mono text-[11px] mb-1">
                  Capture Date
                </label>
                <input
                  type="date"
                  value={captureDate}
                  onChange={(e) => setCaptureDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060B14] border border-[#1B2F4E] text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-[#94A3B8] font-mono text-[11px] mb-1">
                  Sensor System
                </label>
                <input
                  type="text"
                  value={sensorType}
                  onChange={(e) => setSensorType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060B14] border border-[#1B2F4E] text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C] flex items-start gap-2.5 text-[11px] text-[#94A3B8] leading-relaxed">
              <Info className="w-4 h-4 text-[#00C8FF] shrink-0 mt-0.5" />
              <span>
                Metadata enables automatic pairing with reference DEM (ESA Copernicus GLO-30) for RANSAC Huber metric height calibration.
              </span>
            </div>

            {/* Primary Action Button: Start AI Analysis */}
            <button
              onClick={() => onNavigate('processing')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00C8FF] via-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-sm tracking-wide shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Start AI Analysis</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
