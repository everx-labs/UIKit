import * as React from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import { Bubble } from '@tonlabs/uistory.chats';
import { UIPressableArea } from '@tonlabs/uikit.controls';
import { TypographyVariants, UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UICurrency, UINumberDecimalAspect } from '@tonlabs/uicast.numbers';
import { uiLocalized } from '@tonlabs/localization';
import type BigNumber from 'bignumber.js';
import type { TransactionDetailsProps } from './types';
import { UIConstant } from './constants';

function TextParameter({
    label,
    value,
    onPress,
}: {
    label: string;
    value?: string;
    onPress?: () => void | Promise<void>;
}) {
    if (!value) {
        return null;
    }
    return (
        <View style={styles.parameter}>
            <UILabel role={TypographyVariants.ParagraphLabel} color={UILabelColors.TextSecondary}>
                {label}
            </UILabel>
            <UIPressableArea onPress={onPress} disabled={!onPress} style={styles.parameterValue}>
                <UILabel role={TypographyVariants.ParagraphText}>{value}</UILabel>
            </UIPressableArea>
        </View>
    );
}

function NumberParameter({
    label,
    value,
    prefix,
    signChar,
    onPress,
}: {
    label: string;
    value?: BigNumber;
    prefix?: string;
    signChar?: string;
    onPress?: () => void | Promise<void>;
}) {
    if (!value) {
        return null;
    }
    return (
        <View style={styles.parameter}>
            <UILabel role={TypographyVariants.ParagraphLabel} color={UILabelColors.TextSecondary}>
                {label}
            </UILabel>
            <UIPressableArea onPress={onPress} disabled={!onPress} style={styles.parameterValue}>
                <UILabel role={TypographyVariants.ParagraphText}>
                    {prefix}
                    <UICurrency signChar={signChar} decimalAspect={UINumberDecimalAspect.Precision}>
                        {value}
                    </UICurrency>
                </UILabel>
            </UIPressableArea>
        </View>
    );
}

function ExpandedContent(props: TransactionDetailsProps) {
    const {
        signature,
        action,
        recipient,
        amount,
        amountCurrency,
        contractFee,
        contractFeeCurrency,
        networkFee,
        networkFeeCurrency,
        onRecipientPress,
    } = props;
    return (
        <>
            <TextParameter
                label={uiLocalized.Browser.TransactionConfirmation.Signature}
                value={signature?.title}
            />
            <TextParameter
                label={uiLocalized.Browser.TransactionConfirmation.Action}
                value={action}
            />
            <TextParameter
                label={uiLocalized.Browser.TransactionConfirmation.Recipient}
                value={recipient}
                onPress={onRecipientPress}
            />
            <NumberParameter
                label={uiLocalized.Browser.TransactionConfirmation.Amount}
                value={amount}
                signChar={amountCurrency}
            />
            <NumberParameter
                label={uiLocalized.Browser.TransactionConfirmation.ContractFee}
                value={contractFee}
                signChar={contractFeeCurrency}
                prefix={`${uiLocalized.Browser.TransactionConfirmation.UpTo} `}
            />
            <NumberParameter
                label={uiLocalized.Browser.TransactionConfirmation.NetworkFee}
                value={networkFee}
                signChar={networkFeeCurrency}
                prefix="≈"
            />
        </>
    );
}

function FoldedContent(props: TransactionDetailsProps) {
    const { amount, amountCurrency, contractFee, contractFeeCurrency } = props;
    return (
        <>
            <NumberParameter
                label={uiLocalized.Browser.TransactionConfirmation.Amount}
                value={amount}
                signChar={amountCurrency}
            />
            <NumberParameter
                label={uiLocalized.Browser.TransactionConfirmation.ContractFee}
                value={contractFee}
                signChar={contractFeeCurrency}
                prefix={`${uiLocalized.Browser.TransactionConfirmation.UpTo} `}
            />
        </>
    );
}

export function TransactionDetails(props: TransactionDetailsProps) {
    const { isDangerous, expandedByDefault } = props;
    const [expanded, setExpanded] = React.useState<boolean>(!!expandedByDefault);
    const onPress = React.useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(prev => !prev);
    }, []);
    return (
        <Bubble {...props} style={styles.bubble}>
            <UILabel role={TypographyVariants.TitleSmall} style={styles.title}>
                {uiLocalized.Browser.TransactionConfirmation.Title}
            </UILabel>
            <View style={styles.parametersContainer}>
                {expanded ? <ExpandedContent {...props} /> : <FoldedContent {...props} />}
            </View>
            {expanded ? null : (
                <UIPressableArea onPress={onPress} style={styles.moreButton}>
                    <UILabel role={TypographyVariants.MonoText}>
                        {uiLocalized.Browser.TransactionConfirmation.More}
                    </UILabel>
                </UIPressableArea>
            )}
            {isDangerous && (
                <View style={styles.cardRow}>
                    <UILabel role={UILabelRoles.ParagraphLabel} color={UILabelColors.TextNegative}>
                        {uiLocalized.Browser.TransactionConfirmation.Attention}
                    </UILabel>
                    <UILabel color={UILabelColors.TextNegative}>
                        {uiLocalized.Browser.TransactionConfirmation.AttentionDesc}
                    </UILabel>
                </View>
            )}
        </Bubble>
    );
}

const styles = StyleSheet.create({
    bubble: {
        alignSelf: 'stretch',
        maxWidth: UIConstant.transactionDetails.maxWidth,
        paddingHorizontal: 0,
    },
    title: {
        paddingTop: UILayoutConstant.contentInsetVerticalX2,
        paddingBottom: UILayoutConstant.contentInsetVerticalX4,
        paddingHorizontal: UILayoutConstant.normalContentOffset,
    },
    parametersContainer: {
        overflow: 'hidden',
        paddingHorizontal: UILayoutConstant.normalContentOffset,
    },
    parameter: {
        paddingTop: UILayoutConstant.contentInsetVerticalX2,
    },
    parameterValue: {
        paddingBottom: UILayoutConstant.contentInsetVerticalX2,
    },
    moreButton: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX2,
        paddingHorizontal: UILayoutConstant.normalContentOffset,
        alignItems: 'center',
    },
    cardRow: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX3,
        paddingHorizontal: UILayoutConstant.normalContentOffset,
    },
});
