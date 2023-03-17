import * as React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { ColorVariants } from '@tonlabs/uikit.themes';

import { UISheet } from '../UISheet/UISheet';
import type { KeyboardAwareSheetProps } from '../UISheet/KeyboardAwareSheet';
import { ModalSheetHeader } from './ModalSheetHeader';
import type { UIDesktopModalSheetProps } from './types';

const PAGE_SHEET_HEIGHT_RATIO = 0.8;

function WindowRelativeHeight({
    children,
}: {
    children: (
        height: number,
        getBottomInset: KeyboardAwareSheetProps['getBottomInset'],
    ) => JSX.Element;
}) {
    const { height } = useWindowDimensions();

    const bottomInset = React.useMemo(() => ((1 - PAGE_SHEET_HEIGHT_RATIO) / 2) * height, [height]);
    const relativeHeight = React.useMemo(
        () => Math.round(PAGE_SHEET_HEIGHT_RATIO * height),
        [height],
    );
    const getBottomInset = React.useCallback(
        (_bottomInset: number, _keyboardHeight: number) => {
            'worklet';

            return bottomInset;
        },
        [bottomInset],
    );

    return children(relativeHeight, getBottomInset);
}

export function UIDesktopModalSheet({
    children,
    style,
    hasHeader = false,
    backgroundColor = ColorVariants.BackgroundPrimary,
    ...rest
}: UIDesktopModalSheetProps) {
    const { visible, forId } = rest;
    return (
        <UISheet.Container visible={visible} forId={forId}>
            <WindowRelativeHeight>
                {(height, getBottomInset) => (
                    <UISheet.KeyboardUnaware getBottomInset={getBottomInset}>
                        <UISheet.FixedSize height={height}>
                            <UISheet.Content {...rest} style={[styles.card, style]}>
                                {hasHeader ? (
                                    <ModalSheetHeader backgroundColor={backgroundColor} />
                                ) : null}
                                {children}
                            </UISheet.Content>
                        </UISheet.FixedSize>
                    </UISheet.KeyboardUnaware>
                )}
            </WindowRelativeHeight>
        </UISheet.Container>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        maxWidth: UILayoutConstant.elasticWidthCardSheet,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
        borderRadius: UILayoutConstant.alertBorderRadius,
        overflow: 'hidden',
    },
});
