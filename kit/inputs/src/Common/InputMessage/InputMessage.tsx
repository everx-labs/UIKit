import * as React from 'react';
import { StyleSheet } from 'react-native';

import { TypographyVariants, Typography } from '@tonlabs/uikit.themes';
import { UIPressableLabel } from '@tonlabs/uikit.controls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import type { InputMessageProps } from './types';
import { useMessageColors } from './hooks';
import { AnimatedContainer } from './AnimatedContainer';
import { InputColorScheme } from '../constants';

export function InputMessage({
    children,
    type,
    onPress,
    colorScheme = InputColorScheme.Default,
    ...rest
}: InputMessageProps) {
    const colors = useMessageColors(type, colorScheme);

    return (
        <AnimatedContainer>
            <UIPressableLabel
                onPress={onPress}
                role={TypographyVariants.ParagraphLabel}
                style={styles.comment}
                colors={colors}
                {...rest}
            >
                {children}
            </UIPressableLabel>
        </AnimatedContainer>
    );
}

const styles = StyleSheet.create({
    comment: {
        paddingTop: UILayoutConstant.contentInsetVerticalX1,
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    bottomDefaultOffset: {
        marginTop: UILayoutConstant.contentInsetVerticalX1,
        height: StyleSheet.flatten(Typography[TypographyVariants.ParagraphLabel]).lineHeight,
    },
});
