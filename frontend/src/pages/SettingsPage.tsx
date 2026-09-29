import React, { useState } from 'react';
import { 
  User, 
  Sliders, 
  HardDrive, 
  ShieldCheck, 
  Key, 
  Laptop, 
  Check
} from 'lucide-react';
import type { PrototypeView } from '../components/layout/DesktopSidebar';

interface SettingsPageProps {
  onNavigate?: (view: PrototypeView) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate: _onNavigate }) => {
  const [name, setName] = useState('Dr. Rajesh Varma');
  const [email, setEmail] = useState('r.varma@geospatial.gov.in');
  const [theme, setTheme] = useState('dark-navy');
  const [language, setLanguage] = useState('en-IN');
  const [units, setUnits] = useState('metric');
  const [notifications, setNotifications] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15243C] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
              STEP 16
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            User profile, geospatial calibration preferences, system storage quotas, and authentication tokens.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Save Changes</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs font-mono text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Settings successfully updated across local profile context.</span>
        </div>
      )}

      {/* Grid: 4 Core Sections */}
      <div className="space-y-6">
        
        {/* 1. Profile Section */}
        <div className="bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
            <User className="w-4 h-4 text-[#00C8FF]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Analyst Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#94A3B8] font-mono text-[11px] mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B14] border border-[#1B2F4E] text-white focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-[#94A3B8] font-mono text-[11px] mb-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B14] border border-[#1B2F4E] text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Preferences Section */}
        <div className="bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
            <Sliders className="w-4 h-4 text-[#00C8FF]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Platform Preferences
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {/* Theme */}
            <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C] space-y-2">
              <span className="text-[10px] text-[#64748B] uppercase block">Interface Theme</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-[#0E1A30] border border-[#1E3658] text-white rounded-lg p-2 text-xs focus:outline-none"
              >
                <option value="dark-navy">Deep Navy SaaS (Default)</option>
                <option value="high-contrast">High-Contrast Tactical</option>
              </select>
            </div>

            {/* Language */}
            <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C] space-y-2">
              <span className="text-[10px] text-[#64748B] uppercase block">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#0E1A30] border border-[#1E3658] text-white rounded-lg p-2 text-xs focus:outline-none"
              >
                <option value="en-IN">English (India)</option>
                <option value="en-US">English (US)</option>
              </select>
            </div>

            {/* Units */}
            <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C] space-y-2">
              <span className="text-[10px] text-[#64748B] uppercase block">Measurement Units</span>
              <select
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full bg-[#0E1A30] border border-[#1E3658] text-white rounded-lg p-2 text-xs focus:outline-none"
              >
                <option value="metric">Metric (meters / m²)</option>
                <option value="imperial">Imperial (feet / ft²)</option>
              </select>
            </div>

            {/* Notifications */}
            <div className="p-3 rounded-xl bg-[#060B14] border border-[#15243C] space-y-2">
              <span className="text-[10px] text-[#64748B] uppercase block">Pipeline Notifications</span>
              <div className="flex items-center justify-between pt-1">
                <span className="text-white text-xs">Audio / Visual Alerts</span>
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-4 h-4 accent-[#00C8FF] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Storage Quota Section */}
        <div className="bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#162744] pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#00C8FF]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Cloud Storage Quota
              </h2>
            </div>
            <span className="text-xs font-mono text-cyan-300">2.4 GB / 10.0 GB (24% Used)</span>
          </div>

          <div className="space-y-2">
            <div className="w-full h-3 bg-[#060B14] rounded-full overflow-hidden border border-[#182C4A]">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{ width: '24%' }} />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>Used Storage: <strong className="text-white">2.4 GB</strong> (148 Analyses, DSM GeoTIFFs, 3D GLB Meshes)</span>
              <span>Available Storage: <strong className="text-emerald-400">7.6 GB</strong> Free</span>
            </div>
          </div>
        </div>

        {/* 4. Security Section */}
        <div className="bg-[#091222] p-6 rounded-2xl border border-[#162744] shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#162744] pb-3">
            <ShieldCheck className="w-4 h-4 text-[#00C8FF]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Security & Active Sessions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Change Password Block */}
            <div className="p-4 rounded-xl bg-[#060B14] border border-[#15243C] space-y-3">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Key className="w-3.5 h-3.5 text-[#00C8FF]" />
                <span>Authentication Credentials</span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Protected through secure SHA-256 JWT tokens. Session renewal active.
              </p>
              <button 
                onClick={() => alert('Password update request sent to email: ' + email)}
                className="px-3 py-1.5 rounded-lg bg-[#0E1A30] hover:bg-[#182C50] text-cyan-300 border border-[#1E3658] text-xs font-mono transition-colors"
              >
                Change Password
              </button>
            </div>

            {/* Active Sessions */}
            <div className="p-4 rounded-xl bg-[#060B14] border border-[#15243C] space-y-3">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                <span>Current Active Session</span>
              </div>
              <div className="text-[11px] font-mono text-[#94A3B8] space-y-0.5">
                <div>Device: <span className="text-white">Windows Chrome 128 (Desktop Client)</span></div>
                <div>IP Address: <span className="text-white">103.21.244.12 (India)</span></div>
                <div className="text-emerald-400">Status: Authenticated Operator</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
