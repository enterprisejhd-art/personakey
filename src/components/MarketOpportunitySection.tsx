import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Building2, Check, Nfc, UserCheck } from 'lucide-react';
import { animate, useInView, useReducedMotion } from 'motion/react';

interface MarketOpportunitySectionProps {
  onBookPilot: () => void;
  onJoinBeta: () => void;
  onEnquireSdk: () => void;
}

interface MarketDriver {
  id: string;
  target: number;
  decimals: number;
  suffix: string;
  formattedFinal: string;
  label: string;
  description: string;
  source: string;
}

const UK_MARKET_EVIDENCE: MarketDriver[] = [
  {
    id: 'disabled-adults',
    target: 10.4,
    decimals: 1,
    suffix: 'M',
    formattedFinal: '10.4M',
    label: 'Working-Age Accessibility',
    description:
      'UK working-age disabled adults needing portable accessibility across work and public spaces',
    source: 'DWP',
  },
  {
    id: 'coworking-spaces',
    target: 4415,
    decimals: 0,
    suffix: '',
    formattedFinal: '4,415',
    label: 'Coworking & Flex Desks',
    description:
      'UK flexible & coworking spaces with daily hot-desk turnover',
    source: 'CoworkingCafe',
  },
  {
    id: 'hybrid-businesses',
    target: 1.42,
    decimals: 2,
    suffix: 'M',
    formattedFinal: '1.42M',
    label: 'Hybrid Employing Firms',
    description:
      'UK employing businesses adopting hybrid work models',
    source: 'DBT',
  },
  {
    id: 'hospitality-operators',
    target: 176685,
    decimals: 0,
    suffix: '',
    formattedFinal: '176,685',
    label: 'Hospitality & Venues',
    description:
      'UK hospitality operators seeking contactless guest personalisation',
    source: 'ONS',
  },
];

function formatMetricValue(value: number, decimals: number, suffix: string): string {
  if (decimals > 0) {
    return `${value.toFixed(decimals)}${suffix}`;
  }
  return `${Math.round(value).toLocaleString('en-GB')}${suffix}`;
}

function AnimatedRollupCounter({ driver }: { driver: MarketDriver }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState<string>(driver.formattedFinal);

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      setDisplay(driver.formattedFinal);
      return;
    }

    const controls = animate(0, driver.target, {
      duration: 1.15,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplay(formatMetricValue(latest, driver.decimals, driver.suffix));
      },
      onComplete: () => {
        setDisplay(driver.formattedFinal);
      },
    });

    return () => controls.stop();
  }, [
    driver.decimals,
    driver.formattedFinal,
    driver.suffix,
    driver.target,
    isInView,
    shouldReduceMotion,
  ]);

  return (
    <div ref={ref} className="inline-block">
      <p
        className="font-display text-3xl font-extrabold tracking-[-0.03em] text-[#090D16] tabular-nums sm:text-4xl"
        aria-label={driver.formattedFinal}
      >
        {display}
      </p>
      <div className="mt-2 h-[3px] w-14 bg-[#00A896]" aria-hidden="true" />
    </div>
  );
}

export function MarketOpportunitySection({
  onBookPilot,
  onJoinBeta,
  onEnquireSdk,
}: MarketOpportunitySectionProps) {
  return (
    <section
      id="market-opportunity"
      className="border-b border-[#E2E8F0] bg-[#FFFFFF] py-14 sm:py-18"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className=" text-xs font-semibold tracking-[0.05em] text-[#00A896]">
              UK MARKET SCALE &amp; COMMERCIAL ECOSYSTEM
            </p>
            <h2 className="pk-scaled-heading font-display mt-2.5 font-bold text-balance text-[#090D16]">
              Two-sided commercial model built for UK workplaces and public venues.
            </h2>
            <p className="pk-scaled-body mt-3 text-[#334155]">
              Individuals own their hardware key outright while organisations licence receivers to eliminate manual desk setup and UK GDPR data-storage liability.
            </p>
          </div>

          <span className="inline-flex items-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5  text-[11px] font-medium text-[#090D16]">
            Verified UK Official Datasets
          </span>
        </div>

        {/* 1. Netlify-Style Animated UK Market Scale Strip */}
        <div className="mt-8 grid grid-cols-1 divide-y divide-[#E2E8F0] rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {UK_MARKET_EVIDENCE.map((driver, index) => (
            <article
              key={driver.id}
              className={`pk-card-hover flex flex-col justify-between p-6 ${
                index >= 2 ? 'sm:border-t sm:border-[#E2E8F0] lg:border-t-0' : ''
              } ${index % 2 === 1 ? 'sm:border-l sm:border-[#E2E8F0] lg:border-l-0' : ''}`}
            >
              <div>
                <p className=" text-[10px] font-semibold tracking-[0.04em] text-[#64748B]">
                  {driver.label.toUpperCase()}
                </p>
                <div className="mt-2.5">
                  <AnimatedRollupCounter driver={driver} />
                </div>
                <p className="pk-scaled-small mt-3.5 text-[#334155]">
                  {driver.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#E2E8F0] pt-3">
                <span className=" text-[11px] font-semibold text-[#090D16]">
                  Source: {driver.source}
                </span>
                <span className=" text-[10px] font-medium text-[#00A896]">
                  UK DATA
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* 2. Dual-Sided Value Proposition (2-Column Executive Layout) */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Left: For Individuals & Accessibility Users */}
          <article className="pk-card-hover flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-6">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3.5">
                <span className="inline-flex items-center gap-2  text-xs font-semibold text-[#090D16]">
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

              <ul className="mt-4 space-y-2.5 border-t border-[#E2E8F0] pt-4">
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

            <div className="mt-6 border-t border-[#E2E8F0] pt-4">
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
          <article className="pk-card-hover flex flex-col justify-between rounded-lg border border-[#E2E8F0] border-t-2 border-t-[#00A896] bg-[#F8FAFC] p-6">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3.5">
                <span className="inline-flex items-center gap-2  text-xs font-semibold text-[#090D16]">
                  <Building2 size={15} className="text-[#00A896]" aria-hidden="true" />
                  FOR SERVICE PROVIDERS &amp; ENTERPRISES
                </span>
                <span className="rounded-md border border-[#00A896] bg-[#FFFFFF] px-2 py-0.5  text-[10px] font-semibold text-[#090D16]">
                  B2B &amp; OEM
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-[#090D16]">
                Deploy PersonaKey Receivers to deliver instant accessibility and personalised experiences while reducing UK GDPR data-storage liability.
              </h3>

              <ul className="mt-4 space-y-2.5 border-t border-[#E2E8F0] pt-4">
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

            <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-[#E2E8F0] pt-4">
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
                className="group pk-focus-ring inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#090D16] transition-colors hover:border-[#00A896]"
              >
                <span>Deploy Provider Receivers</span>
                <span className="pk-cta-arrow" aria-hidden="true">
                  <ArrowRight size={13} strokeWidth={2.25} />
                </span>
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
