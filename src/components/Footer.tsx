interface FooterProps {
  onOpenPrivacy: () => void;
}

const FOOTER_LINKS = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#pricing', label: 'Pricing' },
];

export function Footer({ onOpenPrivacy }: FooterProps) {
  return (
    <footer className="border-t border-[#1E293B] bg-[#090D16] py-10 text-[#FFFFFF]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        {/* Left: PersonaKey brand summary */}
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect
                x="1"
                y="1"
                width="22"
                height="22"
                rx="4"
                stroke="#FFFFFF"
                strokeWidth="1.75"
                fill="#090D16"
              />
              <circle cx="9.5" cy="12" r="3.25" stroke="#FFFFFF" strokeWidth="1.75" />
              <path
                d="M12.75 12H18.5M16 12V14.75M18.5 12V14"
                stroke="#00A896"
                strokeWidth="1.75"
                strokeLinecap="square"
              />
            </svg>
            <span className="font-display text-sm font-bold tracking-[-0.02em] text-[#FFFFFF]">
              PersonaKey
            </span>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-[#CBD5E1]">
            One preference identity. Multiple environments. United Kingdom.
          </p>
        </div>

        {/* Centre: Quick navigation links + Privacy Architecture modal trigger */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium"
        >
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="pk-focus-ring rounded-md py-1 text-[#CBD5E1] transition-colors hover:text-[#FFFFFF] hover:underline underline-offset-4 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="pk-focus-ring cursor-pointer rounded-md border border-[#1E293B] bg-[#090D16] px-3 py-1.5 font-mono text-[11px] font-medium text-[#FFFFFF] transition-colors hover:border-[#00A896] hover:text-[#00A896] whitespace-nowrap"
          >
            Privacy Architecture
          </button>
        </nav>

        {/* Right: Contact & copyright */}
        <div className="flex flex-col items-start gap-1 text-xs lg:items-end">
          <a
            href="mailto:hello@personakey.co.uk"
            className="pk-focus-ring rounded-md font-mono text-xs text-[#CBD5E1] transition-colors hover:text-[#00A896] hover:underline underline-offset-4"
          >
            hello@personakey.co.uk
          </a>
          <p className="text-xs text-[#94A3B8]">
            © 2026 PersonaKey. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
