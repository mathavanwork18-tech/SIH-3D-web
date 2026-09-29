import React, { useState } from 'react';
import { 
  Upload, 
  X, 
  FileUp 
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [sceneName, setSceneName] = useState('Visakhapatnam Urban Maritime Zone');
  const [crs, setCrs] = useState('EPSG:4326');
  const [gsd, setGsd] = useState('0.35');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleStartInference = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUploadSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-panel-elevated w-full max-w-lg rounded-2xl p-6 border border-cyan-500/30 shadow-2xl space-y-5 animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Ingest New Remote Sensing Scene
              </h3>
              <p className="text-xs text-slate-400">
                Upload RGB orthomosaic (GeoTIFF, PNG, JPEG)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone */}
        <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#070b14]/50">
          <FileUp className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-200">
            Drag & drop satellite scene or browse files
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Supports GeoTIFF, PNG, JPG up to 100MB (Pre-loaded: Synthetic 1024x1024 Benchmark)
          </span>
        </div>

        {/* Scene Parameters Form */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Scene Name / ROI:</label>
            <input 
              type="text"
              value={sceneName}
              onChange={(e) => setSceneName(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Horizontal CRS:</label>
              <select
                value={crs}
                onChange={(e) => setCrs(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
              >
                <option value="EPSG:4326">EPSG:4326 (WGS84)</option>
                <option value="EPSG:32644">UTM Zone 44N (EPSG:32644)</option>
                <option value="EPSG:3857">Web Mercator (EPSG:3857)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">GSD Resolution (m/px):</label>
              <input 
                type="number"
                step="0.05"
                value={gsd}
                onChange={(e) => setGsd(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleStartInference}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            {isProcessing ? 'Initializing AI Pipeline...' : 'Start 3D Metric Inference'}
          </button>
        </div>

      </div>
    </div>
  );
};
