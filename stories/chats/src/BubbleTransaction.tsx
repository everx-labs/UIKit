import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/localization';
import { UIScaleButton } from '@tonlabs/uikit.components';
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

const getValueForTestID = (message: TransactionMessage) => message.info.amount.toFixed(9);

const getContainerTestID = (message: TransactionMessage) => {
    if (message.status === MessageStatus.Pending) {
        return `transaction_message_${getValueForTestID(message)}_pending`;
    }

    return `transaction_message_${getValueForTestID(message)}`;
};

const getBubbleInner = (position: BubblePosition) => {
    if (position === BubblePosition.left) {
        return styles.innerLeft;
    }

    if (position === BubblePosition.right) {
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

const getBubbleCornerStyle = (position: BubblePosition) => {
    if (position === BubblePosition.left) {
        return styles.leftCorner;
    }

    if (position === BubblePosition.right) {
        return styles.rightCorner;
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
    if (props.status === MessageStatus.Aborted) {
        return (
            <>
                <UILabel
                    testID={`transaction_message_${getValueForTestID(props)}_aborted`}
                    role={UILabelRoles.ParagraphFootnote}
                    color={getCommentColor(props)}
                >
                    {uiLocalized.formatString(
                        uiLocalized.TransactionStatus.aborted,
                        uiLocalized.formatDate(props.time),
                    )}
                </UILabel>
            </>
        );
    }
    if (props.status === MessageStatus.Pending) {
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
                {uiLocalized.formatDate(props.time)}
            </UILabel>
        </>
    );
}

function BubbleTransactionMain(props: TransactionMessage) {
    const position = useBubblePosition(props.status);
    const bubbleStyle = useBubbleStyle(props);
    const { balanceChange } = props.info;
    return (
        <View
            testID={getContainerTestID(props)}
            style={[
                UIStyle.Common.justifyCenter(),
                styles.trxCard,
                bubbleStyle,
                getBubbleCornerStyle(position),
                props.status === MessageStatus.Pending && UIStyle.common.opacity70(),
            ]}
        >
            <View
                style={[
                    UIStyle.Common.flexRow(),
                    UIStyle.Margin.bottomTiny(),
                    UIStyle.Common.justifyStart(),
                ]}
            >
                <UILabel role={UILabelRoles.PromoMedium} color={getAmountColor(props)}>
                    {balanceChange}
                </UILabel>
            </View>
            <View style={[UIStyle.Common.flexRow(), UIStyle.Common.justifyStart()]}>
                <TransactionSublabel {...props} />
            </View>
        </View>
    );
}

export function BubbleTransaction(props: TransactionMessage) {
    const position = useBubblePosition(props.status);
    const containerStyle = useBubbleContainerStyle(props);
    const actionString = getActionString(props);

    return (
        <View style={containerStyle} onLayout={props.onLayout}>
            <UIScaleButton
                onPress={props.onPress}
                content={
                    <View style={getBubbleInner(position)}>
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
                        {props.comment && (
                            <BubbleTransactionComment
                                {...props.comment}
                                status={props.status}
                                type={props.info.type}
                                onPress={props.onPress}
                            />
                        )}
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    innerLeft: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    innerRight: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    trxCard: {
        borderRadius: UIConstant.borderRadius(),
        paddingHorizontal: UIConstant.normalContentOffset(),
        paddingVertical: UIConstant.normalContentOffset(),
    },
    leftCorner: {
        borderTopLeftRadius: 0,
    },
    rightCorner: {
        borderBottomRightRadius: 0,
    },
    actionString: {
        paddingTop: UIConstant.tinyContentOffset(),
        textAlign: 'right',
    },
});
