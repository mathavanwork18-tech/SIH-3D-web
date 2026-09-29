import React from 'react';
import '../styles/landing.css';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { WorkflowBlueprint } from '../components/landing/WorkflowBlueprint';
import { DepthEstimation } from '../components/landing/DepthEstimation';
import { MetricHeight } from '../components/landing/MetricHeight';
import { ReconstructionPreview } from '../components/landing/ReconstructionPreview';
import { FlythroughPreview } from '../components/landing/FlythroughPreview';
import { UseCases } from '../components/landing/UseCases';
import { TechnologyStack } from '../components/landing/TechnologyStack';
import { SecuritySection } from '../components/landing/SecuritySection';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';

interface LandingPageProps {
  onStartAnalysis: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis }) => {
  const handleExploreDemo = () => {
    const el = document.getElementById('depth-estimation') || document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExplore3DDemo = () => {
    const el = document.getElementById('reconstruction');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-root bg-[#050B14] min-h-screen text-[#F8FAFC] flex flex-col selection:bg-[#00C8FF]/20 selection:text-[#00C8FF]">
      
      {/* 01. Sticky Header / Navigation */}
      <Navbar
        onStartAnalysis={onStartAnalysis}
        onExploreDemo={handleExploreDemo}
      />

      <main className="flex-1 w-full flex flex-col">
        {/* 02. Hero Section with 3D/Satellite Visualization */}
        <Hero
          onStartAnalysis={onStartAnalysis}
          onExploreDemo={handleExploreDemo}
        />

        {/* 03. How DepthWizard Works (5 Steps) */}
        <HowItWorks />

        {/* 04. Scientific Workflow Blueprint Diagram */}
        <WorkflowBlueprint />

        {/* 05. AI Depth Estimation Section */}
        <DepthEstimation />

        {/* 06. Metric Height Estimation Section */}
        <MetricHeight />

        {/* 07. 3D Volumetric Reconstruction Preview */}
        <ReconstructionPreview
          onExplore3DDemo={handleExplore3DDemo}
        />

        {/* 08. 3D Flythrough Exploration Preview */}
        <FlythroughPreview
          onStartAnalysis={onStartAnalysis}
        />

        {/* 09. Operational Use Cases (Exactly 4) */}
        <UseCases />

        {/* 10. Modern Geospatial Technology Stack */}
        <TechnologyStack />

        {/* 11. Security & Geospatial Data Handling */}
        <SecuritySection />

        {/* 12. Final Call to Action */}
        <FinalCTA
          onStartAnalysis={onStartAnalysis}
          onExploreDemo={handleExploreDemo}
        />
      </main>

      {/* 13. Professional Footer */}
      <Footer />

    </div>
  );
};

export default LandingPage;
