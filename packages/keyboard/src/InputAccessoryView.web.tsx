import * as React from 'react';

import { CustomKeyboardWrapper } from './CustomKeyboardWrapper';
import type { UIInputAccessoryViewProps } from './types';

export function InputAccessoryView({ children, customKeyboardView }: UIInputAccessoryViewProps) {
    const CustomKeyboardContent = customKeyboardView?.component;
    return (
        <>
            {children}
            <CustomKeyboardWrapper>
                {CustomKeyboardContent && (
                    <CustomKeyboardContent {...customKeyboardView?.initialProps} />
                )}
            </CustomKeyboardWrapper>
        </>
    );
}
