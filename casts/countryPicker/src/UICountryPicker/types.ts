export type Country = {
    code: string;
    name: string;
    flag: string;
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

export enum SoftInputMode {
    NOTHING = 48,
    PAN = 32,
    RESIZE = 16,
    UNSPECIFIED = 0,
}
