import * as React from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';

import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/localization';
import { UIPressableArea } from '@tonlabs/uikit.controls';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.themes';

import { MessageStatus, TransactionType } from './constants';
import type { TransactionMessage } from './types';
import { useBubblePosition, BubblePosition, useBubbleContainerStyle } from './useBubblePosition';
import { BubbleTransactionComment } from './BubbleTransactionComment';
import { useBubbleRoundedCornerStyle } from './useBubbleStyle';

const getValueForTestID = (message: TransactionMessage) => message.info.amount.toFixed(9);

const getContainerTestID = (message: TransactionMessage) => {
    if (message.status === MessageStatus.Pending) {
        return `transaction_message_${getValueForTestID(message)}_pending`;
    }

    return `transaction_message_${getValueForTestID(message)}`;
};

const getBubbleInner = (position: BubblePosition, isRTL: boolean) => {
    if (position === BubblePosition.left) {
        if (isRTL) {
            return [styles.innerLeft, styles.innerLeftRTL];
        }
        return styles.innerLeft;
    }

    if (position === BubblePosition.right) {
        if (isRTL) {
            return [styles.innerRight, styles.innerRightRTL];
        }
        return styles.innerRight;
    }
    return null;
};

const useBubbleStyle = (message: TransactionMessage) => {
    const theme = useTheme();
    const { type } = message.info;

    if (message.status === MessageStatus.Aborted) {
        return [UIStyle.color.getBackgroundColorStyle(theme[ColorVariants.BackgroundNegative])];
    }

    if (type === TransactionType.Expense) {
        return [UIStyle.color.getBackgroundColorStyle(theme[ColorVariants.StaticBackgroundBlack])];
    }

    if (type === TransactionType.Income) {
        return [UIStyle.color.getBackgroundColorStyle(theme[ColorVariants.BackgroundPositive])];
    }

    return null;
};

const getAmountColor = (_message: TransactionMessage) => {
    return UILabelColors.StaticTextPrimaryLight;
};

const getCommentColor = (_message: TransactionMessage) => {
    return UILabelColors.StaticTextOverlayLight;
};

const getCommentText = (message: TransactionMessage) => {
    if (message.info.text == null) {
        return '';
    }

    return `${message.info.text}, `;
};

const getActionString = (message: TransactionMessage) => {
    if (message.status === MessageStatus.Aborted) {
        return message.actionText ?? uiLocalized.Chats.Bubbles.TapToResend;
    }

    return message.actionText;
};

const getActionStringColor = (message: TransactionMessage) => {
    if (message.status === MessageStatus.Aborted) {
        return UILabelColors.TextNegative;
    }

    return UILabelColors.TextTertiary;
};

function TransactionSublabel(props: TransactionMessage) {
    const { status, time } = props;
    if (status === MessageStatus.Aborted) {
        return (
            <>
                <UILabel
                    testID={`transaction_message_${getValueForTestID(props)}_aborted`}
                    role={UILabelRoles.ParagraphFootnote}
                    color={getCommentColor(props)}
                >
                    {uiLocalized.formatString(
                        uiLocalized.TransactionStatus.aborted,
                        uiLocalized.formatDate(time),
                    )}
                </UILabel>
            </>
        );
    }
    if (status === MessageStatus.Pending) {
        return (
            <>
                <UILabel
                    testID={`transaction_message_${getValueForTestID(props)}_time`}
                    role={UILabelRoles.ParagraphFootnote}
                    color={getCommentColor(props)}
                >
                    {uiLocalized.TransactionStatus.sending}
                </UILabel>
            </>
        );
    }

    return (
        <>
            <UILabel role={UILabelRoles.ParagraphFootnote} color={getCommentColor(props)}>
                {getCommentText(props)}
            </UILabel>
            <UILabel
                testID={`transaction_message_${getValueForTestID(props)}_time`}
                role={UILabelRoles.ParagraphFootnote}
                color={getCommentColor(props)}
            >
                {uiLocalized.formatDate(time)}
            </UILabel>
        </>
    );
}

function BubbleTransactionMain(props: TransactionMessage) {
    const { status, info } = props;
    const position = useBubblePosition(status);
    const bubbleStyle = useBubbleStyle(props);
    const { balanceChange } = info;
    const bubbleRoundedCornerStyle = useBubbleRoundedCornerStyle(props, position);
    return (
        <View
            testID={getContainerTestID(props)}
            style={[
                UIStyle.common.justifyCenter(),
                styles.trxCard,
                bubbleStyle,
                bubbleRoundedCornerStyle,
                status === MessageStatus.Pending && UIStyle.common.opacity70(),
            ]}
        >
            <View
                style={[
                    UIStyle.common.flexRow(),
                    UIStyle.margin.bottomTiny(),
                    UIStyle.common.justifyStart(),
                ]}
            >
                <UILabel role={UILabelRoles.PromoMedium} color={getAmountColor(props)}>
                    {balanceChange}
                </UILabel>
            </View>
            <View style={[UIStyle.common.flexRow(), UIStyle.common.justifyStart()]}>
                <TransactionSublabel {...props} />
            </View>
        </View>
    );
}

export function BubbleTransaction(props: TransactionMessage) {
    const { status, info, onLayout, onPress, comment } = props;
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(props);
    const actionString = getActionString(props);
    const isRTL = React.useMemo(() => I18nManager.getConstants().isRTL, []);

    return (
        <View style={containerStyle} onLayout={onLayout}>
            <UIPressableArea onPress={onPress}>
                <View style={getBubbleInner(position, isRTL)}>
                    <BubbleTransactionMain {...props} />
                    {actionString && (
                        <UILabel
                            style={styles.actionString}
                            role={UILabelRoles.ActionFootnote}
                            color={getActionStringColor(props)}
                        >
                            {actionString}
                        </UILabel>
                    )}
                    {comment && (
                        <BubbleTransactionComment {...comment} status={status} type={info.type} />
                    )}
                </View>
            </UIPressableArea>
        </View>
    );
}

const styles = StyleSheet.create({
    innerLeft: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    innerLeftRTL: {
        alignItems: 'flex-end',
    },
    innerRight: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    innerRightRTL: {
        alignItems: 'flex-start',
    },
    trxCard: {
        paddingHorizontal: UIConstant.normalContentOffset(),
        paddingVertical: UIConstant.normalContentOffset(),
    },
    actionString: {
        paddingTop: UIConstant.tinyContentOffset(),
        textAlign: 'right',
    },
});
