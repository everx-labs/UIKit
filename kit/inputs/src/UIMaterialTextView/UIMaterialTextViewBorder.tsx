import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import type { UIMaterialTextViewCommonProps } from './types';

const getBorderColor = (
    props: UIMaterialTextViewCommonProps,
    isFocused: boolean,
    isHovered: boolean,
): ColorVariants => {
    if (props.success) {
        return ColorVariants.Transparent;
    }
    if (props.error) {
        return ColorVariants.LineNegative;
    }
    if (isFocused) {
        return ColorVariants.LineAccent;
    }
    if (isHovered) {
        return ColorVariants.LineNeutral;
    }
    return ColorVariants.LineSecondary;
};

export function UIMaterialTextViewBorder(
    props: UIMaterialTextViewCommonProps & {
        isFocused: boolean;
        children: React.ReactNode;
        onMouseEnter: () => void;
        onMouseLeave: () => void;
        isHovered: boolean;
    },
) {
    const { borderViewRef, onMouseEnter, onMouseLeave, isFocused, isHovered, children } = props;
    const theme = useTheme();

    return (
        <View
            ref={borderViewRef}
            // @ts-expect-error
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={[
                styles.inputWrapper,
                {
                    borderBottomColor: theme[getBorderColor(props, isFocused, isHovered)],
                },
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    inputWrapper: {
        position: 'relative',
        paddingBottom: 9,
        borderBottomWidth: 1,
        flexDirection: 'row',
    },
});
