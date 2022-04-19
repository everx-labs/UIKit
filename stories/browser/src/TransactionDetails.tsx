import * as React from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import { Bubble } from '@tonlabs/uistory.chats';
import { UIPressableArea } from '@tonlabs/uikit.controls';
import { TypographyVariants, UILabel, UILabelColors } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { TransactionDetailsMessage } from './types';
import { UIConstant } from './constants';

function Parameter({ label, text }: { label: string; text?: string }) {
    if (!text) {
        return null;
    }
    return (
        <View style={styles.parameter}>
            <UILabel role={TypographyVariants.ParagraphLabel} color={UILabelColors.TextSecondary}>
                {label}
            </UILabel>
            <UILabel role={TypographyVariants.ParagraphText}>{text}</UILabel>
        </View>
    );
}

function ExpandedContent(props: TransactionDetailsMessage) {
    const { signature, action, recipient, amount, contractFee, networkFee } = props;
    return (
        <>
            <Parameter key="Signature" label="Signature" text={signature} />
            <Parameter key="Action" label="Action" text={action} />
            <Parameter key="Recipient" label="Recipient" text={recipient} />
            <Parameter key="Amount" label="Amount" text={amount} />
            <Parameter key="Contract fee" label="Contract fee" text={contractFee} />
            <Parameter key="Network fee" label="Network fee" text={networkFee} />
        </>
    );
}

function FoldedContent(props: TransactionDetailsMessage) {
    const { amount, contractFee } = props;
    return (
        <>
            <Parameter key="Amount" label="Amount" text={amount} />
            <Parameter key="Contract fee" label="Contract fee" text={contractFee} />
        </>
    );
}
export function TransactionDetails(props: TransactionDetailsMessage) {
    const { title } = props;
    const [expanded, setExpanded] = React.useState<boolean>(false);
    const onPress = React.useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(prev => !prev);
    }, []);
    return (
        <Bubble {...props} style={styles.bubble}>
            <UILabel role={TypographyVariants.TitleSmall} style={styles.title}>
                {title}
            </UILabel>
            <View style={styles.parametersContainer}>
                {expanded ? <ExpandedContent {...props} /> : <FoldedContent {...props} />}
            </View>
            {expanded ? null : (
                <UIPressableArea onPress={onPress} style={styles.moreButton}>
                    <UILabel role={TypographyVariants.MonoText}>more...</UILabel>
                </UIPressableArea>
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
        paddingVertical: UILayoutConstant.contentInsetVerticalX2,
    },
    moreButton: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX2,
        alignItems: 'center',
    },
});
