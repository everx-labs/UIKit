import * as React from 'react';
import { requireNativeComponent } from 'react-native';

import type { UIInputAccessoryViewProps } from './types';

const CustomKeyboardNativeView = requireNativeComponent<UIInputAccessoryViewProps>(
    'CustomKeyboardNativeView',
);

export function InputAccessoryView({ children, customKeyboardView }: UIInputAccessoryViewProps) {
    const CustomKeyboardContent = customKeyboardView?.component;
    return (
        <>
            {children}
            <CustomKeyboardNativeView>
                {CustomKeyboardContent && (
                    <CustomKeyboardContent {...customKeyboardView?.initialProps} />
                )}
            </CustomKeyboardNativeView>
        </>
    );
}
