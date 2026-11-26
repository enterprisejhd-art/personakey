import { CalendarCheck2, FileLock2, Nfc, ShieldCheck } from 'lucide-react';

interface TrustPillar {
  code: string;
  label: string;
  detail: string;
  icon: 'gdpr' | 'tap' | 'diagnostic' | 'pilot';
}

const TRUST_PILLARS: TrustPillar[] = [
  {
    code: '01 · PRIVACY',
    label: 'UK GDPR Privacy-by-Design',
    detail: 'Ephemeral session tokens and local consent logs; zero persistent tracking.',
    icon: 'gdpr',
  },
  {
    code: '02 · ACTIVATION',
    label: 'Explicit Tap Activation (Zero Passive Tracking)',
    detail: 'Sessions begin only on deliberate NFC tap or signed app approval.',
    icon: 'tap',
  },
  {
    code: '03 · MINIMISATION',
    label: 'Zero Diagnostic Data Stored',
    detail: 'Stores functional display and room intent—never medical records.',
    icon: 'diagnostic',
  },
  {
    code: '04 · DEPLOYMENT',
    label: '4-Week Controlled Pilot Ready',
    detail: 'Turnkey hot-desk rollout with baseline snapshot and audit verification.',
    icon: 'pilot',
  },
];

function PillarIcon({ type }: { type: TrustPillar['icon'] }) {
  switch (type) {
    case 'gdpr':
      return <ShieldCheck size={15} className="shrink-0 text-[#00A896]" aria-hidden="true" />;
    case 'tap':
      return (
        <span
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-xs bg-[#FF6B00] text-[#FFFFFF]"
          aria-hidden="true"
        >
          <Nfc size={10} strokeWidth={2.25} />
        </span>
      );
    case 'diagnostic':
      return <FileLock2 size={15} className="shrink-0 text-[#00A896]" aria-hidden="true" />;
    case 'pilot':
      return <CalendarCheck2 size={15} className="shrink-0 text-[#00A896]" aria-hidden="true" />;
  }
}

export function ComplianceTrustBar() {
  return (
    <section
      aria-label="UK commercial and compliance guarantees"
      className="border-b border-[var(--pk-border)] bg-[var(--pk-surface)] py-6"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 divide-y divide-[var(--pk-border)] rounded-lg border border-[var(--pk-border)] bg-[var(--pk-surface-muted)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {TRUST_PILLARS.map((pillar, index) => (
            <div
              key={pillar.label}
              className={`px-4 py-3.5 ${
                index >= 2 ? 'sm:border-t sm:border-[var(--pk-border)] lg:border-t-0' : ''
              } ${index % 2 === 1 ? 'sm:border-l sm:border-[var(--pk-border)] lg:border-l-0' : ''}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-semibold tracking-[0.04em] text-[#64748B]">
                  {pillar.code}
                </span>
                <PillarIcon type={pillar.icon} />
              </div>
              <p className="mt-1.5 text-xs font-semibold text-[#090D16]">
                {pillar.label}
              </p>
              <p className="pk-scaled-xs mt-1 text-[#334155]">{pillar.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
