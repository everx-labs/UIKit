import * as React from 'react';
import type { ColorValue } from 'react-native';

import { CustomKeyboardWrapper } from './CustomKeyboardWrapper';

type CustomKeyboardView = {
    component: typeof React.Component;
    initialProps?: Record<string, unknown>;
    backgroundColor?: ColorValue;
};

type UIInputAccessoryViewProps = {
    children: React.ReactNode;
    customKeyboardView?: CustomKeyboardView;
};

export function UIInputAccessoryView({
    children,
    customKeyboardView,
}: UIInputAccessoryViewProps) {
    const CustomKeyboardContent = customKeyboardView?.component;
    return (
        <>
            {children}
            <CustomKeyboardWrapper>
                {CustomKeyboardContent && (
                    <CustomKeyboardContent
                        {...customKeyboardView?.initialProps}
                    />
                )}
            </CustomKeyboardWrapper>
        </>
    );
}
