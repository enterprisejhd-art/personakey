import { useState } from 'react';
import {
  AlertTriangle,
  BedDouble,
  Car,
  CheckCircle2,
  HeartPulse,
  Home,
  Lock,
  Monitor,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type ExplorerMode = 'without' | 'with';

interface DailyStop {
  id: string;
  time: string;
  location: string;
  shortTagWithout: string;
  shortTagWith: string;
  icon: 'home' | 'office' | 'car' | 'hotel' | 'ae';
  withoutPersonaKey: {
    ecosystemProblem: string;
    humanImpact: string;
    detail: string;
    exposureBadge: string;
    frictionMetric: string;
  };
  withPersonaKey: {
    partitionUnlocked: string;
    sealedPartitions: string;
    detail: string;
    trustBadge: string;
    retentionMetric: string;
  };
}

const DAILY_STOPS: DailyStop[] = [
  {
    id: 'home',
    time: '08:30',
    location: 'Home Mac & Smart Lights',
    shortTagWithout: 'Vendor Silo',
    shortTagWith: 'Local Tap',
    icon: 'home',
    withoutPersonaKey: {
      ecosystemProblem: 'Apple iCloud & HomeKit Lock-In',
      humanImpact: 'Settings trapped inside consumer ecosystem',
      detail:
        'Your 135% text zoom, Warm Paper display profile, and 2700K morning lighting are locked inside your personal Apple ID. None of these settings can travel securely to your Windows office desk or public terminals.',
      exposureBadge: 'Vendor Silo · Zero Portability',
      frictionMetric: 'Manual export impossible across ecosystems',
    },
    withPersonaKey: {
      partitionUnlocked: 'Partitions 01 & 03 · Local Sync',
      sealedPartitions: 'Mobility, Public & Emergency stay sealed',
      detail:
        'Your PersonaKey hardware vault stores your chosen display scale and warm lighting rules locally in open preference schemas—ready to translate onto any Windows, Mac, browser, or Matter endpoint without cloud sync.',
      trustBadge: '0 Cloud Sync · Hardware Vault Authoritative',
      retentionMetric: 'Portable across all operating systems',
    },
  },
  {
    id: 'office',
    time: '10:00',
    location: 'Shared Office Windows Hot-Desk',
    shortTagWithout: 'Settings Lost',
    shortTagWith: 'Partition 01',
    icon: 'office',
    withoutPersonaKey: {
      ecosystemProblem: 'Cross-OS Failure (macOS to Windows 11)',
      humanImpact: '12 minutes of daily manual reconfiguration',
      detail:
        'Signing into a shared corporate Windows workstation resets display zoom to 100%, disables High Contrast mode, and leaves the motorised standing desk at default height—forcing disabled and hybrid staff to rebuild ergonomics every morning.',
      exposureBadge: 'Daily Accessibility Friction',
      frictionMetric: 'Settings wiped or mismatched across shared desks',
    },
    withPersonaKey: {
      partitionUnlocked: 'Partition 01 · Workplace & Display',
      sealedPartitions: 'Partitions 02–05 remain sealed on key',
      detail:
        'One offline NFC tap on Desk #04 unlocks only Partition 01, applying 135% zoom, High Contrast mode, and 108cm standing-desk height in under a second—while automatically reverting the terminal on sign-out.',
      trustBadge: 'Desk #04 Verified · 0 Bytes Retained at Sign-Out',
      retentionMetric: 'Instant activation (< 1s) · Zero IT tickets',
    },
  },
  {
    id: 'car',
    time: '14:00',
    location: 'Hire Car / EV Fleet',
    shortTagWithout: 'Account Forced',
    shortTagWith: 'Partition 02',
    icon: 'car',
    withoutPersonaKey: {
      ecosystemProblem: 'Forced Rental App & Cloud Account Creation',
      humanImpact: 'Personal driving profile left on fleet servers',
      detail:
        'To save seat lumbar position, mirror angles, cabin temperature, and voice navigation cues, the fleet provider forces you to install an app, create a vendor login, and pair your smartphone—leaving telemetry in their cloud.',
      exposureBadge: 'Forced Vendor Account · Cloud Telemetry',
      frictionMetric: 'Personal data persists after vehicle return',
    },
    withPersonaKey: {
      partitionUnlocked: 'Partition 02 · Mobility & Vehicle',
      sealedPartitions: 'Partitions 01 & 03–05 remain sealed on key',
      detail:
        'Tapping the vehicle cabin receiver unlocks only Partition 02 via offline NFC/BLE, setting Lumbar +2, Mirror Set B, 20°C climate, and voice-nav cues without creating an account or touching your phone.',
      trustBadge: 'Fleet EV #B12 Verified · Zero Cloud Account',
      retentionMetric: 'Cabin memory auto-purges when key departs',
    },
  },
  {
    id: 'hotel',
    time: '19:00',
    location: 'Hotel Check-In',
    shortTagWithout: 'Cloud Exposure',
    shortTagWith: 'Partition 03',
    icon: 'hotel',
    withoutPersonaKey: {
      ecosystemProblem: 'Hospitality Loyalty Cloud Breach Exposure',
      humanImpact: 'Accessibility requests stored against passport ID',
      detail:
        'Requests for hypoallergenic bedding, closed captions, and low-glare warm lighting get logged into central hotel CRM databases—creating unnecessary UK GDPR breach liability while rooms still require manual setup.',
      exposureBadge: 'Central CRM Breach Risk',
      frictionMetric: 'Static loyalty profile exposed to third-party leaks',
    },
    withPersonaKey: {
      partitionUnlocked: 'Partition 03 · Hospitality & Room',
      sealedPartitions: 'Partitions 01–02 & 04–05 remain sealed on key',
      detail:
        'Tapping Room #402 unlocks only Partition 03 to configure 2700K warm lighting, 19°C sleep climate, TV subtitles, and hypoallergenic bedding locally—with zero personal health attributes stored by the hotel.',
      trustBadge: 'Room #402 Verified · Zero Guest Data Stored',
      retentionMetric: 'Room resets to neutral baseline at checkout',
    },
  },
  {
    id: 'ae',
    time: '21:30',
    location: 'A&E Emergency Triage',
    shortTagWithout: 'Locked Phone',
    shortTagWith: 'Partition 05',
    icon: 'ae',
    withoutPersonaKey: {
      ecosystemProblem: 'Critical Directives Trapped Behind Locked Phone',
      humanImpact: 'Dead battery or passcode blocks clinical triage',
      detail:
        'Severe allergies (Penicillin, Latex), O-Negative blood type, next-of-kin contact, and Non-Verbal/BSL communication directives sit locked inside a smartphone Medical ID or cloud portal paramedics cannot access offline.',
      exposureBadge: 'Offline Failure · Delayed Clinical Care',
      frictionMetric: 'Single point of failure when phone is locked or flat',
    },
    withPersonaKey: {
      partitionUnlocked: 'Partition 05 · Emergency Care Directives',
      sealedPartitions: 'Partitions 01–04 remain sealed on key',
      detail:
        'An NHS Responder credential unlocks Partition 05 immediately offline—even with zero signal or a flat phone battery—surfacing blood type, severe allergies, next-of-kin, and BSL directives while sealing work and vehicle data.',
      trustBadge: 'NHS Responder Verified · Works Offline',
      retentionMetric: 'Critical care directives surfaced in < 1s',
    },
  },
];

function StopIcon({
  icon,
  isSelected,
}: {
  icon: DailyStop['icon'];
  isSelected: boolean;
}) {
  const cls = isSelected ? 'text-[#0F8B8D]' : 'text-[#64748B]';
  switch (icon) {
    case 'home':
      return <Home size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'office':
      return <Monitor size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'car':
      return <Car size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'hotel':
      return <BedDouble size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'ae':
      return <HeartPulse size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
  }
}

export function WhySyncFailsSection() {
  const [mode, setMode] = useState<ExplorerMode>('without');
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const activeStop = DAILY_STOPS[activeStopIndex] ?? DAILY_STOPS[0];

  return (
    <section
      id="why-sync-fails"
      className="border-b border-[#E2E8F0] bg-[#F8FAFC] py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-medium tracking-[0.04em] text-[#64748B]">
            WHY EXISTING SYNC FAILS
          </p>
          <h2 className="pk-scaled-heading mt-2.5 font-semibold text-balance text-[#0B1E33]">
            Existing sync traps your identity in vendor silos—and exposes your data in the cloud.
          </h2>
          <p className="pk-scaled-small mt-3 text-[#334155]">
            Explore one normal day across five shared environments to see where account-based cloud sync breaks down—and how an offline PersonaKey vault eliminates both daily friction and central cloud exposure.
          </p>
        </div>

        {/* Interactive "One Day, Five Environments" Friction Simulator */}
        <div className="mt-8 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-xs sm:p-6">
          {/* Simulator Header + Mode Switcher */}
          <div className="flex flex-col justify-between gap-4 border-b border-[#E2E8F0] pb-5 lg:flex-row lg:items-center">
            <div>
              <span className="font-mono text-[11px] font-semibold tracking-[0.04em] text-[#64748B]">
                ONE DAY, FIVE ENVIRONMENTS · FRICTION SIMULATOR
              </span>
              <p className="mt-1 text-sm font-medium text-[#0B1E33]">
                Select any daily stop and toggle between legacy cloud sync and PersonaKey.
              </p>
            </div>

            <div
              role="radiogroup"
              aria-label="Friction simulator mode"
              className="grid grid-cols-1 gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1 sm:grid-cols-2"
            >
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'without'}
                onClick={() => setMode('without')}
                className={`pk-focus-ring cursor-pointer rounded-md px-3.5 py-2 text-left text-xs font-semibold transition-colors sm:whitespace-nowrap ${
                  mode === 'without'
                    ? 'border border-[#0B1E33] bg-[#0B1E33] text-[#FFFFFF]'
                    : 'border border-transparent text-[#334155] hover:text-[#0B1E33]'
                }`}
              >
                Without PersonaKey: Cloud &amp; Vendor Lock-In
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'with'}
                onClick={() => setMode('with')}
                className={`pk-focus-ring cursor-pointer rounded-md px-3.5 py-2 text-left text-xs font-semibold transition-colors sm:whitespace-nowrap ${
                  mode === 'with'
                    ? 'border border-[#0F8B8D] bg-[#0F8B8D] text-[#FFFFFF]'
                    : 'border border-transparent text-[#334155] hover:text-[#0B1E33]'
                }`}
              >
                With PersonaKey: Zero-Cloud Hardware Vault
              </button>
            </div>
          </div>

          {/* 5 Daily Stops Timeline + Live Outcome Detail */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
            {/* Left (5 cols): 5 Clickable Daily Stops */}
            <div
              role="tablist"
              aria-label="Five daily environments"
              className="flex flex-col justify-between gap-2.5 lg:col-span-5"
            >
              {DAILY_STOPS.map((stop, index) => {
                const isSelected = activeStopIndex === index;
                return (
                  <button
                    key={stop.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveStopIndex(index)}
                    className={`pk-focus-ring flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? mode === 'with'
                          ? 'border-[#0F8B8D] bg-[#F8FAFC]'
                          : 'border-[#0B1E33] bg-[#F8FAFC]'
                        : 'border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#64748B]'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <StopIcon icon={stop.icon} isSelected={isSelected} />
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-[#0B1E33] tabular-nums">
                          {stop.time} · {stop.location}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold ${
                        mode === 'with'
                          ? isSelected
                            ? 'border-[#0F8B8D] bg-[#FFFFFF] text-[#0B1E33]'
                            : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
                          : isSelected
                            ? 'border-[#0B1E33] bg-[#0B1E33] text-[#FFFFFF]'
                            : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
                      }`}
                    >
                      {mode === 'with' ? stop.shortTagWith : stop.shortTagWithout}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right (7 cols): Animated Scenario Outcome Panel */}
            <div className="flex flex-col lg:col-span-7">
              <div className="flex h-full flex-col justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:p-6">
                <AnimatePresence mode="wait">
                  {mode === 'without' ? (
                    <motion.div
                      key={`without-${activeStop.id}`}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="flex h-full flex-col justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3.5">
                          <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#0B1E33]">
                            <AlertTriangle
                              size={14}
                              className="shrink-0 text-[#D4A338]"
                              aria-hidden="true"
                            />
                            {activeStop.time} · {activeStop.location}
                          </span>
                          <span className="rounded-md border border-[#0B1E33] bg-[#FFFFFF] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#0B1E33]">
                            {activeStop.withoutPersonaKey.exposureBadge}
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-[#0B1E33]">
                          {activeStop.withoutPersonaKey.ecosystemProblem}
                        </h3>

                        <p className="pk-scaled-small mt-3 leading-relaxed text-[#334155]">
                          {activeStop.withoutPersonaKey.detail}
                        </p>
                      </div>

                      <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#E2E8F0] pt-4 sm:grid-cols-2">
                        <div className="rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-3.5">
                          <span className="font-mono text-[10px] font-semibold text-[#64748B]">
                            HUMAN &amp; ACCESSIBILITY IMPACT
                          </span>
                          <p className="mt-1 text-xs font-semibold text-[#0B1E33]">
                            {activeStop.withoutPersonaKey.humanImpact}
                          </p>
                        </div>
                        <div className="rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-3.5">
                          <span className="font-mono text-[10px] font-semibold text-[#64748B]">
                            CLOUD &amp; LOCK-IN OUTCOME
                          </span>
                          <p className="mt-1 text-xs font-semibold text-[#0B1E33]">
                            {activeStop.withoutPersonaKey.frictionMetric}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`with-${activeStop.id}`}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="flex h-full flex-col justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3.5">
                          <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#0B1E33]">
                            <CheckCircle2
                              size={14}
                              className="shrink-0 text-[#0F8B8D]"
                              aria-hidden="true"
                            />
                            {activeStop.time} · {activeStop.location}
                          </span>
                          <span className="rounded-md border border-[#0F8B8D] bg-[#FFFFFF] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#0B1E33]">
                            {activeStop.withPersonaKey.trustBadge}
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-[#0B1E33]">
                          {activeStop.withPersonaKey.partitionUnlocked}
                        </h3>

                        <p className="pk-scaled-small mt-3 leading-relaxed text-[#334155]">
                          {activeStop.withPersonaKey.detail}
                        </p>
                      </div>

                      <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#E2E8F0] pt-4 sm:grid-cols-2">
                        <div className="rounded-md border border-[#0F8B8D] bg-[#FFFFFF] p-3.5">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#0F8B8D]">
                            <Lock size={11} aria-hidden="true" />
                            ISOLATION GUARANTEE
                          </span>
                          <p className="mt-1 text-xs font-semibold text-[#0B1E33]">
                            {activeStop.withPersonaKey.sealedPartitions}
                          </p>
                        </div>
                        <div className="rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-3.5">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#64748B]">
                            <WifiOff size={11} aria-hidden="true" />
                            OFFLINE &amp; RETENTION RESULT
                          </span>
                          <p className="mt-1 text-xs font-semibold text-[#0B1E33]">
                            {activeStop.withPersonaKey.retentionMetric}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3 font-mono text-[11px] text-[#64748B]">
                  <span>
                    {mode === 'without'
                      ? 'Central Cloud Exposure: High · Reconfiguration Friction: Daily'
                      : 'Cloud Accounts Required: 0 · Provider Retention After Exit: 0 Bytes'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#0B1E33]">
                    <ShieldCheck
                      size={13}
                      className={mode === 'with' ? 'text-[#0F8B8D]' : 'text-[#64748B]'}
                      aria-hidden="true"
                    />
                    {mode === 'with' ? 'Zero-Cloud Verified' : 'Legacy Siloed Sync'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
