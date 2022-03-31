import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UICurrency } from '@tonlabs/uicast.numbers';
import { UILabel, UILabelRoles, UILabelColors } from '@tonlabs/uikit.themes';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';

import { UIConstant } from './constants';
import { useUIRowsPressability } from './UIListRowsContext';
import type { UICurrencyRowProps } from './UICurrencyRow';

export const UIHiddenCurrencyRow = React.memo(function UIHiddenCurrencyRow({
    testID,
    loading,
    name,
    nameTestID,
    amount,
    amountTestID,
    currencySignProps = { signChar: 'Ē' },
    onPress: onPressProp,
    onLongPress: onLongPressProp,
    payload,
}: UICurrencyRowProps & { payload?: any }) {
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
                </View>
                <UICurrency
                    testID={amountTestID}
                    integerColor={UILabelColors.TextSecondary}
                    decimalColor={UILabelColors.TextSecondary}
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
});
