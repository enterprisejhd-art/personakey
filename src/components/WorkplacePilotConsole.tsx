import { useState } from 'react';
import {
  CheckCircle2,
  Monitor,
  Nfc,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export type PilotSectorId =
  | 'coworking'
  | 'nhs'
  | 'mobility'
  | 'hospitality';

interface ReceiverNode {
  id: string;
  sector: PilotSectorId;
  label: string;
  site: string;
  token: string;
  tokenType: 'nfc' | 'app';
  partition: string;
  active: boolean;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  event: string;
  detail: string;
}

interface WorkplacePilotConsoleProps {
  sectorId: PilotSectorId;
}

const SECTOR_META: Record<
  PilotSectorId,
  { siteLabel: string; estateLabel: string }
> = {
  coworking: {
    siteLabel: 'Operator Network: London & Manchester Flex & Enterprise Desks',
    estateLabel: '6 Multi-Site Receivers (Click any node to simulate tap)',
  },
  nhs: {
    siteLabel: 'Clinical Network: NHS Emergency & Outpatient Triage Estate',
    estateLabel: '6 Multi-Site Receivers (Click any node to simulate tap)',
  },
  mobility: {
    siteLabel: 'Fleet Network: UK Car Hire & Shared EV Mobility Hubs',
    estateLabel: '6 Multi-Site Receivers (Click any node to simulate tap)',
  },
  hospitality: {
    siteLabel: 'Venue Network: Hotel Suites, Airport & Public Self-Service Terminals',
    estateLabel: '6 Multi-Site Receivers (Click any node to simulate tap)',
  },
};

const INITIAL_RECEIVERS: ReceiverNode[] = [
  {
    id: 'rx-01',
    sector: 'coworking',
    label: 'Clerkenwell Desk #04',
    site: 'Floor 2 · Windows 11',
    token: 'rx_anon_9f2a',
    tokenType: 'nfc',
    partition: '01 Workplace & Display',
    active: true,
  },
  {
    id: 'rx-02',
    sector: 'nhs',
    label: 'NHS Triage Tablet #A1',
    site: 'A&E Bay 3 · Clinical Unit',
    token: 'rx_anon_4c81',
    tokenType: 'nfc',
    partition: '05 Emergency Directives',
    active: true,
  },
  {
    id: 'rx-03',
    sector: 'mobility',
    label: 'Fleet EV #B12',
    site: 'King’s Cross · Cabin Pad',
    token: 'rx_anon_8b03',
    tokenType: 'app',
    partition: '02 Mobility & EV',
    active: true,
  },
  {
    id: 'rx-04',
    sector: 'hospitality',
    label: 'Hotel Suite #402',
    site: 'North Wing · Matter Hub',
    token: 'rx_anon_7d19',
    tokenType: 'nfc',
    partition: '03 Hospitality & Room',
    active: true,
  },
  {
    id: 'rx-05',
    sector: 'hospitality',
    label: 'Terminal Kiosk #07',
    site: 'Concourse · Audio-Assist',
    token: 'rx_anon_5a90',
    tokenType: 'nfc',
    partition: '04 Public Accessibility',
    active: true,
  },
  {
    id: 'rx-06',
    sector: 'coworking',
    label: 'Manchester Pod #B2',
    site: 'Quiet Zone · Matter Lamp',
    token: 'rx_anon_2e64',
    tokenType: 'app',
    partition: '01 Workplace (2700K)',
    active: true,
  },
];

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'log-1',
    timestamp: '14:18:04',
    event: 'TAP_ACTIVATED · Clerkenwell Desk #04',
    detail: 'Zero Personal Data Retained — only approved Partition 01 Display applied',
  },
  {
    id: 'log-2',
    timestamp: '15:09:42',
    event: 'SESSION_PURGED · Hotel Suite #401',
    detail: 'Zero Personal Data Retained — room lighting & TV subtitles reset (0 bytes)',
  },
];

function formatCurrentTime(): string {
  const now = new Date();
  return now.toTimeString().slice(0, 8);
}

function generateSessionToken(): string {
  const hex = Math.floor(0x1000 + Math.random() * 0xefff).toString(16);
  return `rx_anon_${hex}`;
}

