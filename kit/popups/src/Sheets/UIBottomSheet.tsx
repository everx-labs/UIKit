import * as React from 'react';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useTheme, Theme, makeStyles, ColorVariants } from '@tonlabs/uikit.themes';
import { UIDialogBar, UIDialogBarProps } from '@tonlabs/uicast.bars';

import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UIBottomSheetProps = Omit<UISheetProps, 'style'> & {
    hasDefaultInset?: boolean;
    /**
     * Whether UIBottomSheet has a header
     * Default: true
     */
    hasHeader?: boolean;
    /**
     * You can use it if you need a header customization
     */
    headerOptions?: Pick<UIDialogBarProps, 'headerLeftItems' | 'headerRightItems'>;
};

export function UIBottomSheet({
    children,
    hasDefaultInset,
    hasHeader = true,
    headerOptions,
    ...rest
}: UIBottomSheetProps) {
    const { visible, forId } = rest;
    const theme = useTheme();

    const styles = useStyles(theme);

    return (
        <UISheet.Container visible={visible} forId={forId}>
            <UISheet.KeyboardAware
                hasDefaultInset={hasDefaultInset}
                defaultShift={-UILayoutConstant.rubberBandEffectDistance}
            >
                <UISheet.IntrinsicSize>
                    <UISheet.Content {...rest} containerStyle={styles.sheet} style={styles.card}>
                        {hasHeader ? <UIDialogBar hasPuller {...headerOptions} /> : null}
                        {children}
                    </UISheet.Content>
                </UISheet.IntrinsicSize>
            </UISheet.KeyboardAware>
        </UISheet.Container>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    sheet: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    card: {
        flex: 1,
        maxWidth: UILayoutConstant.elasticWidthCardSheet,
        borderTopLeftRadius: UILayoutConstant.alertBorderRadius,
        borderTopRightRadius: UILayoutConstant.alertBorderRadius,
        overflow: 'hidden',
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        paddingBottom: UILayoutConstant.rubberBandEffectDistance,
    },
}));
