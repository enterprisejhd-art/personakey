import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  BedDouble,
  Car,
  HeartPulse,
  Lock,
  Monitor,
  ShieldCheck,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AnimatedBeam } from './ui/animated-beam';
import { BorderBeam } from './ui/border-beam';

interface HeroSectionProps {
  onBookPilot: () => void;
}

interface HeroReceiverNode {
  id: 'nhs' | 'coworking' | 'ev' | 'hotel';
  label: string;
  sublabel: string;
  partitionCode: string;
  tickerText: string;
  curvature: number;
  icon: 'nhs' | 'coworking' | 'ev' | 'hotel';
}

const HERO_RECEIVER_NODES: HeroReceiverNode[] = [
  {
    id: 'nhs',
    label: 'NHS Emergency Triage',
    sublabel: 'Clinical Responder Unit',
    partitionCode: 'Partition 05',
    tickerText:
      'NHS Receiver Verified → Partition 05 Unlocked · Partitions 01–04 Sealed on Key',
    curvature: 36,
    icon: 'nhs',
  },
  {
    id: 'coworking',
    label: 'Coworking Hot-Desk',
    sublabel: 'Shared Workstation #04',
    partitionCode: 'Partition 01',
    tickerText:
      'Desk #04 Receiver Verified → Partition 01 Unlocked · Partitions 02–05 Sealed on Key',
    curvature: 36,
    icon: 'coworking',
  },
  {
    id: 'ev',
    label: 'Shared EV Cabin',
    sublabel: 'Fleet Mobility Pod #B12',
    partitionCode: 'Partition 02',
    tickerText:
      'Fleet EV Receiver Verified → Partition 02 Unlocked · Partitions 01 & 03–05 Sealed on Key',
    curvature: -36,
    icon: 'ev',
  },
  {
    id: 'hotel',
    label: 'Hotel Suite',
    sublabel: 'Room #402 Matter Hub',
    partitionCode: 'Partition 03',
    tickerText:
      'Room #402 Receiver Verified → Partition 03 Unlocked · Partitions 01–02 & 04–05 Sealed on Key',
    curvature: -36,
    icon: 'hotel',
  },
];

function ReceiverNodeIcon({
  icon,
  isActive,
}: {
  icon: HeroReceiverNode['icon'];
  isActive: boolean;
}) {
  const colorClass = isActive ? 'text-[#0F8B8D]' : 'text-[#94A3B8]';
  switch (icon) {
    case 'nhs':
      return <HeartPulse size={16} className={`shrink-0 ${colorClass}`} aria-hidden="true" />;
    case 'coworking':
      return <Monitor size={16} className={`shrink-0 ${colorClass}`} aria-hidden="true" />;
    case 'ev':
      return <Car size={16} className={`shrink-0 ${colorClass}`} aria-hidden="true" />;
    case 'hotel':
      return <BedDouble size={16} className={`shrink-0 ${colorClass}`} aria-hidden="true" />;
  }
}

