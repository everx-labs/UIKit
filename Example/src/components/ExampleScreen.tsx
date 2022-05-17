import * as React from 'react';
import type { ScrollViewProps } from 'react-native';

import { UIBackgroundView, ColorVariants } from '@tonlabs/uikit.themes';
import { ScrollView } from '@tonlabs/uikit.scrolls';

export function ExampleScreen({
    children,
    color,
    ...rest
}: {
    children: React.ReactNode;
    color?: ColorVariants;
} & ScrollViewProps) {
    return (
        <UIBackgroundView style={{ flex: 1 }} color={color}>
            <ScrollView
                contentContainerStyle={{
                    alignItems: 'center',
                }}
                automaticallyAdjustContentInsets
                automaticallyAdjustKeyboardInsets
                {...rest}
            >
                {children}
            </ScrollView>
        </UIBackgroundView>
    );
}
