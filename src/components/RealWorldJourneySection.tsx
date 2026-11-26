import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import {
  Accessibility,
  Activity,
  BedDouble,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  HeartPulse,
  KeyRound,
  Lock,
  Monitor,
  Nfc,
  Radio,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Unlock,
  Volume2,
  WifiOff,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  DEFAULT_KEY_VAULT,
  RECEIVER_SCENARIOS,
  VAULT_PARTITIONS,
  type KeyVaultData,
  type PartitionId,
  type ScenarioId,
} from '../data/vault';
import { AnimatedBeam } from './ui/animated-beam';
import { BorderBeam } from './ui/border-beam';

type WorkflowPhase =
  | 'idle'
  | 'step1-tap'
  | 'step2-handshake'
  | 'step3-live'
  | 'step4-wipe';

interface RealWorldJourneySectionProps {
  vault: KeyVaultData;
  onVaultChange: Dispatch<SetStateAction<KeyVaultData>>;
  scenarioId: ScenarioId;
  onScenarioChange: (id: ScenarioId) => void;
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

const WORKFLOW_STEPS: { id: WorkflowPhase; label: string; shortLabel: string }[] = [
  { id: 'step1-tap', label: 'Step 1: NFC/BLE Tap', shortLabel: '1. Tap' },
  {
    id: 'step2-handshake',
    label: 'Step 2: 3-Part Architecture Handshake',
    shortLabel: '2. Handshake',
  },
  {
    id: 'step3-live',
    label: 'Step 3: Live Environment Control',
    shortLabel: '3. Live Control',
  },
  { id: 'step4-wipe', label: 'Step 4: Step Away & Wipe', shortLabel: '4. Wipe' },
];

function ScenarioIcon({
  id,
  isSelected,
}: {
  id: ScenarioId;
  isSelected: boolean;
}) {
  const cls = isSelected ? 'text-[#00A896]' : 'text-[#94A3B8]';
  switch (id) {
    case 'nhs-triage':
      return <HeartPulse size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'coworking-desk':
      return <Monitor size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'car-hire':
      return <Car size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'hotel-checkin':
      return <BedDouble size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'public-kiosk':
      return <Accessibility size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
    case 'fitness-studio':
      return <Activity size={15} className={`shrink-0 ${cls}`} aria-hidden="true" />;
  }
}

export function RealWorldJourneySection({
  vault,
  onVaultChange,
  scenarioId,
  onScenarioChange,
  onConnectionChange,
}: RealWorldJourneySectionProps) {
  const [phase, setPhase] = useState<WorkflowPhase>('idle');
  const [editOpen, setEditOpen] = useState(false);
  const [bslAlertExpanded, setBslAlertExpanded] = useState(true);
  const [audioAssistPreview, setAudioAssistPreview] = useState(true);
  const [kioskActionMessage, setKioskActionMessage] = useState<string | null>(null);
  const [lastWipeTimestamp, setLastWipeTimestamp] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();

  const beamContainerRef = useRef<HTMLDivElement>(null);
  const beamKeyRef = useRef<HTMLDivElement>(null);
  const beamReceiverRef = useRef<HTMLDivElement>(null);

  const activeScenario =
    RECEIVER_SCENARIOS.find((s) => s.id === scenarioId) ?? RECEIVER_SCENARIOS[0];

  // Auto-advance Step 1 -> Step 2 -> Step 3 on tap, and Step 4 -> Idle on wipe
  useEffect(() => {
    if (phase === 'step1-tap') {
      const t = window.setTimeout(() => {
        setPhase('step2-handshake');
      }, 550);
      return () => window.clearTimeout(t);
    }
    if (phase === 'step2-handshake') {
      const t = window.setTimeout(() => {
        setPhase('step3-live');
        onConnectionChange(true);
      }, 950);
      return () => window.clearTimeout(t);
    }
    if (phase === 'step4-wipe') {
      const t = window.setTimeout(() => {
        setPhase('idle');
        setLastWipeTimestamp('0 Bytes Retained · Purged');
        onConnectionChange(false);
      }, 650);
      return () => window.clearTimeout(t);
    }
  }, [phase, onConnectionChange]);

  const handleSelectScenario = (id: ScenarioId) => {
    onScenarioChange(id);
    setPhase('idle');
    setKioskActionMessage(null);
    setLastWipeTimestamp(null);
    onConnectionChange(false);
  };

  const handleTapOnReceiver = () => {
    if (phase !== 'idle') return;
    setKioskActionMessage(null);
    setLastWipeTimestamp(null);
    setPhase('step1-tap');
  };

  const handleStepAwayAndWipe = () => {
    if (phase === 'idle' || phase === 'step4-wipe') return;
    setKioskActionMessage(null);
    onConnectionChange(false);
    setPhase('step4-wipe');
  };

  const showArchitectureProof =
    phase === 'step1-tap' || phase === 'step2-handshake' || phase === 'step3-live';
  const isPartitionUnlocked =
    phase === 'step1-tap' || phase === 'step2-handshake' || phase === 'step3-live';
  const unlockedPartition: PartitionId | null = isPartitionUnlocked
    ? activeScenario.unlocksPartition
    : null;

  const ledColor =
    phase === 'step3-live' || phase === 'step2-handshake'
      ? '#00A896'
      : '#FF6B00';

  const workplaceHeadlineByLang: Record<KeyVaultData['workplace']['language'], string> = {
    'English (UK)': 'Q4 Regional Operations Workspace',
    Cymraeg: 'Gweithle Gweithrediadau Rhanbarthol Ch4',
    Français: 'Espace Opérations Régionales T4',
  };

  return (
    <section
      id="real-world-journey"
      className="border-b border-[#E2E8F0] bg-[#F8FAFC] py-14 text-[#090D16] sm:py-18"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header (Bright Corporate Framing) */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className=" text-xs font-semibold tracking-[0.04em] text-[#FF6B00]">
              INTERACTIVE REAL-WORLD PRODUCT JOURNEY
            </p>
            <h2 className="pk-scaled-heading font-display mt-2 font-bold text-balance text-[#090D16]">
              One physical key, five encrypted partitions, six live environments.
            </h2>
            <p className="pk-scaled-small mt-2.5 text-[#334155]">
              Customise what lives inside your physical PersonaKey on the left, select a receiver scenario on the right, and tap to inspect the complete 4-step end-to-end lifecycle.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-1.5  text-[11px] font-medium text-[#090D16]">
            <WifiOff size={13} className="text-[#00A896]" aria-hidden="true" />
            Offline Hardware-to-Receiver · 0 Cloud Sync
          </div>
        </div>

        {/* Obsidian Interactive Stage Framed Inside Bright Layout */}
        <div className="mt-8 rounded-lg border border-[#1E293B] bg-[#090D16] p-5 text-[#FFFFFF] sm:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
            {/* PERSISTENT LEFT COLUMN (5 cols): Your Physical PersonaKey */}
            <div className="min-w-0 lg:sticky lg:top-20 lg:col-span-5">
              <div className="relative rounded-lg border border-[#1E293B] bg-[#090D16] p-5">
                <BorderBeam
                  size={76}
                  duration={5.5}
                  borderWidth={1}
                  colorFrom="#00A896"
                  colorTo="#FF6B00"
                />

                {/* Vault Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
                  <div>
                    <span className=" text-[11px] font-semibold tracking-[0.04em] text-[#FF6B00]">
                      YOUR PHYSICAL PERSONAKEY
                    </span>
                    <h3 className="mt-0.5 text-base font-semibold text-[#FFFFFF]">
                      Your Physical PersonaKey · #PK-409
                    </h3>
                  </div>

                  <span
                    className={`rounded-md border px-2.5 py-1  text-[10px] font-semibold ${
                      isPartitionUnlocked
                        ? 'border-[#00A896] bg-[#090D16] text-[#00A896]'
                      : 'border-[#1E293B] bg-[#090D16] text-[#CBD5E1]'
                  }`}
                >
                  {isPartitionUnlocked ? '1 UNLOCKED · 4 SEALED' : 'ALL 5 SEALED'}
                </span>
              </div>

              {/* Matte-Obsidian & Solar-Orange PersonaKey Device + Local Storage Indicator */}
              <div className="mt-4 rounded-md border border-[#1E293B] bg-[#090D16] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <svg
                      width="84"
                      height="50"
                      viewBox="0 0 88 52"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="PersonaKey Matte-Obsidian and Solar-Orange Hardware Token"
                      className="shrink-0"
                    >
                      <rect
                        x="1"
                        y="1"
                        width="86"
                        height="50"
                        rx="6"
                        fill="#090D16"
                        stroke="#1E293B"
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
                        fill="#090D16"
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
                        stroke="#FF6B00"
                        strokeWidth="1.4"
                        strokeLinecap="square"
                      />
                      <rect x="73" y="10" width="5" height="5" rx="1" fill={ledColor} />
                    </svg>

                    <div className="min-w-0">
                      <p className=" text-[11px] font-semibold text-[#FFFFFF]">
                        AES-256 Hardware Element
                      </p>
                      <p className="mt-0.5  text-[10px] text-[#CBD5E1]">
                        {phase === 'step1-tap'
                          ? 'NFC Field Active...'
                          : phase === 'step2-handshake'
                            ? 'Verifying Role Certificate...'
                            : phase === 'step3-live'
                              ? 'Single Partition Disclosed'
                              : phase === 'step4-wipe'
                                ? 'Closing Session...'
                                : 'Ready for NFC/BLE Tap'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-md border border-[#00A896] bg-[#090D16] px-3 py-2  text-[10px] font-semibold text-[#FFFFFF]">
                  <Lock size={12} className="shrink-0 text-[#FF6B00]" aria-hidden="true" />
                  <span>ZERO CLOUD DEPENDENCY · 100% ON-DEVICE VAULT</span>
                </div>
              </div>

              {/* 5 Encrypted Partitions Live Visual Map */}
              <div className="mt-4 space-y-2">
                {VAULT_PARTITIONS.map((partition) => {
                  const isUnlocked = unlockedPartition === partition.id;
                  return (
                    <div
                      key={partition.id}
                      className={`relative flex items-center justify-between gap-3 rounded-md border px-3.5 py-2.5 transition-colors ${
                        isUnlocked
                          ? 'border-[#00A896] bg-[#090D16]'
                          : 'border-[#1E293B] bg-[#090D16]'
                      }`}
                    >
                      {isUnlocked && (
                        <BorderBeam
                          size={48}
                          duration={3.8}
                          borderWidth={1}
                          colorFrom="#00A896"
                          colorTo="#FF6B00"
                        />
                      )}

                      <div className="flex min-w-0 items-center gap-2.5">
                        {isUnlocked ? (
                          <Unlock
                            size={14}
                            className="shrink-0 text-[#00A896]"
                            aria-hidden="true"
                          />
                        ) : (
                          <Lock
                            size={14}
                            className="shrink-0 text-[#94A3B8]"
                            aria-hidden="true"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#FFFFFF]">
                            {partition.index}. {partition.name}
                          </p>
                          <p className="truncate text-[11px] text-[#94A3B8]">
                            {partition.scopeNote}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-sm border px-2 py-0.5  text-[10px] font-semibold ${
                          isUnlocked
                            ? 'border-[#00A896] bg-[#090D16] text-[#00A896]'
                            : 'border-[#1E293B] bg-[#090D16] text-[#94A3B8]'
                        }`}
                      >
                        {isUnlocked ? 'UNLOCKED' : 'SEALED ON DEVICE'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Customise My Key Data Drawer */}
              <div className="mt-4 border-t border-[#1E293B] pt-4">
                <button
                  type="button"
                  aria-expanded={editOpen}
                  aria-controls="customise-key-drawer"
                  onClick={() => setEditOpen((prev) => !prev)}
                  className="pk-focus-ring flex w-full cursor-pointer items-center justify-between rounded-md border border-[#334155] bg-[#090D16] px-3.5 py-2.5 text-xs font-semibold text-[#FFFFFF] transition-colors hover:border-[#00A896]"
                >
                  <span className="inline-flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-[#00A896]" aria-hidden="true" />
                    Customise My Key
                  </span>
                  {editOpen ? (
                    <ChevronUp size={14} aria-hidden="true" />
                  ) : (
                    <ChevronDown size={14} aria-hidden="true" />
                  )}
                </button>

                <AnimatePresence>
                  {editOpen && (
                    <motion.div
                      id="customise-key-drawer"
                      initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-3 space-y-3 rounded-md border border-[#1E293B] bg-[#090D16] p-4"
                    >
                      <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                        <span className=" text-[11px] font-semibold text-[#FF6B00]">
                          ON-KEY PARTITION VALUES
                        </span>
                        <button
                          type="button"
                          onClick={() => onVaultChange(DEFAULT_KEY_VAULT)}
                          className="pk-focus-ring cursor-pointer  text-[11px] font-medium text-[#CBD5E1] underline hover:text-[#FFFFFF]"
                        >
                          Reset Defaults
                        </button>
                      </div>

                      {/* Emergency Directives */}
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="vault-blood-type"
                            className="block text-[11px] font-semibold text-[#CBD5E1]"
                          >
                            Blood Type (Partition 05)
                          </label>
                          <select
                            id="vault-blood-type"
                            value={vault.emergency.bloodType}
                            onChange={(e) =>
                              onVaultChange((prev) => ({
                                ...prev,
                                emergency: {
                                  ...prev.emergency,
                                  bloodType: e.target
                                    .value as KeyVaultData['emergency']['bloodType'],
                                },
                              }))
                            }
                            className="pk-focus-ring mt-1 w-full rounded-md border border-[#334155] bg-[#090D16] px-2.5 py-1.5 text-xs text-[#FFFFFF]"
                          >
                            <option value="O-Negative">O-Negative</option>
                            <option value="A-Positive">A-Positive</option>
                            <option value="B-Positive">B-Positive</option>
                            <option value="AB-Negative">AB-Negative</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="vault-allergies"
                            className="block text-[11px] font-semibold text-[#CBD5E1]"
                          >
                            Severe Allergies
                          </label>
                          <input
                            id="vault-allergies"
                            type="text"
                            value={vault.emergency.allergies}
                            onChange={(e) =>
                              onVaultChange((prev) => ({
                                ...prev,
                                emergency: {
                                  ...prev.emergency,
                                  allergies: e.target.value,
                                },
                              }))
                            }
                            className="pk-focus-ring mt-1 w-full rounded-md border border-[#334155] bg-[#090D16] px-2.5 py-1.5 text-xs text-[#FFFFFF]"
                          />
                        </div>
                      </div>

                      {/* Workplace Text Scale, Theme & Language */}
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                        <div>
                          <label
                            htmlFor="vault-text-scale"
                            className="block text-[11px] font-semibold text-[#CBD5E1]"
                          >
                            Text Scale
                          </label>
                          <select
                            id="vault-text-scale"
                            value={vault.workplace.textScale}
                            onChange={(e) =>
                              onVaultChange((prev) => ({
                                ...prev,
                                workplace: {
                                  ...prev.workplace,
                                  textScale: e.target
                                    .value as KeyVaultData['workplace']['textScale'],
                                },
                              }))
                            }
                            className="pk-focus-ring mt-1 w-full rounded-md border border-[#334155] bg-[#090D16] px-2.5 py-1.5 text-xs text-[#FFFFFF]"
                          >
                            <option value="100%">100%</option>
                            <option value="115%">115%</option>
                            <option value="135%">135%</option>
                            <option value="150%">150%</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="vault-theme"
                            className="block text-[11px] font-semibold text-[#CBD5E1]"
                          >
                            Display Theme
                          </label>
                          <select
                            id="vault-theme"
                            value={vault.workplace.theme}
                            onChange={(e) =>
                              onVaultChange((prev) => ({
                                ...prev,
                                workplace: {
                                  ...prev.workplace,
                                  theme: e.target
                                    .value as KeyVaultData['workplace']['theme'],
                                },
                              }))
                            }
                            className="pk-focus-ring mt-1 w-full rounded-md border border-[#334155] bg-[#090D16] px-2.5 py-1.5 text-xs text-[#FFFFFF]"
                          >
                            <option value="High Contrast">High Contrast</option>
                            <option value="Standard">Standard</option>
                            <option value="Warm Paper">Warm Paper</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="vault-language"
                            className="block text-[11px] font-semibold text-[#CBD5E1]"
                          >
                            Language
                          </label>
                          <select
                            id="vault-language"
                            value={vault.workplace.language}
                            onChange={(e) =>
                              onVaultChange((prev) => ({
                                ...prev,
                                workplace: {
                                  ...prev.workplace,
                                  language: e.target
                                    .value as KeyVaultData['workplace']['language'],
                                },
                              }))
                            }
                            className="pk-focus-ring mt-1 w-full rounded-md border border-[#334155] bg-[#090D16] px-2.5 py-1.5 text-xs text-[#FFFFFF]"
                          >
                            <option value="English (UK)">English (UK)</option>
                            <option value="Cymraeg">Cymraeg</option>
                            <option value="Français">Français</option>
                          </select>
                        </div>
                      </div>

                      {/* Desk Height, Cabin Temp & Room Lighting */}
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                        <div>
                          <label
                            htmlFor="vault-desk-height"
                            className="block text-[11px] font-semibold text-[#CBD5E1]"
                          >
                            Standing Desk ({vault.workplace.standingDeskCm}cm)
                          </label>
                          <input
                            id="vault-desk-height"
                            type="range"
                            min={100}
                            max={120}
                            step={1}
                            value={vault.workplace.standingDeskCm}
                            onChange={(e) =>
                              onVaultChange((prev) => ({
                                ...prev,
                                workplace: {
                                  ...prev.workplace,
                                  standingDeskCm: Number(e.target.value),
                                },
                              }))
                            }
                            className="pk-focus-ring mt-2 w-full cursor-pointer accent-[#00A896]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="vault-cabin-temp"
                            className="block text-[11px] font-semibold text-[#CBD5E1]"
                          >
                            EV Cabin ({vault.mobility.cabinTempC}°C)
                          </label>
                          <input
                            id="vault-cabin-temp"
                            type="range"
                            min={18}
                            max={23}
                            step={1}
                            value={vault.mobility.cabinTempC}
                            onChange={(e) =>
                              onVaultChange((prev) => ({
                                ...prev,
                                mobility: {
                                  ...prev.mobility,
                                  cabinTempC: Number(e.target.value),
                                },
                              }))
                            }
                            className="pk-focus-ring mt-2 w-full cursor-pointer accent-[#00A896]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="vault-room-kelvin"
                            className="block text-[11px] font-semibold text-[#CBD5E1]"
                          >
                            Room Lighting
                          </label>
                          <select
                            id="vault-room-kelvin"
                            value={vault.hospitality.lightingKelvin}
                            onChange={(e) =>
                              onVaultChange((prev) => ({
                                ...prev,
                                hospitality: {
                                  ...prev.hospitality,
                                  lightingKelvin: Number(e.target.value) as 2700 | 3200 | 4000,
                                },
                              }))
                            }
                            className="pk-focus-ring mt-1 w-full rounded-md border border-[#334155] bg-[#090D16] px-2.5 py-1.5 text-xs text-[#FFFFFF]"
                          >
                            <option value={2700}>2700K Warm</option>
                            <option value={3200}>3200K Soft</option>
                            <option value={4000}>4000K Neutral</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (7 cols): 6 Scenarios & 4-Step End-to-End Workflow */}
          <div className="min-w-0 lg:col-span-7">
            {/* 6 Scenario Tabs */}
            <div
              role="tablist"
              aria-label="Six real-world PersonaKey scenarios"
              className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3"
            >
              {RECEIVER_SCENARIOS.map((scenario) => {
                const isSelected = scenario.id === activeScenario.id;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectScenario(scenario.id)}
                    className={`pk-focus-ring pk-card-hover relative flex cursor-pointer flex-col items-start rounded-lg border p-3.5 text-left ${
                      isSelected
                        ? 'border-[#00A896] bg-[#090D16]'
                        : 'border-[#1E293B] bg-[#090D16]'
                    }`}
                  >
                    {isSelected && (
                      <BorderBeam
                        size={48}
                        duration={4.2}
                        borderWidth={1}
                        colorFrom="#00A896"
                        colorTo="#FF6B00"
                      />
                    )}
                    <div className="flex w-full items-center justify-between gap-2">
                      <ScenarioIcon id={scenario.id} isSelected={isSelected} />
                      <span className=" text-[10px] text-[#94A3B8]">
                        {scenario.verifiedCredential}
                      </span>
                    </div>
                    <span className="mt-2 text-xs font-semibold text-[#FFFFFF]">
                      {scenario.tabLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Receiver Stage Container */}
            <div className="mt-5 overflow-hidden rounded-lg border border-[#1E293B] bg-[#090D16]">
              {/* Receiver Action Header + AnimatedBeam Bridge */}
              <div className="border-b border-[#1E293B] bg-[#090D16] px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-[#FFFFFF]">
                        {activeScenario.title}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md border border-[#00A896] bg-[#090D16] px-2 py-0.5  text-[10px] font-semibold text-[#FFFFFF]">
                        <ShieldCheck size={11} className="text-[#00A896]" aria-hidden="true" />
                        {activeScenario.verifiedCredential}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#CBD5E1]">
                      {activeScenario.summary}
                    </p>
                  </div>

                  {/* Tap or Step Away & Wipe Action */}
                  <div>
                    {phase === 'idle' ? (
                      <button
                        type="button"
                        onClick={handleTapOnReceiver}
                        className="pk-focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#FF6B00] bg-[#FF6B00] px-4 py-2.5 text-xs font-semibold text-[#FFFFFF] transition-colors hover:border-[#00A896] hover:bg-[#00A896] sm:whitespace-nowrap"
                      >
                        <span
                          className="inline-flex h-4 w-4 items-center justify-center rounded-xs bg-[#090D16] text-[#FF6B00]"
                          aria-hidden="true"
                        >
                          <Nfc size={10} strokeWidth={2.25} />
                        </span>
                        Tap PersonaKey on Receiver
                      </button>
                    ) : phase === 'step1-tap' || phase === 'step2-handshake' ? (
                      <button
                        type="button"
                        disabled
                        className="inline-flex cursor-wait items-center gap-2 rounded-md border border-[#FF6B00] bg-[#090D16] px-4 py-2.5 text-xs font-semibold text-[#FF6B00] sm:whitespace-nowrap"
                      >
                        <Nfc size={13} aria-hidden="true" />
                        {phase === 'step1-tap'
                          ? 'Step 1: NFC/BLE Tap...'
                          : 'Step 2: Verifying 3-Part Architecture...'}
                      </button>
                    ) : phase === 'step3-live' ? (
                      <button
                        type="button"
                        onClick={handleStepAwayAndWipe}
                        className="pk-focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#FF6B00] bg-[#090D16] px-4 py-2.5 text-xs font-semibold text-[#FFFFFF] transition-colors hover:bg-[#FF6B00] sm:whitespace-nowrap"
                      >
                        <RotateCcw size={13} aria-hidden="true" />
                        Step Away &amp; Wipe Receiver
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex cursor-wait items-center gap-2 rounded-md border border-[#334155] bg-[#090D16] px-4 py-2.5 text-xs font-semibold text-[#CBD5E1] sm:whitespace-nowrap"
                      >
                        <RotateCcw size={13} aria-hidden="true" />
                        Purging Receiver Memory...
                      </button>
                    )}
                  </div>
                </div>

                {/* 4-Step End-to-End Progress Stepper + AnimatedBeam Connection */}
                <div className="mt-4 border-t border-[#1E293B] pt-3.5">
                  <div
                    ref={beamContainerRef}
                    className="relative mb-3 flex items-center justify-between gap-4 rounded-md border border-[#1E293B] bg-[#090D16] px-3.5 py-2"
                  >
                    <AnimatedBeam
                      containerRef={beamContainerRef}
                      fromRef={beamKeyRef}
                      toRef={beamReceiverRef}
                      curvature={0}
                      active={
                        phase === 'step1-tap' ||
                        phase === 'step2-handshake' ||
                        phase === 'step3-live'
                      }
                      reverse={phase === 'step4-wipe'}
                      pathColor="#1E293B"
                      pathWidth={1.5}
                      gradientStartColor="#00A896"
                      gradientStopColor="#FF6B00"
                      duration={1.5}
                    />

                    <div
                      ref={beamKeyRef}
                      className="relative z-10 inline-flex items-center gap-1.5 rounded-sm border border-[#334155] bg-[#090D16] px-2.5 py-1  text-[10px] font-semibold text-[#FF6B00]"
                    >
                      <KeyRound size={11} aria-hidden="true" />
                      <span>KEY #PK-409</span>
                    </div>

                    <span className="relative z-10 rounded-sm bg-[#090D16] px-2  text-[10px] text-[#CBD5E1]">
                      {phase === 'idle'
                        ? 'Awaiting Tap'
                        : phase === 'step1-tap'
                          ? 'Encrypted NFC Link'
                          : phase === 'step2-handshake'
                            ? 'Role Cert Verified'
                            : phase === 'step3-live'
                              ? '1 Partition Active'
                              : 'Purging to 0 Bytes'}
                    </span>

                    <div
                      ref={beamReceiverRef}
                      className="relative z-10 inline-flex items-center gap-1.5 rounded-sm border border-[#334155] bg-[#090D16] px-2.5 py-1  text-[10px] font-semibold text-[#FFFFFF]"
                    >
                      <Radio size={11} className="text-[#00A896]" aria-hidden="true" />
                      <span className="hidden sm:inline">{activeScenario.verifiedCredential}</span>
                      <span className="sm:hidden">RECEIVER</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {WORKFLOW_STEPS.map((step) => {
                      const isCurrent = phase === step.id;
                      const isCompleted =
                        (phase === 'step2-handshake' && step.id === 'step1-tap') ||
                        (phase === 'step3-live' &&
                          (step.id === 'step1-tap' || step.id === 'step2-handshake'));

                      return (
                        <div
                          key={step.id}
                          className={`rounded-md border px-2.5 py-1.5  text-[10px] font-semibold transition-colors ${
                            isCurrent
                              ? 'border-[#00A896] bg-[#090D16] text-[#FFFFFF]'
                              : isCompleted
                                ? 'border-[#1E293B] bg-[#090D16] text-[#00A896]'
                                : 'border-[#1E293B] bg-[#090D16] text-[#94A3B8]'
                          }`}
                        >
                          <span className="hidden xl:inline">{step.label}</span>
                          <span className="xl:hidden">{step.shortLabel}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Main Viewport Body */}
              <div className="p-5">
                {/* Architecture Status Bar (Visible in Stage 1, Stage 2 & Stage 3) */}
                {showArchitectureProof && (
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className={`mb-4 grid grid-cols-1 gap-2.5 rounded-md border bg-[#090D16] p-3 sm:grid-cols-3 ${
                      phase === 'step1-tap' ? 'border-[#FF6B00]' : 'border-[#00A896]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={14}
                        className="mt-0.5 shrink-0 text-[#00A896]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className=" text-[10px] font-semibold text-[#CBD5E1]">
                          On-Key Vault
                        </p>
                        <p className=" text-[11px] font-semibold text-[#FFFFFF]">
                          [1 Unlocked / 4 Sealed]
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={14}
                        className="mt-0.5 shrink-0 text-[#00A896]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className=" text-[10px] font-semibold text-[#CBD5E1]">
                          Provider Receiver
                        </p>
                        <p className=" text-[11px] font-semibold text-[#FFFFFF]">
                          [Role Certificate Verified]
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Cpu
                        size={14}
                        className="mt-0.5 shrink-0 text-[#FF6B00]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className=" text-[10px] font-semibold text-[#CBD5E1]">
                          Local Translation Engine
                        </p>
                        <p className=" text-[11px] font-semibold text-[#FFFFFF]">
                          [Cloud Bypassed]
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {/* IDLE STATE */}
                  {phase === 'idle' && (
                    <motion.div
                      key={`idle-${activeScenario.id}`}
                      initial={shouldReduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.16 }}
                      className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-[#334155] bg-[#090D16] p-6 text-center"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#1E293B] bg-[#090D16] text-[#FFFFFF]">
                        <Nfc size={22} aria-hidden="true" />
                      </div>
                      <h4 className="mt-4 text-sm font-semibold text-[#FFFFFF]">
                        {activeScenario.environmentType} — Neutral Baseline
                      </h4>
                      <p className="mt-1.5 max-w-md text-xs text-[#CBD5E1]">
                        Receiver memory is empty. Select &ldquo;Tap PersonaKey on Receiver&rdquo; above to begin the 4-step local handshake.
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                        <span className="inline-flex items-center rounded-md border border-[#1E293B] bg-[#090D16] px-3 py-1  text-[11px] font-semibold text-[#FFFFFF]">
                          0 Bytes Retained
                        </span>
                        {lastWipeTimestamp && (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#00A896] bg-[#090D16] px-3 py-1  text-[11px] font-semibold text-[#00A896]">
                            <CheckCircle2 size={12} aria-hidden="true" />
                            {lastWipeTimestamp}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 1 & STEP 2 HANDSHAKE TRANSITION */}
                  {(phase === 'step1-tap' || phase === 'step2-handshake') && (
                    <motion.div
                      key={phase}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-[#00A896] bg-[#090D16] p-6 text-center"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#00A896] bg-[#090D16] text-[#FF6B00]">
                        {phase === 'step1-tap' ? (
                          <Nfc size={22} aria-hidden="true" />
                        ) : (
                          <ShieldCheck size={22} className="text-[#00A896]" aria-hidden="true" />
                        )}
                      </div>
                      <h4 className="mt-4 text-sm font-semibold text-[#FFFFFF]">
                        {phase === 'step1-tap'
                          ? `Step 1: Establishing Offline NFC/BLE Link with ${activeScenario.verifiedCredential}...`
                          : `Step 2: Role Certificate Verified — Unlocking Single Authorised Partition...`}
                      </h4>
                      <p className="mt-1.5 max-w-md text-xs text-[#CBD5E1]">
                        {phase === 'step1-tap'
                          ? 'Zero cloud round-trip. Handshaking directly with the key’s local secure element.'
                          : 'Translating approved intent fields into native local hardware controls while sealing the other 4 partitions.'}
                      </p>
                    </motion.div>
                  )}

                  {/* STEP 4 PURGE ANIMATION */}
                  {phase === 'step4-wipe' && (
                    <motion.div
                      key="step4-wipe"
                      initial={shouldReduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.16 }}
                      className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-[#FF6B00] bg-[#090D16] p-6 text-center"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#FF6B00] bg-[#090D16] text-[#FF6B00]">
                        <RotateCcw size={22} aria-hidden="true" />
                      </div>
                      <h4 className="mt-4 text-sm font-semibold text-[#FFFFFF]">
                        Step 4: Wiping Ephemeral Session &amp; Restoring Baseline...
                      </h4>
                      <p className="mt-1.5 max-w-md text-xs text-[#CBD5E1]">
                        Clearing temporary display, climate, and triage buffers from {activeScenario.verifiedCredential}. Re-sealing all 5 partitions on your PersonaKey.
                      </p>
                    </motion.div>
                  )}

                  {/* STEP 3 LIVE INTERACTIVE ENVIRONMENT SCREENS */}
                  {phase === 'step3-live' && (
                    <motion.div
                      key={`live-${activeScenario.id}`}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-4"
                    >
                      {/* 1. NHS EMERGENCY TRIAGE */}
                      {activeScenario.id === 'nhs-triage' && (
                        <div className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 text-[#090D16]">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                            <div>
                              <span className=" text-[10px] font-semibold text-[#00A896]">
                                PARAMEDIC TRIAGE TABLET · PARTITION 05 ACTIVE
                              </span>
                              <h4 className="mt-0.5 text-base font-semibold text-[#090D16]">
                                Critical Care Directives — Sarah Jenkins
                              </h4>
                            </div>
                            <span className="rounded-md bg-[#090D16] px-3 py-1  text-xs font-semibold text-[#FFFFFF]">
                              Blood Group: {vault.emergency.bloodType}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                              <span className=" text-[10px] font-semibold text-[#64748B]">
                                SEVERE ALLERGIES
                              </span>
                              <p className="mt-1 text-sm font-semibold text-[#090D16]">
                                {vault.emergency.allergies || 'None Reported'}
                              </p>
                            </div>
                            <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                              <span className=" text-[10px] font-semibold text-[#64748B]">
                                EMERGENCY NEXT-OF-KIN
                              </span>
                              <p className="mt-1 text-sm font-semibold text-[#090D16]">
                                {vault.emergency.nextOfKin}
                              </p>
                            </div>
                          </div>

                          {/* Toggleable BSL / Non-Verbal Communication Directive Card */}
                          <div className="mt-3 rounded-md border border-[#00A896] bg-[#F8FAFC] p-3.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className=" text-[10px] font-semibold text-[#00A896]">
                                BSL / Non-Verbal Communication Directive
                              </span>
                              <button
                                type="button"
                                onClick={() => setBslAlertExpanded((prev) => !prev)}
                                className="pk-focus-ring cursor-pointer rounded-sm border border-[#090D16] bg-[#FFFFFF] px-2.5 py-1  text-[10px] font-semibold text-[#090D16] transition-colors hover:bg-[#090D16] hover:text-[#FFFFFF]"
                              >
                                {bslAlertExpanded ? 'Collapse Directive' : 'Expand Directive'}
                              </button>
                            </div>
                            <p className="mt-1.5 text-sm font-semibold text-[#090D16]">
                              {vault.emergency.communicationDirective}
                            </p>
                            {bslAlertExpanded && (
                              <p className="mt-1.5 text-xs text-[#334155]">
                                Clinical responder guidance: Present visual triage cards and request remote BSL video relay before verbal consent checks.
                              </p>
                            )}
                          </div>

                          <div className="mt-3 flex items-center gap-2 rounded-md border border-[#090D16] bg-[#090D16] px-3 py-2  text-[11px] font-semibold text-[#FFFFFF]">
                            <Lock size={12} className="shrink-0 text-[#FF6B00]" aria-hidden="true" />
                            <span>Workplace, Home &amp; Travel Partitions: SEALED</span>
                          </div>
                        </div>
                      )}

                      {/* 2. COWORKING HOT-DESK */}
                      {activeScenario.id === 'coworking-desk' && (
                        <div
                          className={`rounded-lg border-2 p-5 transition-colors ${
                            vault.workplace.theme === 'High Contrast'
                              ? 'border-[#00A896] bg-[#090D16] text-[#FFFFFF]'
                              : vault.workplace.theme === 'Warm Paper'
                                ? 'border-[#FF6B00] bg-[#F8FAFC] text-[#090D16] sepia-[0.28]'
                                : 'border-[#E2E8F0] bg-[#FFFFFF] text-[#090D16]'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-current/20 pb-3">
                            <span className=" text-[11px] font-semibold">
                              WORKSTATION MONITOR · {vault.workplace.language.toUpperCase()}
                            </span>
                            <span className="rounded-md border border-current/30 px-2.5 py-0.5  text-[11px] font-semibold tabular-nums">
                              Desk Actuator: {vault.workplace.standingDeskCm}cm
                            </span>
                          </div>

                          <h4
                            className={`mt-4 font-semibold tracking-[-0.02em] ${
                              vault.workplace.textScale === '150%'
                                ? 'text-2xl'
                                : vault.workplace.textScale === '135%'
                                  ? 'text-xl'
                                  : vault.workplace.textScale === '115%'
                                    ? 'text-lg'
                                    : 'text-base'
                            }`}
                          >
                            {workplaceHeadlineByLang[vault.workplace.language]} ({vault.workplace.textScale})
                          </h4>

                          <p
                            className={`mt-2 leading-relaxed ${
                              vault.workplace.textScale === '150%'
                                ? 'text-base'
                                : vault.workplace.textScale === '135%'
                                  ? 'text-sm'
                                  : 'text-xs'
                            }`}
                          >
                            OS scaling locked at {vault.workplace.textScale} in {vault.workplace.theme} theme. Interface language set to {vault.workplace.language}.
                          </p>

                          {/* Interactive Monitor Quick Controls */}
                          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-current/20 pt-3.5 sm:grid-cols-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className=" text-[10px] font-semibold">
                                STANDING DESK HEIGHT
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onVaultChange((prev) => ({
                                      ...prev,
                                      workplace: {
                                        ...prev.workplace,
                                        standingDeskCm: Math.max(100, prev.workplace.standingDeskCm - 2),
                                      },
                                    }))
                                  }
                                  className="pk-focus-ring cursor-pointer rounded-sm border border-current/40 px-2 py-0.5  text-xs font-semibold"
                                >
                                  -
                                </button>
                                <span className=" text-xs font-semibold tabular-nums">
                                  {vault.workplace.standingDeskCm}cm
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onVaultChange((prev) => ({
                                      ...prev,
                                      workplace: {
                                        ...prev.workplace,
                                        standingDeskCm: Math.min(120, prev.workplace.standingDeskCm + 2),
                                      },
                                    }))
                                  }
                                  className="pk-focus-ring cursor-pointer rounded-sm border border-current/40 px-2 py-0.5  text-xs font-semibold"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <span className=" text-[10px] font-semibold">
                                ZOOM SCALE
                              </span>
                              <div className="flex items-center gap-1">
                                {(['100%', '115%', '135%', '150%'] as const).map((scale) => (
                                  <button
                                    key={scale}
                                    type="button"
                                    onClick={() =>
                                      onVaultChange((prev) => ({
                                        ...prev,
                                        workplace: { ...prev.workplace, textScale: scale },
                                      }))
                                    }
                                    className={`pk-focus-ring cursor-pointer rounded-sm border px-1.5 py-0.5  text-[10px] font-semibold ${
                                      vault.workplace.textScale === scale
                                        ? 'border-[#00A896] bg-[#00A896] text-[#FFFFFF]'
                                        : 'border-current/30'
                                    }`}
                                  >
                                    {scale}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <span className=" text-[10px] font-semibold">
                                THEME
                              </span>
                              <div className="flex items-center gap-1">
                                {(['High Contrast', 'Warm Paper', 'Standard'] as const).map((themeOption) => (
                                  <button
                                    key={themeOption}
                                    type="button"
                                    onClick={() =>
                                      onVaultChange((prev) => ({
                                        ...prev,
                                        workplace: { ...prev.workplace, theme: themeOption },
                                      }))
                                    }
                                    className={`pk-focus-ring cursor-pointer rounded-sm border px-1.5 py-0.5  text-[10px] font-semibold ${
                                      vault.workplace.theme === themeOption
                                        ? 'border-[#00A896] bg-[#00A896] text-[#FFFFFF]'
                                        : 'border-current/30'
                                    }`}
                                  >
                                    {themeOption === 'High Contrast'
                                      ? 'Contrast'
                                      : themeOption === 'Warm Paper'
                                        ? 'Warm'
                                        : 'Std'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <span className=" text-[10px] font-semibold">
                                LANGUAGE
                              </span>
                              <div className="flex items-center gap-1">
                                {(['English (UK)', 'Cymraeg', 'Français'] as const).map((lang) => (
                                  <button
                                    key={lang}
                                    type="button"
                                    onClick={() =>
                                      onVaultChange((prev) => ({
                                        ...prev,
                                        workplace: { ...prev.workplace, language: lang },
                                      }))
                                    }
                                    className={`pk-focus-ring cursor-pointer rounded-sm border px-1.5 py-0.5  text-[10px] font-semibold ${
                                      vault.workplace.language === lang
                                        ? 'border-[#00A896] bg-[#00A896] text-[#FFFFFF]'
                                        : 'border-current/30'
                                    }`}
                                  >
                                    {lang === 'English (UK)' ? 'EN-UK' : lang}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. CAR HIRE / SHARED EV */}
                      {activeScenario.id === 'car-hire' && (
                        <div className="rounded-lg border border-[#1E293B] bg-[#090D16] p-5 text-[#FFFFFF]">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
                            <span className=" text-[11px] font-semibold text-[#00A896]">
                              EV CABIN CONSOLE · PARTITION 02 ACTIVE
                            </span>
                            <span className=" text-xs font-semibold tabular-nums">
                              Cabin: {vault.mobility.cabinTempC}°C · {vault.mobility.regenMode}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-12">
                            {/* Seat & Lumbar Diagram */}
                            <div className="flex items-center gap-3 rounded-md border border-[#1E293B] bg-[#090D16] p-3.5 sm:col-span-5">
                              <svg
                                width="54"
                                height="58"
                                viewBox="0 0 54 58"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="shrink-0"
                              >
                                <path
                                  d={
                                    vault.mobility.seatProfile === 'Lumbar +2 · Mirror Set B'
                                      ? 'M14 10L20 34H42L44 44H14L8 12L14 10Z'
                                      : 'M18 10L20 34H42L44 44H14L12 12L18 10Z'
                                  }
                                  stroke="#00A896"
                                  strokeWidth="2"
                                  fill="#090D16"
                                />
                                <circle
                                  cx={vault.mobility.seatProfile === 'Lumbar +2 · Mirror Set B' ? 21 : 19}
                                  cy="26"
                                  r="3"
                                  fill="#FF6B00"
                                />
                              </svg>
                              <div className="min-w-0">
                                <span className=" text-[10px] text-[#94A3B8]">
                                  SEAT LUMBAR COORDINATES
                                </span>
                                <p className="mt-1 text-xs font-semibold text-[#FFFFFF]">
                                  {vault.mobility.seatProfile}
                                </p>
                                <p className="mt-0.5  text-[10px] text-[#00A896] tabular-nums">
                                  {vault.mobility.seatProfile === 'Lumbar +2 · Mirror Set B'
                                    ? 'X:+2mm · Y:+14mm · Recline 104°'
                                    : 'X:0mm · Y:0mm · Recline 98°'}
                                </p>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onVaultChange((prev) => ({
                                      ...prev,
                                      mobility: {
                                        ...prev.mobility,
                                        seatProfile:
                                          prev.mobility.seatProfile === 'Lumbar +2 · Mirror Set B'
                                            ? 'Neutral Position A'
                                            : 'Lumbar +2 · Mirror Set B',
                                      },
                                    }))
                                  }
                                  className="pk-focus-ring mt-2 cursor-pointer rounded-sm border border-[#334155] px-2 py-0.5  text-[10px] font-semibold text-[#CBD5E1] hover:border-[#00A896]"
                                >
                                  Toggle Profile
                                </button>
                              </div>
                            </div>

                            {/* Cabin Climate & Regen Braking */}
                            <div className="space-y-3 sm:col-span-7">
                              <div className="flex items-center justify-between rounded-md border border-[#1E293B] bg-[#090D16] p-3">
                                <div>
                                  <span className=" text-[10px] text-[#94A3B8]">
                                    CABIN CLIMATE
                                  </span>
                                  <p className="text-sm font-semibold text-[#FFFFFF] tabular-nums">
                                    {vault.mobility.cabinTempC}°C Auto
                                  </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onVaultChange((prev) => ({
                                        ...prev,
                                        mobility: {
                                          ...prev.mobility,
                                          cabinTempC: Math.max(18, prev.mobility.cabinTempC - 1),
                                        },
                                      }))
                                    }
                                    className="pk-focus-ring cursor-pointer rounded-sm border border-[#334155] bg-[#090D16] px-2.5 py-1  text-xs font-semibold text-[#FFFFFF] hover:border-[#00A896]"
                                  >
                                    -
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onVaultChange((prev) => ({
                                        ...prev,
                                        mobility: {
                                          ...prev.mobility,
                                          cabinTempC: Math.min(23, prev.mobility.cabinTempC + 1),
                                        },
                                      }))
                                    }
                                    className="pk-focus-ring cursor-pointer rounded-sm border border-[#334155] bg-[#090D16] px-2.5 py-1  text-xs font-semibold text-[#FFFFFF] hover:border-[#00A896]"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="rounded-md border border-[#1E293B] bg-[#090D16] p-3">
                                <span className=" text-[10px] text-[#94A3B8]">
                                  REGENERATIVE BRAKING PROFILE
                                </span>
                                <div className="mt-2 grid grid-cols-3 gap-1.5">
                                  {(['High One-Pedal', 'Balanced', 'Coast'] as const).map((mode) => (
                                    <button
                                      key={mode}
                                      type="button"
                                      onClick={() =>
                                        onVaultChange((prev) => ({
                                          ...prev,
                                          mobility: { ...prev.mobility, regenMode: mode },
                                        }))
                                      }
                                      className={`pk-focus-ring cursor-pointer rounded-sm border px-2 py-1  text-[10px] font-semibold transition-colors ${
                                        vault.mobility.regenMode === mode
                                          ? 'border-[#00A896] bg-[#00A896] text-[#FFFFFF]'
                                          : 'border-[#334155] bg-[#090D16] text-[#CBD5E1]'
                                      }`}
                                    >
                                      {mode}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4. HOTEL SUITE */}
                      {activeScenario.id === 'hotel-checkin' && (
                        <div className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 text-[#090D16]">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                            <span className=" text-[11px] font-semibold text-[#00A896]">
                              SUITE #402 CONTROL PANEL · PARTITION 03 ACTIVE
                            </span>
                            <span className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-0.5  text-[11px] font-semibold text-[#090D16] tabular-nums">
                              {vault.hospitality.lightingKelvin}K · {vault.hospitality.sleepTempC}°C
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {/* Live Warm Lighting Preview */}
                            <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5  text-[10px] font-semibold text-[#64748B]">
                                  <Sun size={12} className="text-[#FF6B00]" aria-hidden="true" />
                                  LIVE ROOM LIGHTING
                                </span>
                                <span className=" text-xs font-semibold text-[#090D16]">
                                  {vault.hospitality.lightingKelvin}K
                                </span>
                              </div>
                              <div
                                className={`mt-2.5 rounded-sm border border-[#E2E8F0] px-3 py-2 text-xs font-medium ${
                                  vault.hospitality.lightingKelvin === 2700
                                    ? 'bg-[#FF6B00] text-[#FFFFFF]'
                                    : vault.hospitality.lightingKelvin === 3200
                                      ? 'bg-[#F8FAFC] text-[#090D16]'
                                      : 'bg-[#FFFFFF] text-[#090D16]'
                                }`}
                              >
                                {vault.hospitality.lightingKelvin === 2700
                                  ? '2700K Evening Amber Warmth Active'
                                  : vault.hospitality.lightingKelvin === 3200
                                    ? '3200K Soft Ambient Active'
                                    : '4000K Neutral Reading Light Active'}
                              </div>
                              <div className="mt-2.5 flex gap-1.5">
                                {([2700, 3200, 4000] as const).map((k) => (
                                  <button
                                    key={k}
                                    type="button"
                                    onClick={() =>
                                      onVaultChange((prev) => ({
                                        ...prev,
                                        hospitality: { ...prev.hospitality, lightingKelvin: k },
                                      }))
                                    }
                                    className={`pk-focus-ring cursor-pointer rounded-sm border px-2 py-1  text-[10px] font-semibold ${
                                      vault.hospitality.lightingKelvin === k
                                        ? 'border-[#090D16] bg-[#090D16] text-[#FFFFFF]'
                                        : 'border-[#E2E8F0] bg-[#FFFFFF] text-[#334155]'
                                    }`}
                                  >
                                    {k}K
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Sleep Temp + TV Subtitles Toggle */}
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                                <div>
                                  <span className=" text-[10px] text-[#64748B]">
                                    SLEEP CLIMATE
                                  </span>
                                  <p className="text-xs font-semibold text-[#090D16] tabular-nums">
                                    {vault.hospitality.sleepTempC}°C Night Target
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onVaultChange((prev) => ({
                                        ...prev,
                                        hospitality: {
                                          ...prev.hospitality,
                                          sleepTempC: Math.max(17, prev.hospitality.sleepTempC - 1),
                                        },
                                      }))
                                    }
                                    className="pk-focus-ring cursor-pointer rounded-sm border border-[#E2E8F0] bg-[#FFFFFF] px-2 py-0.5  text-xs font-semibold"
                                  >
                                    -
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onVaultChange((prev) => ({
                                        ...prev,
                                        hospitality: {
                                          ...prev.hospitality,
                                          sleepTempC: Math.min(22, prev.hospitality.sleepTempC + 1),
                                        },
                                      }))
                                    }
                                    className="pk-focus-ring cursor-pointer rounded-sm border border-[#E2E8F0] bg-[#FFFFFF] px-2 py-0.5  text-xs font-semibold"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                                <div>
                                  <span className=" text-[10px] text-[#64748B]">
                                    TV SUBTITLES · BEDDING
                                  </span>
                                  <p className="text-xs font-semibold text-[#090D16]">
                                    {vault.hospitality.tvSubtitles ? 'Subtitles On' : 'Subtitles Off'} · {vault.hospitality.bedding}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onVaultChange((prev) => ({
                                      ...prev,
                                      hospitality: {
                                        ...prev.hospitality,
                                        tvSubtitles: !prev.hospitality.tvSubtitles,
                                      },
                                    }))
                                  }
                                  className="pk-focus-ring cursor-pointer rounded-sm border border-[#090D16] bg-[#FFFFFF] px-2.5 py-1  text-[10px] font-semibold text-[#090D16]"
                                >
                                  Toggle Captions
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 5. AIRPORT / BANK KIOSK */}
                      {activeScenario.id === 'public-kiosk' && (
                        <div className="rounded-lg border-2 border-[#FFFFFF] bg-[#090D16] p-5 text-[#FFFFFF]">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#334155] pb-3">
                            <span className="inline-flex items-center gap-1.5  text-[11px] font-semibold text-[#00A896]">
                              <Volume2 size={14} aria-hidden="true" />
                              HIGH-CONTRAST TERMINAL · AUDIO-ASSIST {audioAssistPreview ? 'ON' : 'MUTED'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setAudioAssistPreview((prev) => !prev)}
                              className="pk-focus-ring cursor-pointer rounded-md border border-[#FFFFFF] px-2.5 py-0.5  text-[11px] font-semibold hover:bg-[#FFFFFF] hover:text-[#090D16]"
                            >
                              {audioAssistPreview ? 'Audio Readout: Active' : 'Audio Readout: Muted'}
                            </button>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <button
                              type="button"
                              onClick={() =>
                                setKioskActionMessage(
                                  audioAssistPreview
                                    ? `Audio Assist Active: Printing large-text boarding pass (${vault.public.touchTarget}).`
                                    : `High-Contrast Print Queued (${vault.public.touchTarget}).`,
                                )
                              }
                              className="pk-focus-ring pk-card-hover cursor-pointer rounded-md border-2 border-[#FFFFFF] bg-[#090D16] p-4 text-left hover:border-[#00A896]"
                            >
                              <p className="text-base font-semibold text-[#FFFFFF]">
                                Print Boarding Pass
                              </p>
                              <p className="mt-1 text-xs text-[#CBD5E1]">
                                {vault.public.touchTarget} · {vault.public.extendedTimeoutSec}s timeout
                              </p>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setKioskActionMessage(
                                  audioAssistPreview
                                    ? 'Audio Assist Active: Gate assistance request sent via local terminal.'
                                    : 'Gate Assistance Requested via local terminal.',
                                )
                              }
                              className="pk-focus-ring pk-card-hover cursor-pointer rounded-md border-2 border-[#FFFFFF] bg-[#090D16] p-4 text-left hover:border-[#00A896]"
                            >
                              <p className="text-base font-semibold text-[#FFFFFF]">
                                Request Gate Assistance
                              </p>
                              <p className="mt-1 text-xs text-[#CBD5E1]">
                                3.5mm tactile audio guidance active
                              </p>
                            </button>
                          </div>

                          {kioskActionMessage && (
                            <div className="mt-3 rounded-md border border-[#00A896] bg-[#090D16] px-3 py-2  text-[11px] font-semibold text-[#00A896]">
                              {kioskActionMessage}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 6. SMART FITNESS STUDIO */}
                      {activeScenario.id === 'fitness-studio' && (
                        <div className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 text-[#090D16]">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                            <span className=" text-[11px] font-semibold text-[#00A896]">
                              ADAPTIVE GYM CONSOLE · PARTITION 04 ACTIVE
                            </span>
                            <span className="rounded-md border border-[#090D16] bg-[#F8FAFC] px-2.5 py-0.5  text-[11px] font-semibold text-[#090D16]">
                              High-Visibility Font
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                              <span className=" text-[10px] text-[#64748B]">
                                MACHINE CALIBRATION
                              </span>
                              <p className="mt-1 text-base font-semibold text-[#090D16]">
                                {vault.public.adaptiveRig}
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  onVaultChange((prev) => ({
                                    ...prev,
                                    public: {
                                      ...prev.public,
                                      adaptiveRig:
                                        prev.public.adaptiveRig === 'Low-Impact Seated Preset'
                                          ? 'Standing Ergonomic Preset'
                                          : 'Low-Impact Seated Preset',
                                    },
                                  }))
                                }
                                className="pk-focus-ring mt-2.5 cursor-pointer rounded-sm border border-[#090D16] bg-[#FFFFFF] px-2.5 py-1  text-[10px] font-semibold text-[#090D16]"
                              >
                                Switch Calibration
                              </button>
                            </div>

                            <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                              <span className=" text-[10px] text-[#64748B]">
                                TARGET HEART-RATE ZONE
                              </span>
                              <p className="mt-1 text-base font-semibold text-[#090D16] tabular-nums">
                                {vault.public.fitnessHrZone}
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  onVaultChange((prev) => ({
                                    ...prev,
                                    public: {
                                      ...prev.public,
                                      fitnessHrZone:
                                        prev.public.fitnessHrZone === 'Zone 2 (128–142 bpm)'
                                          ? 'Zone 3 (143–158 bpm)'
                                          : 'Zone 2 (128–142 bpm)',
                                    },
                                  }))
                                }
                                className="pk-focus-ring mt-2.5 cursor-pointer rounded-sm border border-[#090D16] bg-[#FFFFFF] px-2.5 py-1  text-[10px] font-semibold text-[#090D16]"
                              >
                                Switch Target Zone
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sealed Partitions Footer Banner */}
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#00A896] bg-[#090D16] px-3.5 py-2.5">
                        <span className="inline-flex items-center gap-2 text-xs font-medium text-[#FFFFFF]">
                          <CheckCircle2
                            size={14}
                            className="shrink-0 text-[#00A896]"
                            aria-hidden="true"
                          />
                          4 unrelated partitions remain SEALED ON DEVICE. Click &ldquo;Step Away &amp; Wipe Receiver&rdquo; to reset to 0 bytes.
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
