export type PartitionId =
  | 'workplace'
  | 'mobility'
  | 'hospitality'
  | 'public'
  | 'emergency';

export interface VaultPartitionMeta {
  id: PartitionId;
  index: string;
  name: string;
  scopeNote: string;
}

export const VAULT_PARTITIONS: VaultPartitionMeta[] = [
  {
    id: 'workplace',
    index: '01',
    name: 'Workplace & Display',
    scopeNote: 'Text zoom, contrast theme, language, standing desk height',
  },
  {
    id: 'mobility',
    index: '02',
    name: 'Mobility & EV',
    scopeNote: 'Seat & lumbar memory, cabin climate, regen braking, voice cues',
  },
  {
    id: 'hospitality',
    index: '03',
    name: 'Hospitality & Room',
    scopeNote: 'Warm lighting, sleep temperature, TV subtitles, bedding',
  },
  {
    id: 'public',
    index: '04',
    name: 'Public Accessibility',
    scopeNote: 'Audio assist, large touch targets, extended timeout, adaptive console',
  },
  {
    id: 'emergency',
    index: '05',
    name: 'Emergency Care Directives',
    scopeNote: 'Blood group, severe allergies, next-of-kin, BSL directive',
  },
];

export interface KeyVaultData {
  workplace: {
    textScale: '100%' | '115%' | '135%' | '150%';
    theme: 'High Contrast' | 'Standard' | 'Warm Paper';
    language: 'English (UK)' | 'Cymraeg' | 'Français';
    standingDeskCm: number;
  };
  mobility: {
    seatProfile: 'Lumbar +2 · Mirror Set B' | 'Neutral Position A';
    cabinTempC: number;
    regenMode: 'High One-Pedal' | 'Balanced' | 'Coast';
    voiceNavCues: boolean;
  };
  hospitality: {
    lightingKelvin: 2700 | 3200 | 4000;
    sleepTempC: number;
    tvSubtitles: boolean;
    bedding: 'Hypoallergenic' | 'Standard';
  };
  public: {
    screenReader: boolean;
    touchTarget: 'Large Touch Targets' | 'Standard';
    extendedTimeoutSec: 90 | 120;
    fitnessHrZone: 'Zone 2 (128–142 bpm)' | 'Zone 3 (143–158 bpm)';
    adaptiveRig: 'Low-Impact Seated Preset' | 'Standing Ergonomic Preset';
  };
  emergency: {
    bloodType: 'O-Negative' | 'A-Positive' | 'B-Positive' | 'AB-Negative';
    allergies: string;
    nextOfKin: string;
    communicationDirective:
      | 'Non-Verbal / BSL Interpreter'
      | 'Easy-Read Visual Prompts'
      | 'Standard Spoken English';
  };
}

export const DEFAULT_KEY_VAULT: KeyVaultData = {
  workplace: {
    textScale: '135%',
    theme: 'High Contrast',
    language: 'English (UK)',
    standingDeskCm: 108,
  },
  mobility: {
    seatProfile: 'Lumbar +2 · Mirror Set B',
    cabinTempC: 20,
    regenMode: 'High One-Pedal',
    voiceNavCues: true,
  },
  hospitality: {
    lightingKelvin: 2700,
    sleepTempC: 19,
    tvSubtitles: true,
    bedding: 'Hypoallergenic',
  },
  public: {
    screenReader: true,
    touchTarget: 'Large Touch Targets',
    extendedTimeoutSec: 120,
    fitnessHrZone: 'Zone 2 (128–142 bpm)',
    adaptiveRig: 'Low-Impact Seated Preset',
  },
  emergency: {
    bloodType: 'O-Negative',
    allergies: 'Penicillin, Latex',
    nextOfKin: 'David Jenkins · +44 7700 900123',
    communicationDirective: 'Non-Verbal / BSL Interpreter',
  },
};

export type ScenarioId =
  | 'nhs-triage'
  | 'coworking-desk'
  | 'car-hire'
  | 'hotel-checkin'
  | 'public-kiosk'
  | 'fitness-studio';

export interface ReceiverScenario {
  id: ScenarioId;
  tabLabel: string;
  title: string;
  environmentType: string;
  verifiedCredential: string;
  unlocksPartition: PartitionId;
  isMvp: boolean;
  phaseTag:
    | 'Year-1 Pilot MVP (Available Now)'
    | 'Phase 2–3 Partner Ecosystem Preview';
  summary: string;
}

export const RECEIVER_SCENARIOS: ReceiverScenario[] = [
  {
    id: 'nhs-triage',
    tabLabel: '1. NHS Emergency Triage',
    title: 'NHS Emergency Triage',
    environmentType: 'Paramedic Clinical Triage Tablet',
    verifiedCredential: 'NHS_RESPONDER_UK',
    unlocksPartition: 'emergency',
    isMvp: false,
    phaseTag: 'Phase 2–3 Partner Ecosystem Preview',
    summary:
      'Unlocks ONLY Blood Group, Severe Allergies, Next-of-Kin, and BSL / Non-Verbal communication alert.',
  },
  {
    id: 'coworking-desk',
    tabLabel: '2. Coworking Hot-Desk & Inclusive Workplace',
    title: 'Coworking Hot-Desk & Inclusive Workplace',
    environmentType: 'Shared Windows / Mac Workstation',
    verifiedCredential: 'WORKPLACE_DESK_04',
    unlocksPartition: 'workplace',
    isMvp: true,
    phaseTag: 'Year-1 Pilot MVP (Available Now)',
    summary:
      'Unlocks text zoom, high-contrast theme, language, and standing desk height; seals medical, EV, and hotel data.',
  },
  {
    id: 'car-hire',
    tabLabel: '3. Car Hire / Shared EV',
    title: 'Car Hire / Shared EV',
    environmentType: 'Fleet EV Cabin Console',
    verifiedCredential: 'FLEET_EV_B12',
    unlocksPartition: 'mobility',
    isMvp: false,
    phaseTag: 'Phase 2–3 Partner Ecosystem Preview',
    summary:
      'Unlocks seat & lumbar calibration, cabin climate, regen braking, and voice-nav cues.',
  },
  {
    id: 'hotel-checkin',
    tabLabel: '4. Hotel Suite',
    title: 'Hotel Suite',
    environmentType: 'Room #402 Matter Control Hub',
    verifiedCredential: 'SUITE_HUB_402',
    unlocksPartition: 'hospitality',
    isMvp: false,
    phaseTag: 'Phase 2–3 Partner Ecosystem Preview',
    summary:
      'Unlocks warm lighting Kelvin, sleep climate, TV subtitles, and hypoallergenic bedding.',
  },
  {
    id: 'public-kiosk',
    tabLabel: '5. Airport / Bank Kiosk',
    title: 'Airport / Bank Kiosk',
    environmentType: 'Public Self-Service Terminal',
    verifiedCredential: 'PUBLIC_KIOSK_07',
    unlocksPartition: 'public',
    isMvp: false,
    phaseTag: 'Phase 2–3 Partner Ecosystem Preview',
    summary:
      'Unlocks high-contrast large touch targets, audio-assist readout, and extended session timeout.',
  },
  {
    id: 'fitness-studio',
    tabLabel: '6. Smart Fitness Studio',
    title: 'Smart Fitness Studio',
    environmentType: 'Adaptive Gym Console',
    verifiedCredential: 'STUDIO_CONSOLE_02',
    unlocksPartition: 'public',
    isMvp: false,
    phaseTag: 'Phase 2–3 Partner Ecosystem Preview',
    summary:
      'Unlocks adaptive machine preset, target heart-rate zone, and high-visibility console typography.',
  },
];
