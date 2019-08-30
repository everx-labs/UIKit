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

import { TypeOfTransaction } from '../extras';
import type { ChatMessage, TransactionExtraInfo, ChatAdditionalInfo } from '../extras';

type Props = {
    message: any,
    additionalInfo: ChatAdditionalInfo,
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
        const trx = this.getTransaction();
        const extra = this.getExtra();
        const amount = trx.out ? -extra.localeAmount : extra.localeAmount;

        const { currency } = extra;
        if (!currency) {
            return '';
        }

        return `${amount * currency.rate} ${currency.symbol}`;
    }

    getDate(): number {
        return this.getMessage().info.created;
    }

    getExtra(): TransactionExtraInfo {
        const extra: TransactionExtraInfo = {
            localeAmount: this.getAmount(),
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


    renderTrxContent() {
        const trx = this.getTransaction();
        const extra = this.getExtra();
        const conner = trx.out ? styles.rightConner : styles.leftConner;
        const amount = trx.out ? -extra.localeAmount : extra.localeAmount;
        const color = this.getCardColor();
        const date = Moment(this.getDate()).format('D MMM LT');

        return (
            <View style={[
                UIStyle.Common.justifyCenter(),
                styles.trxCard,
                conner,
                color,
            ]}
            >
                <View style={[
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
                        role={UILabel.Role.Caption}
                        text={this.getText()}
                    />
                    <UIBalanceView
                        balance={`${amount}`}
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
                        style={[UIStyle.Margin.rightHuge(), styles.textMetadata]}
                        role={UILabel.Role.TinyRegular}
                        text={date}
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
