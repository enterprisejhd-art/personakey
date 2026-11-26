import { ModalDrawer } from './ModalDrawer';

interface PrivacyArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIVACY_CONTROLS = [
  {
    code: '01 · UK GDPR DATA MINIMISATION',
    title: 'Category-scoped selective disclosure',
    detail:
      'Receiving workstations and smart rooms advertise only the capability schemas they can translate. Your PersonaKey credential transmits solely the approved categories for that session and withholds unrelated preferences such as home lighting or personal browser rules.',
  },
  {
    code: '02 · ZERO DIAGNOSTIC STORAGE',
    title: 'Functional settings only — never medical records',
    detail:
      'PersonaKey models human preference outputs (text scale, contrast ratio, cursor size, motion reduction, and ambient lighting) rather than underlying health conditions or clinical diagnoses. No special-category medical data is collected, inferred, or stored.',
  },
  {
    code: '03 · ENCRYPTION IN TRANSIT & AT REST',
    title: 'Hardware-bound tokens and ephemeral session keys',
    detail:
      'All session handshakes run over mutual TLS 1.3 with short-lived encrypted session envelopes. Portable profiles stored on user devices or optional PersonaKey Plus backups are encrypted at rest using AES-256-GCM with user-held keys.',
  },
  {
    code: '04 · AUTOMATIC SESSION REVERSAL',
    title: 'Deterministic cleanup at sign-out or TTL expiry',
    detail:
      'Before applying any personalisation, the local adaptor captures a baseline snapshot of the shared terminal. Signing out, tapping away, or reaching the session time-to-live (TTL) immediately wipes temporary overlays and restores neutral defaults.',
  },
];

export function PrivacyArchitectureModal({
  isOpen,
  onClose,
}: PrivacyArchitectureModalProps) {
  return (
    <ModalDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy Architecture"
      eyebrow="UK GDPR & CRYPTOGRAPHIC SAFEGUARDS"
    >
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-[#334155]">
          PersonaKey is engineered around explicit user consent, minimal session
          disclosure, and verifiable reversal across shared environments.
        </p>

        <div className="divide-y divide-[#E2E8F0] rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
          {PRIVACY_CONTROLS.map((control) => (
            <div key={control.code} className="p-4">
              <p className="font-mono text-[11px] font-semibold text-[#00A896]">
                {control.code}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-[#090D16]">
                {control.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#334155]">
                {control.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
          <span className="font-mono text-[11px] text-[#64748B]">
            Data protection queries: hello@personakey.co.uk
          </span>
          <button
            type="button"
            onClick={onClose}
            className="pk-focus-ring cursor-pointer rounded-md bg-[#090D16] px-4 py-2 text-xs font-semibold text-[#FFFFFF] transition-colors hover:bg-[#1E293B]"
          >
            Close
          </button>
        </div>
      </div>
    </ModalDrawer>
  );
}
