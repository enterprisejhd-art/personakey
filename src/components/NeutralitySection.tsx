import { useState } from 'react';
import { Check, Info, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { type KeyVaultData, type ScenarioId } from '../data/vault';
import { SdkPayloadInspector } from './SdkPayloadInspector';

interface NeutralitySectionProps {
  vault: KeyVaultData;
  scenarioId: ScenarioId;
  isConnected: boolean;
}

type MatrixStatus =
  | 'Core Architecture'
  | 'Ecosystem-Locked'
  | 'Cloud Required'
  | 'Not Supported';

interface ComparisonRow {
  platform: string;
  limitation: string;
  isPersonaKey?: boolean;
  zeroCloudStorage: MatrixStatus;
  crossVenue: MatrixStatus;
  userOwnedVault: MatrixStatus;
  selectiveDisclosure: MatrixStatus;
  emergencyReady: MatrixStatus;
  autoPurge: MatrixStatus;
  bridgeExplanation: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    platform: 'PersonaKey',
    limitation: 'Hardware-anchored portable identity across OS, vehicles, and venues',
    isPersonaKey: true,
    zeroCloudStorage: 'Core Architecture',
    crossVenue: 'Core Architecture',
    userOwnedVault: 'Core Architecture',
    selectiveDisclosure: 'Core Architecture',
    emergencyReady: 'Core Architecture',
    autoPurge: 'Core Architecture',
    bridgeExplanation:
      'PersonaKey decouples user preferences from any single vendor operating system or cloud account. Your five encrypted partitions reside inside a physical key you carry—translating cleanly onto third-party terminals on tap and purging immediately when you step away.',
  },
  {
    platform: 'Apple iCloud',
    limitation: 'Tied to personal Apple IDs and Apple silicon devices',
    zeroCloudStorage: 'Cloud Required',
    crossVenue: 'Ecosystem-Locked',
    userOwnedVault: 'Not Supported',
    selectiveDisclosure: 'Not Supported',
    emergencyReady: 'Ecosystem-Locked',
    autoPurge: 'Not Supported',
    bridgeExplanation:
      'Apple iCloud synchronises accessibility settings well between your own iPhone and Mac, but fails when you sit at a corporate Windows 11 desk, hire an EV, or need NHS responders to view critical directives without unlocking your iPhone.',
  },
  {
    platform: 'Google Account Sync',
    limitation: 'Browser-bound sync requiring central cloud login',
    zeroCloudStorage: 'Cloud Required',
    crossVenue: 'Cloud Required',
    userOwnedVault: 'Not Supported',
    selectiveDisclosure: 'Not Supported',
    emergencyReady: 'Not Supported',
    autoPurge: 'Not Supported',
    bridgeExplanation:
      'Google Account Sync transfers Chrome flags after signing into a central Google profile on shared machines, exposing personal session history while offering no physical desk-height, vehicle cabin, or offline clinical triage translation.',
  },
  {
    platform: 'Microsoft Windows Backup',
    limitation: 'OS-centric roaming tied to enterprise or personal Microsoft tenants',
    zeroCloudStorage: 'Cloud Required',
    crossVenue: 'Ecosystem-Locked',
    userOwnedVault: 'Not Supported',
    selectiveDisclosure: 'Not Supported',
    emergencyReady: 'Not Supported',
    autoPurge: 'Not Supported',
    bridgeExplanation:
      'Windows Backup requires corporate Active Directory or personal Microsoft sign-in and cannot cross into third-party coworking spaces, hotel room hubs, public kiosks, or non-Windows terminals.',
  },
  {
    platform: 'Matter Smart Home',
    limitation: 'Local smart-device protocol without portable human credentials',
    zeroCloudStorage: 'Not Supported',
    crossVenue: 'Ecosystem-Locked',
    userOwnedVault: 'Not Supported',
    selectiveDisclosure: 'Not Supported',
    emergencyReady: 'Not Supported',
    autoPurge: 'Not Supported',
    bridgeExplanation:
      'Matter 1.6 standardises how lamps and thermostats receive commands locally—but does not carry a user-owned portable identity. PersonaKey acts as the upstream human key that feeds Matter room hubs safely on arrival.',
  },
  {
    platform: 'Hotel Loyalty Apps',
    limitation: 'Vendor-owned databases storing static guest or staff preferences',
    zeroCloudStorage: 'Cloud Required',
    crossVenue: 'Not Supported',
    userOwnedVault: 'Not Supported',
    selectiveDisclosure: 'Not Supported',
    emergencyReady: 'Not Supported',
    autoPurge: 'Not Supported',
    bridgeExplanation:
      'Hotel loyalty apps lock your room and accessibility needs inside each hospitality chain’s central cloud—creating UK GDPR breach liability for operators while forcing guests to reconfigure preferences at every new property.',
  },
];

const COLUMNS: {
  key: keyof Pick<
    ComparisonRow,
    | 'zeroCloudStorage'
    | 'crossVenue'
    | 'userOwnedVault'
    | 'selectiveDisclosure'
    | 'emergencyReady'
    | 'autoPurge'
  >;
  label: string;
}[] = [
  { key: 'zeroCloudStorage', label: 'On-Device Encrypted Vault' },
  { key: 'crossVenue', label: 'Cross-OS & Cross-Venue' },
  { key: 'userOwnedVault', label: 'User-Owned Hardware Vault' },
  { key: 'selectiveDisclosure', label: 'Selective Partition Disclosure' },
  { key: 'emergencyReady', label: 'Emergency Directives Ready' },
  { key: 'autoPurge', label: 'Zero Third-Party Retention' },
];

