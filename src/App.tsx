import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RealWorldJourneySection } from './components/RealWorldJourneySection';
import { SystemArchitectureSection } from './components/SystemArchitectureSection';
import { ComplianceTrustBar } from './components/ComplianceTrustBar';
import { WhySyncFailsSection } from './components/WhySyncFailsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { NeutralitySection } from './components/NeutralitySection';
import { SolutionsSection } from './components/SolutionsSection';
import { MarketOpportunitySection } from './components/MarketOpportunitySection';
import { PricingSection } from './components/PricingSection';
import { Footer } from './components/Footer';
import {
  WorkplacePilotModal,
  type WorkplaceEnquiryMode,
} from './components/WorkplacePilotModal';
import { ConsumerBetaModal } from './components/ConsumerBetaModal';
import { PrivacyArchitectureModal } from './components/PrivacyArchitectureModal';
import { type AccessibilityMode } from './types/accessibility';
import {
  DEFAULT_KEY_VAULT,
  type KeyVaultData,
  type ScenarioId,
} from './data/vault';

type ActiveModal = 'pilot' | 'sdk' | 'beta' | 'privacy' | null;

export function App() {
  const [mode, setMode] = useState<AccessibilityMode>('standard');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const [vault, setVault] = useState<KeyVaultData>(DEFAULT_KEY_VAULT);
  const [scenarioId, setScenarioId] = useState<ScenarioId>('nhs-triage');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-a11y-mode', mode);
  }, [mode]);

  const workplaceMode: WorkplaceEnquiryMode =
    activeModal === 'sdk' ? 'sdk' : 'pilot';

  return (
    <div className="flex min-h-screen flex-col bg-[var(--pk-bg)] text-[var(--pk-text)]">
      <Header
        mode={mode}
        onModeChange={setMode}
        onBookPilot={() => setActiveModal('pilot')}
      />

      <main className="flex-1">
        <HeroSection onBookPilot={() => setActiveModal('pilot')} />
        <WhySyncFailsSection />
        <HowItWorksSection />
        <RealWorldJourneySection
          vault={vault}
          onVaultChange={setVault}
          scenarioId={scenarioId}
          onScenarioChange={setScenarioId}
          isConnected={isConnected}
          onConnectionChange={setIsConnected}
        />
        <SystemArchitectureSection />
        <ComplianceTrustBar />
        <NeutralitySection
          vault={vault}
          scenarioId={scenarioId}
          isConnected={isConnected}
        />
        <SolutionsSection />
        <MarketOpportunitySection
          onBookPilot={() => setActiveModal('pilot')}
          onJoinBeta={() => setActiveModal('beta')}
          onEnquireSdk={() => setActiveModal('sdk')}
        />
        <PricingSection
          onBookPilot={() => setActiveModal('pilot')}
          onJoinBeta={() => setActiveModal('beta')}
          onEnquireSdk={() => setActiveModal('sdk')}
        />
      </main>

      <Footer onOpenPrivacy={() => setActiveModal('privacy')} />

      <WorkplacePilotModal
        isOpen={activeModal === 'pilot' || activeModal === 'sdk'}
        mode={workplaceMode}
        onClose={() => setActiveModal(null)}
      />

      <ConsumerBetaModal
        isOpen={activeModal === 'beta'}
        onClose={() => setActiveModal(null)}
      />

      <PrivacyArchitectureModal
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}

export default App;
