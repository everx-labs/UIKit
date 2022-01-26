import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle, StatusBar, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useAnimatedReaction } from 'react-native-reanimated';
import { UISheet, UISheetProps } from './UISheet/UISheet';

import { useShrinkContentUnderSheetContextProgress } from './ShrinkContentUnderSheet';
import { useSheetProgress } from './UISheet/usePosition';

export type UIFullscreenSheetProps = Omit<UISheetProps, 'countRubberBandDistance'> & {
    style?: StyleProp<ViewStyle>;
};

function MoveContentUnderSheet() {
    const contentUnderSheetProgress = useShrinkContentUnderSheetContextProgress();
    const positionProgress = useSheetProgress();

    useAnimatedReaction(
        () => {
            // to a range 0-1 be starting from half of the snapPoint to the end of it
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
}

export function UIFullscreenSheet({ children, style, ...rest }: UIFullscreenSheetProps) {
    const { height } = useWindowDimensions();
    const { top: topInset } = useSafeAreaInsets();

    const fullscreenHeight = React.useMemo(
        () =>
            height -
            Math.max(StatusBar.currentHeight ?? 0, topInset) +
            UILayoutConstant.rubberBandEffectDistance -
            // TODO: borderRadius + some indent
            (10 + 2),
        [height, topInset],
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
    },
});