export function HeroSection({ onBookPilot }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const stageRef = useRef<HTMLDivElement>(null);
  const centerKeyRef = useRef<HTMLDivElement>(null);
  const nhsRef = useRef<HTMLButtonElement>(null);
  const coworkingRef = useRef<HTMLButtonElement>(null);
  const evRef = useRef<HTMLButtonElement>(null);
  const hotelRef = useRef<HTMLButtonElement>(null);

  const nodeRefs = [nhsRef, coworkingRef, evRef, hotelRef];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_RECEIVER_NODES.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [activeIndex]);

  const activeNode = HERO_RECEIVER_NODES[activeIndex];

  const scrollToJourney = () => {
    const el = document.getElementById('real-world-journey');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="hero"
      className="border-b border-[#1E3A5F] bg-[#071322] py-12 text-[#FFFFFF] sm:py-16 lg:py-20"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8">
        {/* Left Column (6 cols): Executive Value Proposition */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0 lg:col-span-6"
        >
          <div className="inline-flex items-center gap-2 rounded-md border border-[#0F8B8D] bg-[#0B1E33] px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.04em] text-[#FFFFFF]">
            <Lock size={12} className="shrink-0 text-[#0F8B8D]" aria-hidden="true" />
            <span>ZERO CLOUD SYNC · 100% ON-DEVICE ENCRYPTED VAULT</span>
          </div>

          <h1 className="pk-scaled-hero mt-5 font-semibold tracking-[-0.02em] text-balance text-[#FFFFFF]">
            Your preferences and critical directives—carried in your pocket, unlocked only where you choose.
          </h1>

          <p className="pk-scaled-body mt-4 max-w-2xl leading-relaxed text-[#CBD5E1]">
            PersonaKey stores your encrypted profile inside your physical key—never in a central cloud database. Tap any PersonaKey Receiver at a workplace, hire car, hotel, public kiosk, or emergency unit to unlock only the exact partition permitted.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={scrollToJourney}
              className="pk-focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#0F8B8D] bg-[#0F8B8D] px-5 py-2.5 text-sm font-semibold text-[#FFFFFF] transition-colors hover:bg-[#0B1E33] sm:whitespace-nowrap"
            >
              Experience Interactive Scenarios
              <ArrowDown size={15} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onBookPilot}
              className="pk-focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#334155] bg-[#0B1E33] px-5 py-2.5 text-sm font-semibold text-[#FFFFFF] transition-colors hover:border-[#0F8B8D] hover:bg-[#071322] sm:whitespace-nowrap"
            >
              Book a Workplace Pilot
            </button>
          </div>
        </motion.div>

        {/* Right Column (6 cols): Animated Hardware-to-Environment Stage */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0 lg:col-span-6"
        >
          <div className="rounded-lg border border-[#1E3A5F] bg-[#0B1E33] p-4 shadow-xs sm:p-6">
            {/* Stage Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E3A5F] pb-3.5">
              <span className="font-mono text-[11px] font-medium tracking-[0.04em] text-[#CBD5E1]">
                SELECTIVE PARTITION HANDSHAKE
              </span>
              <span className="rounded-md border border-[#1E3A5F] bg-[#071322] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#D4A338]">
                0 BYTES IN CLOUD · OFFLINE NFC/BLE VAULT
              </span>
            </div>

            {/* Hub-and-Spoke Stage with AnimatedBeams */}
            <div ref={stageRef} className="relative mt-5 py-1">
              {/* Animated SVG Connection Beams (Behind Nodes) */}
              {HERO_RECEIVER_NODES.map((node, idx) => (
                <AnimatedBeam
                  key={node.id}
                  containerRef={stageRef}
                  fromRef={centerKeyRef}
                  toRef={nodeRefs[idx]}
                  curvature={node.curvature}
                  active={activeIndex === idx}
                  pathColor="#1E3A5F"
                  pathWidth={1.5}
                  pathOpacity={0.65}
                  gradientStartColor="#0F8B8D"
                  gradientStopColor="#D4A338"
                  duration={2.2}
                />
              ))}

              {/* Top Receiver Row (NHS + Coworking) */}
              <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-5">
                {HERO_RECEIVER_NODES.slice(0, 2).map((node, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <button
                      key={node.id}
                      ref={nodeRefs[idx]}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-pressed={isActive}
                      className={`pk-focus-ring relative flex min-h-[78px] cursor-pointer flex-col justify-between rounded-lg border p-3 text-left transition-colors sm:p-3.5 ${
                        isActive
                          ? 'border-[#0F8B8D] bg-[#071322]'
                          : 'border-[#1E3A5F] bg-[#071322] hover:border-[#334155]'
                      }`}
                    >
                      {isActive && (
                        <BorderBeam
                          size={56}
                          duration={4.2}
                          borderWidth={1}
                          colorFrom="#0F8B8D"
                          colorTo="#D4A338"
                        />
                      )}
                      <div className="flex w-full items-center justify-between gap-2">
                        <ReceiverNodeIcon icon={node.icon} isActive={isActive} />
                        <span
                          className={`font-mono text-[10px] font-semibold ${
                            isActive ? 'text-[#0F8B8D]' : 'text-[#94A3B8]'
                          }`}
                        >
                          {node.partitionCode}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <p className="text-xs font-semibold text-[#FFFFFF] sm:text-sm">
                          {node.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#CBD5E1]">
                          {node.sublabel}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Centre Node: Matte-Navy & Gold PersonaKey Hardware Device */}
              <div className="relative z-10 my-7 flex justify-center sm:my-9">
                <div
                  ref={centerKeyRef}
                  className="relative flex w-full max-w-[272px] items-center gap-3.5 rounded-lg border border-[#1E3A5F] bg-[#071322] px-4 py-3.5 shadow-xs"
                >
                  <BorderBeam
                    size={72}
                    duration={5}
                    borderWidth={1}
                    colorFrom="#0F8B8D"
                    colorTo="#D4A338"
                  />

                  {/* Matte-Navy & Gold Hardware Device Graphic */}
                  <svg
                    width="64"
                    height="40"
                    viewBox="0 0 88 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="86"
                      height="50"
                      rx="6"
                      fill="#0B1E33"
                      stroke="#334155"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="5"
                      y="5"
                      width="78"
                      height="42"
                      rx="4"
                      stroke="#D4A338"
                      strokeWidth="0.9"
                      strokeOpacity="0.55"
                    />
                    <rect
                      x="10"
                      y="19"
                      width="4"
                      height="14"
                      rx="2"
                      fill="#071322"
                      stroke="#D4A338"
                      strokeWidth="1"
                    />
                    <rect
                      x="21"
                      y="14"
                      width="22"
                      height="24"
                      rx="3"
                      fill="#071322"
                      stroke="#D4A338"
                      strokeWidth="1.25"
                    />
                    <path
                      d="M27 20H37M27 26H37M27 32H34M32 14V38"
                      stroke="#D4A338"
                      strokeWidth="1"
                      strokeOpacity="0.85"
                    />
                    <circle cx="57" cy="24" r="3.5" stroke="#FFFFFF" strokeWidth="1.4" />
                    <path
                      d="M60.5 24H71M67 24V27.5M71 24V26.5"
                      stroke="#D4A338"
                      strokeWidth="1.4"
                      strokeLinecap="square"
                    />
                    <rect x="73" y="10" width="5" height="5" rx="1" fill="#0F8B8D" />
                  </svg>

                  <div className="min-w-0">
                    <p className="font-mono text-[10px] font-semibold tracking-[0.04em] text-[#D4A338]">
                      PERSONAKEY #PK-409
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-[#FFFFFF]">
                      Hardware Vault
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-[#CBD5E1]">
                      5 Encrypted Partitions
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Receiver Row (Shared EV + Hotel Suite) */}
              <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-5">
                {HERO_RECEIVER_NODES.slice(2, 4).map((node, offsetIdx) => {
                  const idx = offsetIdx + 2;
                  const isActive = activeIndex === idx;
                  return (
                    <button
                      key={node.id}
                      ref={nodeRefs[idx]}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-pressed={isActive}
                      className={`pk-focus-ring relative flex min-h-[78px] cursor-pointer flex-col justify-between rounded-lg border p-3 text-left transition-colors sm:p-3.5 ${
                        isActive
                          ? 'border-[#0F8B8D] bg-[#071322]'
                          : 'border-[#1E3A5F] bg-[#071322] hover:border-[#334155]'
                      }`}
                    >
                      {isActive && (
                        <BorderBeam
                          size={56}
                          duration={4.2}
                          borderWidth={1}
                          colorFrom="#0F8B8D"
                          colorTo="#D4A338"
                        />
                      )}
                      <div className="flex w-full items-center justify-between gap-2">
                        <ReceiverNodeIcon icon={node.icon} isActive={isActive} />
                        <span
                          className={`font-mono text-[10px] font-semibold ${
                            isActive ? 'text-[#0F8B8D]' : 'text-[#94A3B8]'
                          }`}
                        >
                          {node.partitionCode}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <p className="text-xs font-semibold text-[#FFFFFF] sm:text-sm">
                          {node.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#CBD5E1]">
                          {node.sublabel}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Status Ticker */}
            <div className="mt-5 rounded-md border border-[#1E3A5F] bg-[#071322] px-3.5 py-2.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-2 font-mono text-[11px] text-[#FFFFFF]"
                >
                  <ShieldCheck
                    size={14}
                    className="mt-0.5 shrink-0 text-[#0F8B8D]"
                    aria-hidden="true"
                  />
                  <span className="leading-snug">{activeNode.tickerText}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
