// @flow
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { NativeMethodsMixinType } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';
import UILabel from '../../text/UILabel';

type Props = {
    balance: string,
    separator: string,
    description: string,
    tokenSymbol: string,
    testID?: string,
};

type State = {
    balance: string,
    auxBalance: string,
};

const styles = StyleSheet.create({
    auxBalance: {
        opacity: 0,
        zIndex: -1,
    },
});

export default class UIBalanceView extends UIComponent<Props, State> {
    static defaultProps = {
        balance: '',
        description: '',
        tokenSymbol: '',
    };

    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            balance: '',
            auxBalance: '',
        };
    }

    componentDidUpdate(prevProps: Props) {
        const { balance } = this.props;
        if (balance !== prevProps.balance) {
            this.setAuxBalance(balance, () => { // start component layout and measuring
                this.measureAuxBalanceText(balance);
            });
        }
    }

    // Events
    auxBalanceLineHeight: ?number;
    onAuxBalanceLayout = (e: any) => {
        const { height } = e.nativeEvent.layout;
        if (!this.auxBalanceLineHeight) {
            this.auxBalanceLineHeight = height;
        }
    };

    // Setters
    setBalance(balance: string) {
        this.setStateSafely({ balance });
    }

    setAuxBalance(auxBalance: string, callback?: () => void) {
        this.setStateSafely({ auxBalance }, callback);
    }

    // Getters
    getSeparator(): string {
        return this.props.separator || '.';
    }

    getBalance(): string {
        return this.state.balance
            || `0${this.getSeparator()}${'0'.repeat(UIConstant.maxDecimalDigits())}`;
    }

    getAuxBalance(): string {
        return this.state.auxBalance || this.getBalance();
    }

    getDescription(): string {
        return this.props.description || '';
    }

    getTokenSymbol(): string {
        return this.props.tokenSymbol || '';
    }

    getTestID(): ?string {
        return this.props.testID;
    }

    // Processing
    processAuxBalanceHeight(height: number, auxBalance: string) {
        if (!this.auxBalanceLineHeight) {
            this.auxBalanceLineHeight = height;
        } else if (this.auxBalanceLineHeight < height) {
            const truncatedAuxBalance = auxBalance.slice(0, -1); // reduce balance size
            this.setAuxBalance(truncatedAuxBalance, () => {
                this.measureAuxBalanceText(truncatedAuxBalance);
            });
        } else {
            this.setBalance(auxBalance);
        }
    }

    // Actions
    measureAuxBalanceText(auxBalance: string) {
        setTimeout(() => {
            if (!this.auxBalanceText) {
                return;
            }
            this.auxBalanceText.measure((relX, relY, w, h) => {
                this.processAuxBalanceHeight(h, auxBalance);
            });
        }, 0);
    }

    // Render
    renderBalance() {
        const balance = this.getBalance();
        const separator = this.getSeparator();
        const stringParts = balance.split(separator);
        return (
            <Text
                style={UIStyle.Text.primaryTitleLight()}
                numberOfLines={1}
            >
                {stringParts[0]}
                <Text style={UIStyle.Text.tertiaryTitleLight()}>
                    {`${separator}${stringParts[1]} ${this.getTokenSymbol()}`}
                </Text>
            </Text>
        );
    }

    /* eslint-disable-next-line */
    auxBalanceText: ?(React$Component<*> & NativeMethodsMixinType);
    renderAuxBalance() {
        const auxBalance = this.getAuxBalance();
        return (
            <Text
                ref={(component) => { this.auxBalanceText = component; }}
                style={[
                    UIStyle.topScreenContainer,
                    UIStyle.Text.primaryTitleLight(),
                    styles.auxBalance,
                ]}
                onLayout={this.onAuxBalanceLayout}
                numberOfLines={2}
            >
                {`${auxBalance} ${this.getTokenSymbol()}`}
            </Text>
        );
    }

    renderDescription() {
        return (<UILabel
            style={UIStyle.Margin.topSmall()}
            text={this.getDescription()}
            role={UILabel.Role.CaptionTertiary}
        />);
    }

    render() {
        const testID = this.getTestID();
        const testIDProp = testID ? { testID } : null;
        return (
            <View {...testIDProp} >
                {this.renderBalance()}
                {this.renderAuxBalance()}
                {this.renderDescription()}
            </View>
        );
    }
}
