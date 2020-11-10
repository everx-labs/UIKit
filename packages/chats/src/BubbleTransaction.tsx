import * as React from "react";
import { View, StyleSheet } from "react-native";

import {
    UIColor,
    UIStyle,
    UILocalized,
    UIConstant,
    formatDate,
} from "@uikit/core";
import { UILabel } from "@uikit/components";

import { ChatMessageStatus, TransactionType } from "./types";
import type { TransactionMessage } from "./types";
import { useBubblePosition, BubblePosition } from "./useBubblePosition";

const getValueForTestID = (message: TransactionMessage) =>
    message.info.amount.toFixed(1);

const getContainerTestID = (message: TransactionMessage) =>
    message.status === ChatMessageStatus.Sending
        ? `transaction_message_${getValueForTestID(message)}_pending`
        : `transaction_message_${getValueForTestID(message)}`;

const getBubbleContainer = (position: BubblePosition) => {
    if (position === BubblePosition.left) {
        return styles.containerLeft;
    } else if (position === BubblePosition.right) {
        return styles.containerRight;
    }
    return null;
};

const getBubbleColor = (message: TransactionMessage) => {
    const { type } = message.info;

    if (type === TransactionType.Aborted) {
        return styles.cardAborted;
    } else if (type === TransactionType.Withdraw) {
        return styles.cardWithdraw;
    } else if (type === TransactionType.Income) {
        return styles.cardIncome;
    }

    return null;
};

const getBubbleCornerStyle = (position: BubblePosition) => {
    if (position === BubblePosition.left) {
        return styles.leftCorner;
    } else if (position === BubblePosition.right) {
        return styles.rightCorner;
    }
    return null;
};

const getAmountColor = (message: TransactionMessage) => {
    const { type } = message.info;

    if (type === TransactionType.Bill || type === TransactionType.Compliment) {
        return styles.textGrey;
    }
    return styles.textWhite;
};

const getCommentColor = (message: TransactionMessage) => {
    const { type } = message.info;

    if (type === TransactionType.Bill || type === TransactionType.Compliment) {
        return styles.textBlack;
    }
    return styles.textWhite;
};

const getCommentText = (message: TransactionMessage) => {
    return `${message.info.text || ""}, `; // TODO: check how it could be empty and why we use it
};

function TransactionSublabel(props: TransactionMessage) {
    if (props.info.type === TransactionType.Aborted) {
        return (
            <>
                <UILabel
                    testID={`transaction_message_${getValueForTestID(
                        props
                    )}_aborted`}
                    role={UILabel.Role.TinyRegular}
                    text={UILocalized.formatString(
                        UILocalized.TransactionStatus.aborted,
                        formatDate(props.time)
                    )}
                    style={styles.textWhite}
                />
            </>
        );
    }
    if (props.status === ChatMessageStatus.Pending) {
        return (
            <>
                <UILabel
                    testID={`transaction_message_${getValueForTestID(
                        props
                    )}_time`}
                    role={UILabel.Role.TinyRegular}
                    text={UILocalized.TransactionStatus.sending}
                    style={styles.textWhite}
                />
            </>
        );
    }

    return (
        <>
            <UILabel
                role={UILabel.Role.TinyRegular}
                style={getCommentColor(props)}
                text={getCommentText(props)}
            />
            <UILabel
                testID={`transaction_message_${getValueForTestID(props)}_time`}
                role={UILabel.Role.TinyRegular}
                style={getCommentColor(props)}
                text={formatDate(props.time)}
            />
        </>
    );
}

export function BubbleTransaction(props: TransactionMessage) {
    const { amount } = props.info;
    const position = useBubblePosition(props.status);

    return (
        <View style={[getBubbleContainer(position)]}>
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
                        style={[getAmountColor(props)]}
                        role={UILabel.Role.PromoMedium}
                        text={amount.toFixed()}
                    />
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
        </View>
    );
}

const styles = StyleSheet.create({
    containerRight: {
        paddingLeft: "20%",
        alignSelf: "flex-end",
        justifyContent: "flex-end",
    },
    containerLeft: {
        paddingRight: "20%",
        alignSelf: "flex-start",
        justifyContent: "flex-start",
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
});
