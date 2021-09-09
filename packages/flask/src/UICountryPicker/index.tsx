import React from 'react';
import type { CountryPickerProps } from './types';
import { CountryPicker } from './CountryPicker'

export  * from './types'

export function UICountryPicker(props:CountryPickerProps) {
    return (
        <CountryPicker
            {...props}
        />
    )   
}