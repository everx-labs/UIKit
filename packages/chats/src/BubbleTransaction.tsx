import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { UIColor, UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UIScaleButton } from '@tonlabs/uikit.components';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

import { ChatMessageStatus, TransactionType } from './types';
import type { TransactionMessage } from './types';
import { useBubblePosition, BubblePosition } from './useBubblePosition';
import { BubbleTransactionComment } from './BubbleTransactionComment';

const getValueForTestID = (message: TransactionMessage) =>
    message.info.amount.toFixed(1);

const getContainerTestID = (message: TransactionMessage) => {
    if (message.status === ChatMessageStatus.Pending) {
        return `transaction_message_${getValueForTestID(message)}_pending`;
    }

    return `transaction_message_${getValueForTestID(message)}`;
};

const getBubbleContainer = (position: BubblePosition) => {
    if (position === BubblePosition.left) {
        return styles.containerLeft;
    }

    if (position === BubblePosition.right) {
        return styles.containerRight;
    }

    return null;
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

const getBubbleColor = (message: TransactionMessage) => {
    const { type } = message.info;

    if (message.status === ChatMessageStatus.Aborted) {
        return styles.cardAborted;
    }

    if (type === TransactionType.Expense) {
        return styles.cardWithdraw;
    }

    if (type === TransactionType.Income) {
        return styles.cardIncome;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAmountColor = (_message: TransactionMessage) => {
    // TODO: what do with that types?
    // const { type } = _message.info;

    // if (type === TransactionType.Bill || type === TransactionType.Compliment) {
    //     return styles.textGrey;
    // }
    return UILabelColors.TextPrimaryInverted;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCommentColor = (_message: TransactionMessage) => {
    // TODO: what do with that types?
    // const { type } = message.info;

    // if (type === TransactionType.Bill || type === TransactionType.Compliment) {
    //     return styles.textBlack;
    // }
    return UILabelColors.TextPrimaryInverted;
};

const getCommentText = (message: TransactionMessage) => {
    if (message.info.text == null) {
        return '';
    }

    return `${message.info.text}, `;
};

const getActionString = (message: TransactionMessage) => {
    if (message.status === ChatMessageStatus.Aborted) {
        return message.actionText ?? uiLocalized.Chats.Bubbles.TapToResend;
    }

    return message.actionText;
};

const getActionStringColor = (message: TransactionMessage) => {
    if (message.status === ChatMessageStatus.Aborted) {
        return UILabelColors.TextNegative;
    }
    return UILabelColors.TextTertiary;
};

function TransactionSublabel(props: TransactionMessage) {
    if (props.status === ChatMessageStatus.Aborted) {
        return (
            <>
                <UILabel
                    testID={`transaction_message_${getValueForTestID(
                        props,
                    )}_aborted`}
                    role={UILabelRoles.ActionFootnote}
                    color={UILabelColors.TextPrimaryInverted}
                >
                    {uiLocalized.formatString(
                        uiLocalized.TransactionStatus.aborted,
                        uiLocalized.formatDate(props.time),
                    )}
                </UILabel>
            </>
        );
    }
    if (props.status === ChatMessageStatus.Pending) {
        return (
            <>
                <UILabel
                    testID={`transaction_message_${getValueForTestID(
                        props,
                    )}_time`}
                    role={UILabelRoles.ActionFootnote}
                    color={UILabelColors.TextPrimaryInverted}
                >
                    {uiLocalized.TransactionStatus.sending}
                </UILabel>
            </>
        );
    }

    return (
        <>
            <UILabel
                role={UILabelRoles.ActionFootnote}
                color={getCommentColor(props)}
            >
                {getCommentText(props)}
            </UILabel>
            <UILabel
                testID={`transaction_message_${getValueForTestID(props)}_time`}
                role={UILabelRoles.ActionFootnote}
                color={getCommentColor(props)}
            >
                {uiLocalized.formatDate(props.time)}
            </UILabel>
        </>
    );
}

function BubbleTransactionMain(props: TransactionMessage) {
    const position = useBubblePosition(props.status);
    const { balanceChange } = props.info;
    return (
        <View
            testID={getContainerTestID(props)}
            style={[
                UIStyle.Common.justifyCenter(),
                styles.trxCard,
                getBubbleColor(props),
                getBubbleCornerStyle(position),
                props.status === ChatMessageStatus.Pending &&
                    UIStyle.common.opacity70(),
            ]}
        >
            <View
                style={[
                    UIStyle.Common.flexRow(),
                    UIStyle.Margin.bottomTiny(),
                    UIStyle.Common.justifyStart(),
                ]}
            >
                <UILabel
                    role={UILabelRoles.PromoMedium}
                    color={getAmountColor(props)}
                >
                    {balanceChange}
                </UILabel>
            </View>
            <View
                style={[
                    UIStyle.Common.flexRow(),
                    UIStyle.Common.justifyStart(),
                ]}
            >
                <TransactionSublabel {...props} />
            </View>
        </View>
    );
}

export function BubbleTransaction(props: TransactionMessage) {
    const position = useBubblePosition(props.status);
    const actionString = getActionString(props);

    return (
        <View style={getBubbleContainer(position)}>
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
    containerRight: {
        paddingLeft: '20%',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    containerLeft: {
        paddingRight: '20%',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
    },
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
        backgroundColor: UIColor.green(),
    },
    cardIncome: {
        backgroundColor: UIColor.green(),
    },
    cardWithdraw: {
        backgroundColor: UIColor.black(),
    },
    cardAborted: {
        backgroundColor: UIColor.error(),
    },
    textWhite: {
        // TODO: rename it
        color: UIColor.white(),
    },
    textGrey: {
        // TODO: rename it
        color: UIColor.grey(),
    },
    textBlack: {
        // TODO: rename it
        color: UIColor.black(),
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
