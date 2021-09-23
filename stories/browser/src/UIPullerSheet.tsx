import * as React from 'react';
import { StyleSheet, useWindowDimensions, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIConstant } from '@tonlabs/uikit.core';
import { UIBackgroundView, ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { UIBottomSheet } from '@tonlabs/uikit.navigation';
import { ScrollView } from '@tonlabs/uikit.scrolls';

const PULLER_HEIGHT = 12;

export function UIPullerSheet({
    visible,
    onClose,
    children,
}: {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();

    const paddingBottom = Math.max(insets?.bottom || 0, UIConstant.contentOffset());

    return (
        <UIBottomSheet
            visible={visible}
            onClose={onClose}
            style={[
                styles.list,
                {
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                },
            ]}
        >
            <ScrollView
                bounces={false}
                style={{
                    maxHeight: height - (StatusBar.currentHeight ?? 0) - insets.top - PULLER_HEIGHT,
                }}
                contentContainerStyle={{
                    paddingBottom,
                }}
            >
                <UIBackgroundView style={styles.pullerContainer}>
                    <UIBackgroundView
                        color={ColorVariants.BackgroundNeutral}
                        style={styles.puller}
                    />
                </UIBackgroundView>
                {children}
            </ScrollView>
        </UIBottomSheet>
    );
}

const styles = StyleSheet.create({
    pullerContainer: {
        height: PULLER_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    puller: {
        width: 32,
        height: 2,
        borderRadius: 2,
        marginHorizontal: UIConstant.smallContentOffset(),
    },
    list: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
    },
});
