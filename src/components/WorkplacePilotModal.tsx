import { useEffect, useState, type FormEvent } from 'react';
import { Check, Download } from 'lucide-react';
import { ModalDrawer } from './ModalDrawer';

export type WorkplaceEnquiryMode = 'pilot' | 'sdk';

interface WorkplacePilotModalProps {
  isOpen: boolean;
  mode: WorkplaceEnquiryMode;
  onClose: () => void;
}

const ORG_TYPES = [
  'Coworking / Flex Space',
  'SME / Enterprise Employer',
  'Accessibility / Inclusion Programme',
  'Hospitality / Smart Space Partner',
] as const;

const DESK_RANGES = ['1–25', '26–100', '100+'] as const;
const OS_ENVIRONMENTS = ['Windows', 'macOS', 'Mixed / Browser-first'] as const;

const ONBOARDING_STEPS = [
  {
    week: 'Week 1',
    title: 'Scope & Compatibility Audit',
    detail:
      'Confirm target workstation OS images, browser session policies, and Matter desk-lighting endpoints.',
  },
  {
    week: 'Week 2',
    title: 'Receiver & Token Provisioning',
    detail:
      'Deliver ephemeral workspace adaptors alongside pre-provisioned NFC/Bluetooth test tokens.',
  },
  {
    week: 'Week 3',
    title: 'Controlled Floor Trial',
    detail:
      'Run supervised desk activations with live UK GDPR consent and audit-log verification.',
  },
  {
    week: 'Week 4',
    title: 'Reversal Review & Licence Sign-Off',
    detail:
      'Verify automatic baseline restoration across sign-out events and finalise production rollout.',
  },
];

interface PilotSubmission {
  referenceId: string;
  submittedAt: string;
  enquiryRoute: WorkplaceEnquiryMode;
  fullName: string;
  workEmail: string;
  organisationName: string;
  organisationType: (typeof ORG_TYPES)[number];
  approximateSharedDesks: (typeof DESK_RANGES)[number];
  primaryOsEnvironment: (typeof OS_ENVIRONMENTS)[number];
  notes: string;
}

