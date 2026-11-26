import { useState, type FormEvent } from 'react';
import { Check, Nfc } from 'lucide-react';
import { ModalDrawer } from './ModalDrawer';

interface ConsumerBetaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const USE_CASES = [
  'Hybrid / Hot-Desking Worker',
  'Accessibility & Assistive Preferences',
  'Multi-Device Productivity',
] as const;

const ACTIVATION_OPTIONS = [
  {
    id: 'nfc-token',
    label: 'Physical NFC/Bluetooth Token (£79 beta batch)',
    hasHardwareIndicator: true,
  },
  {
    id: 'app-only',
    label: 'App / Digital Credential Only',
    hasHardwareIndicator: false,
  },
] as const;

const DEVICE_OPTIONS = [
  'Windows',
  'macOS',
  'Chrome/Edge',
  'Smart Lighting / Matter',
] as const;

interface BetaSubmission {
  queueId: string;
  name: string;
  email: string;
  useCase: (typeof USE_CASES)[number];
  activationLabel: string;
  devices: string[];
}

export function ConsumerBetaModal({ isOpen, onClose }: ConsumerBetaModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [useCase, setUseCase] = useState<(typeof USE_CASES)[number]>(
    'Hybrid / Hot-Desking Worker'
  );
  const [activationId, setActivationId] = useState<'nfc-token' | 'app-only'>(
    'nfc-token'
  );
  const [devices, setDevices] = useState<string[]>(['Windows', 'Chrome/Edge']);
  const [errorMessage, setErrorMessage] = useState('');
  const [submission, setSubmission] = useState<BetaSubmission | null>(null);

  const handleToggleDevice = (device: string) => {
    setDevices((prev) =>
      prev.includes(device)
        ? prev.filter((item) => item !== device)
        : [...prev, device]
    );
  };

  const handleResetAndClose = () => {
    setErrorMessage('');
    setSubmission(null);
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setErrorMessage('Please enter both your name and email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (devices.length === 0) {
      setErrorMessage('Please select at least one device or environment.');
      return;
    }

    const activation =
      ACTIVATION_OPTIONS.find((item) => item.id === activationId) ??
      ACTIVATION_OPTIONS[0];

    setErrorMessage('');
    setSubmission({
      queueId: `PK-BETA-${Math.floor(100 + Math.random() * 900)}`,
      name: trimmedName,
      email: trimmedEmail,
      useCase,
      activationLabel: activation.label,
      devices,
    });
  };

  return (
    <ModalDrawer
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title="Join the 100-User Consumer Beta"
      eyebrow="CONTROLLED BETA COHORT"
    >
      {submission ? (
        <div className="space-y-5">
          <div className="rounded-lg border border-[#00A896] bg-[#F8FAFC] p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#090D16]">
                <Check size={15} strokeWidth={2.25} className="text-[#00A896]" aria-hidden="true" />
                Beta Cohort Spot Reserved
              </span>
              <span className=" text-xs font-medium text-[#090D16]">
                {submission.queueId}
              </span>
            </div>
            <p className="mt-2 text-sm text-[#334155]">
              Thank you, <strong className="text-[#090D16]">{submission.name}</strong>.
              You have been placed in the controlled 100-user beta cohort queue
              for <strong className="text-[#090D16]">{submission.email}</strong>.
            </p>
          </div>

          <dl className="space-y-2.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-4 text-xs">
            <div>
              <dt className=" text-[11px] text-[#64748B]">PRIMARY USE CASE</dt>
              <dd className="mt-0.5 font-medium text-[#090D16]">
                {submission.useCase}
              </dd>
            </div>
            <div>
              <dt className=" text-[11px] text-[#64748B]">
                PREFERRED ACTIVATION
              </dt>
              <dd className="mt-0.5 font-medium text-[#090D16]">
                {submission.activationLabel}
              </dd>
            </div>
            <div>
              <dt className=" text-[11px] text-[#64748B]">DEVICES USED</dt>
              <dd className="mt-0.5 font-medium text-[#090D16]">
                {submission.devices.join(' · ')}
              </dd>
            </div>
          </dl>

          <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 text-xs leading-relaxed text-[#334155]">
            <strong className="text-[#090D16]">Privacy Notice:</strong> Your beta
            registration details are used solely to invite you to the cohort and
            match adaptor compatibility. PersonaKey never collects or stores
            medical diagnoses, health records, or passive location telemetry.
            Request removal at any time via{' '}
            <span className=" text-[#090D16]">hello@personakey.co.uk</span>.
          </div>

          <div className="flex justify-end border-t border-[#E2E8F0] pt-4">
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
            Register for the UK controlled beta batch. Participants test portable
            preference profiles across shared workstations and home-to-office
            workflows.
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
                htmlFor="beta-name"
                className="block text-xs font-semibold text-[#090D16]"
              >
                Name
              </label>
              <input
                id="beta-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Oliver Bennett"
                className="pk-focus-ring mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-sm text-[#090D16] placeholder:text-[#64748B]"
              />
            </div>

            <div>
              <label
                htmlFor="beta-email"
                className="block text-xs font-semibold text-[#090D16]"
              >
                Email
              </label>
              <input
                id="beta-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="oliver@example.co.uk"
                className="pk-focus-ring mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-sm text-[#090D16] placeholder:text-[#64748B]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="beta-use-case"
              className="block text-xs font-semibold text-[#090D16]"
            >
              Primary Use Case
            </label>
            <select
              id="beta-use-case"
              value={useCase}
              onChange={(e) =>
                setUseCase(e.target.value as (typeof USE_CASES)[number])
              }
              className="pk-focus-ring mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-sm text-[#090D16]"
            >
              {USE_CASES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#090D16]">
              Preferred Activation
            </span>
            <div className="mt-1.5 space-y-2">
              {ACTIVATION_OPTIONS.map((option) => {
                const isSelected = activationId === option.id;
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3.5 py-2.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? 'border-[#090D16] bg-[#F8FAFC] text-[#090D16]'
                        : 'border-[#E2E8F0] bg-[#FFFFFF] text-[#334155]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="preferred-activation"
                        checked={isSelected}
                        onChange={() => setActivationId(option.id)}
                        className="pk-focus-ring accent-[#00A896]"
                      />
                      <span>{option.label}</span>
                    </span>
                    {option.hasHardwareIndicator && (
                      <span
                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-xs bg-[#FF6B00] text-[#FFFFFF]"
                        aria-hidden="true"
                      >
                        <Nfc size={12} strokeWidth={2.25} />
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#090D16]">
              Devices Used
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {DEVICE_OPTIONS.map((device) => {
                const isChecked = devices.includes(device);
                return (
                  <label
                    key={device}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                      isChecked
                        ? 'border-[#090D16] bg-[#F8FAFC] text-[#090D16]'
                        : 'border-[#E2E8F0] bg-[#FFFFFF] text-[#334155]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleDevice(device)}
                      className="pk-focus-ring accent-[#00A896]"
                    />
                    <span>{device}</span>
                  </label>
                );
              })}
            </div>
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
              Reserve Beta Spot
            </button>
          </div>
        </form>
      )}
    </ModalDrawer>
  );
}
