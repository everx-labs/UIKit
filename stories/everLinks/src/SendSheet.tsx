import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import type BigNumber from 'bignumber.js';

import { uiLocalized } from '@tonlabs/localization';

// import type { TONNetNameKeytNameKey } from '@surf/packages.networks';

import { UIBoxButton } from '@tonlabs/uikit.controls';
import { UICardSheet } from '@tonlabs/uikit.popups';
import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { UICurrency, UINumberDecimalAspect } from '@tonlabs/uicast.numbers';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIListSeparator } from '@tonlabs/uicast.rows';

import type { SendParams } from './types';

type Props = {
    sendParams: SendParams;
    visible: boolean;
    onClose: () => void;
};

function CurrencyElement({
    amount,
    // net,
}: {
    amount: BigNumber;
    // net: TONNetNameKey,
}) {
    const signChar = 'EVER'; // TODO: change; Ex.: Chars[net].toUpperCase();

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

const SendSheetContent = observer(function SendSheetContent({ props }: { props: SendParams }) {
    const { address, amount, fee, net, onConfirm } = props;

    return (
        <View>
            <View style={styles.contentContainer}>
                <View style={UIStyle.padding.verticalSmall()}>
                    <UILabel color={UILabelColors.TextPrimary} role={UILabelRoles.SurfTitleLarge}>
                        {uiLocalized.EverLinks.Send.Title}
                    </UILabel>
                </View>
                <View style={UIStyle.margin.topDefault()}>
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.SurfTitleNormal}
                        style={[UIStyle.margin.topNormal(), UIStyle.margin.bottomNormal()]}
                    >
                        {uiLocalized.EverLinks.Send.ActionTitle}
                    </UILabel>
                    <View style={UIStyle.padding.verticalSmall()}>
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
                        {/* @ts-ignore */}
                        <CurrencyElement amount={amount} net={net} />
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
                            {/* @ts-ignore */}
                            <CurrencyElement amount={fee} net={net} />
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
});

export const SendSheet = observer(function SendSheet(props: Props) {
    const { visible, onClose, sendParams } = props;

    return (
        <UICardSheet visible={visible} onClose={onClose}>
            <SendSheetContent props={sendParams} />
        </UICardSheet>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        paddingHorizontal: UIConstant.contentOffset(),
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: UIConstant.contentOffset(),
    },
    feeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boxButtonContainer: {
        padding: UIConstant.contentOffset(),
    },
});
