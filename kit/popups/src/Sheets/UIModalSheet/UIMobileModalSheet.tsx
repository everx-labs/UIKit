import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAnimatedReaction } from 'react-native-reanimated';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useAndroidNavigationBarHeight } from '@tonlabs/uicast.keyboard';
import { ColorVariants } from '@tonlabs/uikit.themes';

import type { UIModalSheetProps } from './UIModalSheet';
import { UISheet } from '../UISheet/UISheet';
import { useShrinkContentUnderSheetContextProgress } from './ShrinkContentUnderSheet';
import { useSheetProgress } from '../UISheet/usePosition';
import { ModalSheetHeader } from './ModalSheetHeader';

export type UIMobileModalSheetProps = UIModalSheetProps & {
    style?: StyleProp<ViewStyle>;
};

const MoveContentUnderSheet = React.memo(function MoveContentUnderSheet() {
    const contentUnderSheetProgress = useShrinkContentUnderSheetContextProgress();
    const positionProgress = useSheetProgress();

    useAnimatedReaction(
        () => {
            // to a range 0-1 be starting from half of the progress to the end of it
            return positionProgress.value * 2 - 1;
        },
        progress => {
            if (!contentUnderSheetProgress) {
                return;
            }

            contentUnderSheetProgress.value = progress;
        },
    );

    return null;
});

export function UIMobileModalSheet({
    children,
    style,
    hasHeader = false,
    backgroundColor = ColorVariants.BackgroundPrimary,
    ...rest
}: UIMobileModalSheetProps) {
    const { height } = useWindowDimensions();
    const { top: topInset } = useSafeAreaInsets();
    const { height: androidNavigationBarHeight } = useAndroidNavigationBarHeight();

    const fullscreenHeight = React.useMemo(
        () =>
            height +
            androidNavigationBarHeight -
            Math.max(topInset, UILayoutConstant.contentInsetVerticalX4) +
            UILayoutConstant.rubberBandEffectDistance -
            // iOS has a very small indent after when borderRadius ends
            // do here the same, it's not exact, just was done with eye test
            (UILayoutConstant.alertBorderRadius + 2),
        [height, topInset, androidNavigationBarHeight],
    );

    const sheetStyle = React.useMemo(() => {
        const flattenStyle = StyleSheet.flatten(style);
        const paddingBottom =
            Math.max((flattenStyle.paddingBottom as number) ?? 0) +
            UILayoutConstant.rubberBandEffectDistance;

        return {
            paddingBottom,
            height: fullscreenHeight,
        };
    }, [style, fullscreenHeight]);

    const { visible, forId } = rest;
    return (
        <UISheet.Container visible={visible} forId={forId}>
            <UISheet.KeyboardUnaware defaultShift={-UILayoutConstant.rubberBandEffectDistance}>
                <UISheet.FixedSize height={fullscreenHeight}>
                    <UISheet.Content {...rest} style={[styles.bottom, style, sheetStyle]}>
                        <MoveContentUnderSheet />
                        {hasHeader ? <ModalSheetHeader backgroundColor={backgroundColor} /> : null}
                        {children}
                    </UISheet.Content>
                </UISheet.FixedSize>
            </UISheet.KeyboardUnaware>
        </UISheet.Container>
    );
}

const styles = StyleSheet.create({
    bottom: {
        width: '100%',
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
        overflow: 'hidden',
        borderTopLeftRadius: UILayoutConstant.alertBorderRadius,
        borderTopRightRadius: UILayoutConstant.alertBorderRadius,
    },
});
