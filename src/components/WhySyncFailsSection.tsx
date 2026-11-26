import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BedDouble,
  CheckCircle2,
  CloudOff,
  Database,
  HeartPulse,
  KeyRound,
  Lock,
  Monitor,
  Nfc,
  Pause,
  Play,
  Radio,
  ShieldCheck,
  Unlock,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AnimatedBeam } from './ui/animated-beam';

interface FailureIncident {
  id: 'triage' | 'cloud-db' | 'hot-desk' | 'hospitality';
  severityBadge: 'P0' | 'FRICTION';
  streamCode: string;
  incidentQuote: string;
  timestamp: string;
  icon: 'triage' | 'cloud' | 'desk' | 'hotel';
  legacyFailure: {
    title: string;
    systemFault: string;
    exposureMetric: string;
  };
  personaKeyResolution: {
    headline: string;
    receiverCredential: string;
    unlockedPartition: string;
    sealedPartitions: string;
    disclosedPayload: string;
    explanation: string;
    proofMetric: string;
  };
}

const FAILURE_STREAM: FailureIncident[] = [
  {
    id: 'triage',
    severityBadge: 'P0',
    streamCode: 'P0 · HOSPITAL TRIAGE',
    incidentQuote:
      'Patient non-verbal in A&E — severe penicillin allergy & next-of-kin locked behind passcoded smartphone.',
    timestamp: '21:14 GMT',
    icon: 'triage',
    legacyFailure: {
      title: 'Critical Care Blocked by Passcode & Signal Loss',
      systemFault:
        'Cloud medical portals and phone-screen IDs fail when a patient is unconscious, non-verbal, or carrying a flat battery in an A&E dead-zone.',
      exposureMetric: '0 clinical directives accessible offline',
    },
    personaKeyResolution: {
      headline: 'Offline NFC Triage Unlock in 0.6 Seconds',
      receiverCredential: 'NHS_RESPONDER_UK',
      unlockedPartition: 'Partition 05 · Emergency Care Directives',
      sealedPartitions: 'Partitions 01–04 Sealed on Key',
      disclosedPayload:
        'Blood: O-Neg · Allergy: Severe Penicillin · Directive: Non-Verbal / BSL · Next-of-Kin Verified',
      explanation:
        'The paramedic’s signed NHS receiver taps the physical PersonaKey directly over passive NFC—requiring zero battery, zero mobile signal, and zero cloud lookup while keeping workplace and travel partitions sealed.',
      proofMetric: '100% Offline · 0 Bytes Retained After Triage',
    },
  },
  {
    id: 'cloud-db',
    severityBadge: 'P0',
    streamCode: 'CLOUD RISK · CENTRAL DB',
    incidentQuote:
      'Vendor cloud sync breached — 2.4M user workspace and location profiles exposed.',
    timestamp: '18:42 GMT',
    icon: 'cloud',
    legacyFailure: {
      title: 'Centralised Cloud Honeypot Compromised',
      systemFault:
        'Account-based sync aggregates millions of accessibility, workplace, and movement records inside a single vendor database target.',
      exposureMetric: '2.4M central user profiles exposed',
    },
    personaKeyResolution: {
      headline: 'Zero Central Database to Breach or Subpoena',
      receiverCredential: 'LOCAL_SECURE_ELEMENT',
      unlockedPartition: 'User-Held AES-256 Hardware Vault Only',
      sealedPartitions: '0 Central Cloud Copies Exist',
      disclosedPayload:
        'Central Cloud Records: 0 · Sync Servers: Bypassed · Key Custody: 100% Physical Owner',
      explanation:
        'PersonaKey eliminates central preference servers by design. Your five encrypted partitions reside physically inside the key in your pocket and transmit point-to-point only when you tap.',
      proofMetric: '0 Bytes in Cloud · Zero Honeypot Liability',
    },
  },
  {
    id: 'hot-desk',
    severityBadge: 'FRICTION',
    streamCode: 'LOCK-IN · HOT-DESKING',
    incidentQuote:
      'Employee spends 15 mins every morning re-configuring screen zoom, high contrast & desk height across OS.',
    timestamp: '09:04 GMT',
    icon: 'desk',
    legacyFailure: {
      title: '15 Minutes Lost Daily Across OS Silos',
      systemFault:
        'Apple, Windows, and browser sync stay trapped inside incompatible vendor accounts—resetting shared hot-desks to unusable defaults.',
      exposureMetric: '60+ hrs/yr manual setup friction per worker',
    },
    personaKeyResolution: {
      headline: 'Cross-OS Ergonomics Applied in One Tap',
      receiverCredential: 'DESK_04 · WIN11 / MACOS',
      unlockedPartition: 'Partition 01 · Workplace & Display',
      sealedPartitions: 'Partitions 02–05 Sealed on Key',
      disclosedPayload:
        'Zoom: 135% · Theme: High Contrast · Standing Desk Actuator: 108cm · Input: Reduced Motion',
      explanation:
        'Tapping Desk #04 verifies the workplace receiver locally and translates open preference intent onto Windows or macOS in under a second—automatically reverting the terminal when the worker steps away.',
      proofMetric: '< 1s Setup · 0 HR Health Records Stored',
    },
  },
  {
    id: 'hospitality',
    severityBadge: 'FRICTION',
    streamCode: 'GDPR LIABILITY · HOSPITALITY',
    incidentQuote:
      'Hotel chain stores permanent guest room & accessibility profiles across 40+ properties.',
    timestamp: '16:29 GMT',
    icon: 'hotel',
    legacyFailure: {
      title: 'Permanent Special-Category Guest Data Liability',
      systemFault:
        'Retaining sensory, mobility, and room-adaptation notes across 40+ property CRMs creates severe UK GDPR compliance and audit exposure.',
      exposureMetric: '40+ property CRMs holding sensitive profiles',
    },
    personaKeyResolution: {
      headline: 'Ephemeral Suite Personalisation · Zero CRM Storage',
      receiverCredential: 'SUITE_402 · MATTER HUB',
      unlockedPartition: 'Partition 03 · Hospitality & Room',
      sealedPartitions: 'Partitions 01–02 & 04–05 Sealed on Key',
      disclosedPayload:
        'Lighting: 2700K Warm · Climate: 19°C · TV Captions: Enabled · Checkout: Auto-Purge',
      explanation:
        'Guests personalise lighting, climate, and captions locally on arrival without surrendering permanent accessibility profiles to hotel loyalty databases. Check-out wipes the room hub to 0 bytes.',
      proofMetric: '0 Guest Profiles Stored · UK GDPR Minimised',
    },
  },
];

