import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { DesktopSidebar, type PrototypeView } from './components/layout/DesktopSidebar';
import { JudgeFlowBar } from './components/layout/JudgeFlowBar';

// 18 Step Page Components
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { ResultsPage } from './pages/ResultsPage';
import { DepthMapPage } from './pages/DepthMapPage';
import { HeightElevationPage } from './pages/HeightElevationPage';
import { ObjectDetectionPage } from './pages/ObjectDetectionPage';
import { Reconstruction3DPage } from './pages/Reconstruction3DPage';
import { FlythroughPage } from './pages/FlythroughPage';
import { MeasurementsPage } from './pages/MeasurementsPage';
import { ComparePage } from './pages/ComparePage';
import { HistoryPage } from './pages/HistoryPage';
import { DetailAnalysisPage } from './pages/DetailAnalysisPage';
import { ExportReportPage } from './pages/ExportReportPage';
import { SettingsPage } from './pages/SettingsPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export function App() {
  // Support deep-linking via query parameter ?view=... or default to 'dashboard'
  const [currentView, setCurrentView] = useState<PrototypeView>(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as PrototypeView;
    if (viewParam) return viewParam;
    if (window.location.pathname === '/' || window.location.pathname === '/home') return 'home';
    return 'dashboard';
  });

  const navigateTo = (view: PrototypeView) => {
    setCurrentView(view);
    const newUrl = view === 'home' ? '/' : `/?view=${view}`;
    window.history.pushState({}, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view') as PrototypeView;
      if (viewParam) setCurrentView(viewParam);
      else if (window.location.pathname === '/' || window.location.pathname === '/home') setCurrentView('home');
      else setCurrentView('dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 01 — HOME: Landing Page View
  if (currentView === 'home') {
    return (
      <div className="relative">
        {/* Floating Top Banner to jump directly into the SIH Prototype for Judges */}
        <div className="bg-gradient-to-r from-cyan-950 via-[#0C1B33] to-blue-950 border-b border-cyan-500/30 px-4 py-2 text-center text-xs font-mono text-cyan-200 flex items-center justify-center gap-3 shadow-lg z-50 sticky top-0">
          <span className="px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-400/40 text-cyan-300 font-bold">
            SIH26175 DEMO
          </span>
          <span>Single Image → Height Estimation → 3D Flythrough</span>
          <button
            onClick={() => navigateTo('dashboard')}
            className="px-3 py-1 rounded-md bg-[#00C8FF] hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-all ml-2"
          >
            Launch Prototype UI →
          </button>
        </div>

        <LandingPage
          onStartAnalysis={() => navigateTo('upload')}
        />
      </div>
    );
  }

  // 02 to 18: Authenticated Prototype Desktop Layout
  return (
    <div className="min-h-screen bg-[#050A14] text-[#F8FAFC] flex selection:bg-[#00C8FF]/20 selection:text-[#00C8FF]">
      
      {/* Persistent Desktop Sidebar */}
      <DesktopSidebar
        currentView={currentView}
        onNavigate={navigateTo}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Persistent Judge Flow Stepper Bar */}
        <JudgeFlowBar
          currentView={currentView}
          onNavigate={navigateTo}
        />

        {/* Dynamic View Router */}
        <main className="flex-1 pb-16">
          {currentView === 'dashboard' && <DashboardPage onNavigate={navigateTo} />}
          {currentView === 'upload' && <UploadPage onNavigate={navigateTo} />}
          {currentView === 'processing' && <ProcessingPage onNavigate={navigateTo} />}
          {currentView === 'results' && <ResultsPage onNavigate={navigateTo} />}
          {currentView === 'depth-map' && <DepthMapPage onNavigate={navigateTo} />}
          {currentView === 'height-elevation' && <HeightElevationPage onNavigate={navigateTo} />}
          {currentView === 'object-detection' && <ObjectDetectionPage onNavigate={navigateTo} />}
          {currentView === '3d-reconstruction' && <Reconstruction3DPage onNavigate={navigateTo} />}
          {currentView === '3d-flythrough' && <FlythroughPage onNavigate={navigateTo} />}
          {currentView === 'measurements' && <MeasurementsPage onNavigate={navigateTo} />}
          {currentView === 'compare' && <ComparePage onNavigate={navigateTo} />}
          {currentView === 'history' && <HistoryPage onNavigate={navigateTo} />}
          {currentView === 'detail' && <DetailAnalysisPage onNavigate={navigateTo} />}
          {currentView === 'reports' && <ExportReportPage onNavigate={navigateTo} />}
          {currentView === 'settings' && <SettingsPage onNavigate={navigateTo} />}
          {currentView === 'help' && <DocumentationPage onNavigate={navigateTo} />}
          {currentView === 'admin' && <AdminDashboardPage onNavigate={navigateTo} />}
        </main>

      </div>

    </div>
  );
}

export default App;
