import { useRef, useState } from 'react';
import {
  BadgeCheck,
  Cpu,
  KeyRound,
  Lock,
  RotateCcw,
  ShieldCheck,
  Unlock,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AnimatedBeam } from './ui/animated-beam';
import { BorderBeam } from './ui/border-beam';

interface HandshakeStage {
  number: string;
  title: string;
  summary: string;
  mechanismLabel: string;
  badgeText: string;
  icon: 'vault' | 'certificate' | 'unlock' | 'purge';
}

const HANDSHAKE_STAGES: HandshakeStage[] = [
  {
    number: '01',
    title: 'On-Key Encrypted Vault (Zero Cloud)',
    summary:
      'Five isolated partitions stored inside the key’s secure element; never uploaded to a central cloud.',
    mechanismLabel: 'HARDWARE SECURE ELEMENT · AES-256 ISOLATION',
    badgeText: 'Zero Cloud Upload',
    icon: 'vault',
  },
  {
    number: '02',
    title: 'Receiver Role Certificate',
    summary:
      'The service provider’s receiver broadcasts a signed credential proving its identity (e.g., NHS_RESPONDER_UK or WORKPLACE_DESK_04).',
    mechanismLabel: 'CRYPTOGRAPHIC ROLE PROOF · SIGNED CREDENTIAL',
    badgeText: 'Role Verified',
    icon: 'certificate',
  },
  {
    number: '03',
    title: 'Selective Partition Unlock & Translation',
    summary:
      'The key unlocks only the matching partition and translates abstract intent into local OS/hardware commands while sealing the other 4 partitions.',
    mechanismLabel: 'SINGLE-PARTITION TRANSLATION ENGINE',
    badgeText: '4 Partitions Sealed',
    icon: 'unlock',
  },
  {
    number: '04',
    title: 'Zero-Trace Auto-Purge',
    summary:
      'Stepping away wipes the receiver immediately (0 Bytes Retained on Provider Hardware).',
    mechanismLabel: 'DETERMINISTIC BASELINE RESTORATION',
    badgeText: '0 Bytes Retained',
    icon: 'purge',
  },
];

