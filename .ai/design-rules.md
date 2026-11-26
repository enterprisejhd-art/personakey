# PersonaKey Corporate Design System & Anti-Slop UI Rules

1. **Hybrid Corporate Architecture (Cloudflare + Netlify Standard):**
   - **Primary Canvas (Light Mode):** Pure White (`#FFFFFF`) and Warm Alabaster (`#F8FAFC`) with crisp `1px solid #E2E8F0` hairline borders for the Hero canvas, Problem Explorer, Handshake Architecture, Neutrality Matrix, Solutions Console, Market Evidence, and Pricing.
   - **Hardware Stage (Deep Obsidian):** Deep Obsidian (`#090D16`) with `#1E293B` hairline borders for the Hero Interactive Product Bento Stage and the Interactive Real-World Hardware Product Journey.
2. **Bright Brand Accents & Color Discipline:**
   - **Electric Teal (`#00A896`):** Verified actions, authorised partition unlocks, and compliance proofs.
   - **Vibrant Solar Orange (`#FF6B00`):** Primary CTAs, NFC tap pulses, live alerts, and active hardware indicators.
   - **Neutral Hierarchy:** Deep Obsidian (`#090D16`) headings on light surfaces, Pure White (`#FFFFFF`) headings on dark stages, Slate Text (`#334155` / `#64748B` on light; `#CBD5E1` / `#94A3B8` on obsidian).
   - ZERO purple, indigo, or violet gradients/accents anywhere.
3. **Typography:**
   - **Display Headings (H1/H2):** `Plus Jakarta Sans` (weights 600, 700, 800), tight `-0.03em` tracking, crisp `1.08` line-height.
   - **UI & Body Prose:** `Inter` (weights 400, 500, 600, 700).
   - **Badges, Telemetry & Metrics:** STRICTLY PROHIBIT monospace fonts (`JetBrains Mono` / `font-mono`). Use `Plus Jakarta Sans` or `Inter` with `tabular-nums` (`font-semibold` or `font-bold`, uppercase, tracking `0.08em`).
4. **Surface, Geometry & Global Micro-Hovers:**
   - Solid flat surfaces only. ZERO `backdrop-blur`, ZERO glassmorphism, ZERO background mesh/radial gradients, and max `8px` (`rounded-lg`) corners.
   - Every interactive card lifts `translateY(-2px)` on hover with border illumination (`#00A896` or `#FF6B00`).
   - Every CTA arrow (`→`) slides `4px` right on hover within `180ms` (`cubic-bezier(0.16, 1, 0.3, 1)`), respecting `prefers-reduced-motion`.
5. **Copy Discipline:** Concrete, technical, UK-English copy ("personalisation", "licence", "authorise"). No exclamation-mark hype, no fake testimonials, no developer jargon.
