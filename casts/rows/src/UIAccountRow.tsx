import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import BigNumber from 'bignumber.js';

import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UICurrency } from '@tonlabs/uicast.numbers';
import type { UICurrencySignProps } from '@tonlabs/uicast.numbers';
import { UIImage, UIImageProps } from '@tonlabs/uikit.media';
import { UILabel, UILabelRoles, UILabelColors } from '@tonlabs/uikit.themes';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';

import { UIConstant } from './constants';

export type UIAccountRowProps = {
    testID?: string;
    icon: UIImageProps['source'];
    name: string;
    description?: string;
    balance: BigNumber;
    currencySignProps?: UICurrencySignProps;
    rate?: string;
    loading: boolean;
    onPress?: () => void;
};

const zeroBigNumber = new BigNumber(0);

export const UIAccountRow = React.memo(function UIAccountRow({
    testID,
    loading,
    icon,
    name,
    description,
    balance,
    currencySignProps,
    rate,
    onPress,
}: UIAccountRowProps) {
    const amountColor = React.useMemo(() => {
        const isAmountZero = zeroBigNumber.isEqualTo(balance);
        if (isAmountZero) {
            return UILabelColors.TextSecondary;
        }
        return UILabelColors.TextPrimary;
    }, [balance]);
    return (
        // TODO: Think later how to pass ref from scroll view
        //       to not animate a row during scroll
        <TouchableOpacity testID={testID} style={styles.container} onPress={onPress}>
            <UISkeleton show={loading} style={styles.iconWrapper}>
                <UIImage source={icon} style={styles.icon} />
            </UISkeleton>
            <UISkeleton
                show={loading}
                style={[styles.inner, loading ? styles.innerSkeleton : null]}
            >
                <View style={styles.desc}>
                    <UILabel role={UILabelRoles.Action} numberOfLines={1} ellipsizeMode="tail">
                        {name}
                    </UILabel>
                    {description == null ? null : (
                        <UILabel
                            role={UILabelRoles.ParagraphFootnote}
                            color={UILabelColors.TextSecondary}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {description}
                        </UILabel>
                    )}
                </View>
                <View style={styles.right}>
                    <UICurrency
                        integerColor={amountColor}
                        decimalColor={amountColor}
                        signChar={currencySignProps?.signChar}
                    >
                        {balance}
                    </UICurrency>
                    {rate == null ? null : (
                        <UILabel
                            role={UILabelRoles.ParagraphFootnote}
                            color={UILabelColors.TextSecondary}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {rate}
                        </UILabel>
                    )}
                </View>
            </UISkeleton>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: UILayoutConstant.contentInsetVerticalX4,
        alignItems: 'center',
    },
    inner: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    innerSkeleton: {
        borderRadius: UIConstant.uiLink.row.borderRadius,
    },
    iconWrapper: {
        marginRight: UILayoutConstant.normalContentOffset,
        borderRadius: UIConstant.uiLink.logo.borderRadius,
        overflow: 'hidden',
    },
    icon: {
        width: UIConstant.uiLink.logo.size,
        height: UIConstant.uiLink.logo.size,
    },
    desc: {
        flex: 1,
        marginRight: UILayoutConstant.normalContentOffset,
    },
    right: {
        alignItems: 'flex-end',
    },
});
