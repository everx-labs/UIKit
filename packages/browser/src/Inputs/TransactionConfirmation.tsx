import * as React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { TransactionConfirmationMessage } from '../types';

import {
    ColorVariants,
    UILabel,
    UILabelColors,
    UILabelRoles,
    useTheme,
    useShadow,
    UIBackgroundView,
    UIImage,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UIAssets } from '@tonlabs/uikit.assets';

export function TransactionConfirmation({
    onLayout,
    toAddress,
    onAddressPress,
    recipientsCount,
    totalAmount,
    fees,
    signature,
    isDangerous,
    onApprove: onApproveProp,
    onCancel: onCancelProp,
    externalState,
}: TransactionConfirmationMessage) {
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

    const mainBubble = (
        <View style={styles.container}>
            <UIBackgroundView style={[styles.card, shadow]}>
                <UILabel role={UILabelRoles.TitleSmall}>
                    {uiLocalized.Browser.Approve.Title}
                </UILabel>
                <View style={styles.cardRow}>
                    <UILabel
                        role={UILabelRoles.ParagraphLabel}
                        color={UILabelColors.TextTertiary}
                    >
                        {uiLocalized.Browser.Approve.To}
                    </UILabel>
                    <TouchableOpacity onPress={onAddressPress}>
                        <View style={styles.address}>
                            <UILabel>
                                {`${toAddress.slice(
                                    0,
                                    4,
                                )} ···· ${toAddress.slice(-4)}`}
                            </UILabel>
                            <UIImage source={UIAssets.icons.ui.arrowUpRight} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardRow}>
                    <UILabel
                        role={UILabelRoles.ParagraphLabel}
                        color={UILabelColors.TextTertiary}
                    >
                        {uiLocalized.Browser.Approve.Recipients}
                    </UILabel>
                    <UILabel>{recipientsCount}</UILabel>
                </View>
                <View style={styles.cardRow}>
                    <UILabel
                        role={UILabelRoles.ParagraphLabel}
                        color={UILabelColors.TextTertiary}
                    >
                        {uiLocalized.Browser.Approve.Total}
                    </UILabel>
                    {totalAmount}
                </View>
                <View style={styles.cardRow}>
                    <UILabel
                        role={UILabelRoles.ParagraphLabel}
                        color={UILabelColors.TextTertiary}
                    >
                        {uiLocalized.Browser.Approve.Fees}
                    </UILabel>
                    {fees}
                </View>
                <View style={styles.cardRow}>
                    <UILabel
                        role={UILabelRoles.ParagraphLabel}
                        color={UILabelColors.TextTertiary}
                    >
                        {uiLocalized.Browser.Approve.Signature}
                    </UILabel>
                    <UILabel>{signature.title}</UILabel>
                </View>
                {isDangerous && (
                    <View style={styles.cardRow}>
                        <UILabel
                            role={UILabelRoles.ParagraphLabel}
                            color={UILabelColors.TextNegative}
                        >
                            {uiLocalized.Browser.Approve.Attention}
                        </UILabel>
                        <UILabel color={UILabelColors.TextNegative}>
                            {uiLocalized.Browser.Approve.AttentionDesc}
                        </UILabel>
                    </View>
                )}
            </UIBackgroundView>
        </View>
    );

    return (
        <View onLayout={onLayout}>
            {mainBubble}
            {externalState?.status == null ? (
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
                            {uiLocalized.Browser.Approve.Confirm}
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
                            {uiLocalized.Browser.Approve.Cancel}
                        </UILabel>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.responseContainer}>
                    <UIBackgroundView
                        testID="approve_response"
                        color={ColorVariants.BackgroundAccent}
                        style={[
                            styles.button,
                            styles.response,
                            {
                                borderColor: theme[ColorVariants.LineAccent],
                            },
                        ]}
                    >
                        <UILabel
                            role={UILabelRoles.Action}
                            color={UILabelColors.StaticTextPrimaryLight}
                        >
                            {externalState.status === 'approved'
                                ? uiLocalized.Browser.Approve.Confirm
                                : uiLocalized.Browser.Approve.Cancel}
                        </UILabel>
                    </UIBackgroundView>
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
    responseContainer: {
        maxWidth: '100%',
        paddingLeft: '20%',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
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
    response: {
        borderBottomRightRadius: 0,
    },
    address: {
        flexDirection: 'row',
    },
});
