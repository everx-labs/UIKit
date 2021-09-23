export type Country = {
    code: string;
    name: string;
    emoji: string;
};

export type CountriesArray = Country[] | [];

export type CountryPickerProps = {
    /** Callback on close */
    onClose: () => void;
    /** Called if some item is selected */
    onSelect?: (countryCode: string) => void;
    /** Array of allowed countries codes */
    permitted?: string[];
    /** Array of countries codes to exclude */
    banned?: string[];
};

export type WrappedCountryPickerProps = CountryPickerProps & {
    visible: boolean;
};
