// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import Moment from 'moment';

import UIPureComponent from '../../UIPureComponent';
import UIScaleButton from '../../buttons/UIScaleButton';
import UILabel from '../../text/UILabel';
import UIBalanceView from '../../views/UIBalanceView';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';

import type { ChatMessage, TransactionExtraInfo } from '../extras';

type Props = {
    message: any,
    extraTrxInfo: TransactionExtraInfo,
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
        marginBottom: UIConstant.normalContentOffset(),
        marginTop: UIConstant.normalContentOffset(),
        backgroundColor: UIColor.green(),
    },
    textWhite: {
        color: UIColor.white(),
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

        if (!extra.currency) {
            return '';
        }
        const {currency} = extra;

        return `${amount * currency.rate} ${currency.symbol}`
    }

    getDate(): number {
        return this.getMessage().info.created;
    }

    getExtra(): TransactionExtraInfo {
        const extra: TransactionExtraInfo = {
            localeAmount: this.getAmount(),
            separator: '.',
            token: '',
        };
        return this.props.extraTrxInfo || extra;
    }

    renderTrxContent() {
        const trx = this.getTransaction();
        const extra = this.getExtra();
        const conner = trx.out ? styles.rightConner : styles.leftConner;
        const amount = trx.out ? -extra.localeAmount : extra.localeAmount;
        const date = Moment(this.getDate()).format('D MMM LT');

        return (
            <View style={[
                UIStyle.Common.justifyCenter(),
                styles.trxCard,
                conner,
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
                        style={[UIStyle.Margin.rightHuge(), styles.textWhite]}
                        role={UILabel.Role.TinyRegular}
                        text={date}
                    />
                    <UILabel
                        style={styles.textWhite}
                        role={UILabel.Role.TinyRegular}
                        text={`${this.getAmountInCurrency()}`}
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
