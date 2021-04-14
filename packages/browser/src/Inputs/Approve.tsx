import * as React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { ApproveMessage } from '../types';

import {
    ColorVariants,
    UILabel,
    UILabelColors,
    UILabelRoles,
    useTheme,
    useShadow,
    UIBackgroundView,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.core';

export function Approve({
    onLayout,
    toAddress,
    recipientsCount,
    totalAmount,
    fees,
    signature,
    isDangerous,
    onApprove: onApproveProp,
    onCancel: onCancelProp,
    externalState,
}: ApproveMessage) {
    const theme = useTheme();
    const shadow = useShadow(1);

    const onApprove = React.useCallback(() => {
        onApproveProp({
            status: 'approved',
        });
    }, [onApproveProp]);
    const onCancel = React.useCallback(() => {
        onCancelProp({
            status: 'cancelled',
        });
    }, [onCancelProp]);

    return (
        <View onLayout={onLayout}>
            <View style={styles.container}>
                <UIBackgroundView style={[styles.card, shadow]}>
                    <UILabel role={UILabelRoles.TitleSmall}>
                        Transaction confirmation
                    </UILabel>
                    <View style={styles.cardRow}>
                        <UILabel
                            role={UILabelRoles.ParagraphLabel}
                            color={UILabelColors.TextTertiary}
                        >
                            To
                        </UILabel>
                        <View style={styles.address}>
                            <UILabel>
                                {`${toAddress.slice(
                                    0,
                                    4,
                                )} ···· ${toAddress.slice(-4)}`}
                            </UILabel>
                        </View>
                    </View>
                    <View style={styles.cardRow}>
                        <UILabel
                            role={UILabelRoles.ParagraphLabel}
                            color={UILabelColors.TextTertiary}
                        >
                            Recipients
                        </UILabel>
                        <UILabel>{recipientsCount}</UILabel>
                    </View>
                    <View style={styles.cardRow}>
                        <UILabel
                            role={UILabelRoles.ParagraphLabel}
                            color={UILabelColors.TextTertiary}
                        >
                            Total
                        </UILabel>
                        {totalAmount}
                    </View>
                    <View style={styles.cardRow}>
                        <UILabel
                            role={UILabelRoles.ParagraphLabel}
                            color={UILabelColors.TextTertiary}
                        >
                            Fees
                        </UILabel>
                        {fees}
                    </View>
                    <View style={styles.cardRow}>
                        <UILabel
                            role={UILabelRoles.ParagraphLabel}
                            color={UILabelColors.TextTertiary}
                        >
                            Signature
                        </UILabel>
                        <UILabel>{signature.title}</UILabel>
                    </View>
                    {isDangerous && (
                        <View style={styles.cardRow}>
                            <UILabel
                                role={UILabelRoles.ParagraphLabel}
                                color={UILabelColors.TextNegative}
                            >
                                Attention
                            </UILabel>
                            <UILabel color={UILabelColors.TextNegative}>
                                This transaction is trying to change the
                                contract and will not be performed
                            </UILabel>
                        </View>
                    )}
                </UIBackgroundView>
            </View>
            {externalState?.status == null && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        testID="approve_confirm"
                        style={[
                            styles.button,
                            {
                                borderColor: theme[ColorVariants.LineAccent],
                            },
                        ]}
                        onPress={onApprove}
                    >
                        <UILabel
                            role={UILabelRoles.Action}
                            color={UILabelColors.TextAccent}
                        >
                            Confirm
                        </UILabel>
                    </TouchableOpacity>
                    <TouchableOpacity
                        testID="approve_cancel"
                        style={[
                            styles.button,
                            {
                                borderColor: theme[ColorVariants.LineAccent],
                            },
                        ]}
                        onPress={onCancel}
                    >
                        <UILabel
                            role={UILabelRoles.Action}
                            color={UILabelColors.TextAccent}
                        >
                            Cancel
                        </UILabel>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...Platform.select({
            web: {
                maxWidth: '100%',
            },
            default: {
                width: '100%',
            },
        }),
        paddingRight: '20%',
        alignSelf: 'flex-start',
        paddingTop: UIConstant.smallContentOffset(),
    },
    card: {
        paddingHorizontal: 12,
        paddingTop: 24,
        paddingBottom: 8,
        borderRadius: 12,
    },
    cardRow: {
        paddingVertical: 12,
    },
    buttonsContainer: {
        maxWidth: '100%',
        paddingRight: '20%',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: UIConstant.smallContentOffset(),
    },
    // TODO: change it to UIMsgButton (or similar)
    button: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        paddingHorizontal: UIConstant.spaciousContentOffset(),
        borderRadius: UIConstant.mediumBorderRadius(),
        marginRight: UIConstant.tinyContentOffset(),
    },
    address: {
        flexDirection: 'row',
    },
});
