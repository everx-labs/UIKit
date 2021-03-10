import * as React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIBackgroundView } from '@tonlabs/uikit.hydrogen';
import type { ColorVariants } from '@tonlabs/uikit.hydrogen';

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
                style={{ flex: 1 }}
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
