import { useState } from 'react';
import { ChevronDown, ChevronUp, Code2, Cpu, FileJson, Sun } from 'lucide-react';
import {
  RECEIVER_SCENARIOS,
  VAULT_PARTITIONS,
  type KeyVaultData,
  type ScenarioId,
} from '../data/vault';

type SdkTabId = 'intent-schema' | 'os-adaptor' | 'matter-space';

interface SdkPayloadInspectorProps {
  vault: KeyVaultData;
  scenarioId: ScenarioId;
  isConnected: boolean;
}

export function SdkPayloadInspector({
  vault,
  scenarioId,
  isConnected,
}: SdkPayloadInspectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<SdkTabId>('intent-schema');

  const activeScenario =
    RECEIVER_SCENARIOS.find((s) => s.id === scenarioId) ?? RECEIVER_SCENARIOS[0];
  const unlockedPartition = activeScenario.unlocksPartition;

  const unlockedPayloadMap: Record<string, unknown> = {
    workplace: vault.workplace,
    mobility: vault.mobility,
    hospitality: vault.hospitality,
    public: vault.public,
    emergency: vault.emergency,
  };

  const intentSchemaOutput = JSON.stringify(
    {
      protocol: 'PersonaKey Local NFC Handshake v1',
      keyVault: 'On-Device Encrypted Hardware Key (#PK-409)',
      cloudStorageUsed: false,
      receiverSession: isConnected ? 'UNLOCKED_SINGLE_PARTITION' : 'AWAITING_TAP',
      receiverCredential: activeScenario.verifiedCredential,
      disclosedPartition: unlockedPartition,
      sealedPartitions: VAULT_PARTITIONS.filter(
        (p) => p.id !== unlockedPartition
      ).map((p) => `${p.name} (SEALED ON DEVICE)`),
      disclosedValues: unlockedPayloadMap[unlockedPartition],
    },
    null,
    2
  );

  const highContrastFlag = vault.workplace.theme === 'High Contrast' ? 1 : 0;
  const zoomNumber = parseInt(vault.workplace.textScale, 10) || 135;

  const workplaceOsAdaptorOutput = `# Ephemeral Receiver Adaptor (${activeScenario.verifiedCredential})
# Partition Requested: ${unlockedPartition} (All other 4 partitions remain sealed on key)

Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop" -Name "FontScale" -Value ${zoomNumber}
Set-ItemProperty -Path "HKCU:\\Control Panel\\Accessibility\\HighContrast" -Name "Flags" -Value ${highContrastFlag}
# Standing Desk Actuator Target: ${vault.workplace.standingDeskCm}cm

# On Step Away / Disconnect -> Wipe ephemeral memory (0 Bytes Retained)`;

  const miredValue = Math.round(1_000_000 / vault.hospitality.lightingKelvin);

  const matterSpaceOutput =
    unlockedPartition === 'hospitality'
      ? JSON.stringify(
          {
            bridge: 'Matter 1.6 Room Controller',
            receiver: activeScenario.verifiedCredential,
            unlockedPartition: 'hospitality',
            commands: [
              {
                cluster: 'ColorControl (0x0300)',
                command: 'MoveToColorTemperature',
                colorTemperatureMireds: miredValue,
                kelvin: vault.hospitality.lightingKelvin,
              },
              {
                cluster: 'Thermostat (0x0201)',
                occupiedHeatingSetpointC: vault.hospitality.sleepTempC,
              },
            ],
            onCheckout: 'Restore neutral suite scene (0 Bytes Retained)',
          },
          null,
          2
        )
      : JSON.stringify(
          {
            bridge: 'Matter 1.6 Room Controller',
            receiver: activeScenario.verifiedCredential,
            status: 'SEALED_ON_DEVICE',
            reason: `Hospitality partition stays sealed; receiver only verified "${activeScenario.verifiedCredential}".`,
            transmittedLightingFields: 0,
          },
          null,
          2
        );

  const tabs: {
    id: SdkTabId;
    label: string;
    content: string;
    summary: string;
  }[] = [
    {
      id: 'intent-schema',
      label: 'Human Intent Schema',
      content: intentSchemaOutput,
      summary: `${activeScenario.title} · Unlocks ${unlockedPartition} only`,
    },
    {
      id: 'os-adaptor',
      label: 'Workplace OS Adaptor',
      content: workplaceOsAdaptorOutput,
      summary: `Workplace zoom ${vault.workplace.textScale} · Standing desk ${vault.workplace.standingDeskCm}cm`,
    },
    {
      id: 'matter-space',
      label: 'Matter 1.6 Smart Space',
      content: matterSpaceOutput,
      summary:
        unlockedPartition === 'hospitality'
          ? `Room #402 · ${vault.hospitality.lightingKelvin}K · ${vault.hospitality.sleepTempC}°C`
          : 'Hospitality partition sealed for this receiver',
    },
  ];

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  return (
    <div className="mt-10 rounded-lg border border-[var(--pk-border)] bg-[var(--pk-surface)]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Code2 size={16} className="shrink-0 text-[#00A896]" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-semibold tracking-[-0.01em] text-[var(--pk-heading)]">
              Preference Translation Engine &amp; Partner SDK
            </h3>
            <p className="mt-0.5 text-xs text-[var(--pk-muted)]">
              Synced with your key vault ({activeScenario.title} · {activeScenario.verifiedCredential})
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="partner-sdk-drawer"
          onClick={() => setIsOpen((prev) => !prev)}
          className="pk-focus-ring inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-md border border-[var(--pk-border)] bg-[var(--pk-surface-muted)] px-3.5 py-2  text-xs font-medium text-[var(--pk-heading)] transition-colors hover:border-[#00A896] whitespace-nowrap"
        >
          {isOpen ? 'Hide Technical Specs' : 'Inspect Partner SDK'}
          {isOpen ? (
            <ChevronUp size={14} aria-hidden="true" />
          ) : (
            <ChevronDown size={14} aria-hidden="true" />
          )}
        </button>
      </div>

      {isOpen && (
        <div
          id="partner-sdk-drawer"
          className="border-t border-[var(--pk-border)] bg-[var(--pk-surface-muted)] p-5"
        >
          <div
            role="tablist"
            aria-label="Preference Translation Engine and Partner SDK tabs"
            className="flex flex-wrap items-center gap-2 border-b border-[var(--pk-border)] pb-3.5"
          >
            {tabs.map((tab) => {
              const isSelected = tab.id === activeTab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="partner-sdk-tabpanel"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`pk-focus-ring inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5  text-xs font-medium transition-colors sm:whitespace-nowrap ${
                    isSelected
                      ? 'border-[#090D16] bg-[#090D16] text-[#FFFFFF]'
                      : 'border-[var(--pk-border)] bg-[#FFFFFF] text-[var(--pk-text)] hover:border-[#00A896] hover:text-[var(--pk-heading)]'
                  }`}
                >
                  {tab.id === 'intent-schema' && <FileJson size={13} aria-hidden="true" />}
                  {tab.id === 'os-adaptor' && <Cpu size={13} aria-hidden="true" />}
                  {tab.id === 'matter-space' && <Sun size={13} aria-hidden="true" />}
                  {tab.label}
                </button>
              );
            })}
          </div>

          <pre
            id="partner-sdk-tabpanel"
            role="tabpanel"
            className="mt-4 max-h-[340px] overflow-auto rounded-md border border-[#1E293B] bg-[#090D16] p-4  text-xs leading-relaxed text-[#F8FAFC]"
          >
            <code>{activeTab.content}</code>
          </pre>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2  text-[11px] text-[var(--pk-muted)]">
            <span className="font-medium text-[var(--pk-heading)]">
              {activeTab.summary}
            </span>
            <span>0 cloud sync · 0 bytes retained after disconnect</span>
          </div>
        </div>
      )}
    </div>
  );
}
