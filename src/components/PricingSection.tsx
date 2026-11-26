import { ArrowRight, Check, Nfc } from 'lucide-react';

interface PricingSectionProps {
  onBookPilot: () => void;
  onJoinBeta: () => void;
  onEnquireSdk: () => void;
}

export function PricingSection({
  onBookPilot,
  onJoinBeta,
  onEnquireSdk,
}: PricingSectionProps) {
  return (
    <section
      id="pricing"
      className="border-b border-[var(--pk-border)] bg-[var(--pk-bg)] py-14 sm:py-18"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className=" text-xs font-semibold tracking-[0.05em] text-[#00A896]">
            COMMERCIAL MODEL &amp; PRICING
          </p>
          <h2 className="pk-scaled-heading font-display mt-2.5 font-bold text-balance text-[var(--pk-heading)]">
            Built for controlled workplace pilots and individual portability.
          </h2>
        </div>

        {/* 3-Card Structured Pricing Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          {/* Card 1: PersonaKey Token + App */}
          <article className="pk-card-hover flex h-full flex-col justify-between rounded-lg border border-[var(--pk-border)] bg-[var(--pk-surface)] p-6 sm:p-7">
            <div>
              <p className=" text-[11px] font-medium tracking-[0.04em] text-[var(--pk-muted)]">
                FOR INDIVIDUALS
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--pk-heading)]">
                PersonaKey NFC Token
              </h3>

              <div className="mt-4 border-b border-[var(--pk-border)] pb-5">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold tracking-[-0.03em] text-[var(--pk-heading)] tabular-nums">
                    £79
                  </span>
                  <span className="text-xs font-medium text-[var(--pk-muted)]">
                    one-off hardware token
                  </span>
                </div>
                <div className="mt-2.5 inline-flex items-center gap-2  text-[11px] text-[var(--pk-text)]">
                  <span
                    className="inline-flex h-4 w-4 items-center justify-center rounded-xs bg-[#FF6B00] text-[#FFFFFF]"
                    aria-hidden="true"
                  >
                    <Nfc size={11} strokeWidth={2.25} />
                  </span>
                  NFC / Bluetooth activation credential
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>Core Persona Profile (15–25 settings)</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>Local selective-disclosure controls</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>Unlimited session activations</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>Automatic session reversal</span>
                </li>
              </ul>
            </div>

            <div className="mt-7 pt-2">
              <button
                type="button"
                onClick={onJoinBeta}
                className="group pk-focus-ring inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2.5 text-sm font-semibold text-[#090D16] transition-colors hover:border-[#00A896] hover:bg-[#F8FAFC] sm:whitespace-nowrap"
              >
                <span>Join Consumer Beta</span>
                <span className="pk-cta-arrow" aria-hidden="true">
                  <ArrowRight size={14} strokeWidth={2.25} />
                </span>
              </button>
            </div>
          </article>

          {/* Card 2: PersonaKey Plus */}
          <article className="pk-card-hover flex h-full flex-col justify-between rounded-lg border border-[var(--pk-border)] bg-[var(--pk-surface)] p-6 sm:p-7">
            <div>
              <p className=" text-[11px] font-medium tracking-[0.04em] text-[var(--pk-muted)]">
                OPTIONAL SOFTWARE TIER
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--pk-heading)]">
                PersonaKey Plus
              </h3>

              <div className="mt-4 border-b border-[var(--pk-border)] pb-5">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-bold tracking-[-0.03em] text-[var(--pk-heading)] tabular-nums">
                    £5.99
                  </span>
                  <span className="text-xs font-medium text-[var(--pk-muted)]">
                    / month
                  </span>
                </div>
                <p className="mt-2.5  text-[11px] text-[var(--pk-muted)]">
                  Multi-context sync &amp; encrypted preference backup
                </p>
              </div>

              <ul className="mt-5 space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>Multi-context profiles (Work, Travel, Evening)</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>Encrypted cloud backup</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>Full audit history</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>Automated context rules</span>
                </li>
              </ul>
            </div>

            <div className="mt-7 pt-2">
              <button
                type="button"
                onClick={onJoinBeta}
                className="group pk-focus-ring inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2.5 text-sm font-semibold text-[#090D16] transition-colors hover:border-[#00A896] hover:bg-[#F8FAFC] sm:whitespace-nowrap"
              >
                <span>Join Beta Waitlist</span>
                <span className="pk-cta-arrow" aria-hidden="true">
                  <ArrowRight size={14} strokeWidth={2.25} />
                </span>
              </button>
            </div>
          </article>

          {/* Card 3: Workplace & Coworking Licence */}
          <article className="pk-card-hover-orange flex h-full flex-col justify-between rounded-lg border border-[var(--pk-border)] border-t-2 border-t-[#FF6B00] bg-[var(--pk-surface)] p-6 sm:p-7">
            <div>
              <p className=" text-[11px] font-semibold tracking-[0.04em] text-[var(--pk-heading)]">
                B2B PILOT &amp; SCALE
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--pk-heading)]">
                Workplace Licence
              </h3>

              <div className="mt-4 border-b border-[var(--pk-border)] pb-5">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-bold tracking-[-0.03em] text-[var(--pk-heading)] tabular-nums">
                    £4.50
                  </span>
                  <span className="text-xs font-medium text-[var(--pk-muted)]">
                    / user / month
                  </span>
                </div>
                <p className="mt-2.5  text-[11px] font-medium text-[var(--pk-heading)] tabular-nums">
                  £1,500+ pilot setup &amp; integration
                </p>
              </div>

              <ul className="mt-5 space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>Windows / browser workspace adaptors</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>Compatible smart-desk lighting bridge</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>B2B admin dashboard</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>Role-based access</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[var(--pk-text)]">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-[#00A896]"
                    aria-hidden="true"
                  />
                  <span>Pilot onboarding support</span>
                </li>
              </ul>
            </div>

            <div className="mt-7 pt-2">
              <button
                type="button"
                onClick={onBookPilot}
                className="group pk-focus-ring inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[var(--pk-cta-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--pk-cta-text)] transition-colors hover:bg-[var(--pk-cta-hover)] sm:whitespace-nowrap"
              >
                <span>Book a Workplace Pilot</span>
                <span className="pk-cta-arrow" aria-hidden="true">
                  <ArrowRight size={14} strokeWidth={2.25} />
                </span>
              </button>
            </div>
          </article>
        </div>

        {/* Single-Row Enterprise Callout Bar */}
        <div className="pk-card-hover mt-8 flex flex-col justify-between gap-4 rounded-lg border border-[var(--pk-border)] bg-[var(--pk-surface)] px-6 py-4 sm:flex-row sm:items-center">
          <p className="pk-scaled-small font-medium text-[var(--pk-heading)]">
            Building workplace hardware, smart-building systems, or hospitality platforms?
          </p>
          <button
            type="button"
            onClick={onEnquireSdk}
            className="group pk-focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#090D16] bg-[#FFFFFF] px-4 py-2 text-center text-xs font-semibold text-[#090D16] transition-colors hover:bg-[#090D16] hover:text-[#FFFFFF] sm:whitespace-nowrap"
          >
            <span>Enquire about PersonaKey SDK / API Licensing</span>
            <span className="pk-cta-arrow" aria-hidden="true">
              <ArrowRight size={13} strokeWidth={2.25} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
