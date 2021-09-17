import * as React from 'react';
import { UICountryPicker as CountryPicker, WrappedCountryPickerProps } from '@tonlabs/uikit.flask';

export const UICountryPicker = (props: WrappedCountryPickerProps) => {
    return (
        <CountryPicker
                {...props}
            />
    );
};