export function WorkplacePilotModal({
  isOpen,
  mode,
  onClose,
}: WorkplacePilotModalProps) {
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [organisationType, setOrganisationType] = useState<
    (typeof ORG_TYPES)[number]
  >(
    mode === 'sdk'
      ? 'Hospitality / Smart Space Partner'
      : 'Coworking / Flex Space'
  );
  const [sharedDesks, setSharedDesks] =
    useState<(typeof DESK_RANGES)[number]>('26–100');
  const [osEnvironment, setOsEnvironment] =
    useState<(typeof OS_ENVIRONMENTS)[number]>('Mixed / Browser-first');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submission, setSubmission] = useState<PilotSubmission | null>(null);

  useEffect(() => {
    if (isOpen) {
      setOrganisationType(
        mode === 'sdk'
          ? 'Hospitality / Smart Space Partner'
          : 'Coworking / Flex Space'
      );
      setErrorMessage('');
      setSubmission(null);
    }
  }, [isOpen, mode]);

  const handleResetAndClose = () => {
    setErrorMessage('');
    setSubmission(null);
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedEmail = workEmail.trim();
    const trimmedOrg = organisationName.trim();

    if (!trimmedName || !trimmedEmail || !trimmedOrg) {
      setErrorMessage(
        'Please complete your full name, work email address, and organisation name.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    setErrorMessage('');
    setSubmission({
      referenceId: `PK-PLT-${Math.floor(100000 + Math.random() * 900000)}`,
      submittedAt: new Date().toISOString(),
      enquiryRoute: mode,
      fullName: trimmedName,
      workEmail: trimmedEmail,
      organisationName: trimmedOrg,
      organisationType,
      approximateSharedDesks: sharedDesks,
      primaryOsEnvironment: osEnvironment,
      notes: notes.trim(),
    });
  };

  const handleDownloadJson = () => {
    if (!submission) return;
    const blob = new Blob([JSON.stringify(submission, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${submission.referenceId.toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const modalTitle =
    mode === 'sdk'
      ? 'Enquire about PersonaKey SDK / API Licensing'
      : 'Book a Workplace Pilot';

  const modalEyebrow =
    mode === 'sdk'
      ? 'OEM & SMART-BUILDING INTEGRATION'
      : '4-WEEK CONTROLLED PILOT';

  return (
    <ModalDrawer
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={modalTitle}
      eyebrow={modalEyebrow}
    >
      {submission ? (
        <div className="space-y-5">
          <div className="rounded-lg border border-[#00A896] bg-[#F8FAFC] p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#090D16]">
                <Check size={15} strokeWidth={2.25} className="text-[#00A896]" aria-hidden="true" />
                Pilot Request Logged
              </span>
              <span className=" text-xs font-medium text-[#090D16]">
                {submission.referenceId}
              </span>
            </div>
            <p className="mt-2 text-sm text-[#334155]">
              Thank you, <strong className="text-[#090D16]">{submission.fullName}</strong>.
              Your {submission.enquiryRoute === 'sdk' ? 'SDK licensing' : 'workplace pilot'}{' '}
              enquiry for <strong className="text-[#090D16]">{submission.organisationName}</strong>{' '}
              has been prepared for technical review.
            </p>
          </div>

          {/* Request Summary */}
          <dl className="grid grid-cols-1 gap-3 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-4 text-xs sm:grid-cols-2">
            <div>
              <dt className=" text-[11px] text-[#64748B]">WORK EMAIL</dt>
              <dd className="mt-0.5 font-medium text-[#090D16]">
                {submission.workEmail}
              </dd>
            </div>
            <div>
              <dt className=" text-[11px] text-[#64748B]">ORGANISATION TYPE</dt>
              <dd className="mt-0.5 font-medium text-[#090D16]">
                {submission.organisationType}
              </dd>
            </div>
            <div>
              <dt className=" text-[11px] text-[#64748B]">SHARED DESKS</dt>
              <dd className="mt-0.5 font-medium text-[#090D16] tabular-nums">
                {submission.approximateSharedDesks}
              </dd>
            </div>
            <div>
              <dt className=" text-[11px] text-[#64748B]">PRIMARY OS</dt>
              <dd className="mt-0.5 font-medium text-[#090D16]">
                {submission.primaryOsEnvironment}
              </dd>
            </div>
            {submission.notes && (
              <div className="sm:col-span-2 border-t border-[#E2E8F0] pt-2.5">
                <dt className=" text-[11px] text-[#64748B]">NOTES</dt>
                <dd className="mt-0.5 text-[#334155]">{submission.notes}</dd>
              </div>
            )}
          </dl>

          {/* 4-Week Controlled Pilot Onboarding Steps */}
          <div>
            <h3 className=" text-xs font-semibold tracking-[0.04em] text-[#090D16]">
              4-WEEK CONTROLLED PILOT ONBOARDING
            </h3>
            <ol className="mt-2.5 divide-y divide-[#E2E8F0] rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
              {ONBOARDING_STEPS.map((item) => (
                <li key={item.week} className="px-4 py-3">
                  <div className="flex items-baseline gap-2">
                    <span className=" text-[11px] font-semibold text-[#090D16]">
                      {item.week}
                    </span>
                    <span className="text-xs font-semibold text-[#090D16]">
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#334155]">{item.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
            <button
              type="button"
              onClick={handleDownloadJson}
              className="pk-focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#090D16] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#090D16] transition-colors hover:bg-[#090D16] hover:text-[#FFFFFF]"
            >
              <Download size={14} aria-hidden="true" />
              Download JSON Summary
            </button>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="pk-focus-ring cursor-pointer rounded-md bg-[#00A896] px-4 py-2 text-xs font-semibold text-[#FFFFFF] transition-colors hover:bg-[#090D16]"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <p className="text-sm text-[#334155]">
            {mode === 'sdk'
              ? 'Share your hardware or building platform details to request PersonaKey SDK documentation and commercial licensing terms.'
              : 'Configure a 4-week controlled pilot across your shared desks, browser terminals, or accessible workspace pods.'}
          </p>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-md border border-[#090D16] bg-[#F8FAFC] px-3.5 py-2.5 text-xs font-medium text-[#090D16]"
            >
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="pilot-full-name"
                className="block text-xs font-semibold text-[#090D16]"
              >
                Full Name
              </label>
              <input
                id="pilot-full-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr Eleanor Davies"
                className="pk-focus-ring mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-sm text-[#090D16] placeholder:text-[#64748B]"
              />
            </div>

            <div>
              <label
                htmlFor="pilot-work-email"
                className="block text-xs font-semibold text-[#090D16]"
              >
                Work Email
              </label>
              <input
                id="pilot-work-email"
                type="email"
                required
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="e.davies@organisation.co.uk"
                className="pk-focus-ring mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-sm text-[#090D16] placeholder:text-[#64748B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="pilot-org-name"
                className="block text-xs font-semibold text-[#090D16]"
              >
                Organisation Name
              </label>
              <input
                id="pilot-org-name"
                type="text"
                required
                value={organisationName}
                onChange={(e) => setOrganisationName(e.target.value)}
                placeholder="Clerkenwell Flex Hubs Ltd"
                className="pk-focus-ring mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-sm text-[#090D16] placeholder:text-[#64748B]"
              />
            </div>

            <div>
              <label
                htmlFor="pilot-org-type"
                className="block text-xs font-semibold text-[#090D16]"
              >
                Organisation Type
              </label>
              <select
                id="pilot-org-type"
                value={organisationType}
                onChange={(e) =>
                  setOrganisationType(e.target.value as (typeof ORG_TYPES)[number])
                }
                className="pk-focus-ring mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-sm text-[#090D16]"
              >
                {ORG_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#090D16]">
              Approximate Shared Desks
            </span>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {DESK_RANGES.map((range) => {
                const isSelected = sharedDesks === range;
                return (
                  <button
                    key={range}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSharedDesks(range)}
                    className={`pk-focus-ring cursor-pointer rounded-md border px-3 py-2  text-xs font-medium transition-colors ${
                      isSelected
                        ? 'border-[#090D16] bg-[#090D16] text-[#FFFFFF]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] hover:border-[#090D16]'
                    }`}
                  >
                    {range}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#090D16]">
              Primary OS Environment
            </span>
            <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {OS_ENVIRONMENTS.map((os) => {
                const isSelected = osEnvironment === os;
                return (
                  <button
                    key={os}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setOsEnvironment(os)}
                    className={`pk-focus-ring cursor-pointer rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                      isSelected
                        ? 'border-[#090D16] bg-[#090D16] text-[#FFFFFF]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] hover:border-[#090D16]'
                    }`}
                  >
                    {os}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="pilot-notes"
              className="block text-xs font-semibold text-[#090D16]"
            >
              Optional Notes
            </label>
            <textarea
              id="pilot-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Include details on smart-lighting bridges, accessibility goals, or target launch dates."
              className="pk-focus-ring mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-sm text-[#090D16] placeholder:text-[#64748B]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="pk-focus-ring cursor-pointer rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2 text-xs font-medium text-[#334155] transition-colors hover:border-[#090D16] hover:text-[#090D16]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pk-focus-ring cursor-pointer rounded-md bg-[#00A896] px-4 py-2 text-xs font-semibold text-[#FFFFFF] transition-colors hover:bg-[#090D16]"
            >
              Submit Pilot Request
            </button>
          </div>
        </form>
      )}
    </ModalDrawer>
  );
}
