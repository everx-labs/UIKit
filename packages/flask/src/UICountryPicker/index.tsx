import type React from 'react';
import type { WrappedCountryPickerProps } from './types';
import { CountryPicker } from './CountryPicker';

export * from './types';

export const UICountryPicker: React.FC<WrappedCountryPickerProps> = CountryPicker;