function IncidentIcon({
  icon,
  active,
}: {
  icon: FailureIncident['icon'];
  active: boolean;
}) {
  const cls = active ? 'text-[#FF6B00]' : 'text-[#64748B]';
  switch (icon) {
    case 'triage':
      return <HeartPulse size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'cloud':
      return <Database size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'desk':
      return <Monitor size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'hotel':
      return <BedDouble size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
  }
}

export function WhySyncFailsSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tapSimulated, setTapSimulated] = useState(true);
  const [isStreamHovered, setIsStreamHovered] = useState(false);
  const [isStreamManuallyPaused, setIsStreamManuallyPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const bridgeContainerRef = useRef<HTMLDivElement>(null);
  const keyNodeRef = useRef<HTMLDivElement>(null);
  const receiverNodeRef = useRef<HTMLDivElement>(null);

  const isStreamPaused =
    isStreamHovered || isStreamManuallyPaused || Boolean(shouldReduceMotion);

  // Continuous, pause-on-hover incident stream rotation
  useEffect(() => {
    if (isStreamPaused) return;

    const timer = window.setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % FAILURE_STREAM.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [isStreamPaused]);

  const activeIncident = FAILURE_STREAM[selectedIndex] ?? FAILURE_STREAM[0];

  const handleSelectIncident = (index: number) => {
    setSelectedIndex(index);
    setTapSimulated(true);
  };

  return (
    <section
      id="why-sync-fails"
      className="border-b border-[#E2E8F0] bg-[#F8FAFC] py-14 sm:py-18"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className=" text-xs font-semibold tracking-[0.05em] text-[#FF6B00]">
              FIGHTING FRAGMENTED SYNC &amp; CLOUD RISK
            </p>
            <h2 className="pk-scaled-heading font-display mt-2.5 font-bold text-balance text-[#090D16]">
              Why existing sync fails people—and exposes institutions.
            </h2>
            <p className="pk-scaled-small mt-3 text-[#334155]">
              Inspect real-world cloud breaches, clinical dead-zones, and vendor lock-in on the left—and click any incident to resolve it offline with PersonaKey on the right.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-1.5  text-[11px] font-semibold text-[#090D16]">
            <CloudOff size={13} className="text-[#00A896]" aria-hidden="true" />
            Zero Central Cloud · Offline NFC/BLE Resolution
          </div>
        </div>

        {/* Cloudflare-Inspired 2-Column Split */}
        <div className="mt-9 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* LEFT COLUMN (6 cols): Live Animated "Cloud & Silo Failure Stream" */}
          <div
            className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 sm:p-6 lg:col-span-6"
            onMouseEnter={() => setIsStreamHovered(true)}
            onMouseLeave={() => setIsStreamHovered(false)}
          >
            <div>
              {/* Stream Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    size={15}
                    className="shrink-0 text-[#FF6B00]"
                    aria-hidden="true"
                  />
                  <span className=" text-xs font-semibold tracking-[0.03em] text-[#090D16]">
                    Cloud &amp; Silo Failure Stream
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className=" text-[11px] text-[#64748B] tabular-nums">
                    {isStreamPaused ? 'Paused' : 'Live Feed'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsStreamManuallyPaused((prev) => !prev)}
                    aria-pressed={isStreamManuallyPaused}
                    className="pk-focus-ring inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1  text-[11px] font-medium text-[#090D16] transition-colors hover:border-[#090D16] whitespace-nowrap shrink-0"
                  >
                    {isStreamPaused ? (
                      <>
                        <Play size={11} aria-hidden="true" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause size={11} aria-hidden="true" />
                        Pause
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Continuous Stream Progress Track */}
              <div
                className="mt-3 h-0.5 w-full overflow-hidden rounded-xs bg-[#E2E8F0]"
                aria-hidden="true"
              >
                {!isStreamPaused ? (
                  <motion.div
                    key={`progress-${selectedIndex}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 4.2, ease: 'linear' }}
                    className="h-full origin-left bg-[#FF6B00]"
                  />
                ) : (
                  <div className="h-full w-1/3 bg-[#64748B]" />
                )}
              </div>

              {/* 4 Animated Incident Cards */}
              <div
                role="listbox"
                aria-label="Cloud and silo failure incidents"
                className="mt-4 space-y-3"
              >
                {FAILURE_STREAM.map((incident, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <motion.button
                      key={incident.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      layout={!shouldReduceMotion}
                      onClick={() => handleSelectIncident(index)}
                      className={`group pk-focus-ring pk-card-hover-orange w-full cursor-pointer rounded-lg border p-4 text-left ${
                        isSelected
                          ? 'border-[#FF6B00] bg-[#F8FAFC]'
                          : 'border-[#E2E8F0] bg-[#FFFFFF]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-sm bg-[#FF6B00] px-2 py-0.5  text-[10px] font-semibold text-[#FFFFFF] whitespace-nowrap shrink-0">
                            {incident.severityBadge}
                          </span>
                          <span className=" text-[11px] font-semibold text-[#090D16]">
                            {incident.streamCode}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className=" text-[11px] text-[#64748B] tabular-nums">
                            {incident.timestamp}
                          </span>
                          <IncidentIcon icon={incident.icon} active={isSelected} />
                        </div>
                      </div>

                      <p className="mt-2.5 text-sm leading-relaxed font-medium text-[#090D16]">
                        &ldquo;{incident.incidentQuote}&rdquo;
                      </p>

                      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#E2E8F0] pt-2  text-[11px]">
                        <span className="text-[#64748B]">
                          {incident.legacyFailure.exposureMetric}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${
                            isSelected ? 'text-[#00A896]' : 'text-[#090D16]'
                          }`}
                        >
                          <span>
                            {isSelected && tapSimulated
                              ? 'Resolved on Right'
                              : 'Resolve with PersonaKey'}
                          </span>
                          <span className="pk-cta-arrow" aria-hidden="true">
                            <ArrowRight size={12} />
                          </span>
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3  text-[11px] text-[#64748B]">
              <span>Hover stream to pause · Click any incident to inspect</span>
              <span className="font-semibold text-[#090D16] tabular-nums">
                Incident 0{selectedIndex + 1} / 0{FAILURE_STREAM.length}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN (6 cols): Interactive "Switch to PersonaKey Zero-Cloud Vault" Panel */}
          <div className="flex flex-col justify-between rounded-lg border border-[#1E293B] bg-[#090D16] p-5 text-[#FFFFFF] sm:p-6 lg:col-span-6">
            <div>
              {/* Right Panel Top Bar + Simulate PersonaKey Tap Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
                <div>
                  <span className=" text-[11px] font-semibold tracking-[0.04em] text-[#00A896]">
                    SWITCH TO PERSONAKEY ZERO-CLOUD VAULT
                  </span>
                  <h3 className="font-display mt-1 text-base font-bold text-[#FFFFFF]">
                    {activeIncident.streamCode}
                  </h3>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={tapSimulated}
                  onClick={() => setTapSimulated((prev) => !prev)}
                  className={`group pk-focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border px-3.5 py-2  text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    tapSimulated
                      ? 'border-[#00A896] bg-[#00A896] text-[#FFFFFF] hover:border-[#FF6B00] hover:bg-[#FF6B00]'
                      : 'border-[#FF6B00] bg-[#FF6B00] text-[#FFFFFF] hover:border-[#00A896] hover:bg-[#00A896]'
                  }`}
                >
                  <Nfc size={14} strokeWidth={2.25} aria-hidden="true" />
                  <span>
                    {tapSimulated
                      ? 'Simulate PersonaKey Tap: ON'
                      : 'Simulate PersonaKey Tap'}
                  </span>
                </button>
              </div>

              {/* Offline NFC/BLE AnimatedBeam Bridge vs Bypassed Cloud */}
              <div
                ref={bridgeContainerRef}
                className="relative mt-4 rounded-lg border border-[#1E293B] bg-[#090D16] p-4"
              >
                <AnimatedBeam
                  containerRef={bridgeContainerRef}
                  fromRef={keyNodeRef}
                  toRef={receiverNodeRef}
                  curvature={0}
                  active={tapSimulated}
                  pathColor="#1E293B"
                  pathWidth={1.75}
                  gradientStartColor="#00A896"
                  gradientStopColor="#FF6B00"
                  duration={1.8}
                />

                <div className="relative z-10 flex items-center justify-between gap-3">
                  {/* Physical PersonaKey Node */}
                  <div
                    ref={keyNodeRef}
                    className={`flex items-center gap-2 rounded-md border bg-[#090D16] px-3 py-2  text-[11px] font-semibold ${
                      tapSimulated
                        ? 'border-[#FF6B00] text-[#FFFFFF]'
                        : 'border-[#1E293B] text-[#94A3B8]'
                    }`}
                  >
                    <KeyRound
                      size={13}
                      className={tapSimulated ? 'text-[#FF6B00]' : 'text-[#94A3B8]'}
                      aria-hidden="true"
                    />
                    <span>PersonaKey Vault</span>
                  </div>

                  {/* Middle Status Badge */}
                  <span
                    className={`rounded-md border bg-[#090D16] px-2.5 py-1  text-[10px] font-semibold ${
                      tapSimulated
                        ? 'border-[#00A896] text-[#00A896]'
                        : 'border-[#FF6B00] text-[#FF6B00]'
                    }`}
                  >
                    {tapSimulated ? 'OFFLINE NFC/BLE' : 'CLOUD BLOCKED'}
                  </span>

                  {/* Local Receiver Node */}
                  <div
                    ref={receiverNodeRef}
                    className={`flex items-center gap-2 rounded-md border bg-[#090D16] px-3 py-2  text-[11px] font-semibold ${
                      tapSimulated
                        ? 'border-[#00A896] text-[#FFFFFF]'
                        : 'border-[#1E293B] text-[#94A3B8]'
                    }`}
                  >
                    <Radio
                      size={13}
                      className={tapSimulated ? 'text-[#00A896]' : 'text-[#94A3B8]'}
                      aria-hidden="true"
                    />
                    <span className="max-w-[130px] truncate sm:max-w-none">
                      {activeIncident.personaKeyResolution.receiverCredential}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#1E293B] pt-2.5  text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-[#CBD5E1]">
                    <CloudOff size={12} className="text-[#00A896]" aria-hidden="true" />
                    Central Cloud Servers: BYPASSED (0 Bytes)
                  </span>
                  <span className="text-[#94A3B8]">100% Local Hardware Link</span>
                </div>
              </div>

              {/* Animated Resolution vs Legacy Failure Detail */}
              <AnimatePresence mode="wait">
                {tapSimulated ? (
                  <motion.div
                    key={`resolved-${activeIncident.id}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-4 space-y-3.5"
                  >
                    <div className="rounded-lg border border-[#00A896] bg-[#090D16] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5  text-xs font-semibold text-[#00A896]">
                          <CheckCircle2 size={14} aria-hidden="true" />
                          SCENARIO RESOLVED OFFLINE
                        </span>
                        <span className=" text-[11px] font-semibold text-[#FFFFFF]">
                          {activeIncident.personaKeyResolution.proofMetric}
                        </span>
                      </div>

                      <h4 className="font-display mt-2.5 text-lg font-bold tracking-[-0.02em] text-[#FFFFFF]">
                        {activeIncident.personaKeyResolution.headline}
                      </h4>

                      <p className="pk-scaled-small mt-2 leading-relaxed text-[#CBD5E1]">
                        {activeIncident.personaKeyResolution.explanation}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-md border border-[#00A896] bg-[#090D16] p-3.5">
                        <span className="inline-flex items-center gap-1.5  text-[10px] font-semibold text-[#00A896]">
                          <Unlock size={12} aria-hidden="true" />
                          AUTHORISED PARTITION UNLOCKED
                        </span>
                        <p className="mt-1.5 text-xs font-semibold text-[#FFFFFF]">
                          {activeIncident.personaKeyResolution.unlockedPartition}
                        </p>
                      </div>

                      <div className="rounded-md border border-[#1E293B] bg-[#090D16] p-3.5">
                        <span className="inline-flex items-center gap-1.5  text-[10px] font-semibold text-[#FF6B00]">
                          <Lock size={12} aria-hidden="true" />
                          ISOLATION GUARANTEE
                        </span>
                        <p className="mt-1.5 text-xs font-semibold text-[#FFFFFF]">
                          {activeIncident.personaKeyResolution.sealedPartitions}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-md border border-[#1E293B] bg-[#090D16] px-3.5 py-2.5  text-xs text-[#CBD5E1]">
                      <span className="font-semibold text-[#00A896]">Disclosed Locally: </span>
                      {activeIncident.personaKeyResolution.disclosedPayload}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`unmitigated-${activeIncident.id}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-4 space-y-3.5"
                  >
                    <div className="rounded-lg border border-[#FF6B00] bg-[#090D16] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5  text-xs font-semibold text-[#FF6B00]">
                          <AlertTriangle size={14} aria-hidden="true" />
                          WITHOUT PERSONAKEY · ACTIVE FAILURE
                        </span>
                        <span className=" text-[11px] font-semibold text-[#FFFFFF]">
                          {activeIncident.legacyFailure.exposureMetric}
                        </span>
                      </div>

                      <h4 className="font-display mt-2.5 text-lg font-bold tracking-[-0.02em] text-[#FFFFFF]">
                        {activeIncident.legacyFailure.title}
                      </h4>

                      <p className="pk-scaled-small mt-2 leading-relaxed text-[#CBD5E1]">
                        {activeIncident.legacyFailure.systemFault}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#1E293B] bg-[#090D16] p-4">
                      <p className="text-xs text-[#CBD5E1]">
                        Toggle <strong className="text-[#FFFFFF]">Simulate PersonaKey Tap</strong> to resolve this incident via the offline hardware vault.
                      </p>
                      <button
                        type="button"
                        onClick={() => setTapSimulated(true)}
                        className="group pk-focus-ring inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#FF6B00] px-3.5 py-2  text-xs font-semibold text-[#FFFFFF] transition-colors hover:bg-[#00A896] whitespace-nowrap shrink-0"
                      >
                        <span>Resolve Scenario Now</span>
                        <span className="pk-cta-arrow" aria-hidden="true">
                          <ArrowRight size={13} />
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Verification Strip */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#1E293B] pt-3  text-[11px] text-[#CBD5E1]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#00A896]" aria-hidden="true" />
                On-Device Encrypted Vault · Selective Disclosure
              </span>
              <span className="text-[#00A896] font-semibold">
                Zero Third-Party Data Retention (0 Bytes Retained)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