function StatusBadge({ status }: { status: MatrixStatus }) {
  switch (status) {
    case 'Core Architecture':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-[#00A896] bg-[#00A896] px-2.5 py-1  text-[10px] font-semibold text-[#FFFFFF] whitespace-nowrap">
          <Check size={11} strokeWidth={2.5} aria-hidden="true" />
          Core Architecture
        </span>
      );
    case 'Ecosystem-Locked':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#FF6B00] bg-[#FFFFFF] px-2.5 py-1  text-[10px] font-semibold text-[#090D16] whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-xs bg-[#FF6B00]" aria-hidden="true" />
          Ecosystem-Locked
        </span>
      );
    case 'Cloud Required':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#090D16] bg-[#F8FAFC] px-2.5 py-1  text-[10px] font-semibold text-[#090D16] whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-xs bg-[#090D16]" aria-hidden="true" />
          Cloud Required
        </span>
      );
    case 'Not Supported':
      return (
        <span className="inline-flex items-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1  text-[10px] font-medium text-[#64748B] whitespace-nowrap">
          Not Supported
        </span>
      );
  }
}

export function NeutralitySection({
  vault,
  scenarioId,
  isConnected,
}: NeutralitySectionProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('PersonaKey');
  const shouldReduceMotion = useReducedMotion();

  const activeRow =
    COMPARISON_ROWS.find((row) => row.platform === selectedPlatform) ??
    COMPARISON_ROWS[0];

  return (
    <section
      id="architecture"
      className="border-b border-[#E2E8F0] bg-[#FFFFFF] py-14 sm:py-18"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className=" text-xs font-semibold tracking-[0.05em] text-[#00A896]">
              BUILT FOR NEUTRALITY
            </p>
            <h2 className="pk-scaled-heading font-display mt-2.5 font-bold text-balance text-[#090D16]">
              Existing tools sync inside walled gardens. PersonaKey bridges across them.
            </h2>
            <p className="pk-scaled-small mt-2.5 text-[#334155]">
              Select any platform row below to inspect why vendor sync stops at ecosystem boundaries and how PersonaKey fills the gap.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-1.5  text-[11px] font-medium text-[#090D16]">
            <Info size={13} className="text-[#00A896]" aria-hidden="true" />
            Click any row to compare architecture
          </span>
        </div>

        {/* Comparison Table */}
        <div className="mt-8 overflow-x-auto rounded-lg border border-[#E2E8F0] bg-[#FFFFFF]">
          <table className="w-full min-w-[940px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th
                  scope="col"
                  className="px-5 py-3.5 text-xs font-semibold tracking-[-0.01em] text-[#090D16]"
                >
                  Platform / Ecosystem
                </th>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-3.5 py-3.5 text-center text-xs font-semibold tracking-[-0.01em] text-[#090D16]"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&>tr:last-child>*]:border-b-0">
              {COMPARISON_ROWS.map((row) => {
                const isSelected = row.platform === activeRow.platform;
                return (
                  <tr
                    key={row.platform}
                    onClick={() => setSelectedPlatform(row.platform)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#F8FAFC]'
                        : 'bg-[#FFFFFF] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <th
                      scope="row"
                      className="border-b border-[#E2E8F0] px-5 py-4 align-middle font-normal"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedPlatform(row.platform)}
                        aria-expanded={isSelected}
                        className="pk-focus-ring w-full cursor-pointer text-left"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-[#090D16]">
                            {row.platform}
                          </span>
                          {row.isPersonaKey && (
                            <span className="rounded-sm border border-[#00A896] bg-[#FFFFFF] px-1.5 py-0.5  text-[10px] font-semibold text-[#00A896]">
                              PORTABLE
                            </span>
                          )}
                          {isSelected && (
                            <span className="rounded-sm bg-[#090D16] px-1.5 py-0.5  text-[10px] font-semibold text-[#FFFFFF]">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="pk-scaled-xs mt-0.5 text-[#64748B]">
                          {row.limitation}
                        </div>
                      </button>
                    </th>
                    {COLUMNS.map((col) => (
                      <td
                        key={col.key}
                        className="border-b border-[#E2E8F0] px-3 py-4 text-center align-middle"
                      >
                        <StatusBadge status={row[col.key]} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Clickable Row Detail Strip */}
        <div className="mt-4 rounded-lg border border-[#00A896] bg-[#FFFFFF] p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRow.platform}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between gap-4 md:flex-row md:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <ShieldCheck
                    size={15}
                    className="shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span className=" text-xs font-semibold text-[#090D16]">
                    {activeRow.platform.toUpperCase()} · ARCHITECTURAL TAKEAWAY
                  </span>
                </div>
                <p className="pk-scaled-small mt-2 leading-relaxed text-[#334155]">
                  {activeRow.bridgeExplanation}
                </p>
              </div>

              <span className="shrink-0 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5  text-[11px] font-semibold text-[#090D16]">
                {activeRow.isPersonaKey
                  ? '6/6 Core Capabilities Verified'
                  : 'PersonaKey Bridges All 6 Gaps'}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live Developer SDK / Payload Inspector */}
        <SdkPayloadInspector
          vault={vault}
          scenarioId={scenarioId}
          isConnected={isConnected}
        />
      </div>
    </section>
  );
}
