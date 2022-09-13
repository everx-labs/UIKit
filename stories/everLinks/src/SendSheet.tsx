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

import type { SendParams } from './types';

type Props = {
    onClose: () => void;
    sendParams: SendParams;
    visible: boolean;
};

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
            decimalAspect={UINumberDecimalAspect.Precision}
            signChar={signChar}
            signVariant={UILabelRoles.SurfParagraphNormal}
        >
            {amount}
        </UICurrency>
    );
}

function SendSheetContent({ address, amount, fee, onConfirm, signChar }: SendParams) {
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
                        {uiLocalized.EverLinks.Send.ActionTitle}
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

export function UISendSheet(props: Props) {
    const { onClose, sendParams, visible } = props;
    const { address, amount, fee, onConfirm, signChar } = sendParams;

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
                address={address}
                amount={amount}
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
