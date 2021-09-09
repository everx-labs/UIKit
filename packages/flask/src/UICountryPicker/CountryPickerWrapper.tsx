import React from 'react';
import { Dimensions } from 'react-native';
import { UIBottomSheet } from '@tonlabs/uikit.navigation';
import type { WrappedCountryPickerProps } from './types';
import { CountryPicker } from './CountryPicker';

// TODO: add wrapper web version(modal) when gotovo
export function WrappedCountryPicker(
    {
        onClose,
        onSelect,
        visible,
        banned,
        permitted,
    }: WrappedCountryPickerProps) {

    return (
        <UIBottomSheet
            onClose={onClose}
            visible={visible}
            style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                height: Dimensions.get('window').height,
            }}>
            <CountryPicker
                onClose={onClose}
                onSelect={onSelect}
                banned={banned}
                permitted={permitted}
            />
        </UIBottomSheet>
    );
}
