import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import {
  ACCESSIBILITY_OPTIONS,
  type AccessibilityMode,
} from '../types/accessibility';

interface HeaderProps {
  mode: AccessibilityMode;
  onModeChange: (mode: AccessibilityMode) => void;
  onBookPilot: () => void;
}

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#pricing', label: 'Pricing' },
];

export function Header({ mode, onModeChange, onBookPilot }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--pk-border)] bg-[var(--pk-surface)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        {/* Left: Minimal geometric PersonaKey wordmark + subtle monospace tag */}
        <div className="flex shrink-0 items-center gap-3">
          <a
            href="#hero"
            className="pk-focus-ring flex shrink-0 items-center gap-2.5 rounded-md py-1 whitespace-nowrap"
            aria-label="PersonaKey home"
          >
            <svg
              width="24"
              height="24"
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
                stroke="#0B1E33"
                strokeWidth="1.75"
                fill="#FFFFFF"
              />
              <circle cx="9.5" cy="12" r="3.25" stroke="#0B1E33" strokeWidth="1.75" />
              <path
                d="M12.75 12H18.5M16 12V14.75M18.5 12V14"
                stroke="#0F8B8D"
                strokeWidth="1.75"
                strokeLinecap="square"
              />
            </svg>
            <span className="text-base font-semibold tracking-[-0.02em] text-[var(--pk-heading)] whitespace-nowrap">
              PersonaKey
            </span>
          </a>

          <span className="hidden shrink-0 border-l border-[var(--pk-border)] pl-3 font-mono text-[11px] font-medium tracking-[0.06em] text-[var(--pk-muted)] whitespace-nowrap sm:inline-block">
            PORTABLE IDENTITY
          </span>
        </div>

        {/* Centre: Navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="pk-focus-ring pk-nav-link shrink-0 rounded-md px-1 py-1 text-sm font-medium text-[var(--pk-text)] transition-colors hover:text-[var(--pk-heading)] hover:underline underline-offset-4 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Live Accessibility Preview toggle pill + Book a Pilot CTA */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <span className="hidden shrink-0 font-mono text-[11px] font-medium tracking-[0.04em] text-[var(--pk-muted)] whitespace-nowrap xl:inline">
              Live Accessibility Preview
            </span>
            <div
              role="radiogroup"
              aria-label="Live Accessibility Preview"
              className="flex shrink-0 items-center gap-0.5 rounded-lg border border-[var(--pk-border)] bg-[var(--pk-surface-muted)] p-0.5"
            >
              {ACCESSIBILITY_OPTIONS.map((option) => {
                const isActive = mode === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => onModeChange(option.id)}
                    className={`pk-focus-ring shrink-0 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'border border-[var(--pk-border)] bg-[var(--pk-mode-active-bg)] text-[var(--pk-mode-active-text)] shadow-xs'
                        : 'border border-transparent text-[var(--pk-muted)] hover:text-[var(--pk-heading)]'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={onBookPilot}
            className="pk-focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md bg-[var(--pk-cta-bg)] px-4 py-2 text-sm font-medium text-[var(--pk-cta-text)] transition-colors hover:bg-[var(--pk-cta-hover)] whitespace-nowrap"
          >
            Book a Pilot
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="pk-focus-ring inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[var(--pk-border)] bg-[var(--pk-surface)] text-[var(--pk-heading)] lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation & Live Accessibility Preview drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[var(--pk-border)] bg-[var(--pk-surface)] px-4 py-4 sm:px-6 lg:hidden"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="pk-focus-ring pk-nav-link rounded-md px-3 py-2.5 text-sm font-medium text-[var(--pk-heading)] whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 border-t border-[var(--pk-border)] pt-4">
            <p className="mb-2 font-mono text-xs font-medium tracking-[0.04em] text-[var(--pk-muted)]">
              Live Accessibility Preview
            </p>
            <div
              role="radiogroup"
              aria-label="Live Accessibility Preview"
              className="grid grid-cols-3 gap-1.5 rounded-lg border border-[var(--pk-border)] bg-[var(--pk-surface-muted)] p-1"
            >
              {ACCESSIBILITY_OPTIONS.map((option) => {
                const isActive = mode === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => onModeChange(option.id)}
                    className={`pk-focus-ring cursor-pointer rounded-md px-1.5 py-2 text-xs font-medium transition-colors sm:whitespace-nowrap sm:px-2.5 ${
                      isActive
                        ? 'border border-[var(--pk-border)] bg-[var(--pk-mode-active-bg)] text-[var(--pk-mode-active-text)] shadow-xs'
                        : 'border border-transparent text-[var(--pk-muted)] hover:text-[var(--pk-heading)]'
                    }`}
                  >
                    {option.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
