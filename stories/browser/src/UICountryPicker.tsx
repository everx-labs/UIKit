import * as React from 'react';
import {
    UICountryPicker as CountryPicker,
    WrappedCountryPickerProps,
} from '@tonlabs/uicast.country-picker';

export const UICountryPicker = (props: WrappedCountryPickerProps) => {
    return <CountryPicker {...props} />;
};
