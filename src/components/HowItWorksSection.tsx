import { useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  KeyRound,
  Lock,
  Radio,
  RotateCcw,
  ShieldCheck,
  Unlock,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AnimatedBeam } from './ui/animated-beam';

type ReceiverCredentialId = 'NHS_RESPONDER_UK' | 'DESK_04' | 'CABIN_EV';

interface HandshakeStage {
  index: string;
  label: string;
  title: string;
  description: string;
  metricBadge: string;
  icon: 'vault' | 'certificate' | 'unlock' | 'purge';
}

interface CredentialPreset {
  id: ReceiverCredentialId;
  venueLabel: string;
  authorisedPartitionIndex: number;
  authorisedPartitionName: string;
  translatedControls: string;
  sealedSummary: string;
}

const HANDSHAKE_STAGES: HandshakeStage[] = [
  {
    index: '01',
    label: '01 · On-Key Encrypted Vault',
    title: 'On-Key Encrypted Vault',
    description:
      '5 isolated partitions stored physically inside the PersonaKey secure element (0 Bytes in Cloud).',
    metricBadge: '0 Bytes in Cloud',
    icon: 'vault',
  },
  {
    index: '02',
    label: '02 · Receiver Role Certificate',
    title: 'Receiver Role Certificate',
    description:
      'Provider receiver broadcasts a signed cryptographic credential (NHS_RESPONDER_UK, DESK_04, CABIN_EV).',
    metricBadge: 'Ed25519 Role Signed',
    icon: 'certificate',
  },
  {
    index: '03',
    label: '03 · Single-Partition Unlock',
    title: 'Single-Partition Unlock',
    description:
      'Key verifies role and transmits only the matching partition via local NFC/BLE while sealing the other 4.',
    metricBadge: '1 Unlocked · 4 Sealed',
    icon: 'unlock',
  },
  {
    index: '04',
    label: '04 · Zero-Trace Auto-Purge',
    title: 'Zero-Trace Auto-Purge',
    description:
      'Stepping away wipes the receiver immediately (0 Bytes Retained).',
    metricBadge: '0 Bytes Retained',
    icon: 'purge',
  },
];

const PARTITIONS = [
  { num: '01', name: 'Workplace & Display' },
  { num: '02', name: 'Mobility & EV' },
  { num: '03', name: 'Hospitality & Room' },
  { num: '04', name: 'Public Accessibility' },
  { num: '05', name: 'Emergency Directives' },
] as const;

const CREDENTIAL_PRESETS: Record<ReceiverCredentialId, CredentialPreset> = {
  NHS_RESPONDER_UK: {
    id: 'NHS_RESPONDER_UK',
    venueLabel: 'NHS Emergency Triage Tablet',
    authorisedPartitionIndex: 4,
    authorisedPartitionName: '05 · Emergency Directives',
    translatedControls:
      'Blood Group: O-Negative · Allergies: Severe Penicillin · Directive: Non-Verbal / BSL · Next-of-Kin',
    sealedSummary:
      'Partitions 01–04 (Workplace, Mobility, Hospitality, Public Kiosks) remain cryptographically sealed inside the key.',
  },
  DESK_04: {
    id: 'DESK_04',
    venueLabel: 'Shared Enterprise Hot-Desk #04',
    authorisedPartitionIndex: 0,
    authorisedPartitionName: '01 · Workplace & Display',
    translatedControls:
      'OS Text Zoom: 135% · Display Theme: High Contrast · Motorised Standing Desk: 108cm',
    sealedSummary:
      'Partitions 02–05 (Mobility, Hospitality, Public Kiosks, Emergency Directives) remain cryptographically sealed inside the key.',
  },
  CABIN_EV: {
    id: 'CABIN_EV',
    venueLabel: 'Shared Fleet EV Cabin Receiver',
    authorisedPartitionIndex: 1,
    authorisedPartitionName: '02 · Mobility & EV',
    translatedControls:
      'Seat Posture: Lumbar +2 & Mirror Set B · Cabin Climate: 20°C · Regen Braking: High One-Pedal',
    sealedSummary:
      'Partitions 01 & 03–05 (Workplace, Hospitality, Public Kiosks, Emergency Directives) remain cryptographically sealed inside the key.',
  },
};

