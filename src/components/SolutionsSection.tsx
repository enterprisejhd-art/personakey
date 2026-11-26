import { useState } from 'react';
import { Check } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  WorkplacePilotConsole,
  type PilotSectorId,
} from './WorkplacePilotConsole';

interface SolutionTab {
  id: PilotSectorId;
  label: string;
  isMvp: boolean;
  phaseShort: string;
  phaseTag:
    | 'Year-1 Pilot MVP (Available Now)'
    | 'Phase 2–3 Partner Ecosystem Preview';
  gdprBadge: string;
  headline: string;
  intro: string;
  benefits: {
    title: string;
    detail: string;
  }[];
}

const SOLUTION_TABS: SolutionTab[] = [
  {
    id: 'coworking',
    label: 'Coworking & Inclusive Workplace',
    isMvp: true,
    phaseShort: 'Year-1 MVP',
    phaseTag: 'Year-1 Pilot MVP (Available Now)',
    gdprBadge: 'UK GDPR: Zero Third-Party Data Retention',
    headline: 'Instant hot-desk accessibility without storing employee health records.',
    intro:
      'Staff and flex members tap a physical key at any shared workstation to apply text zoom, contrast, language, and desk height—while eliminating UK GDPR special-category storage liability.',
    benefits: [
      {
        title: 'Functional outputs, never medical diagnoses',
        detail:
          'Applies temporary OS display and standing-desk settings without collecting or storing sensitive HR health notes.',
      },
      {
        title: 'Consistent workspace ergonomics across floors',
        detail:
          'Hybrid teams receive identical readable displays across Windows desks, Mac hubs, and partner coworking buildings.',
      },
      {
        title: 'Deterministic sign-out purge',
        detail:
          'Shared terminals automatically revert to neutral defaults with zero residual session files left behind.',
      },
    ],
  },
  {
    id: 'nhs',
    label: 'NHS & Emergency Care',
    isMvp: false,
    phaseShort: 'Phase 2–3',
    phaseTag: 'Phase 2–3 Partner Ecosystem Preview',
    gdprBadge: 'UK GDPR: Ephemeral Clinical Triage Only',
    headline: 'Offline triage directives surfaced in one tap—even without phone battery.',
    intro:
      'Paramedics and A&E clinicians verify their NHS Responder Credential locally to read blood group, severe allergies, and BSL/non-verbal care alerts without holding permanent patient preference databases.',
    benefits: [
      {
        title: 'Role-verified selective emergency unlock',
        detail:
          'Only Partition 05 (Emergency Care Directives) unlocks; workplace, vehicle, and hotel partitions stay cryptographically sealed.',
      },
      {
        title: 'Works 100% offline in clinical dead-zones',
        detail:
          'Operates via NFC/BLE directly from the patient’s physical key with zero mobile signal or smartphone unlock required.',
      },
      {
        title: 'Zero post-triage storage liability',
        detail:
          'Once triage concludes and the session disconnects, the receiver purges temporary card buffers to 0 bytes.',
      },
    ],
  },
  {
    id: 'mobility',
    label: 'Mobility & EV Fleets',
    isMvp: false,
    phaseShort: 'Phase 2–3',
    phaseTag: 'Phase 2–3 Partner Ecosystem Preview',
    gdprBadge: 'UK GDPR: Zero Driver Profile Retention',
    headline: 'Instant cabin personalisation with zero forced rental apps or cloud accounts.',
    intro:
      'Drivers tap their key inside any shared EV or hire car to configure lumbar support, mirror angles, cabin climate, and regenerative braking—eliminating fleet vendor account friction.',
    benefits: [
      {
        title: 'Zero third-party fleet accounts required',
        detail:
          'Eliminates mandatory app downloads and Bluetooth phone pairing just to save seat posture and climate preferences.',
      },
      {
        title: 'Hardware-safe vehicle adaptation',
        detail:
          'Translates abstract comfort intent safely within each EV’s local cabin actuator and regenerative braking bounds.',
      },
      {
        title: 'Automatic drop-off reset',
        detail:
          'Ending the rental wipes cabin memory clean so the next driver starts with zero traces of the previous journey.',
      },
    ],
  },
  {
    id: 'hospitality',
    label: 'Hospitality & Public Kiosks',
    isMvp: false,
    phaseShort: 'Phase 2–3',
    phaseTag: 'Phase 2–3 Partner Ecosystem Preview',
    gdprBadge: 'UK GDPR: Zero Guest CRM Profile Exposure',
    headline: 'Tailored suites and accessible public terminals with zero CRM breach risk.',
    intro:
      'Guests and travellers adapt hotel suite lighting, TV captions, airport kiosks, and gym consoles on arrival without leaving accessibility attributes inside loyalty databases.',
    benefits: [
      {
        title: 'Eliminates UK GDPR profile storage risk',
        detail:
          'Venues deliver personalised rooms and high-contrast audio-assist kiosks without retaining permanent guest records.',
      },
      {
        title: 'Live Matter room lighting & caption sync',
        detail:
          'Translates warm Kelvin lighting, sleep climate, and TV subtitle needs locally across hotel room hubs.',
      },
      {
        title: 'Accessible self-service terminals on demand',
        detail:
          'Airport and banking kiosks switch instantly into large-touch-target, audio-guided layouts and reset when the user steps away.',
      },
    ],
  },
];

