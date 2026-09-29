import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  History, 
  Layers, 
  Box, 
  FileText, 
  Settings, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle2,
  Compass,
  ArrowRight
} from 'lucide-react';

export type PrototypeView = 
  | 'home'
  | 'dashboard'
  | 'upload'
  | 'processing'
  | 'results'
  | 'depth-map'
  | 'height-elevation'
  | 'object-detection'
  | '3d-reconstruction'
  | '3d-flythrough'
  | 'measurements'
  | 'compare'
  | 'history'
  | 'detail'
  | 'reports'
  | 'settings'
  | 'help'
  | 'admin';

interface DesktopSidebarProps {
  currentView: PrototypeView;
  onNavigate: (view: PrototypeView) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard' as PrototypeView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload' as PrototypeView, label: 'New Analysis', icon: UploadCloud },
    { id: 'history' as PrototypeView, label: 'Analysis History', icon: History },
    { id: 'compare' as PrototypeView, label: 'Compare', icon: Layers },
    { id: '3d-reconstruction' as PrototypeView, label: '3D Viewer', icon: Box, subviews: ['3d-reconstruction', '3d-flythrough', 'measurements', 'results', 'depth-map', 'height-elevation', 'object-detection', 'detail'] },
    { id: 'reports' as PrototypeView, label: 'Reports', icon: FileText },
    { id: 'settings' as PrototypeView, label: 'Settings', icon: Settings },
    { id: 'help' as PrototypeView, label: 'Help', icon: HelpCircle },
  ];

  const isItemActive = (item: typeof menuItems[0]) => {
    if (currentView === item.id) return true;
    if (item.subviews && item.subviews.includes(currentView)) return true;
    return false;
  };

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-[#070D18] border-r border-[#15243C] flex flex-col justify-between select-none z-30">
      
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-[#15243C]/80">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left w-full group transition-all"
            title="Return to Home Landing"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30 group-hover:border-cyan-300 transition-all">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-white">DEPTH</span>
                <span className="font-extrabold text-base tracking-wider text-[#00C8FF]">WIZARD</span>
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8] tracking-tight">
                SIH Problem ID: SIH26175
              </div>
            </div>
          </button>

          <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-[#0B1527] border border-[#182C4A] text-[10px] text-[#94A3B8] font-mono leading-tight">
            Single Image → Height Estimation → 3D Flythrough
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#64748B]">
            Platform Navigation
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-transparent border-l-2 border-cyan-400 text-white font-semibold'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#0E192E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#00C8FF]' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </div>
                {active && <ArrowRight className="w-3 h-3 text-[#00C8FF]" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#15243C] space-y-3 bg-[#050A14]">
        
        {/* Admin Switcher */}
        <button
          onClick={() => onNavigate('admin')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            currentView === 'admin'
              ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/30'
              : 'text-[#94A3B8] hover:text-white hover:bg-[#0E192E]'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Admin Dashboard</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#111C33] text-indigo-300">
            LOD2
          </span>
        </button>

        {/* System Status */}
        <div className="p-2.5 rounded-xl bg-[#091222] border border-[#15243C] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#64748B] uppercase">System Status</div>
            <div className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>AI Engine Online</span>
            </div>
          </div>
          <div className="w-6 h-6 rounded-lg bg-[#0F1E36] flex items-center justify-center text-[#10B981]">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Return to Home Landing link */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] px-1">
          <button 
            onClick={() => onNavigate('home')}
            className="hover:text-[#00C8FF] transition-colors"
          >
            ← View Landing
          </button>
          <span>v2.4.0</span>
        </div>

      </div>

    </aside>
  );
};
