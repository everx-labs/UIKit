import * as React from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import { Bubble } from '@tonlabs/uistory.chats';
import { UIPressableArea } from '@tonlabs/uikit.controls';
import {
    ColorVariants,
    TypographyVariants,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.themes';
import { UIImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIAssets } from '@tonlabs/uikit.assets';
import { uiLocalized } from '@tonlabs/localization';
import type { TransactionDetailsProps } from './types';
import { UIConstant } from './constants';

function Parameter({
    label,
    value,
    onPress,
    hasArrow,
}: {
    label: string;
    value?: string | React.ReactElement<any, any>;
    onPress?: () => void | Promise<void>;
    hasArrow?: boolean;
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
                    {value}
                    {hasArrow ? (
                        <UIImage
                            source={UIAssets.icons.ui.arrowUpRight}
                            tintColor={ColorVariants.TextPrimary}
                        />
                    ) : null}
                </UILabel>
            </UIPressableArea>
        </View>
    );
}

function ExpandedContent(props: TransactionDetailsProps) {
    const { signature, action, recipient, amount, contractFee, networkFee, onRecipientPress } =
        props;
    return (
        <>
            <Parameter
                label={uiLocalized.Browser.TransactionConfirmation.Signature}
                value={signature}
            />
            <Parameter label={uiLocalized.Browser.TransactionConfirmation.Action} value={action} />
            <Parameter
                label={uiLocalized.Browser.TransactionConfirmation.Recipient}
                value={recipient}
                onPress={onRecipientPress}
                hasArrow
            />
            <Parameter label={uiLocalized.Browser.TransactionConfirmation.Amount} value={amount} />
            <Parameter
                label={uiLocalized.Browser.TransactionConfirmation.ContractFee}
                value={contractFee}
            />
            <Parameter
                label={uiLocalized.Browser.TransactionConfirmation.NetworkFee}
                value={networkFee}
            />
        </>
    );
}

function FoldedContent(props: TransactionDetailsProps) {
    const { amount, contractFee } = props;
    return (
        <>
            <Parameter label={uiLocalized.Browser.TransactionConfirmation.Amount} value={amount} />
            <Parameter
                label={uiLocalized.Browser.TransactionConfirmation.ContractFee}
                value={contractFee}
            />
        </>
    );
}

export function TransactionDetails(props: TransactionDetailsProps) {
    const { isDangerous } = props;
    const [expanded, setExpanded] = React.useState<boolean>(false);
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
                    <UILabel role={TypographyVariants.MonoText}>more...</UILabel>
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
    },
    title: {
        paddingTop: UILayoutConstant.contentInsetVerticalX2,
        paddingBottom: UILayoutConstant.contentInsetVerticalX4,
    },
    parametersContainer: {
        overflow: 'hidden',
    },
    parameter: {
        paddingTop: UILayoutConstant.contentInsetVerticalX2,
    },
    parameterValue: {
        paddingBottom: UILayoutConstant.contentInsetVerticalX2,
    },
    moreButton: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX2,
        alignItems: 'center',
    },
    cardRow: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX3,
    },
});
