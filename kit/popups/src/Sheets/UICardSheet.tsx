import * as React from 'react';
import { View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useTheme, Theme, makeStyles, ColorVariants } from '@tonlabs/uikit.themes';
import { UIDialogBar, UIDialogBarProps } from '@tonlabs/uicast.bars';

import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UICardSheetProps = Omit<UISheetProps, 'style'> & {
    /**
     * Whether UICardSheet has a header
     * Default: true
     */
    hasHeader?: boolean;
    /**
     * You can use it if you need a header customization
     */
    headerOptions?: Pick<UIDialogBarProps, 'headerLeftItems' | 'headerRightItems'>;
};

// @inline
const CARD_SHEET_DEFAULT_BOTTOM_INSET = 16; // UILayoutConstant.contentOffset

function getCardSheetBottomInset(bottomInset: number, keyboardHeight: number) {
    'worklet';

    if (keyboardHeight !== 0) {
        return CARD_SHEET_DEFAULT_BOTTOM_INSET;
    }

    return Math.max(CARD_SHEET_DEFAULT_BOTTOM_INSET, bottomInset);
}

export function UICardSheet({
    children,
    hasHeader = true,
    headerOptions,
    ...rest
}: UICardSheetProps) {
    const theme = useTheme();
    const { visible, forId } = rest;
    const styles = useStyles(theme);
    return (
        <UISheet.Container visible={visible} forId={forId}>
            <UISheet.KeyboardAware getBottomInset={getCardSheetBottomInset}>
                <UISheet.IntrinsicSize>
                    <UISheet.Content {...rest} style={styles.sheet}>
                        <View style={styles.card}>
                            {hasHeader ? <UIDialogBar hasPuller {...headerOptions} /> : null}
                            {children}
                        </View>
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
        marginHorizontal: UILayoutConstant.contentOffset,
        borderRadius: UILayoutConstant.alertBorderRadius,
        overflow: 'hidden',
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
    },
}));