export function WorkplacePilotConsole({ sectorId }: WorkplacePilotConsoleProps) {
  const [receivers, setReceivers] = useState<ReceiverNode[]>(INITIAL_RECEIVERS);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [lastTappedId, setLastTappedId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const activeCount = receivers.filter((r) => r.active).length;
  const allWiped = activeCount === 0;
  const meta = SECTOR_META[sectorId];

  const handleToggleReceiverTap = (targetId: string) => {
    const clicked = receivers.find((r) => r.id === targetId);
    if (!clicked) return;

    const nextActive = !clicked.active;
    const nextToken = nextActive ? generateSessionToken() : clicked.token;
    setLastTappedId(targetId);

    setReceivers((prev) =>
      prev.map((node) =>
        node.id === targetId
          ? { ...node, active: nextActive, token: nextToken }
          : node
      )
    );

    setAuditLogs((prev) => [
      {
        id: `tap-${Date.now()}-${targetId}`,
        timestamp: formatCurrentTime(),
        event: nextActive
          ? `LIVE_TAP_VERIFIED · ${clicked.label}`
          : `STEP_AWAY_PURGE · ${clicked.label}`,
        detail: nextActive
          ? `Zero Personal Data Retained — ephemeral session ${nextToken} unlocked ${clicked.partition}`
          : 'Zero Personal Data Retained — terminal reset to neutral baseline (0 bytes)',
      },
      ...prev,
    ]);
  };

  const handleGlobalEndOfShiftWipe = () => {
    setReceivers((prev) => prev.map((node) => ({ ...node, active: false })));
    setLastTappedId(null);
    setAuditLogs((prev) => [
      {
        id: `wipe-${Date.now()}`,
        timestamp: formatCurrentTime(),
        event: 'END_OF_SHIFT_GLOBAL_WIPE · All 6 Receivers',
        detail:
          'Zero Personal Data Retained — 6/6 receivers purged to 0 bytes and neutral baselines restored',
      },
      ...prev,
    ]);
  };

  const handleRestoreNetwork = () => {
    setReceivers(INITIAL_RECEIVERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setLastTappedId(null);
  };

  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-lg border-b border-[#E2E8F0] bg-[#FFFFFF] px-5 py-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className=" text-xs font-semibold tracking-[0.04em] text-[#090D16]">
              LIVE RECEIVER NETWORK CONSOLE
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-[#00A896] bg-[#F8FAFC] px-2.5 py-0.5  text-[11px] font-semibold text-[#090D16]">
              <ShieldCheck size={12} className="text-[#00A896]" aria-hidden="true" />
              Zero Personal Data Retained
            </span>
          </div>
          <p className="mt-1 text-xs text-[#334155]">
            {meta.siteLabel} · {activeCount} of 6 receivers active
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!allWiped ? (
            <button
              type="button"
              onClick={handleGlobalEndOfShiftWipe}
              className="pk-focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#FF6B00] px-4 py-2 text-xs font-semibold text-[#FFFFFF] transition-colors hover:bg-[#090D16] sm:whitespace-nowrap"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Simulate End-of-Shift Global Wipe
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRestoreNetwork}
              className="pk-focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#090D16] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#090D16] transition-colors hover:bg-[#090D16] hover:text-[#FFFFFF] sm:whitespace-nowrap"
            >
              <RefreshCw size={14} aria-hidden="true" />
              Restore All 6 Receivers
            </button>
          )}
        </div>
      </div>

      {/* 6 Interactive Multi-Site Receiver Nodes */}
      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className=" text-[11px] font-semibold tracking-[0.04em] text-[#64748B]">
            {meta.estateLabel.toUpperCase()}
          </span>
          <span className=" text-[11px] text-[#64748B]">
            {allWiped ? '0 Bytes Retained across network' : 'Tap any card to test live session'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {receivers.map((rx) => {
            const isRecentTap = lastTappedId === rx.id;
            const isSectorFocus = rx.sector === sectorId;
            return (
              <motion.button
                key={rx.id}
                type="button"
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                onClick={() => handleToggleReceiverTap(rx.id)}
                className={`pk-focus-ring pk-card-hover w-full cursor-pointer rounded-md border p-3.5 text-left ${
                  rx.active
                    ? isRecentTap || isSectorFocus
                      ? 'border-[#00A896] bg-[#FFFFFF]'
                      : 'border-[#E2E8F0] bg-[#FFFFFF]'
                    : 'border-[#E2E8F0] bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5  text-xs font-semibold text-[#090D16]">
                    <Monitor size={13} className="text-[#64748B]" aria-hidden="true" />
                    {rx.label}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5  text-[10px] font-semibold ${
                      rx.active
                        ? 'border-[#00A896] bg-[#F8FAFC] text-[#090D16]'
                        : 'border-[#E2E8F0] bg-[#FFFFFF] text-[#64748B]'
                    }`}
                  >
                    {rx.active ? 'ACTIVE' : 'WIPED'}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-[#334155]">{rx.site}</p>

                <div className="mt-3 border-t border-[#E2E8F0] pt-2.5">
                  {rx.active ? (
                    <>
                      <div className="flex items-center justify-between gap-1.5">
                        <span className=" text-[11px] font-medium text-[#090D16]">
                          {rx.token}
                        </span>
                        {rx.tokenType === 'nfc' ? (
                          <span
                            className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-xs bg-[#FF6B00] text-[#FFFFFF]"
                            title="NFC Hardware Tap"
                            aria-label="NFC Hardware Tap"
                          >
                            <Nfc size={10} strokeWidth={2.25} aria-hidden="true" />
                          </span>
                        ) : (
                          <span className=" text-[10px] text-[#64748B]">
                            BLE
                          </span>
                        )}
                      </div>
                      <p className="mt-1  text-[10px] text-[#64748B]">
                        {rx.partition} · Click to purge
                      </p>
                    </>
                  ) : (
                    <>
                      <p className=" text-[11px] font-medium text-[#090D16]">
                        0 Bytes Retained
                      </p>
                      <p className="mt-1  text-[10px] text-[#00A896]">
                        Click to simulate live tap
                      </p>
                    </>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Zero Personal Data Retained Audit Logs */}
        <div className="mt-4 rounded-md border border-[#E2E8F0] bg-[#FFFFFF]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-3.5 py-2">
            <span className="inline-flex items-center gap-1.5  text-[11px] font-semibold text-[#090D16]">
              <CheckCircle2 size={13} className="text-[#00A896]" aria-hidden="true" />
              Network Audit Log (Zero Personal Data Retained)
            </span>
            <span className=" text-[10px] text-[#64748B]">
              UK GDPR VERIFIED
            </span>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            <AnimatePresence initial={false}>
              {auditLogs.slice(0, 3).map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="px-3.5 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className=" text-[11px] font-semibold text-[#090D16]">
                      {entry.event}
                    </span>
                    <span className=" text-[10px] text-[#64748B] tabular-nums">
                      {entry.timestamp}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#334155]">{entry.detail}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
