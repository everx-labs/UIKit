import * as React from 'react';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useTheme, Theme, makeStyles, ColorVariants } from '@tonlabs/uikit.themes';
import { UIDialogBar, UIDialogBarProps } from '@tonlabs/uicast.bars';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UISheet, UISheetProps } from './UISheet/UISheet';
import { getMaxPossibleDefaultBottomInset } from './UISheet/KeyboardAwareSheet';

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
    /**
     * Background color of the UIBottomSheet
     */
    backgroundColor?: ColorVariants;
};

export function UIBottomSheet({
    children,
    hasDefaultInset = true,
    hasHeader = true,
    headerOptions,
    backgroundColor = ColorVariants.BackgroundPrimary,
    ...rest
}: UIBottomSheetProps) {
    const { visible, forId } = rest;
    const theme = useTheme();
    const { bottom } = useSafeAreaInsets();
    const defaultInset = React.useMemo(() => getMaxPossibleDefaultBottomInset(bottom), [bottom]);

    const styles = useStyles(defaultInset, theme, backgroundColor);

    return (
        <UISheet.Container visible={visible} forId={forId}>
            <UISheet.KeyboardAware
                hasDefaultInset={hasDefaultInset}
                defaultShift={-UILayoutConstant.rubberBandEffectDistance - defaultInset}
            >
                <UISheet.IntrinsicSize>
                    <UISheet.Content {...rest} containerStyle={styles.sheet} style={styles.card}>
                        {hasHeader ? (
                            <UIDialogBar
                                hasPuller
                                {...headerOptions}
                                backgroundColor={backgroundColor}
                            />
                        ) : null}
                        {children}
                    </UISheet.Content>
                </UISheet.IntrinsicSize>
            </UISheet.KeyboardAware>
        </UISheet.Container>
    );
}

const useStyles = makeStyles(
    (defaultInset: number, theme: Theme, backgroundColor: ColorVariants) => ({
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
            backgroundColor: theme[backgroundColor],
            paddingBottom: defaultInset + UILayoutConstant.rubberBandEffectDistance,
        },
    }),
);
