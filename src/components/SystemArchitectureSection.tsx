import { ArrowRight, KeyRound, Nfc, Radio, RotateCcw } from 'lucide-react';

interface ArchitecturePart {
  step: string;
  title: string;
  subtitle: string;
  bullets: string[];
  guarantee: string;
  kind: 'key' | 'receiver' | 'session';
}

const ARCHITECTURE_PARTS: ArchitecturePart[] = [
  {
    step: 'PART 01',
    title: 'The PersonaKey',
    subtitle: 'User-Owned Hardware Vault',
    bullets: [
      'Stores encrypted preference partitions and emergency directives locally on the secure element inside the key.',
      'Works offline-first via NFC/BLE—never requires a central cloud account to function.',
    ],
    guarantee: 'Offline NFC / BLE Secure Element',
    kind: 'key',
  },
  {
    step: 'PART 02',
    title: 'The PersonaKey Receiver',
    subtitle: 'At the Service Provider',
    bullets: [
      'Plug-and-play hardware pad or software receiver installed at desks, vehicles, hospital triage tablets, hotel rooms, and public kiosks.',
      'Broadcasts a cryptographically signed Context & Role Certificate proving who is asking and which single partition they are permitted to request.',
    ],
    guarantee: 'Signed Context & Role Certificate',
    kind: 'receiver',
  },
  {
    step: 'PART 03',
    title: 'Zero-Retention Ephemeral Session',
    subtitle: 'Instant Apply & Purge',
    bullets: [
      'The key unlocks and translates only the approved fields into the local system’s native controls.',
      'The moment the user steps away or ends the session, the receiver purges all temporary settings—leaving zero personal data behind.',
    ],
    guarantee: '0 Bytes Retained After Disconnect',
    kind: 'session',
  },
];

function PartBadgeIcon({ kind }: { kind: ArchitecturePart['kind'] }) {
  if (kind === 'key') {
    return (
      <span
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xs bg-[#D4A338] text-[#0B1E33]"
        aria-hidden="true"
      >
        <Nfc size={13} strokeWidth={2.25} />
      </span>
    );
  }
  if (kind === 'receiver') {
    return (
      <span
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xs border border-[#0F8B8D] bg-[#F8FAFC] text-[#0F8B8D]"
        aria-hidden="true"
      >
        <Radio size={13} strokeWidth={2.25} />
      </span>
    );
  }
  return (
    <span
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xs border border-[#0F8B8D] bg-[#F8FAFC] text-[#0F8B8D]"
      aria-hidden="true"
    >
      <RotateCcw size={13} strokeWidth={2.25} />
    </span>
  );
}

export function SystemArchitectureSection() {
  return (
    <section
      id="system-architecture"
      className="border-b border-[var(--pk-border)] bg-[var(--pk-bg)] py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-medium tracking-[0.04em] text-[var(--pk-muted)]">
              3-PART SYSTEM ARCHITECTURE
            </p>
            <h2 className="pk-scaled-heading mt-2 font-semibold text-balance text-[var(--pk-heading)]">
              How one personal key interacts safely with any service provider.
            </h2>
            <p className="pk-scaled-small mt-2.5 text-[var(--pk-text)]">
              Built so individuals keep total ownership of their vault while workplaces, vehicles, hospitals, and public terminals receive only verified, temporary settings.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-md border border-[var(--pk-border)] bg-[var(--pk-surface)] px-3 py-1.5 font-mono text-[11px] font-medium text-[#0B1E33]">
            <KeyRound size={13} className="text-[#0F8B8D]" aria-hidden="true" />
            Hardware-to-Receiver · No Cloud Sync
          </div>
        </div>

        {/* 3-Part Horizontal Pipeline */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_28px_1fr_28px_1fr] lg:items-stretch lg:gap-0">
          {ARCHITECTURE_PARTS.map((part, index) => (
            <div key={part.step} className="contents">
              <article className="flex flex-col justify-between rounded-lg border border-[var(--pk-border)] bg-[var(--pk-surface)] p-5 shadow-xs">
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-[var(--pk-border)] pb-3">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.04em] text-[#64748B]">
                      {part.step}
                    </span>
                    <PartBadgeIcon kind={part.kind} />
                  </div>

                  <h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-[var(--pk-heading)]">
                    {part.title}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs font-medium text-[#334155]">
                    {part.subtitle}
                  </p>

                  <ul className="mt-4 space-y-2.5">
                    {part.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="pk-scaled-small flex items-start gap-2 text-[#334155]"
                      >
                        <span
                          className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-xs bg-[#0B1E33]"
                          aria-hidden="true"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 border-t border-[var(--pk-border)] pt-3">
                  <span className="font-mono text-[11px] font-semibold text-[#0B1E33]">
                    {part.guarantee}
                  </span>
                </div>
              </article>

              {index < ARCHITECTURE_PARTS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden items-center justify-center lg:flex"
                >
                  <div className="relative flex w-full items-center">
                    <span className="h-px w-full bg-[var(--pk-border)]" />
                    <ArrowRight
                      size={14}
                      className="shrink-0 text-[#64748B] -ml-1"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
