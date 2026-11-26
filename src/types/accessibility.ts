export type AccessibilityMode = 'standard' | 'high-contrast' | 'large-text';

export interface AccessibilityOption {
  id: AccessibilityMode;
  label: string;
  shortLabel: string;
  schemaContrast: 'standard' | 'high';
  schemaFontScale: number;
  description: string;
}

export const ACCESSIBILITY_OPTIONS: AccessibilityOption[] = [
  {
    id: 'standard',
    label: 'Standard',
    shortLabel: 'Standard',
    schemaContrast: 'standard',
    schemaFontScale: 1.0,
    description: 'Default slate-white canvas and 16px body scale.',
  },
  {
    id: 'high-contrast',
    label: 'High Contrast',
    shortLabel: 'High Contrast',
    schemaContrast: 'high',
    schemaFontScale: 1.0,
    description: 'Deep navy structural borders, underlined navigation, and maximum text contrast.',
  },
  {
    id: 'large-text',
    label: 'Large Text',
    shortLabel: 'Large Text',
    schemaContrast: 'standard',
    schemaFontScale: 1.1875,
    description: '1.19x body and heading scale with expanded reading measure.',
  },
];
