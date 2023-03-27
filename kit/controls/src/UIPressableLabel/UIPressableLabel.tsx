import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { UILabel } from '@tonlabs/uikit.themes';

import type { UIPressableLabelProps } from './types';
import { UIPressableLabelContent } from './UIPressableLabelContent';
import { Pressable } from '../Pressable';

export function UIPressableLabel({
    children,
    onPress,
    colors,
    ...uiLabelProps
}: UIPressableLabelProps) {
    if (!children || children.length === 0) {
        return null;
    }

    if (!onPress) {
        return (
            <UILabel {...uiLabelProps} color={colors.initialColor}>
                {children}
            </UILabel>
        );
    }

    return (
        <Pressable onPress={onPress} style={styles.pressableContainer}>
            <UIPressableLabelContent colors={colors} {...uiLabelProps}>
                {children}
            </UIPressableLabelContent>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressableContainer: {
        display: 'flex',
        ...Platform.select({
            web: {
                userSelect: 'none',
            },
            default: {},
        }),
    },
});
