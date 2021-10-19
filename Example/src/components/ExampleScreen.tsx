import * as React from 'react';
import type { ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    const insets = useSafeAreaInsets();
    return (
        <UIBackgroundView style={{ flex: 1 }} color={color}>
            <ScrollView
                contentContainerStyle={{
                    alignItems: 'center',
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }}
                {...rest}
            >
                {children}
            </ScrollView>
        </UIBackgroundView>
    );
}
