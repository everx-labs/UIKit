import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import BigNumber from 'bignumber.js';

import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UICurrency } from '@tonlabs/uicast.numbers';
import { UIImage, UIImageProps } from '@tonlabs/uikit.media';
import { UILabel, UILabelRoles, UILabelColors } from '@tonlabs/uikit.themes';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';

import { UIConstant } from './constants';

export type UICurrencyRowProps = {
    testID?: string;
    icon: UIImageProps['source'];
    name: string;
    description?: string;
    amount: BigNumber;
    currencySignChar?: string;
    loading: boolean;
    onPress?: () => void;
};

const zeroBigNumber = new BigNumber(0);

export function UICurrencyRow({
    testID,
    loading,
    icon,
    name,
    description,
    amount,
    currencySignChar = 'Ē',
    onPress,
}: UICurrencyRowProps) {
    const amountColor = React.useMemo(() => {
        const isAmountZero = zeroBigNumber.isEqualTo(amount);
        if (isAmountZero) {
            return UILabelColors.TextSecondary;
        }
        return UILabelColors.TextPrimary;
    }, [amount]);
    return (
        // TODO: Think later how to pass ref from scroll view
        //       to not animate a row during scroll
        <TouchableOpacity testID={testID} style={styles.container} onPress={onPress}>
            <UISkeleton show={loading} style={styles.iconWrapper}>
                <UIImage source={icon} style={styles.icon} />
            </UISkeleton>
            <UISkeleton show={loading} style={styles.inner}>
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
                <UICurrency
                    integerColor={amountColor}
                    decimalColor={amountColor}
                    signChar={currencySignChar}
                >
                    {amount}
                </UICurrency>
            </UISkeleton>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // TODO
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
});
