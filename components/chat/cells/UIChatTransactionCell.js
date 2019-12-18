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
    TransactionExtraInfo,
} from '../extras';

type Props = {
    message: any,
    additionalInfo: ChatAdditionalInfo,
    status: ChatMessageStatusType,
    onPress: () => void,
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
        backgroundColor: UIColor.white(),
        ...UIConstant.cardShadow(),
    },
    cardWithdraw: {
        backgroundColor: UIColor.white(),
        ...UIConstant.cardShadow(),
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
    },
    cardInvoice: {
        backgroundColor: UIColor.white(),
        ...UIConstant.cardShadow(),
    },
    cardInvite: {
        backgroundColor: UIColor.primary(),
    },
    textWhite: {
        color: UIColor.white(),
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
        onPress: () => {},
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
        const amount = `${extra.amount}`;

        const { currency } = extra;
        if (!currency) {
            return '';
        }

        return UIFunction.amountAndCurrency(amount, currency.symbol);
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

    getExtra(): TransactionExtraInfo {
        const extra: TransactionExtraInfo = {
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
        const trx = this.getTransaction();
        const { type } = extra;
        if (type === TypeOfTransaction.Deposit) {
            return styles.cardDeposit;
        } else if (type === TypeOfTransaction.Withdraw) {
            return styles.cardWithdraw;
        } else if (type === TypeOfTransaction.Income) {
            return styles.cardIncome;
        } else if (type === TypeOfTransaction.Spending) {
            if (trx.aborted) {
                return styles.cardAborted;
            } else if (trx.deploy) {
                return styles.cardInvite;
            }
            return styles.cardSpending;
        } else if (type === TypeOfTransaction.Bill) {
            return styles.cardBill;
        } else if (type === TypeOfTransaction.Invoice) {
            return styles.cardInvoice;
        } else if (type === TypeOfTransaction.Invite) {
            return styles.cardInvite;
        }

        return null;
    }

    getTextColor() {
        // TODO:
    }

    getAmountColor() {
        // TODO:
    }

    getStatus(): string {
        const { status } = this.props;
        return status || ChatMessageStatus.Received;
    }

    getStatusString(status: ChatMessageStatus): string {
        if (status === ChatMessageStatus.Rejected) {
            return UILocalized.TransactionStatus.rejected;
        } else if (status === ChatMessageStatus.Aborted) {
            return UILocalized.TransactionStatus.aborted;
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
        const conner = this.isReceived() ? styles.leftConner : styles.rightConner;
        const amount = trx.out ? `− ${extra.amountLocalized}` : `+ ${extra.amountLocalized}`;
        const color = this.getCardColor();
        const date = this.getDate();

        return (
            <View
                testID={`transaction_message_${amount}`}
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
                            styles.textWhite,
                        ]}
                        role={UILabel.Role.SmallMedium}
                        text={this.getText()}
                    />
                    <UIBalanceView
                        balance={amount}
                        separator={extra.separator}
                        tokenSymbol={extra.token}
                        smartTruncator={false}
                        textStyle={[
                            UIStyle.Text.smallRegular(),
                            styles.textWhite,
                        ]}
                        fractionalTextStyle={styles.textWhite}
                    />
                </View>

                <View style={[UIStyle.Common.flexRow(), UIStyle.Common.justifySpaceBetween()]}>
                    <UILabel
                        testID={trx.aborted
                            ? `transaction_message_${amount}_date`
                            : `transaction_message_${amount}_aborted`}
                        style={[UIStyle.Margin.rightHuge(), styles.textMetadata]}
                        role={UILabel.Role.TinyRegular}
                        text={
                            trx.aborted
                                ? this.getStatusString(ChatMessageStatus.Aborted)
                                : date
                        }
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