function StageIcon({
  icon,
  isActive,
}: {
  icon: HandshakeStage['icon'];
  isActive: boolean;
}) {
  const cls = isActive ? 'text-[#00A896]' : 'text-[#64748B]';
  switch (icon) {
    case 'vault':
      return <KeyRound size={16} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'certificate':
      return <BadgeCheck size={16} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'unlock':
      return <Unlock size={16} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'purge':
      return <RotateCcw size={16} className={`shrink-0 ${cls}`} aria-hidden="true" />;
  }
}

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState<number>(2);
  const [credentialId, setCredentialId] =
    useState<ReceiverCredentialId>('NHS_RESPONDER_UK');
  const shouldReduceMotion = useReducedMotion();

  const stepperContainerRef = useRef<HTMLDivElement>(null);
  const step0Ref = useRef<HTMLButtonElement>(null);
  const step1Ref = useRef<HTMLButtonElement>(null);
  const step2Ref = useRef<HTMLButtonElement>(null);
  const step3Ref = useRef<HTMLButtonElement>(null);

  const liveBridgeRef = useRef<HTMLDivElement>(null);
  const liveKeyRef = useRef<HTMLDivElement>(null);
  const liveReceiverRef = useRef<HTMLDivElement>(null);

  const stepRefs = [step0Ref, step1Ref, step2Ref, step3Ref];
  const currentStage = HANDSHAKE_STAGES[activeStep] ?? HANDSHAKE_STAGES[0];
  const activePreset = CREDENTIAL_PRESETS[credentialId];

  const handleAdvanceStep = () => {
    setActiveStep((prev) => (prev + 1) % HANDSHAKE_STAGES.length);
  };

  return (
    <section
      id="how-it-works"
      className="border-b border-[#E2E8F0] bg-[#FFFFFF] py-14 sm:py-18"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold tracking-[0.05em] text-[#00A896]">
              HOW PERSONAKEY WORKS · 4-STAGE CRYPTOGRAPHIC HANDSHAKE
            </p>
            <h2 className="pk-scaled-heading font-display mt-2.5 font-bold text-balance text-[#090D16]">
              Hardware-anchored selective disclosure in four deterministic steps.
            </h2>
            <p className="pk-scaled-small mt-3 text-[#334155]">
              Select any stage in the horizontal handshake below—or switch receiver credentials—to inspect how PersonaKey verifies roles offline and seals unrelated partitions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdvanceStep}
            className="group pk-focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#090D16] bg-[#090D16] px-4 py-2 font-mono text-xs font-semibold text-[#FFFFFF] transition-colors hover:border-[#00A896] hover:bg-[#00A896] whitespace-nowrap shrink-0"
          >
            <span>Next Handshake Step (0{((activeStep + 1) % 4) + 1}/04)</span>
            <span className="pk-cta-arrow" aria-hidden="true">
              <ArrowRight size={13} />
            </span>
          </button>
        </div>

        {/* Horizontal 4-Stage Interactive Stepper Connected by AnimatedBeam Paths */}
        <div ref={stepperContainerRef} className="relative mt-10">
          <AnimatedBeam
            containerRef={stepperContainerRef}
            fromRef={step0Ref}
            toRef={step1Ref}
            curvature={0}
            active={activeStep >= 1}
            pathColor="#E2E8F0"
            pathWidth={2}
            pathOpacity={1}
            gradientStartColor="#00A896"
            gradientStopColor="#FF6B00"
            duration={2}
          />
          <AnimatedBeam
            containerRef={stepperContainerRef}
            fromRef={step1Ref}
            toRef={step2Ref}
            curvature={0}
            active={activeStep >= 2}
            pathColor="#E2E8F0"
            pathWidth={2}
            pathOpacity={1}
            gradientStartColor="#00A896"
            gradientStopColor="#FF6B00"
            duration={2}
          />
          <AnimatedBeam
            containerRef={stepperContainerRef}
            fromRef={step2Ref}
            toRef={step3Ref}
            curvature={0}
            active={activeStep === 3}
            pathColor="#E2E8F0"
            pathWidth={2}
            pathOpacity={1}
            gradientStartColor="#FF6B00"
            gradientStopColor="#00A896"
            duration={2}
          />

          <div
            role="tablist"
            aria-label="Four deterministic handshake steps"
            className="relative z-10 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6"
          >
            {HANDSHAKE_STAGES.map((stage, index) => {
              const isSelected = activeStep === index;
              const isReached = index <= activeStep;

              return (
                <button
                  key={stage.index}
                  ref={stepRefs[index]}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveStep(index)}
                  className={`pk-focus-ring pk-card-hover flex h-full cursor-pointer flex-col justify-between rounded-lg border p-5 text-left ${
                    isSelected
                      ? 'border-[#00A896] bg-[#FFFFFF]'
                      : isReached
                        ? 'border-[#090D16] bg-[#FFFFFF]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                      <span
                        className={`rounded-sm px-2 py-0.5 font-mono text-xs font-semibold tabular-nums ${
                          isSelected
                            ? 'bg-[#00A896] text-[#FFFFFF]'
                            : isReached
                              ? 'bg-[#090D16] text-[#FFFFFF]'
                              : 'bg-[#E2E8F0] text-[#090D16]'
                        }`}
                      >
                        {stage.index}
                      </span>
                      <StageIcon icon={stage.icon} isActive={isSelected} />
                    </div>

                    <h3 className="font-display mt-4 text-base font-bold tracking-[-0.02em] text-[#090D16]">
                      {stage.label}
                    </h3>

                    <p className="pk-scaled-small mt-2 leading-relaxed text-[#334155]">
                      {stage.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3">
                    <span
                      className={`font-mono text-[11px] font-semibold ${
                        isSelected ? 'text-[#00A896]' : 'text-[#090D16]'
                      }`}
                    >
                      {stage.metricBadge}
                    </span>
                    <span className="font-mono text-[10px] text-[#64748B]">
                      {isSelected ? 'ACTIVE' : 'INSPECT'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Deterministic Handshake Live Telemetry & Role Certificate Simulator */}
        <div className="mt-7 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:p-6">
          {/* Top Control Strip: Active Step + Receiver Credential Selector */}
          <div className="flex flex-col justify-between gap-4 border-b border-[#E2E8F0] pb-4 lg:flex-row lg:items-center">
            <div>
              <span className="font-mono text-[11px] font-semibold tracking-[0.04em] text-[#00A896]">
                STEP {currentStage.index} DETERMINISTIC VERIFICATION
              </span>
              <h3 className="font-display mt-0.5 text-base font-bold text-[#090D16]">
                {currentStage.title} — {activePreset.venueLabel}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-medium text-[#64748B]">
                Receiver Credential:
              </span>
              <div
                role="radiogroup"
                aria-label="Select provider receiver role certificate"
                className="flex flex-wrap items-center gap-1 rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-1"
              >
                {(
                  ['NHS_RESPONDER_UK', 'DESK_04', 'CABIN_EV'] as ReceiverCredentialId[]
                ).map((role) => {
                  const isRoleActive = credentialId === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      role="radio"
                      aria-checked={isRoleActive}
                      onClick={() => setCredentialId(role)}
                      className={`pk-focus-ring cursor-pointer rounded-sm px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        isRoleActive
                          ? 'bg-[#090D16] text-[#FFFFFF]'
                          : 'text-[#64748B] hover:text-[#090D16]'
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Hardware-to-Receiver AnimatedBeam Bridge */}
          <div
            ref={liveBridgeRef}
            className="relative mt-4 rounded-lg border border-[#1E293B] bg-[#090D16] px-4 py-3.5 text-[#FFFFFF]"
          >
            <AnimatedBeam
              containerRef={liveBridgeRef}
              fromRef={liveKeyRef}
              toRef={liveReceiverRef}
              curvature={0}
              active={activeStep === 1 || activeStep === 2}
              reverse={activeStep === 1}
              pathColor="#1E293B"
              pathWidth={1.75}
              gradientStartColor={activeStep === 1 ? '#FF6B00' : '#00A896'}
              gradientStopColor={activeStep === 1 ? '#00A896' : '#FF6B00'}
              duration={1.7}
            />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div
                ref={liveKeyRef}
                className="inline-flex items-center gap-2 rounded-md border border-[#1E293B] bg-[#090D16] px-3 py-1.5 font-mono text-xs font-semibold text-[#FFFFFF]"
              >
                <KeyRound size={13} className="text-[#FF6B00]" aria-hidden="true" />
                <span>PersonaKey Secure Element</span>
              </div>

              <span className="rounded-md border border-[#1E293B] bg-[#090D16] px-3 py-1 font-mono text-[11px] font-semibold text-[#00A896]">
                {activeStep === 0 && 'ALL 5 PARTITIONS SEALED · 0 BYTES IN CLOUD'}
                {activeStep === 1 && `VERIFYING ROLE CERT ← ${credentialId}`}
                {activeStep === 2 &&
                  `TRANSMITTING ${activePreset.authorisedPartitionName.toUpperCase()} ONLY`}
                {activeStep === 3 && 'LINK CLOSED · RECEIVER WIPED TO 0 BYTES'}
              </span>

              <div
                ref={liveReceiverRef}
                className="inline-flex items-center gap-2 rounded-md border border-[#1E293B] bg-[#090D16] px-3 py-1.5 font-mono text-xs font-semibold text-[#FFFFFF]"
              >
                <Radio size={13} className="text-[#00A896]" aria-hidden="true" />
                <span>{credentialId}</span>
              </div>
            </div>
          </div>

          {/* 5-Partition Isolation Map + Active Stage Detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeStep}-${credentialId}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -5 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 space-y-4"
            >
              {/* 5 Isolated Partitions Bar */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
                {PARTITIONS.map((partition, idx) => {
                  const isTarget = idx === activePreset.authorisedPartitionIndex;
                  const isUnlockedNow = activeStep === 2 && isTarget;
                  const isScopedNext = activeStep === 1 && isTarget;

                  return (
                    <div
                      key={partition.num}
                      className={`rounded-md border p-3 transition-colors ${
                        isUnlockedNow
                          ? 'border-[#00A896] bg-[#FFFFFF]'
                          : isScopedNext
                            ? 'border-[#FF6B00] bg-[#FFFFFF]'
                            : 'border-[#E2E8F0] bg-[#FFFFFF]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-semibold text-[#090D16] tabular-nums">
                          Partition {partition.num}
                        </span>
                        {isUnlockedNow ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-[#00A896]">
                            <Unlock size={11} aria-hidden="true" />
                            UNLOCKED
                          </span>
                        ) : isScopedNext ? (
                          <span className="font-mono text-[10px] font-semibold text-[#FF6B00]">
                            REQUESTED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-[#64748B]">
                            <Lock size={11} aria-hidden="true" />
                            SEALED
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs font-semibold text-[#090D16]">
                        {partition.name}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Stage-Specific Deterministic Proof Row */}
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                <div className="rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-4 lg:col-span-7">
                  <span className="font-mono text-[10px] font-semibold text-[#64748B]">
                    {activeStep === 0 && 'HARDWARE CUSTODY STATE'}
                    {activeStep === 1 && 'SIGNED RECEIVER ROLE CERTIFICATE'}
                    {activeStep === 2 && 'LOCALLY TRANSLATED HARDWARE PAYLOAD'}
                    {activeStep === 3 && 'DETERMINISTIC DEPARTURE WIPE'}
                  </span>
                  <p className="mt-1.5 text-sm font-semibold text-[#090D16]">
                    {activeStep === 0 &&
                      'All 5 preference partitions remain AES-256 encrypted inside the physical PersonaKey secure element with zero cloud replication.'}
                    {activeStep === 1 &&
                      `${credentialId} presents a signed Ed25519 role certificate requesting access strictly to ${activePreset.authorisedPartitionName}.`}
                    {activeStep === 2 && activePreset.translatedControls}
                    {activeStep === 3 &&
                      `Stepping away from ${credentialId} immediately purges temporary session memory and restores neutral terminal defaults.`}
                  </p>
                </div>

                <div className="flex flex-col justify-between rounded-md border border-[#00A896] bg-[#FFFFFF] p-4 lg:col-span-5">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#00A896]">
                    <ShieldCheck size={12} aria-hidden="true" />
                    CRYPTOGRAPHIC GUARANTEE
                  </span>
                  <p className="mt-1.5 text-xs leading-relaxed font-medium text-[#334155]">
                    {activeStep === 3 ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#090D16]">
                        <CheckCircle2
                          size={13}
                          className="shrink-0 text-[#00A896]"
                          aria-hidden="true"
                        />
                        0 Bytes Retained on {credentialId} · All 5 Partitions Re-Sealed
                      </span>
                    ) : (
                      activePreset.sealedSummary
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
