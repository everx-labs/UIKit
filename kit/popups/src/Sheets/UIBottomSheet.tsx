import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useTheme, Theme, makeStyles, ColorVariants } from '@tonlabs/uikit.themes';
import { UIDialogBar, UIDialogBarProps } from '@tonlabs/uicast.bars';

import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UIBottomSheetProps = UISheetProps & {
    style?: StyleProp<ViewStyle>;
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
    style,
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

        const flattenStyle = StyleSheet.flatten(style);
        return Math.max(
            bottomInset || 0,
            UILayoutConstant.contentOffset,
            (flattenStyle?.paddingBottom as number) ?? 0,
        );
    }, [style, bottomInset, hasDefaultInset]);

    const styles = useStyles(defaultPadding, theme);

    return (
        <UISheet.Container visible={visible} forId={forId}>
            <UISheet.KeyboardAware defaultShift={-UILayoutConstant.rubberBandEffectDistance}>
                <UISheet.IntrinsicSize>
                    <UISheet.Content {...rest} style={styles.sheet}>
                        <View style={styles.card}>
                            {hasHeader ? <UIDialogBar hasPuller {...headerOptions} /> : null}
                            <View style={[styles.cardContent, style, styles.bottom]}>
                                {children}
                            </View>
                        </View>
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
        alignItems: 'stretch',
        overflow: 'hidden',
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
    },
    bottom: {
        paddingBottom: defaultPadding + UILayoutConstant.rubberBandEffectDistance,
    },
    cardContent: {
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
}));
