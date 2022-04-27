import * as React from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import { UILabel, TypographyVariants, Typography } from '@tonlabs/uikit.themes';
import type { UIExpandableTextProps } from './types';

/**
 * It is used only to find out if the UILabel will be clipped
 * by a given numberOfLines or the text will fit in its entirety.
 *
 * It renders nothing visible.
 * @param props
 * @returns
 */
export function MeasureLabel(
    props: UIExpandableTextProps & {
        onMeasure: (isFit: boolean) => void;
    },
) {
    const { numberOfLines, onMeasure, role } = props;

    const lineHeight = React.useMemo(
        () => StyleSheet.flatten(Typography[role || TypographyVariants.ParagraphText]).lineHeight,
        [role],
    );

    const onLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { height },
            },
        }: LayoutChangeEvent) => {
            if (
                numberOfLines == null ||
                lineHeight == null ||
                Math.round(height / lineHeight) <= numberOfLines
            ) {
                onMeasure(true);
            } else {
                onMeasure(false);
            }
        },
        [lineHeight, numberOfLines, onMeasure],
    );

    return (
        <UILabel {...props} onLayout={onLayout} style={styles.measure} numberOfLines={undefined} />
    );
}
const styles = StyleSheet.create({
    measure: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        opacity: 0,
        flexShrink: 0,
    },
});