function StageIcon({
  icon,
  isActive,
}: {
  icon: HandshakeStage['icon'];
  isActive: boolean;
}) {
  const cls = isActive ? 'text-[#0F8B8D]' : 'text-[#64748B]';
  switch (icon) {
    case 'vault':
      return <KeyRound size={16} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'certificate':
      return <BadgeCheck size={16} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'unlock':
      return <Cpu size={16} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'purge':
      return <RotateCcw size={16} className={`shrink-0 ${cls}`} aria-hidden="true" />;
  }
}

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [sampleRole, setSampleRole] = useState<'NHS_RESPONDER_UK' | 'WORKPLACE_DESK_04'>(
    'NHS_RESPONDER_UK'
  );
  const shouldReduceMotion = useReducedMotion();

  const flowRef = useRef<HTMLDivElement>(null);
  const step0Ref = useRef<HTMLButtonElement>(null);
  const step1Ref = useRef<HTMLButtonElement>(null);
  const step2Ref = useRef<HTMLButtonElement>(null);
  const step3Ref = useRef<HTMLButtonElement>(null);

  const stepRefs = [step0Ref, step1Ref, step2Ref, step3Ref];
  const currentStage = HANDSHAKE_STAGES[activeStep] ?? HANDSHAKE_STAGES[0];

  return (
    <section
      id="how-it-works"
      className="border-b border-[#E2E8F0] bg-[#FFFFFF] py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-medium tracking-[0.04em] text-[#64748B]">
              HOW PERSONAKEY WORKS · 4-STAGE CRYPTOGRAPHIC HANDSHAKE
            </p>
            <h2 className="pk-scaled-heading mt-2.5 font-semibold text-balance text-[#0B1E33]">
              How PersonaKey solves it: Hardware-anchored selective disclosure.
            </h2>
            <p className="pk-scaled-small mt-2.5 text-[#334155]">
              Click any stage in the handshake pipeline below to inspect how the physical key verifies a receiver and releases only the permitted partition.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 font-mono text-[11px] font-medium text-[#0B1E33]">
            <ShieldCheck size={13} className="text-[#0F8B8D]" aria-hidden="true" />
            0 Bytes Retained on Provider Hardware
          </span>
        </div>

        {/* 4-Stage Connected Visual Flow */}
        <div ref={flowRef} className="relative mt-10">
          {/* AnimatedBeam SVG Connections Between Adjacent Stages */}
          <AnimatedBeam
            containerRef={flowRef}
            fromRef={step0Ref}
            toRef={step1Ref}
            curvature={0}
            active={activeStep === 0 || activeStep === 1}
            pathColor="#E2E8F0"
            pathWidth={1.5}
            pathOpacity={0.9}
            gradientStartColor="#0F8B8D"
            gradientStopColor="#D4A338"
            duration={2}
          />
          <AnimatedBeam
            containerRef={flowRef}
            fromRef={step1Ref}
            toRef={step2Ref}
            curvature={0}
            active={activeStep === 1 || activeStep === 2}
            pathColor="#E2E8F0"
            pathWidth={1.5}
            pathOpacity={0.9}
            gradientStartColor="#0F8B8D"
            gradientStopColor="#D4A338"
            duration={2}
          />
          <AnimatedBeam
            containerRef={flowRef}
            fromRef={step2Ref}
            toRef={step3Ref}
            curvature={0}
            active={activeStep === 2 || activeStep === 3}
            pathColor="#E2E8F0"
            pathWidth={1.5}
            pathOpacity={0.9}
            gradientStartColor="#0F8B8D"
            gradientStopColor="#D4A338"
            duration={2}
          />

          <div
            role="tablist"
            aria-label="4-Stage Cryptographic Handshake"
            className="relative z-10 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-5"
          >
            {HANDSHAKE_STAGES.map((stage, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  key={stage.number}
                  ref={stepRefs[index]}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveStep(index)}
                  className={`pk-focus-ring relative flex h-full cursor-pointer flex-col justify-between rounded-lg border p-5 text-left transition-colors ${
                    isActive
                      ? 'border-[#0F8B8D] bg-[#FFFFFF] shadow-xs'
                      : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#0B1E33]'
                  }`}
                >
                  {isActive && (
                    <BorderBeam
                      size={64}
                      duration={4.5}
                      borderWidth={1}
                      colorFrom="#0F8B8D"
                      colorTo="#D4A338"
                    />
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                      <span className="font-mono text-xs font-semibold text-[#0B1E33] tabular-nums">
                        {stage.number}
                      </span>
                      <StageIcon icon={stage.icon} isActive={isActive} />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold tracking-[-0.01em] text-[#0B1E33]">
                      {stage.title}
                    </h3>

                    <p className="pk-scaled-small mt-2 text-[#334155]">
                      {stage.summary}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[#E2E8F0] pt-3">
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold ${
                        isActive
                          ? 'border-[#0F8B8D] bg-[#F8FAFC] text-[#0B1E33]'
                          : 'border-[#E2E8F0] bg-[#FFFFFF] text-[#64748B]'
                      }`}
                    >
                      {stage.badgeText}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Stage Mechanism Inspector */}
        <div className="mt-6 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-xs sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3.5">
            <div>
              <span className="font-mono text-[11px] font-semibold tracking-[0.04em] text-[#0F8B8D]">
                STAGE {currentStage.number} · {currentStage.mechanismLabel}
              </span>
              <h3 className="mt-0.5 text-base font-semibold text-[#0B1E33]">
                {currentStage.title}
              </h3>
            </div>

            {activeStep >= 1 && activeStep <= 2 && (
              <div
                role="radiogroup"
                aria-label="Inspect receiver credential example"
                className="flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-1"
              >
                {(['NHS_RESPONDER_UK', 'WORKPLACE_DESK_04'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    role="radio"
                    aria-checked={sampleRole === role}
                    onClick={() => setSampleRole(role)}
                    className={`pk-focus-ring cursor-pointer rounded-sm px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
                      sampleRole === role
                        ? 'bg-[#0B1E33] text-[#FFFFFF]'
                        : 'text-[#64748B] hover:text-[#0B1E33]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeStep}-${sampleRole}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -5 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4"
            >
              {activeStep === 0 && (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
                  {[
                    '01 · Workplace & Display',
                    '02 · Mobility & Vehicle',
                    '03 · Hospitality & Room',
                    '04 · Public Accessibility',
                    '05 · Emergency Directives',
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Lock size={12} className="text-[#D4A338]" aria-hidden="true" />
                        <span className="font-mono text-[10px] font-semibold text-[#64748B]">
                          SEALED
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-xs font-semibold text-[#0B1E33]">
                        {item}
                      </p>
                      <p className="mt-1 text-[11px] text-[#64748B]">
                        Encrypted in hardware secure element
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeStep === 1 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-4">
                    <span className="font-mono text-[10px] font-semibold text-[#64748B]">
                      BROADCAST CREDENTIAL ID
                    </span>
                    <p className="mt-1.5 font-mono text-sm font-semibold text-[#0B1E33]">
                      {sampleRole}
                    </p>
                  </div>
                  <div className="rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-4">
                    <span className="font-mono text-[10px] font-semibold text-[#64748B]">
                      AUTHORISED PARTITION SCOPE
                    </span>
                    <p className="mt-1.5 text-sm font-semibold text-[#0B1E33]">
                      {sampleRole === 'NHS_RESPONDER_UK'
                        ? 'Partition 05 · Emergency Only'
                        : 'Partition 01 · Workplace Only'}
                    </p>
                  </div>
                  <div className="rounded-md border border-[#0F8B8D] bg-[#FFFFFF] p-4">
                    <span className="font-mono text-[10px] font-semibold text-[#0F8B8D]">
                      SIGNATURE CHECK
                    </span>
                    <p className="mt-1.5 font-mono text-xs font-semibold text-[#0B1E33]">
                      Ed25519 Offline Key Verification Passed
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-md border border-[#0F8B8D] bg-[#FFFFFF] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#0F8B8D]">
                        <Unlock size={13} aria-hidden="true" />
                        UNLOCKED &amp; TRANSLATED LOCALLY
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-[#0B1E33]">
                        {sampleRole}
                      </span>
                    </div>
                    <p className="mt-2.5 text-sm font-semibold text-[#0B1E33]">
                      {sampleRole === 'NHS_RESPONDER_UK'
                        ? 'Blood Type: O-Negative · Allergies: Penicillin, Latex · Directive: Non-Verbal / BSL Interpreter'
                        : 'Display Zoom: 135% · Theme: High Contrast · Standing Desk Actuator: 108cm'}
                    </p>
                  </div>

                  <div className="rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#64748B]">
                        <Lock size={13} aria-hidden="true" />
                        SEALED ON KEY (NEVER TRANSMITTED)
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-[#64748B]">
                        4 OF 5 PARTITIONS
                      </span>
                    </div>
                    <p className="mt-2.5 text-xs text-[#334155]">
                      {sampleRole === 'NHS_RESPONDER_UK'
                        ? 'Workplace settings, EV cabin climate, hotel room preferences, and public kiosk presets remain cryptographically sealed.'
                        : 'Emergency directives, EV seat memory, hotel room sleep preferences, and public kiosk presets remain cryptographically sealed.'}
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-4">
                    <span className="font-mono text-[10px] font-semibold text-[#64748B]">
                      TRIGGER EVENT
                    </span>
                    <p className="mt-1.5 text-sm font-semibold text-[#0B1E33]">
                      User steps away or signs out
                    </p>
                  </div>
                  <div className="rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-4">
                    <span className="font-mono text-[10px] font-semibold text-[#64748B]">
                      TERMINAL ACTION
                    </span>
                    <p className="mt-1.5 text-sm font-semibold text-[#0B1E33]">
                      Neutral OS &amp; hardware baseline restored
                    </p>
                  </div>
                  <div className="rounded-md border border-[#0F8B8D] bg-[#FFFFFF] p-4">
                    <span className="font-mono text-[10px] font-semibold text-[#0F8B8D]">
                      PROVIDER STORAGE PROOF
                    </span>
                    <p className="mt-1.5 font-mono text-sm font-semibold text-[#0B1E33]">
                      0 Bytes Retained on Provider Hardware
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
