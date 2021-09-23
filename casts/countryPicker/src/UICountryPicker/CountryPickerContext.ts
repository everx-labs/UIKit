import { createContext } from 'react';

type CountryPickerContextType = {
    loading: boolean;
    onSelect?(countryCode: string): void;
};

export const CountryPickerContext = createContext<CountryPickerContextType>({
    loading: true,
});
