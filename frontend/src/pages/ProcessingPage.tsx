import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  RotateCw, 
  Cpu, 
  Terminal, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface ProcessingPageProps {
  onNavigate: (view: PrototypeView) => void;
}

interface PipelineStage {
  id: string;
  name: string;
  subtext: string;
  status: 'COMPLETED' | 'PROCESSING' | 'PENDING';
  modelDetail: string;
}

export const ProcessingPage: React.FC<ProcessingPageProps> = ({ onNavigate }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(2); // Depth Estimation active
  const [progress, setProgress] = useState(68);
  const [elapsedSec, setElapsedSec] = useState(2.8);
  const [isSimulating, setIsSimulating] = useState(true);

  const stages: PipelineStage[] = [
    { id: '1', name: 'Image Upload', subtext: 'Format verification & coordinate bounds ingestion', status: currentStageIdx > 0 ? 'COMPLETED' : currentStageIdx === 0 ? 'PROCESSING' : 'PENDING', modelDetail: 'GeoTIFF / PNG Parser' },
    { id: '2', name: 'Preprocessing', subtext: 'Resolution GSD normalization & CLAHE contrast balance', status: currentStageIdx > 1 ? 'COMPLETED' : currentStageIdx === 1 ? 'PROCESSING' : 'PENDING', modelDetail: 'OpenCV Bilateral Filter' },
    { id: '3', name: 'Depth Estimation', subtext: 'Dense monocular disparity neural tensor inference', status: currentStageIdx > 2 ? 'COMPLETED' : currentStageIdx === 2 ? 'PROCESSING' : 'PENDING', modelDetail: 'Depth-Anything-V2-Aerial' },
    { id: '4', name: 'Metric Calibration', subtext: 'RANSAC Huber linear regression against Copernicus GLO-30 DEM', status: currentStageIdx > 3 ? 'COMPLETED' : currentStageIdx === 3 ? 'PROCESSING' : 'PENDING', modelDetail: 'Copernicus GLO-30 Huber Estimator' },
    { id: '5', name: 'Object Detection', subtext: 'Polygon segmentation of urban buildings & road corridors', status: currentStageIdx > 4 ? 'COMPLETED' : currentStageIdx === 4 ? 'PROCESSING' : 'PENDING', modelDetail: 'YOLOv8x-Geospatial v2' },
    { id: '6', name: 'Height Estimation', subtext: 'Metric AMSL roof & ground elevation extraction', status: currentStageIdx > 5 ? 'COMPLETED' : currentStageIdx === 5 ? 'PROCESSING' : 'PENDING', modelDetail: 'Metric DSM GeoTIFF Generator' },
    { id: '7', name: '3D Reconstruction', subtext: 'Continuous terrain displacement & extruded LOD2 meshes', status: currentStageIdx > 6 ? 'COMPLETED' : currentStageIdx === 6 ? 'PROCESSING' : 'PENDING', modelDetail: 'Three.js LOD2 WebGL Builder' },
  ];

  // Auto-progress simulation for judging demonstration
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setElapsedSec((prev) => +(prev + 0.4).toFixed(1));
      setProgress((prev) => {
        if (prev >= 100) {
          setIsSimulating(false);
          setCurrentStageIdx(7);
          return 100;
        }
        const next = prev + 6;
        if (next > 40 && next < 60) setCurrentStageIdx(3);
        else if (next >= 60 && next < 80) setCurrentStageIdx(4);
        else if (next >= 80 && next < 95) setCurrentStageIdx(5);
        else if (next >= 95) setCurrentStageIdx(6);
        return next > 100 ? 100 : next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleRestart = () => {
    setCurrentStageIdx(0);
    setProgress(12);
    setElapsedSec(0.4);
    setIsSimulating(true);
  };

  const sampleLogs = [
    { time: '07:15:00.12', stage: 'Upload', text: 'Validating 1024x1024 nadir optical imagery. Sensor bounds: [83.2100°E, 17.6800°N].' },
    { time: '07:15:00.45', stage: 'Preprocess', text: 'Ground sample distance calculated at 0.35m/px. CLAHE normalization applied.' },
    { time: '07:15:01.21', stage: 'Depth AI', text: 'Depth-Anything-V2-Aerial initialized on NVIDIA RTX 4090. Disparity map extracted in 760ms.' },
    { time: '07:15:01.98', stage: 'Calibration', text: 'Collected 48 reference elevations from Copernicus GLO-30 DEM. Optimal scale: 62.00, offset: 14.00m.' },
    { time: '07:15:02.89', stage: 'Objects', text: 'YOLOv8x detected 142 structures. Tallest structure BLD-B12 estimated at 76.3m.' },
    { time: '07:15:03.45', stage: '3D Mesh', text: 'Generating 3D elevation field and extruded building polygonal boundaries.' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              AI Analysis in Progress
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 04
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Autonomous monocular neural pipeline: Single Image → Neural Depth → Metric Calibration → 3D Volumetric Scene.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#091222] border border-[#162744] text-[#94A3B8] hover:text-white text-xs font-mono transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Re-run Pipeline</span>
          </button>

          <button
            onClick={() => onNavigate('results')}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>View Analysis Results</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Top 3 Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Progress % */}
        <div className="p-5 rounded-2xl bg-[#091222] border border-[#162744] flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-[#94A3B8]">Overall Progress</span>
            <div className="text-3xl font-extrabold text-[#00C8FF] mt-1">
              {progress}%
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {progress === 100 ? 'PIPELINE COMPLETE' : 'INFERENCE EXECUTING'}
            </span>
          </div>
          
          <div className="w-14 h-14 rounded-full border-4 border-[#162744] border-t-[#00C8FF] flex items-center justify-center font-mono text-xs font-bold text-white animate-spin-slow">
            {currentStageIdx + 1}/7
          </div>
        </div>

        {/* Processing Time */}
        <div className="p-5 rounded-2xl bg-[#091222] border border-[#162744] flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-[#94A3B8]">Processing Time</span>
            <div className="text-3xl font-extrabold text-white mt-1">
              {elapsedSec}s
            </div>
            <span className="text-[10px] font-mono text-[#64748B] mt-1 block">
              Estimated Total: 3.84s (End-to-End)
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#0E1A30] text-[#00C8FF] border border-[#1E3658]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* AI Model Status */}
        <div className="p-5 rounded-2xl bg-[#091222] border border-[#162744] flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-[#94A3B8]">AI Model Status</span>
            <div className="text-sm font-bold text-white mt-1">
              Depth-Anything-V2 + YOLOv8x
            </div>
            <span className="text-[10px] font-mono text-cyan-300 mt-1 block">
              TensorRT 10.1 • CUDA 12.4
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#0E1A30] text-emerald-400 border border-[#1E3658]">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Grid: Vertical Pipeline Stepper (Left 7) + Live Log Panel (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 cols: Vertical Pipeline Stepper */}
        <div className="lg:col-span-7 bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#162744] pb-3">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00C8FF]" />
              Vertical Execution Pipeline
            </h2>
            <span className="text-xs font-mono text-cyan-300">
              Stage: {stages[Math.min(currentStageIdx, stages.length - 1)]?.name}
            </span>
          </div>

          <div className="space-y-3 relative">
            {stages.map((stage, idx) => {
              const isDone = stage.status === 'COMPLETED';
              const isCurrent = stage.status === 'PROCESSING';

              return (
                <div
                  key={stage.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                    isCurrent
                      ? 'border-[#00C8FF] bg-[#0C1A33] shadow-md shadow-cyan-500/10'
                      : isDone
                      ? 'border-[#152744] bg-[#070E1A]'
                      : 'border-[#101C30] bg-[#050A14] opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="shrink-0">
                      {isDone ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-[#00C8FF]" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#0B1527] border border-[#1E3658] text-[#64748B] font-mono text-xs flex items-center justify-center">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isCurrent ? 'text-[#00C8FF]' : isDone ? 'text-white' : 'text-[#64748B]'}`}>
                          {stage.name}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-mono text-emerald-400">✓ Done</span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-[#00C8FF] bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/30">
                            Processing...
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        {stage.subtext}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-[#64748B] bg-[#0B1527] px-2 py-1 rounded border border-[#142642] shrink-0 hidden sm:inline">
                    {stage.modelDetail}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick jump to results on finish */}
          <div className="pt-2">
            <button
              onClick={() => onNavigate('results')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{progress === 100 ? 'View Completed Analysis Result' : 'Skip Ahead to Results'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Right 5 cols: Live Processing Log Panel */}
        <div className="lg:col-span-5 bg-[#060D1A] rounded-2xl border border-[#162744] shadow-xl overflow-hidden flex flex-col h-[520px]">
          <div className="p-3.5 bg-[#091222] border-b border-[#162744] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-white">
              <Terminal className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>LIVE INFERENCE LOGS</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              TELEMETRY STREAM
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] space-y-3 leading-relaxed text-[#94A3B8]">
            {sampleLogs.map((log, idx) => (
              <div key={idx} className="space-y-0.5 border-l-2 border-[#162E52] pl-2.5">
                <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
                  <span>{log.time}</span>
                  <span className="text-cyan-400">[{log.stage}]</span>
                </div>
                <div className="text-slate-200">
                  {log.text}
                </div>
              </div>
            ))}

            <div className="pt-2 text-emerald-400 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Neural tensors synchronized with GPU device context.</span>
            </div>
          </div>

          <div className="p-3 bg-[#08101E] border-t border-[#162744] text-[10px] font-mono text-[#64748B] flex items-center justify-between">
            <span>Worker: worker-gpu-nv-04</span>
            <span>VRAM: 8.4 GB / 24.0 GB</span>
          </div>
        </div>

      </div>

    </div>
  );
};
