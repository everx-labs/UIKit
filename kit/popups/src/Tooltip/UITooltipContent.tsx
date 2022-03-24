import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILabel, TypographyVariants, UILabelColors } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIConstant } from '../constants';
import type { UITooltipContentProps } from './types';

export const UITooltipContent = React.memo(
    React.forwardRef<View, UITooltipContentProps>(function UITooltipContent(
        { onLayout, children },
        ref,
    ) {
        return (
            <View style={style.container} onLayout={onLayout} ref={ref}>
                <UILabel
                    role={TypographyVariants.NarrowParagraphFootnote}
                    color={UILabelColors.TextPrimary}
                >
                    {children}
                </UILabel>
            </View>
        );
    }),
);

const style = StyleSheet.create({
    container: {
        maxWidth: UIConstant.tooltip.maxWidth,
        padding: UILayoutConstant.smallContentOffset,
    },
});
