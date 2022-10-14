import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type BigNumber from 'bignumber.js';

import { uiLocalized } from '@tonlabs/localization';

import { UIBoxButton } from '@tonlabs/uikit.controls';
import { UICardSheet } from '@tonlabs/uikit.popups';
import { UICurrency, UINumberDecimalAspect } from '@tonlabs/uicast.numbers';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIListSeparator } from '@tonlabs/uicast.rows';

import type { UIEverLinkSheetProps, UISendSheetParams } from './types';

export function useUISendSheet() {
    const [sendSheetVisible, setSendSheetVisible] = React.useState(false);

    const openSendSheet = React.useCallback(() => {
        setSendSheetVisible(true);
    }, [setSendSheetVisible]);

    const closeSendSheet = React.useCallback(() => {
        setSendSheetVisible(false);
    }, [setSendSheetVisible]);

    return {
        sendSheetVisible,
        openSendSheet,
        closeSendSheet,
    };
}

function CurrencyElement({ amount, signChar }: { amount: BigNumber; signChar: string }) {
    return (
        <UICurrency
            integerColor={UILabelColors.TextPrimary}
            integerVariant={UILabelRoles.SurfMonoNormal}
            decimalColor={UILabelColors.TextPrimary}
            decimalVariant={UILabelRoles.SurfMonoNormal}
            decimalAspect={UINumberDecimalAspect.Short}
            signChar={signChar}
            signVariant={UILabelRoles.SurfParagraphNormal}
        >
            {amount}
        </UICurrency>
    );
}

function SendSheetContent({ actionTitle, address, amount, comment, fee, onConfirm, signChar }: UISendSheetParams) {
    return (
        <View>
            <View style={styles.contentContainer}>
                <View style={styles.paddingVerticalSmall}>
                    <UILabel color={UILabelColors.TextPrimary} role={UILabelRoles.SurfTitleLarge}>
                        {uiLocalized.EverLinks.Send.Title}
                    </UILabel>
                </View>
                <View style={styles.infoContainer}>
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.SurfTitleNormal}
                        style={styles.marginVerticalNormal}
                    >
                        {actionTitle}
                    </UILabel>
                    <View style={styles.paddingVerticalSmall}>
                        <UILabel
                            color={UILabelColors.TextSecondary}
                            role={UILabelRoles.SurfParagraphSmall}
                        >
                            {uiLocalized.EverLinks.Send.RecipientAddress}
                        </UILabel>
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.SurfParagraphNormal}
                        >
                            {address}
                        </UILabel>
                    </View>
                    {comment ? (
                        <View style={styles.paddingVerticalSmall}>
                            <UILabel
                                color={UILabelColors.TextSecondary}
                                role={UILabelRoles.SurfParagraphSmall}
                            >
                                {uiLocalized.EverLinks.Send.Comment}
                            </UILabel>
                            <UILabel
                                color={UILabelColors.TextPrimary}
                                role={UILabelRoles.SurfParagraphNormal}
                            >
                                {comment}
                            </UILabel>
                        </View>
                    ) : null}
                    <UIListSeparator />
                    <View style={styles.rowContainer}>
                        <UILabel
                            color={UILabelColors.TextSecondary}
                            role={UILabelRoles.SurfParagraphNormal}
                        >
                            {uiLocalized.EverLinks.Send.Amount}
                        </UILabel>
                        <CurrencyElement amount={amount} signChar={signChar} />
                    </View>
                    <UIListSeparator />
                    <View style={styles.rowContainer}>
                        <UILabel
                            color={UILabelColors.TextSecondary}
                            role={UILabelRoles.SurfParagraphNormal}
                        >
                            {uiLocalized.EverLinks.Send.NetworkFee}
                        </UILabel>
                        <View style={styles.feeContainer}>
                            <UILabel
                                color={UILabelColors.TextPrimary}
                                role={UILabelRoles.SurfMonoNormal}
                            >
                                {uiLocalized.EverLinks.Send.NetworkFeeTilde}
                            </UILabel>
                            <CurrencyElement amount={fee} signChar={signChar} />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.boxButtonContainer}>
                <UIBoxButton
                    title={uiLocalized.EverLinks.Send.Confirm}
                    onPress={onConfirm}
                />
            </View>
        </View>
    );
}

export function UISendSheet(props: UIEverLinkSheetProps) {
    const { onClose, params: sendParams, visible } = props;
    const { actionTitle, address, amount, comment, fee, onConfirm, signChar } = sendParams as UISendSheetParams;

    const onConfirmPress = React.useCallback(() => {
        if (onConfirm) {
            onConfirm();
        }
        if (onClose) {
            onClose();
        }
    }, [onConfirm, onClose]);

    return (
        <UICardSheet visible={visible} onClose={onClose}>
            <SendSheetContent
                actionTitle={actionTitle}
                address={address}
                amount={amount}
                comment={comment}
                fee={fee}
                onConfirm={onConfirmPress}
                signChar={signChar}
            />
        </UICardSheet>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    paddingVerticalSmall: {
        paddingVertical: UILayoutConstant.smallContentOffset,
    },
    marginVerticalNormal: {
        marginVertical: UILayoutConstant.normalContentOffset,
    },
    infoContainer: {
        marginTop: UILayoutConstant.contentOffset,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: UILayoutConstant.contentOffset,
    },
    feeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boxButtonContainer: {
        padding: UILayoutConstant.contentOffset,
    },
});
