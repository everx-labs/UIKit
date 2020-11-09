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

const getValueForTestID = (message: TransactionMessage) =>
    message.info.amount.toFixed(1);

const getContainerTestID = (message: TransactionMessage) =>
    message.status === ChatMessageStatus.Sending
        ? `transaction_message_${getValueForTestID(message)}_pending`
        : `transaction_message_${getValueForTestID(message)}`;

const getBubbleContainer = (status: ChatMessageStatus) => {
    if (status === ChatMessageStatus.Received) {
        return styles.containerReceived;
    }
    return styles.container;
};

const getCardColor = (message: TransactionMessage) => {
    const { type } = message.info;

    if (type === TransactionType.Aborted) {
        return styles.cardAborted;
    } else if (type === TransactionType.Deposit) {
        return styles.cardDeposit;
    } else if (type === TransactionType.Withdraw) {
        return styles.cardWithdraw;
    } else if (type === TransactionType.Income) {
        return styles.cardIncome;
    } else if (type === TransactionType.Spending) {
        return styles.cardSpending;
    } else if (type === TransactionType.Bill) {
        return styles.cardBill;
    } else if (type === TransactionType.Invoice) {
        return styles.cardInvoice;
    } else if (type === TransactionType.Invite) {
        return styles.cardInvite;
    } else if (type === TransactionType.Compliment) {
        return styles.cardCompliment;
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

const TransactionSublabel = (props: TransactionMessage) => {
    if (props.status === ChatMessageStatus.Aborted) {
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
    if (props.status === ChatMessageStatus.Rejected) {
        return (
            <>
                <UILabel
                    testID={`transaction_message_${getValueForTestID(
                        props
                    )}_time`}
                    role={UILabel.Role.TinyRegular}
                    text={UILocalized.formatString(
                        UILocalized.TransactionStatus.rejected,
                        formatDate(props.time)
                    )}
                    style={styles.textWhite}
                />
            </>
        );
    }
    if (props.status === ChatMessageStatus.Sending) {
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
};

export function BubbleTransaction(props: TransactionMessage) {
    const { amount } = props.info;

    return (
        <View style={[getBubbleContainer(props.status)]}>
            <View
                testID={getContainerTestID(props)}
                style={[
                    UIStyle.Common.justifyCenter(),
                    styles.trxCard,
                    getCardColor(props),
                    props.status === ChatMessageStatus.Sending &&
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
    container: {
        paddingLeft: "20%",
        alignSelf: "flex-end",
        justifyContent: "flex-end",
    },
    containerReceived: {
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
    cardAborted: {
        backgroundColor: UIColor.error(),
    },
    cardDeposit: {
        backgroundColor: UIColor.primaryPlus(),
    },
    cardWithdraw: {
        backgroundColor: UIColor.primaryPlus(),
    },
    cardIncome: {
        backgroundColor: UIColor.green(),
    },
    cardSpending: {
        backgroundColor: UIColor.black(),
    },
    cardBill: {
        backgroundColor: UIColor.white(),
        ...UIConstant.cardShadow(),
    },
    cardInvoice: {
        backgroundColor: UIColor.white(),
        ...UIConstant.cardShadow(),
    },
    cardInvite: {
        backgroundColor: UIColor.primary(),
    },
    cardCompliment: {
        backgroundColor: UIColor.fa(),
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
});
