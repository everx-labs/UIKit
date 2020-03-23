// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import Moment from 'moment';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIPureComponent from '../../UIPureComponent';
import UIScaleButton from '../../buttons/UIScaleButton';
import UILabel from '../../text/UILabel';
import UIBalanceView from '../../views/UIBalanceView';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIFunction from '../../../helpers/UIFunction';
import UILocalized from '../../../helpers/UILocalized';

import { ChatMessageStatus, TypeOfTransaction } from '../extras';

import type {
    ChatAdditionalInfo,
    ChatMessage,
    ChatMessageStatusType,
    TransactionInfo,
} from '../extras';

type Props = {
    message: any,
    additionalInfo: ChatAdditionalInfo,
    status: ChatMessageStatusType,
    onPress: ?(() => void),
}

type State = {
    // Empty
}

const styles = StyleSheet.create({
    trxCard: {
        height: UIConstant.greatCellHeight(),
        borderRadius: UIConstant.borderRadius(),
        paddingHorizontal: UIConstant.normalContentOffset(),
        backgroundColor: UIColor.green(),
    },
    cardDeposit: {
        backgroundColor: UIColor.primaryPlus(),
    },
    cardWithdraw: {
        backgroundColor: UIColor.blackLight(),
    },
    cardIncome: {
        backgroundColor: UIColor.green(),
    },
    cardSpending: {
        backgroundColor: UIColor.blackLight(),
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
        borderBottomLeftRadius: 0,
    },
    rightConner: {
        borderBottomRightRadius: 0,
    },
});

export default class UIChatTransactionCell extends UIPureComponent<Props, State> {
    static defaultProps = {
        onPress: null,
    };

    // Getters
    getMessage(): ChatMessage {
        return this.props.message;
    }

    getText(): string {
        return this.getMessage().info.text || '';
    }

    getTransaction(): any {
        return this.getMessage().info.trx;
    }

    getAmount(): number {
        const trx = this.getTransaction();
        return Math.abs(trx.amount || 0.0);
    }

    getAmountInCurrency(): string {
        const extra = this.getExtra();
        const { currency } = extra;
        if (!currency) {
            return '';
        }
        const localizedAmountInCurrency = `${extra.amount * currency.rate}`; // TODO: localize!!!
        return UIFunction.amountAndCurrency(localizedAmountInCurrency, currency.symbol);
    }

    getDate(): string {
        const { created } = this.getMessage().info;
        const today = new Date();
        const date = new Date(created);
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();
        const dateTime = date.getTime();
        const isToday = todayTime === dateTime;
        const isYesterday = (todayTime - dateTime) === (24 * 3600 * 1000);
        const moment = (isToday || isYesterday) ? (
            `${isToday ? UILocalized.Today : UILocalized.Yesterday}, ${Moment(created).format('LT')}`
        ) : (
            Moment(created).format('D MMM LT')
        );

        return moment;
    }

    getTime(): string {
        const { created } = this.getMessage().info;
        return Moment(created).format('LT');
    }

    getExtra(): TransactionInfo {
        const extra: TransactionInfo = {
            amountLocalized: this.getAmount(),
            amount: this.getAmount(),
            separator: '.',
            token: '',
            currency: {
                rate: 1.0,
                symbol: '',
            },
        };
        return this.props.additionalInfo?.transactionInfo || extra;
    }

    getCardColor(): ViewStyleProp {
        const extra = this.getExtra();
        const { type } = extra;
        if (type === TypeOfTransaction.Deposit) {
            return styles.cardDeposit;
        } else if (type === TypeOfTransaction.Withdraw) {
            return styles.cardWithdraw;
        } else if (type === TypeOfTransaction.Income) {
            return styles.cardIncome;
        } else if (type === TypeOfTransaction.Spending) {
            const trx = this.getTransaction();
            if (trx.aborted) {
                return styles.cardAborted;
            }
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

    getStatusString(status: ChatMessageStatus): string {
        const time = this.getTime();
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

    isReceived(): boolean {
        return this.getStatus() === ChatMessageStatus.Received;
    }

    // Render
    renderTrxContent() {
        const trx = this.getTransaction();
        const extra = this.getExtra();
        const { amountLocalized } = extra;
        const conner = this.isReceived() ? styles.leftConner : styles.rightConner;
        const color = this.getCardColor();
        const textColor = this.getTextColor();
        const amountColor = this.getAmountColor();
        const commentColor = this.getCommentColor();
        const date = this.getDate();
        const { Aborted, Sending } = ChatMessageStatus;
        const info = (trx.aborted || trx.sending)
            ? this.getStatusString(trx.aborted ? Aborted : Sending)
            : date;

        return (
            <View
                testID={`transaction_message_${amountLocalized}`}
                style={[
                    UIStyle.Common.justifyCenter(),
                    styles.trxCard,
                    conner,
                    color,
                ]}
            >
                <View
                    style={[
                        UIStyle.Common.flexRow(),
                        UIStyle.Margin.bottomTiny(),
                        UIStyle.Common.justifySpaceBetween(),
                    ]}
                >
                    <UILabel
                        style={[
                            UIStyle.Margin.rightHuge(),
                            textColor,
                        ]}
                        role={UILabel.Role.SmallMedium}
                        text={this.getText()}
                    />
                    <UIBalanceView
                        balance={amountLocalized}
                        separator={extra.separator}
                        tokenSymbol={extra.token}
                        smartTruncator={false}
                        textStyle={[
                            UIStyle.Text.smallRegular(),
                            amountColor,
                        ]}
                        fractionalTextStyle={amountColor}
                    />
                </View>

                <View
                    testID={trx.aborted
                        ? `transaction_message_${amountLocalized}_aborted`
                        : `transaction_message_${amountLocalized}_time`}
                    style={[UIStyle.Common.flexRow(), UIStyle.Common.justifySpaceBetween()]}
                >
                    <UILabel
                        role={UILabel.Role.TinyRegular}
                        text={info}
                        style={[UIStyle.Margin.rightHuge(), commentColor]}
                    />
                    <UILabel
                        style={styles.textMetadata}
                        role={UILabel.Role.TinyRegular}
                        text={this.getAmountInCurrency()}
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
