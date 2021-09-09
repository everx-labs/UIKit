import type React from 'react';
import type { WrappedCountryPickerProps } from './types';
import { WrappedCountryPicker } from './CountryPickerWrapper';

export * from './types';

export const UICountryPicker: React.FC<WrappedCountryPickerProps> = WrappedCountryPicker;
