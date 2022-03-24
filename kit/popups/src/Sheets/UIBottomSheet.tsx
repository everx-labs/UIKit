import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    hasDefaultInset = true,
    hasHeader = true,
    headerOptions,
    ...rest
}: UIBottomSheetProps) {
    const { visible, forId } = rest;
    const theme = useTheme();

    const { bottom: bottomInset } = useSafeAreaInsets();

    const defaultPadding = React.useMemo(() => {
        if (!hasDefaultInset) {
            return 0;
        }

        return Math.max(bottomInset || 0, UILayoutConstant.contentOffset);
    }, [bottomInset, hasDefaultInset]);

    const styles = useStyles(defaultPadding, theme);

    return (
        <UISheet.Container visible={visible} forId={forId}>
            <UISheet.KeyboardAware defaultShift={-UILayoutConstant.rubberBandEffectDistance}>
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

const useStyles = makeStyles((defaultPadding: number, theme: Theme) => ({
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
        paddingBottom: defaultPadding + UILayoutConstant.rubberBandEffectDistance,
    },
}));
