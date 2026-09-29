import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  RotateCw, 
  Layers
} from 'lucide-react';
import type { Analysis, JobStage, ProcessingJob } from '../types';
import { DEMO_JOB } from '../services/api';

interface PipelineMonitorProps {
  analysis: Analysis;
}

export const PipelineMonitor: React.FC<PipelineMonitorProps> = ({ analysis: _analysis }) => {
  const [job, setJob] = useState<ProcessingJob>(DEMO_JOB);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARNING'>('ALL');

  const STAGES: { key: JobStage; name: string; description: string }[] = [
    { key: 'IMAGE_UPLOAD', name: '1. Image Ingestion', description: 'Georeference & Band validation' },
    { key: 'IMAGE_PREPROCESSING', name: '2. Preprocessing', description: 'GSD calibration & CLAHE normalization' },
    { key: 'AI_DEPTH_ESTIMATION', name: '3. Neural Depth', description: 'Depth-Anything-V2 dense disparity' },
    { key: 'METRIC_CALIBRATION', name: '4. Metric Scale', description: 'RANSAC Huber regression vs DEM' },
    { key: 'OBJECT_DETECTION', name: '5. Footprint Segmentation', description: 'YOLOv8x polygon instance masks' },
    { key: 'ELEVATION_MAP', name: '6. DSM GeoTIFF', description: 'AMSL height raster generation' },
    { key: 'RECONSTRUCTION_3D', name: '7. 3D Mesh Generation', description: 'LOD2 continuous terrain + buildings' },
    { key: 'FINAL_ANALYSIS', name: '8. Metric Verification', description: 'Quality assurance & reproducibility hash' },
    { key: 'COMPLETED', name: '9. Deployment Ready', description: 'Artifacts published to client' }
  ];

  const stageOrder = STAGES.map((s) => s.key);
  const currentStageIndex = stageOrder.indexOf(job.currentStage);

  // Trigger live pipeline simulation
  const handleRerunPipeline = () => {
    setIsSimulating(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < STAGES.length) {
        setJob((prev) => ({
          ...prev,
          currentStage: STAGES[step].key,
          progressPercentage: Math.round(((step + 1) / STAGES.length) * 100),
          status: step === STAGES.length - 1 ? 'SUCCEEDED' : 'RUNNING'
        }));
        step++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 700);
  };

  const filteredLogs = job.logs.filter((l) => logFilter === 'ALL' || l.level === logFilter);

  return (
    <div className="w-full h-full flex flex-col gap-5 p-4 max-w-[1920px] mx-auto select-none">
      
      {/* Top Banner: Worker Hardware & Status */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-white flex items-center gap-2">
              <span>Asynchronous Inference Pipeline State Machine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                STATUS: {job.status}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Worker Node: <span className="font-mono text-cyan-300">{job.workerNode}</span> • Accelerator: <span className="font-mono text-white">{job.hardwareAccelerator}</span>
            </p>
          </div>
        </div>

        {/* Re-run Pipeline Button */}
        <button
          onClick={handleRerunPipeline}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Processing Pipeline...' : 'Simulate Live Inference Run'}</span>
        </button>
      </div>

      {/* Pipeline Stages Stepper */}
      <div className="glass-panel-elevated p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Execution Workflow Stages ({job.progressPercentage}% Complete)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Total Latency: 3.84s (End-to-End)
          </span>
        </div>

        {/* Stepper Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {STAGES.map((s, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex && job.status === 'RUNNING';

            return (
              <div 
                key={s.key}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20 animate-pulse'
                    : isCompleted
                    ? 'bg-[#0b1329] border-emerald-500/40 text-slate-200'
                    : 'bg-[#070b14]/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-slate-400">STAGE {idx + 1}</span>
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
                <div className="font-bold text-xs text-white leading-tight mb-1">
                  {s.name}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2">
                  {s.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Streaming Execution Logs */}
      <div className="glass-panel-elevated p-4 rounded-2xl border border-slate-800 shadow-xl flex-1 flex flex-col min-h-[320px]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono">
              Inference Engine Logs (/var/log/depthwizard-worker.log)
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Filter:</span>
            <button
              onClick={() => setLogFilter('ALL')}
              className={`px-2 py-0.5 rounded text-[11px] ${logFilter === 'ALL' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              ALL
            </button>
            <button
              onClick={() => setLogFilter('INFO')}
              className={`px-2 py-0.5 rounded text-[11px] ${logFilter === 'INFO' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              INFO
            </button>
          </div>
        </div>

        {/* Log Lines Container */}
        <div className="mt-3 flex-1 overflow-y-auto font-mono text-xs space-y-1.5 p-3 bg-[#050811] rounded-xl border border-slate-900/80">
          {filteredLogs.map((l, i) => (
            <div key={i} className="flex items-start gap-3 text-slate-300">
              <span className="text-slate-500 select-none text-[11px]">{l.timestamp}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-cyan-300">
                {l.stage}
              </span>
              <span className="text-emerald-400 text-[11px] font-bold">[{l.level}]</span>
              <span className="text-slate-200">{l.message}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
