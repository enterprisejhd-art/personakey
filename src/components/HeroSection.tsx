import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BedDouble,
  Car,
  HeartPulse,
  Lock,
  Monitor,
  Nfc,
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
  unlockedLabel: string;
  sealedLabel: string;
  curvature: number;
  icon: 'nhs' | 'coworking' | 'ev' | 'hotel';
}

const HERO_RECEIVER_NODES: HeroReceiverNode[] = [
  {
    id: 'nhs',
    label: 'NHS Emergency Triage',
    sublabel: 'Clinical Responder Unit',
    partitionCode: 'Partition 05',
    unlockedLabel: 'UNLOCKED: Partition 05 [Emergency]',
    sealedLabel: 'SEALED: Partitions 01–04',
    curvature: 36,
    icon: 'nhs',
  },
  {
    id: 'coworking',
    label: 'Coworking Hot-Desk',
    sublabel: 'Shared Workstation #04',
    partitionCode: 'Partition 01',
    unlockedLabel: 'UNLOCKED: Partition 01 [Workplace]',
    sealedLabel: 'SEALED: Partitions 02–05',
    curvature: 36,
    icon: 'coworking',
  },
  {
    id: 'ev',
    label: 'Shared EV Cabin',
    sublabel: 'Fleet Mobility Pod #B12',
    partitionCode: 'Partition 02',
    unlockedLabel: 'UNLOCKED: Partition 02 [Mobility]',
    sealedLabel: 'SEALED: Partitions 01, 03–05',
    curvature: -36,
    icon: 'ev',
  },
  {
    id: 'hotel',
    label: 'Hotel Room',
    sublabel: 'Suite #402 Matter Hub',
    partitionCode: 'Partition 03',
    unlockedLabel: 'UNLOCKED: Partition 03 [Hospitality]',
    sealedLabel: 'SEALED: Partitions 01–02, 04–05',
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
  const colorClass = isActive ? 'text-[#00A896]' : 'text-[#94A3B8]';
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

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="hero"
      className="border-b border-[#E2E8F0] bg-[#FFFFFF] py-12 text-[#090D16] sm:py-16 lg:py-20"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8">
        {/* Left Column (6 cols): Cloudflare + Netlify Enterprise Value Proposition */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0 lg:col-span-6"
        >
          {/* Top Announcement Banner (Cloudflare Style) */}
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="group pk-focus-ring pk-card-hover-orange inline-flex max-w-full cursor-pointer items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-1.5 text-left  text-[11px] font-semibold tracking-[0.04em] text-[#090D16]"
          >
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-xs bg-[#FF6B00]"
              aria-hidden="true"
            />
            <span className="truncate sm:whitespace-normal">
              UK INNOVATOR ARCHITECTURE · ZERO CLOUD STORAGE · HARDWARE-ANCHORED IDENTITY
            </span>
            <span className="pk-cta-arrow shrink-0 text-[#FF6B00]" aria-hidden="true">
              <ArrowRight size={13} strokeWidth={2.25} />
            </span>
          </button>

          <h1 className="pk-scaled-hero mt-6 font-extrabold text-balance text-[#090D16]">
            One preference identity. Unlocked only where you tap.
          </h1>

          <p className="pk-scaled-body mt-5 max-w-xl text-[#334155]">
            PersonaKey stores your encrypted preferences and emergency directives inside your physical key—never in the cloud—and unlocks only the authorised slice at any workplace, vehicle, hotel, kiosk, or NHS receiver.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => scrollToSection('real-world-journey')}
              className="group pk-focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#FF6B00] bg-[#FF6B00] px-5 py-3 text-sm font-semibold text-[#FFFFFF] transition-colors hover:border-[#090D16] hover:bg-[#090D16] sm:whitespace-nowrap"
            >
              <span>Explore Live Scenarios</span>
              <span className="pk-cta-arrow" aria-hidden="true">
                <ArrowRight size={15} strokeWidth={2.25} />
              </span>
            </button>

            <button
              type="button"
              onClick={onBookPilot}
              className="group pk-focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#090D16] bg-[#090D16] px-5 py-3 text-sm font-semibold text-[#FFFFFF] transition-colors hover:border-[#00A896] hover:bg-[#00A896] sm:whitespace-nowrap"
            >
              <span>Book a Workplace Pilot</span>
              <span className="pk-cta-arrow" aria-hidden="true">
                <ArrowRight size={15} strokeWidth={2.25} />
              </span>
            </button>
          </div>

          {/* Crisp Unboxed Technical Trust Line */}
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E2E8F0] pt-5  text-[11px] font-medium text-[#64748B]">
            <span className="inline-flex items-center gap-1.5 text-[#090D16]">
              <Lock size={12} className="text-[#00A896]" aria-hidden="true" />
              AES-256 On-Key Enclave
            </span>
            <span aria-hidden="true">·</span>
            <span>Zero Cloud Accounts</span>
            <span aria-hidden="true">·</span>
            <span>0 Bytes Retained After Exit</span>
          </div>
        </motion.div>

        {/* Right Column (6 cols): Interactive Product Bento Stage (Netlify Style) */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0 lg:col-span-6"
        >
          <div className="overflow-hidden rounded-lg border border-[#1E293B] bg-[#090D16]">
            {/* Live Hardware Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] bg-[#090D16] px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2  text-[11px] font-semibold tracking-[0.04em] text-[#FFFFFF]">
                <span
                  className="inline-flex h-4 w-4 items-center justify-center rounded-xs bg-[#FF6B00] text-[#FFFFFF]"
                  aria-hidden="true"
                >
                  <Nfc size={10} strokeWidth={2.5} />
                </span>
                <span>PERSONAKEY VAULT v2.4</span>
              </div>
              <span className=" text-[10px] font-semibold tracking-[0.04em] text-[#00A896]">
                0 BYTES IN CLOUD · OFFLINE NFC/BLE
              </span>
            </div>

            {/* Bento Hub-and-Spoke Stage */}
            <div className="p-4 sm:p-6">
              <div ref={stageRef} className="relative py-1">
                {/* Animated SVG Light Trails (Electric Teal -> Vibrant Solar Orange) */}
                {HERO_RECEIVER_NODES.map((node, idx) => (
                  <AnimatedBeam
                    key={node.id}
                    containerRef={stageRef}
                    fromRef={centerKeyRef}
                    toRef={nodeRefs[idx]}
                    curvature={node.curvature}
                    active={activeIndex === idx}
                    pathColor="#1E293B"
                    pathWidth={1.5}
                    pathOpacity={0.85}
                    gradientStartColor="#00A896"
                    gradientStopColor="#FF6B00"
                    duration={2.1}
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
                        className={`pk-focus-ring pk-card-hover relative flex min-h-[82px] cursor-pointer flex-col justify-between rounded-lg border p-3 text-left sm:p-3.5 ${
                          isActive
                            ? 'border-[#00A896] bg-[#090D16]'
                            : 'border-[#1E293B] bg-[#090D16]'
                        }`}
                      >
                        {isActive && (
                          <BorderBeam
                            size={56}
                            duration={4}
                            borderWidth={1}
                            colorFrom="#00A896"
                            colorTo="#FF6B00"
                          />
                        )}
                        <div className="flex w-full items-center justify-between gap-2">
                          <ReceiverNodeIcon icon={node.icon} isActive={isActive} />
                          <span
                            className={` text-[10px] font-semibold ${
                              isActive ? 'text-[#FF6B00]' : 'text-[#94A3B8]'
                            }`}
                          >
                            {node.partitionCode}
                          </span>
                        </div>
                        <div className="mt-2.5">
                          <p className="text-xs font-semibold text-[#FFFFFF] sm:text-sm">
                            {node.label}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#94A3B8]">
                            {node.sublabel}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Centre Node: Matte-Obsidian & Solar-Orange PersonaKey Hardware Device */}
                <div className="relative z-10 my-7 flex justify-center sm:my-9">
                  <div
                    ref={centerKeyRef}
                    className="pk-card-hover-orange relative flex w-full max-w-[286px] items-center gap-3.5 rounded-lg border border-[#1E293B] bg-[#090D16] px-4 py-3.5"
                  >
                    <BorderBeam
                      size={76}
                      duration={4.8}
                      borderWidth={1}
                      colorFrom="#00A896"
                      colorTo="#FF6B00"
                    />

                    {/* Matte-Obsidian & Solar-Orange Hardware Device SVG */}
                    <svg
                      width="66"
                      height="42"
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
                        fill="#090D16"
                        stroke="#334155"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="5"
                        y="5"
                        width="78"
                        height="42"
                        rx="4"
                        stroke="#FF6B00"
                        strokeWidth="0.9"
                        strokeOpacity="0.65"
                      />
                      <rect
                        x="10"
                        y="19"
                        width="4"
                        height="14"
                        rx="2"
                        fill="#1E293B"
                        stroke="#FF6B00"
                        strokeWidth="1"
                      />
                      <rect
                        x="21"
                        y="14"
                        width="22"
                        height="24"
                        rx="3"
                        fill="#090D16"
                        stroke="#FF6B00"
                        strokeWidth="1.25"
                      />
                      <path
                        d="M27 20H37M27 26H37M27 32H34M32 14V38"
                        stroke="#FF6B00"
                        strokeWidth="1"
                        strokeOpacity="0.85"
                      />
                      <circle cx="57" cy="24" r="3.5" stroke="#FFFFFF" strokeWidth="1.4" />
                      <path
                        d="M60.5 24H71M67 24V27.5M71 24V26.5"
                        stroke="#00A896"
                        strokeWidth="1.5"
                        strokeLinecap="square"
                      />
                      <rect x="73" y="10" width="5" height="5" rx="1" fill="#FF6B00" />
                    </svg>

                    <div className="min-w-0">
                      <p className=" text-[10px] font-semibold tracking-[0.04em] text-[#FF6B00]">
                        PERSONAKEY #PK-409
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-[#FFFFFF]">
                        Obsidian Hardware Vault
                      </p>
                      <p className="mt-0.5  text-[10px] text-[#94A3B8]">
                        5 Isolated Partitions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Receiver Row (Shared EV + Hotel Room) */}
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
                        className={`pk-focus-ring pk-card-hover relative flex min-h-[82px] cursor-pointer flex-col justify-between rounded-lg border p-3 text-left sm:p-3.5 ${
                          isActive
                            ? 'border-[#00A896] bg-[#090D16]'
                            : 'border-[#1E293B] bg-[#090D16]'
                        }`}
                      >
                        {isActive && (
                          <BorderBeam
                            size={56}
                            duration={4}
                            borderWidth={1}
                            colorFrom="#00A896"
                            colorTo="#FF6B00"
                          />
                        )}
                        <div className="flex w-full items-center justify-between gap-2">
                          <ReceiverNodeIcon icon={node.icon} isActive={isActive} />
                          <span
                            className={` text-[10px] font-semibold ${
                              isActive ? 'text-[#FF6B00]' : 'text-[#94A3B8]'
                            }`}
                          >
                            {node.partitionCode}
                          </span>
                        </div>
                        <div className="mt-2.5">
                          <p className="text-xs font-semibold text-[#FFFFFF] sm:text-sm">
                            {node.label}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#94A3B8]">
                            {node.sublabel}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Bottom Telemetry Bar */}
            <div className="border-t border-[#1E293B] bg-[#090D16] px-4 py-3 sm:px-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap items-center justify-between gap-2  text-[11px]"
                >
                  <span className="inline-flex items-center gap-2 font-semibold text-[#00A896]">
                    <ShieldCheck size={14} className="shrink-0" aria-hidden="true" />
                    <span>{activeNode.unlockedLabel}</span>
                  </span>
                  <span className="font-medium text-[#94A3B8]">
                    · {activeNode.sealedLabel}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
