// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import BigNumber from 'bignumber.js';


import {
    UIColor,
    UIConstant,
    UIStyle,
    UILocalized,
    formatTime,
} from '@uikit/core';
import {
    UIPureComponent,
    UIScaleButton,
    UILabel,
} from '@uikit/components';
import type { BigNum } from '@uikit/core/types/BigNum';

import type {
    ChatAdditionalInfo,
    ChatMessageStatusType,
    TransactionInfo,
    UIChatMessage,
} from '../extras';
import { ChatMessageStatus, TypeOfTransaction } from '../extras';


type Props = {
    message: any,
    isReceived: boolean,
    additionalInfo?: ChatAdditionalInfo,
    status?: ChatMessageStatusType,
    onPress?: () => void,
}

type State = {
    // Empty
}

const styles = StyleSheet.create({
    trxCard: {
        borderRadius: UIConstant.borderRadius(),
        paddingHorizontal: UIConstant.normalContentOffset(),
        paddingVertical: UIConstant.normalContentOffset(),
        backgroundColor: UIColor.green(),
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
    cardRejected: {
        backgroundColor: UIColor.caution(),
    },
    cardAborted: {
        backgroundColor: UIColor.error(),
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
        color: UIColor.white(),
    },
    textBlue: {
        color: UIColor.primary(),
    },
    textGreen: {
        color: UIColor.green(),
    },
    textBlack: {
        color: UIColor.black(),
    },
    textGrey: {
        color: UIColor.grey(),
    },
    textMetadata: {
        color: UIColor.grey1(),
    },
    leftConner: {
        borderTopLeftRadius: 0,
    },
    rightConner: {
        borderBottomRightRadius: 0,
    },
});

export default class UIChatTransactionCell extends UIPureComponent<Props, State> {
    // Getters
    getMessage(): UIChatMessage {
        return this.props.message;
    }

    getText(): string {
        return this.getMessage().info.text || '';
    }

    getTransaction(): any {
        return this.getMessage().info.trx;
    }

    getTransactionValue(): BigNum {
        const trx = this.getTransaction();
        return trx.amount || new BigNumber(0);
    }

    getValueForTestID(): string {
        return this.getTransactionValue().toFixed(1);
    }

    getDate(): string {
        const { created } = this.getMessage().info;
        return created ? formatTime(created) : '';
    }

    getExtra(): TransactionInfo {
        const value = this.getTransactionValue();
        const extra: TransactionInfo = {
            type: null,
            amount: value.toFixed(),
        };
        return this.props.additionalInfo?.transactionInfo || extra;
    }

    getCardColor(): ViewStyleProp {
        const extra = this.getExtra();

        const { type } = extra;
        if (type === TypeOfTransaction.Aborted) {
            return styles.cardAborted;
        } else if (type === TypeOfTransaction.Deposit) {
            return styles.cardDeposit;
        } else if (type === TypeOfTransaction.Withdraw) {
            return styles.cardWithdraw;
        } else if (type === TypeOfTransaction.Income) {
            return styles.cardIncome;
        } else if (type === TypeOfTransaction.Spending) {
            return styles.cardSpending;
        } else if (type === TypeOfTransaction.Bill) {
            return styles.cardBill;
        } else if (type === TypeOfTransaction.Invoice) {
            return styles.cardInvoice;
        } else if (type === TypeOfTransaction.Invite) {
            return styles.cardInvite;
        } else if (type === TypeOfTransaction.Compliment) {
            return styles.cardCompliment;
        }

        return null;
    }

    getTextColor() {
        const extra = this.getExtra();
        const { type } = extra;
        if (type === TypeOfTransaction.Bill
            || type === TypeOfTransaction.Compliment) {
            return styles.textBlack;
        }
        return styles.textWhite;
    }

    getAmountColor() {
        const extra = this.getExtra();
        const { type } = extra;
        if (type === TypeOfTransaction.Bill
            || type === TypeOfTransaction.Compliment) {
            return styles.textBlack;
        }
        return styles.textWhite;
    }

    getCommentColor() {
        const extra = this.getExtra();
        const { type } = extra;
        if (type === TypeOfTransaction.Bill
            || type === TypeOfTransaction.Compliment
        ) {
            return styles.textGrey;
        }
        return styles.textWhite;
    }

    getStatus(): string {
        const { status } = this.props;
        return status || ChatMessageStatus.Received;
    }

    getStatusString(status: ChatMessageStatusType): string {
        const time = this.getDate();
        if (status === ChatMessageStatus.Rejected) {
            return UILocalized.formatString(
                UILocalized.TransactionStatus.rejected,
                time,
            );
        } else if (status === ChatMessageStatus.Aborted) {
            return UILocalized.formatString(
                UILocalized.TransactionStatus.aborted,
                time,
            );
        } else if (status === ChatMessageStatus.Sending) {
            return UILocalized.TransactionStatus.sending;
        }
        return '';
    }

    get isReceived(): boolean {
        return this.props.isReceived;
    }

    // Render
    renderTrxContent() {
        const { amount } = this.getExtra();
        const corner = this.isReceived ? styles.leftConner : styles.rightConner;
        const status = this.getStatus();
        const color = this.getCardColor();
        const textColor = this.getTextColor();
        const amountColor = this.getAmountColor();
        const commentColor = this.getCommentColor();
        const date = this.getDate();
        const { Aborted, Sending, Rejected } = ChatMessageStatus;
        const isAborted = status === Aborted;
        const isSending = status === Sending;
        const isRejected = status === Rejected;
        const info = (isAborted || isRejected) ? this.getStatusString(status) : date;

        return (
            <View
                testID={
                    isSending
                        ? `transaction_message_${this.getValueForTestID()}_pending`
                        : `transaction_message_${this.getValueForTestID()}`
                }
                style={[
                    UIStyle.Common.justifyCenter(),
                    styles.trxCard,
                    corner,
                    color,
                    isSending && UIStyle.common.opacity70(),
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
                        style={[amountColor]}
                        role={UILabel.Role.PromoMedium}
                        text={amount}
                    />
                </View>

                <View
                    style={[UIStyle.Common.flexRow(), UIStyle.Common.justifyStart()]}
                >
                    {!isAborted && (
                        <UILabel
                            style={textColor}
                            role={UILabel.Role.TinyRegular}
                            text={`${this.getText()}, `}
                        />
                    )}
                    <UILabel
                        testID={status === Aborted
                            ? `transaction_message_${this.getValueForTestID()}_aborted`
                            : `transaction_message_${this.getValueForTestID()}_time`}
                        role={UILabel.Role.TinyRegular}
                        text={info}
                        style={commentColor}
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <UIScaleButton
                onPress={this.props.onPress}
                content={this.renderTrxContent()}
            />
        );
    }
}