export function SolutionsSection() {
  const [activeTabId, setActiveTabId] = useState<PilotSectorId>('coworking');
  const shouldReduceMotion = useReducedMotion();

  const activeTab =
    SOLUTION_TABS.find((tab) => tab.id === activeTabId) ?? SOLUTION_TABS[0];

  return (
    <section
      id="solutions"
      className="border-b border-[#E2E8F0] bg-[#F8FAFC] py-14 sm:py-18"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className=" text-xs font-semibold tracking-[0.05em] text-[#00A896]">
            SOLUTIONS &amp; MULTI-SITE RECEIVER CONSOLE
          </p>
          <h2 className="pk-scaled-heading font-display mt-2.5 font-bold text-balance text-[#090D16]">
            Built for workplaces, NHS responders, EV fleets, and public venues.
          </h2>
          <p className="pk-scaled-small mt-2.5 text-[#334155]">
            Deliver instant accessibility and personalisation on arrival while eliminating UK GDPR liability for storing permanent user profiles.
          </p>
        </div>

        {/* Crisp 4-Tab Switcher */}
        <div
          role="tablist"
          aria-label="PersonaKey sector solutions"
          className="mt-8 flex flex-wrap border-b border-[#E2E8F0]"
        >
          {SOLUTION_TABS.map((tab) => {
            const isSelected = tab.id === activeTab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTabId(tab.id)}
                className={`pk-focus-ring -mb-px inline-flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-left text-sm font-medium transition-colors sm:whitespace-nowrap ${
                  isSelected
                    ? 'border-[#00A896] font-semibold text-[#090D16]'
                    : 'border-transparent text-[#64748B] hover:border-[#E2E8F0] hover:text-[#090D16]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold ${
                    tab.isMvp
                      ? 'border-[#00A896] bg-[#FFFFFF] text-[#00A896]'
                      : 'border-[#E2E8F0] bg-[#FFFFFF] text-[#64748B]'
                  }`}
                >
                  {tab.phaseShort}
                </span>
              </button>
            );
          })}
        </div>

        {/* Unified 2-Column Layout: Sector Benefits + Live Receiver Network Console */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start"
        >
          {/* Left Column (4 cols): Sector Benefits */}
          <div className="min-w-0 lg:col-span-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-semibold ${
                      activeTab.isMvp
                        ? 'border-[#00A896] bg-[#00A896] text-[#FFFFFF]'
                        : 'border-[#E2E8F0] bg-[#FFFFFF] text-[#334155]'
                    }`}
                  >
                    {activeTab.phaseTag}
                  </span>
                  <span className="inline-flex items-center rounded-md border border-[#00A896] bg-[#FFFFFF] px-2.5 py-1 text-[10px] font-semibold text-[#090D16]">
                    {activeTab.gdprBadge}
                  </span>
                </div>
                <h3 className="pk-scaled-subheading font-display font-bold text-[#090D16]">
                  {activeTab.headline}
                </h3>
                <p className="pk-scaled-small mt-3 text-[#334155]">
                  {activeTab.intro}
                </p>

                <ul className="mt-6 divide-y divide-[#E2E8F0] border-t border-b border-[#E2E8F0]">
                  {activeTab.benefits.map((benefit) => (
                    <li key={benefit.title} className="flex items-start gap-3 py-4">
                      <Check
                        size={16}
                        strokeWidth={2.25}
                        className="mt-0.5 shrink-0 text-[#00A896]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#090D16]">
                          {benefit.title}
                        </p>
                        <p className="pk-scaled-small mt-1 text-[#334155]">
                          {benefit.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column (8 cols): Interactive Live Receiver Network Console */}
          <div className="min-w-0 lg:col-span-8">
            <WorkplacePilotConsole sectorId={activeTab.id} />
          </div>
        </div>
      </div>
    </section>
  );
}
