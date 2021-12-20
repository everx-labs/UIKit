import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import BigNumber from 'bignumber.js';

import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UICurrency, UICurrencySignProps } from '@tonlabs/uicast.numbers';
import { UIImage, UIImageProps } from '@tonlabs/uikit.media';
import { UILabel, UILabelRoles, UILabelColors } from '@tonlabs/uikit.themes';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';

import { UIConstant } from './constants';
import { useUIRowsPressability } from './UIListRowsContext';

export type UICurrencyRowProps = {
    testID?: string;
    icon: UIImageProps['source'];
    name: string;
    nameTestID?: string;
    description?: string;
    descriptionTestID?: string;
    amount: BigNumber;
    amountTestID?: string;
    currencySignProps?: Partial<UICurrencySignProps>;
    loading: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
};

const zeroBigNumber = new BigNumber(0);

export const UICurrencyRow = React.memo(function UICurrencyRow({
    testID,
    loading,
    icon,
    name,
    nameTestID,
    description,
    descriptionTestID,
    amount,
    amountTestID,
    currencySignProps = { signChar: 'Ē' },
    onPress: onPressProp,
    onLongPress: onLongPressProp,
    payload,
}: UICurrencyRowProps & { payload?: any }) {
    const amountColor = React.useMemo(() => {
        const isAmountZero = zeroBigNumber.isEqualTo(amount);
        if (isAmountZero) {
            return UILabelColors.TextSecondary;
        }
        return UILabelColors.TextPrimary;
    }, [amount]);
    const { onPress, onLongPress } = useUIRowsPressability(payload, onPressProp, onLongPressProp);
    return (
        // TODO: Think later how to pass ref from scroll view
        //       to not animate a row during scroll
        <TouchableOpacity
            testID={testID}
            style={styles.container}
            onPress={onPress}
            onLongPress={onLongPress}
        >
            <UISkeleton show={loading} style={styles.iconWrapper}>
                <UIImage source={icon} style={styles.icon} />
            </UISkeleton>
            <UISkeleton show={loading} style={styles.inner}>
                <View style={styles.desc}>
                    <UILabel
                        testID={nameTestID}
                        role={UILabelRoles.Action}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {name}
                    </UILabel>
                    {description == null ? null : (
                        <UILabel
                            testID={descriptionTestID}
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
                    testID={amountTestID}
                    integerColor={amountColor}
                    decimalColor={amountColor}
                    {...currencySignProps}
                >
                    {amount}
                </UICurrency>
            </UISkeleton>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
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
