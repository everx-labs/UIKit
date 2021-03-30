import * as React from 'react';
import { requireNativeComponent } from 'react-native';
import type { ColorValue } from 'react-native';

type CustomKeyboardView = {
    component: typeof React.Component;
    initialProps?: Record<string, unknown>;
    backgroundColor?: ColorValue;
};

type UIInputAccessoryViewProps = {
    children: React.ReactNode;
    customKeyboardView?: CustomKeyboardView;
};

const CustomKeyboardNativeView = requireNativeComponent<
    UIInputAccessoryViewProps
>('CustomKeyboardNativeView');

export function UIInputAccessoryView({
    children,
    customKeyboardView,
}: UIInputAccessoryViewProps) {
    const CustomKeyboardContent = customKeyboardView?.component;
    return (
        <>
            {children}
            <CustomKeyboardNativeView>
                {CustomKeyboardContent && (
                    <CustomKeyboardContent
                        {...customKeyboardView?.initialProps}
                    />
                )}
            </CustomKeyboardNativeView>
        </>
    );
}
