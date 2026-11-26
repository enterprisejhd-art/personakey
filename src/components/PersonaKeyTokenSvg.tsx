interface PersonaKeyTokenSvgProps {
  status: 'idle' | 'consent' | 'active';
}

export function PersonaKeyTokenSvg({ status }: PersonaKeyTokenSvgProps) {
  const ledColor = status === 'active' ? '#00A896' : '#FF6B00';
  const statusLabel =
    status === 'active'
      ? 'LED ACTIVE (TEAL)'
      : status === 'consent'
        ? 'LED HANDSHAKE'
        : 'LED IDLE (ORANGE)';

  return (
    <div className="flex items-center gap-3">
      <svg
        width="88"
        height="52"
        viewBox="0 0 88 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`PersonaKey NFC Hardware Token — ${statusLabel}`}
        className="shrink-0"
      >
        {/* Matte Obsidian Card/Fob Body */}
        <rect
          x="1"
          y="1"
          width="86"
          height="50"
          rx="6"
          fill="#090D16"
          stroke="#1E293B"
          strokeWidth="1.5"
        />

        {/* Solar Orange Trim Hairline */}
        <rect
          x="5"
          y="5"
          width="78"
          height="42"
          rx="4"
          stroke="#FF6B00"
          strokeWidth="0.8"
          strokeOpacity="0.45"
        />

        {/* Keyring Slot */}
        <rect
          x="10"
          y="19"
          width="4"
          height="14"
          rx="2"
          fill="#F8FAFC"
          stroke="#FF6B00"
          strokeWidth="1"
        />

        {/* Solar Orange NFC Contact / Coil Pad */}
        <rect
          x="21"
          y="14"
          width="22"
          height="24"
          rx="3"
          fill="#090D16"
          stroke="#FF6B00"
          strokeWidth="1.25"
        />
        <path
          d="M27 20H37M27 26H37M27 32H34M32 14V38"
          stroke="#FF6B00"
          strokeWidth="1"
          strokeOpacity="0.85"
        />

        {/* Engraved Geometric Key Mark */}
        <circle cx="57" cy="24" r="3.5" stroke="#FFFFFF" strokeWidth="1.4" />
        <path
          d="M60.5 24H71M67 24V27.5M71 24V26.5"
          stroke="#FF6B00"
          strokeWidth="1.4"
          strokeLinecap="square"
        />

        {/* Live LED Hardware Status Indicator */}
        <rect
          x="73"
          y="10"
          width="5"
          height="5"
          rx="1"
          fill={ledColor}
        />

        {/* Subtle Engraved Wordmark */}
        <text
          x="51"
          y="38"
          fill="#E2E8F0"
          fontSize="5.5"
          fontFamily="JetBrains Mono, monospace"
          letterSpacing="0.8"
        >
          PK-NFC
        </text>
      </svg>

      <div className="min-w-0">
        <p className="font-mono text-[11px] font-semibold text-[var(--pk-heading)]">
          Hardware Token
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] text-[var(--pk-muted)]">
          <span
            className={`inline-block h-2 w-2 shrink-0 rounded-xs ${
              status === 'active' ? 'bg-[#00A896]' : 'bg-[#FF6B00]'
            }`}
            aria-hidden="true"
          />
          {status === 'active'
            ? 'Teal LED · Authorised'
            : status === 'consent'
              ? 'Orange LED · Consent'
              : 'Orange LED · Ready'}
        </p>
      </div>
    </div>
  );
}
