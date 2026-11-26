import { ArrowRight, Building2, Check, Nfc, UserCheck } from 'lucide-react';

interface MarketOpportunitySectionProps {
  onBookPilot: () => void;
  onJoinBeta: () => void;
  onEnquireSdk: () => void;
}

interface MarketDriver {
  metric: string;
  description: string;
  source: string;
}

const UK_MARKET_EVIDENCE: MarketDriver[] = [
  {
    metric: '10.4 Million',
    description:
      'UK working-age disabled adults needing consistent accessibility across work and public spaces',
    source: 'Source: DWP',
  },
  {
    metric: '4,415 Locations',
    description:
      'UK flexible & coworking spaces with daily hot-desk turnover',
    source: 'Source: CoworkingCafe',
  },
  {
    metric: '1.42 Million',
    description:
      'UK employing businesses adopting hybrid work models',
    source: 'Source: DBT',
  },
  {
    metric: '176,685 Businesses',
    description:
      'UK hospitality & venue operators seeking contactless guest personalisation',
    source: 'Source: ONS / House of Commons Library',
  },
];

export function MarketOpportunitySection({
  onBookPilot,
  onJoinBeta,
  onEnquireSdk,
}: MarketOpportunitySectionProps) {
  return (
    <section
      id="market-opportunity"
      className="border-b border-[var(--pk-border)] bg-[var(--pk-bg)] py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-medium tracking-[0.04em] text-[var(--pk-muted)]">
            COMMERCIAL ECOSYSTEM &amp; UK MARKET OPPORTUNITY
          </p>
          <h2 className="pk-scaled-heading mt-2.5 font-semibold text-balance text-[var(--pk-heading)]">
            Two-sided commercial model built for UK workplaces and public venues.
          </h2>
          <p className="pk-scaled-body mt-3 text-[var(--pk-text)]">
            Individuals own their hardware key outright while organisations licence receivers to eliminate manual desk setup and UK GDPR data-storage liability.
          </p>
        </div>

        {/* 1. Dual-Sided Value Proposition (2-Column Executive Layout) */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Left: For Individuals & Accessibility Users */}
          <article className="pk-card-hover flex flex-col justify-between rounded-lg border border-[var(--pk-border)] bg-[var(--pk-surface)] p-6">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-[var(--pk-border)] pb-3.5">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#090D16]">
                  <UserCheck size={15} className="text-[#00A896]" aria-hidden="true" />
                  FOR INDIVIDUALS &amp; ACCESSIBILITY USERS
                </span>
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-xs bg-[#FF6B00] text-[#FFFFFF]"
                  title="Hardware Key"
                  aria-hidden="true"
                >
                  <Nfc size={11} strokeWidth={2.25} />
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-[#090D16]">
                Carry one key everywhere; protect medical and personal privacy; eliminate daily reconfiguration friction.
              </h3>

              <ul className="mt-4 space-y-2.5 border-t border-[var(--pk-border)] pt-4">
                <li className="flex items-start gap-2.5 text-sm text-[#334155]">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#00A896]" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-[#090D16]">£79 PersonaKey Hardware Device</strong> — offline-first NFC/BLE encrypted key storing all 5 partitions locally.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[#334155]">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#00A896]" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-[#090D16]">Optional £5.99/mo PersonaKey Plus</strong> — encrypted offline backup &amp; multi-profile management.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 border-t border-[var(--pk-border)] pt-4">
              <button
                type="button"
                onClick={onJoinBeta}
                className="group pk-focus-ring inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#090D16] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#090D16] transition-colors hover:bg-[#090D16] hover:text-[#FFFFFF]"
              >
                <span>Join Consumer Beta</span>
                <span className="pk-cta-arrow" aria-hidden="true">
                  <ArrowRight size={13} strokeWidth={2.25} />
                </span>
              </button>
            </div>
          </article>

          {/* Right: For Service Providers & Enterprises */}
          <article className="pk-card-hover flex flex-col justify-between rounded-lg border border-[var(--pk-border)] border-t-2 border-t-[#00A896] bg-[var(--pk-surface)] p-6">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-[var(--pk-border)] pb-3.5">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#090D16]">
                  <Building2 size={15} className="text-[#00A896]" aria-hidden="true" />
                  FOR SERVICE PROVIDERS &amp; ENTERPRISES
                </span>
                <span className="rounded-md border border-[#00A896] bg-[#F8FAFC] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#090D16]">
                  B2B &amp; OEM
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-[#090D16]">
                Deploy PersonaKey Receivers to deliver instant accessibility and personalised experiences while reducing UK GDPR data-storage liability.
              </h3>

              <ul className="mt-4 space-y-2.5 border-t border-[var(--pk-border)] pt-4">
                <li className="flex items-start gap-2.5 text-sm text-[#334155]">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#00A896]" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-[#090D16]">£4.50 / active user / month</strong> workplace licence with <strong className="font-semibold text-[#090D16]">£1,500+</strong> pilot setup.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[#334155]">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#00A896]" aria-hidden="true" />
                  <span>
                    Custom <strong className="font-semibold text-[#090D16]">Receiver SDK / API</strong> licensing for healthcare, mobility, and hospitality partners.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-[var(--pk-border)] pt-4">
              <button
                type="button"
                onClick={onBookPilot}
                className="group pk-focus-ring inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[#FF6B00] px-4 py-2 text-xs font-semibold text-[#FFFFFF] transition-colors hover:bg-[#090D16]"
              >
                <span>Book a Workplace Pilot</span>
                <span className="pk-cta-arrow" aria-hidden="true">
                  <ArrowRight size={13} strokeWidth={2.25} />
                </span>
              </button>
              <button
                type="button"
                onClick={onEnquireSdk}
                className="group pk-focus-ring inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[var(--pk-border)] bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-[#090D16] transition-colors hover:border-[#00A896]"
              >
                <span>Deploy Provider Receivers</span>
                <span className="pk-cta-arrow" aria-hidden="true">
                  <ArrowRight size={13} strokeWidth={2.25} />
                </span>
              </button>
            </div>
          </article>
        </div>

        {/* 2. UK Market Evidence (4 Verified Metric Cards) */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {UK_MARKET_EVIDENCE.map((driver) => (
            <article
              key={driver.metric}
              className="pk-card-hover flex flex-col justify-between rounded-lg border border-[var(--pk-border)] border-t-2 border-t-[#00A896] bg-[var(--pk-surface)] p-5"
            >
              <div>
                <p className="font-display text-2xl font-bold tracking-[-0.03em] text-[#090D16] tabular-nums sm:text-3xl">
                  {driver.metric}
                </p>
                <p className="pk-scaled-small mt-3 text-[#334155]">
                  {driver.description}
                </p>
              </div>

              <div className="mt-5 border-t border-[var(--pk-border)] pt-3">
                <span className="font-mono text-[11px] font-medium text-[#64748B]">
                  {driver.source}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
