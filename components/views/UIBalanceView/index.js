// @flow
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { NativeMethodsMixinType } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';
import UILabel from '../../text/UILabel';

type BalanceWithSign = {
    balance: string,
    sign: string,
};

type Props = {
    animated: boolean,
    balance: string,
    separator: string,
    description: string,
    additionalDescription: string,
    additionalEnabled: boolean,
    tokenSymbol: string,
    testID?: string,
    cacheKey?: string,
    containerStyle?: ViewStyleProp,
    textStyle?: ViewStyleProp,
    fractionalTextStyle?: ViewStyleProp,
    smartTruncator: boolean,
    loading: boolean,
    maxFractionalDigits: number,
};

type State = {
    balance: string,
    auxBalance: string,
    newBalance: string,
    balanceWidth: AnimatedValue,
    marginTops: AnimatedValue[],
};

const styles = StyleSheet.create({
    auxBalance: {
        opacity: 0,
        zIndex: -1,
    },
});

const cachedBalance = {};

const maxBalanceLength = UIConstant.maxDecimalDigits() + 2;

export default class UIBalanceView extends UIComponent<Props, State> {
    static defaultProps = {
        balance: '',
        description: '',
        additionalDescription: '',
        additionalEnabled: true,
        tokenSymbol: '',
        textStyle: UIStyle.text.titleLight(),
        fractionalTextStyle: UIStyle.text.tertiary(),
        smartTruncator: true,
        animated: false,
        loading: false,
        maxFractionalDigits: UIConstant.maxDecimalDigits(),
    };

    // constructor
    balance: ?string;
    balanceLineHeight: number;
    updatingBalance: boolean;
    animatingBalance: boolean;
    afterAnimationCallback: () => void;

    constructor(props: Props) {
        super(props);

        this.state = {
            balance: this.getCachedBalance(),
            newBalance: '', // new value for digits animation
            marginTops: [],
            balanceWidth: new Animated.Value(0),
            auxBalance: '', // hidden balance for investigate, how long string can be
        };

        this.balance = null;
        this.balanceLineHeight = 0;
        this.updatingBalance = false;
        this.animatingBalance = false;
        this.afterAnimationCallback = () => {};
        // this.newBalanceSymbolsWidth = 0;
        // this.oldBalanceSymbolsWidth = 0;
    }

    componentDidMount() {
        super.componentDidMount();
        this.updateBalance();
    }

    componentDidUpdate() {
        this.updateBalance();
    }

    // Events
    onBalanceLayout = (e: any) => {
        const { height } = e.nativeEvent.layout;
        this.balanceLineHeight = height;
    };

    onAuxBalanceLayout = () => {
        if (this.updatingBalance) {
            return;
        }
        this.updatingBalance = true;
        this.updateBalance(true); // force
    };

    // onNewBalanceSymbolsLayout = (e) => {
    //     const { width } = e.nativeEvent.layout;
    //     this.setStateSafely({ newBalanceSymbolsWidth: width });
    // };
    //
    // onOldBalanceSymbolsLayout = (e) => {
    //     const { width } = e.nativeEvent.layout;
    //     this.setStateSafely({ oldBalanceSymbolsWidth: width });
    // };

    // Setters
    async setBalance(balance: string, isCallback: boolean = false) {
        this.updatingBalance = false;
        // const balanceWidthValue = this.state.balanceWidth.__getValue();

        const { loading, animated } = this.props;
        if ((balance === this.getNewBalance() || balance === this.getBalance())
                && !loading) { // && balanceWidthValue !== 0
            return;
        }
        if (!animated && !loading) {
            this.setCachedBalance(balance);
            this.setStateSafely({ balance, newBalance: '' });
            return;
        }

        if (isCallback) {
            this.afterAnimationCallback = () => {};
        }

        const { length: balanceLen } = this.getBalance();

        if (this.animatingBalance) {
            this.afterAnimationCallback = () => { this.setBalance(balance, true); };
            return;
        }
        this.animatingBalance = true;

        // const integer = balance.split(this.getSeparator())[0];
        // const setWidthAnim = condition => (condition
        //     ? Animated.timing(this.state.balanceWidth, {
        //         toValue: integer.length * (this.getSymbolWidth()),
        //         duration: UIConstant.animationSmallDuration(),
        //     }) : {
        //         start: (callback) => { callback(); },
        //     }
        // );
        // const startWidthAnim = setWidthAnim(balance.length > balanceLen || balanceWidthValue === 0);
        // $FlowExpectedError
        // startWidthAnim.start(

        (async () => {
            await this.setNewBalance(balance);
            const len = Math.max(this.getNewBalance().length, balanceLen);

            const marginTops = [];
            for (let i = 0; i < len; i += 1) {
                marginTops.push(new Animated.Value(-this.balanceLineHeight));
            }
            await this.setMarginTops(marginTops);

            const animations = [];
            for (let i = 0; i < len; i += 1) {
                const anim = Animated.timing(this.getMarginTop(i), {
                    toValue: 0,
                    duration: UIConstant.animationDuration(),
                    delay: i * (UIConstant.animationDuration() / 5),
                });
                animations.push(anim);
            }
            Animated.parallel(animations).start(() => {
                // const endWidthAnim = setWidthAnim(balance.length < balanceLen);
                // endWidthAnim.start(() => {

                this.animatingBalance = false;
                this.setCachedBalance(balance);
                const callback = loading
                    ? () => {
                        setTimeout(() => {
                            this.setBalance(this.getAuxBalance());
                        }, 250);
                    } : this.afterAnimationCallback;
                this.setStateSafely({
                    marginTops: [],
                    balance,
                    newBalance: '',
                }, callback);

                // });
            });
        })();
    }

    setNewBalance(newBalance: string) {
        return new Promise<void>((resolve) => {
            this.setStateSafely({ newBalance }, () => {
                resolve();
            });
        });
    }

    setMarginTops(marginTops: AnimatedValue[]) {
        return new Promise<void>((resolve) => {
            this.setStateSafely({ marginTops }, () => {
                resolve();
            });
        });
    }

    setAuxBalance(auxBalance: string, callback?: () => void) {
        this.setStateSafely({ auxBalance }, callback);
    }

    // Getters
    getSeparator(): string {
        return this.props.separator || '.';
    }

    getBalance(): string {
        return this.state.balance || `0${this.getSeparator()}${this.getZeroes()}`;
    }

    getNewBalance() {
        return this.state.newBalance || '';
    }

    getMarginTop(index: number) {
        return this.state.marginTops[index];
    }

    getAuxBalance(): string {
        return this.state.auxBalance || this.getBalance();
    }

    getDescription(): string {
        return this.props.description || '';
    }

    getAdditionalDescription(): string {
        return this.props.additionalDescription || '';
    }

    getAdditionalEnabled(): boolean {
        return this.props.additionalEnabled;
    }

    getTokenSymbol(): string {
        return this.props.tokenSymbol || '';
    }

    getTestID(): ?string {
        return this.props.testID;
    }

    getCacheKey(): ?string {
        return this.props.cacheKey;
    }

    getCachedBalance(): string {
        const key = this.getCacheKey();
        return (key && cachedBalance[key]) || '';
    }

    getPreSymbols() {
        const balance = this.getBalance();
        const balanceWithSign: BalanceWithSign = this.formBalanceWithSign(balance);
        return `${balanceWithSign.sign ? `${balanceWithSign.sign} ` : ''}${this.getTokenSymbol()} `;
    }

    getZeroes() {
        return '0'.repeat(this.props.maxFractionalDigits);
    }

    // Processing
    processAuxBalanceHeight(height: number, auxBalance: string) {
        if (this.balanceLineHeight < height) { // make sure we fit the balance into one line
            const truncatedAuxBalance = auxBalance.slice(0, -1); // reduce balance size
            this.setAuxBalance(truncatedAuxBalance, () => {
                this.measureAuxBalanceText();
            });
        } else {
            this.setBalance(auxBalance);
        }
    }

    // Actions
    measuringBalance: ?string;
    measureAuxBalanceText() {
        setTimeout(() => {
            this.measuringBalance = this.getAuxBalance();
            if (!this.auxBalanceText) {
                return;
            }
            this.auxBalanceText.measure((relX, relY, w, h) => {
                if (this.measuringBalance && this.measuringBalance === this.getAuxBalance()) {
                    this.processAuxBalanceHeight(h, this.measuringBalance);
                }
            });
        }, 0);
    }

    setCachedBalance(balance: string) {
        const key = this.getCacheKey();
        if (key) {
            cachedBalance[key] = balance;
        }
    }

    updateBalance(force: boolean = false) {
        const { balance, separator, loading } = this.props;
        const loadingCondition = loading && this.balance !== '0' && balance;
        const updatingCondition = (balance !== this.balance && !loading) || force;
        if (!loadingCondition && !updatingCondition) {
            return;
        }
        let floorBalance;
        if (loadingCondition) {
            this.balance = '0';
            floorBalance = `0${separator}${this.getZeroes()}`;
        } else {
            this.balance = balance;
            const formattedBalance = balance.split(separator).length > 1
                ? balance
                : `${balance}${separator}${this.getZeroes()}`;
            const integer = formattedBalance.split(separator)[0];
            floorBalance = integer.length > maxBalanceLength ? integer : formattedBalance;
        }
        this.setAuxBalance(floorBalance, () => { // start component layout and measuring
            this.measureAuxBalanceText();
        });
    }

    formBalanceWithSign(balance: string): BalanceWithSign {
        // here "-" signs have different codes, so we should check & replace both of them
        if (balance.includes('−') || balance.includes('-')) {
            return {
                balance: balance.replace('−', '').replace('-', '').trim(),
                sign: '−',
            };
        } else if (balance.includes('+')) {
            return {
                balance: balance.replace('+', '').trim(),
                sign: '+',
            };
        }
        return {
            balance,
            sign: '',
        };
    }

    // Render
    renderBalance() {
        const balance = this.getBalance();
        const balanceWithSign: BalanceWithSign = this.formBalanceWithSign(balance);
        const separator = this.getSeparator();
        const stringParts = balanceWithSign.balance.split(separator);
        const integer = `${balanceWithSign.sign ? `${balanceWithSign.sign} ` : ''}${this.getTokenSymbol()} ${stringParts[0]}`;
        const fractional = stringParts.length > 1
            ? (
                <Text style={this.props.fractionalTextStyle}>
                    {`${separator}${stringParts[1]}`}
                </Text>
            ) : null;
        return (
            <Text
                style={[UIStyle.text.primary(), this.props.textStyle]}
                onLayout={this.onBalanceLayout}
                numberOfLines={1}
            >
                {integer}{fractional}
            </Text>
        );
    }

    renderAnimatedBalanceContainer() {
        const balance = this.getBalance().length > this.getNewBalance().length
            ? this.getBalance()
            : this.getNewBalance();
        return (
            <Text
                style={[
                    UIStyle.text.primaryTitleLight(),
                    styles.auxBalance,
                    this.props.textStyle,
                ]}
                onLayout={this.onBalanceLayout}
                numberOfLines={1}
            >
                {this.getPreSymbols()}
                {balance}
            </Text>
        );
    }

    renderAnimatedSymbol(digit: string, primary: boolean, newDigit: boolean, index: number) {
        const { fractionalTextStyle, textStyle } = this.props;
        const digitStyle = primary ? null : fractionalTextStyle;
        const shift = newDigit ? 0 : this.balanceLineHeight;
        const marginTop = this.getMarginTop(index) ? this.getMarginTop(index).interpolate({
            inputRange: [-this.balanceLineHeight, 0],
            outputRange: [-this.balanceLineHeight + shift, shift],
        }) : 0;
        return (
            <Animated.View
                key={`${index}-${digit}-${Math.random()}`}
                style={{ marginTop }}
            >
                <Text style={[UIStyle.text.primary(), textStyle, digitStyle]}>
                    {digit}
                </Text>
            </Animated.View>
        );
    }

    renderAnimatedBalance() {
        if (!this.props.animated) {
            return null;
        }
        const separator = this.getSeparator();

        let i = 0;
        const oldSymbols = [];
        const balance = this.getBalance();
        const stringParts = balance.split(separator);
        const integer = stringParts[0];
        const fractional = stringParts.length > 1 ? `${separator}${stringParts[1]}` : '';

        const pushSymbols = (digit, primary, newDigit, symbols) => {
            symbols.push(this.renderAnimatedSymbol(digit, primary, newDigit, i));
            i += 1;
        };

        integer.split('').forEach((sym) => {
            pushSymbols(sym, true, false, oldSymbols);
        });
        fractional.split('').forEach((sym) => {
            pushSymbols(sym, false, false, oldSymbols);
        });

        i = 0;
        const newSymbols = [];
        const newBalance = this.getNewBalance();
        const newStringParts = newBalance.split(separator);
        const newInteger = newStringParts[0];
        const newFractional = newStringParts.length > 1 ? `${separator}${newStringParts[1]}` : '';

        newInteger.split('').forEach((sym) => {
            pushSymbols(sym, true, true, newSymbols);
        });
        newFractional.split('').forEach((sym) => {
            pushSymbols(sym, false, true, newSymbols);
        });

        return (
            <View style={[UIStyle.common.positionAbsolute(), UIStyle.common.flexRow()]}>
                <Text
                    style={[UIStyle.text.primary(), this.props.textStyle]}
                    numberOfLines={1}
                >
                    {this.getPreSymbols()}
                </Text>
                <View style={[UIStyle.common.flexRow()]}>
                    {oldSymbols}
                    <View style={[UIStyle.common.positionAbsolute(), UIStyle.common.flexRow()]}>
                        {newSymbols}
                    </View>
                </View>
            </View>
        );

        // <View
        //     style={[...newSymbolsStyle, styles.auxBalance]}
        //     onLayout={this.onNewBalanceSymbolsLayout}
        // >
        //     {newSymbols}
        // </View>,
        //     <View
        //         style={[...newSymbolsStyle, styles.auxBalance]}
        //         onLayout={this.onOldBalanceSymbolsLayout}
        //     >
        //         {oldSymbols}
        //     </View>,
    }

    /* eslint-disable-next-line */
    auxBalanceText: ?(React$Component<*> & NativeMethodsMixinType);
    renderAuxBalance() {
        const auxBalance = this.getAuxBalance();
        const integer = auxBalance.split(this.getSeparator())[0];
        const smartTruncator = this.props.smartTruncator && integer.length < maxBalanceLength;
        return (
            <Text
                testID="renderAuxBalance"
                ref={(component) => { this.auxBalanceText = component; }}
                style={[
                    UIStyle.container.topScreen(),
                    UIStyle.text.primaryTitleLight(),
                    styles.auxBalance,
                    this.props.textStyle,
                ]}
                onLayout={this.onAuxBalanceLayout}
                numberOfLines={smartTruncator ? 2 : 1}
            >
                {this.getPreSymbols()}{auxBalance}
            </Text>
        );
    }

    renderDescription() {
        const description = this.getDescription();
        const additionalDescription = this.getAdditionalDescription();
        const additionalEnabled = this.getAdditionalEnabled();
        if (!description) {
            return null;
        }
        return (
            <View style={UIStyle.common.flexRow()}>
                <UILabel
                    style={UIStyle.margin.topSmall()}
                    text={description}
                    role={UILabel.Role.CaptionTertiary}
                />
                {
                    additionalDescription ? (
                        <UILabel
                            style={[UIStyle.margin.topSmall(), UIStyle.margin.leftNormal()]}
                            text={additionalDescription}
                            role={
                                additionalEnabled
                                    ? UILabel.Role.CaptionTertiary
                                    : UILabel.Role.CaptionError
                            }
                        />
                    ) : null
                }
            </View>
        );
    }

    render() {
        const testID = this.getTestID();
        const testIDProp = testID ? { testID } : null;
        const visibleBalance = this.props.animated ? (
            <View style={UIStyle.common.overflowHidden()}>
                {this.renderAnimatedBalanceContainer()}
                {this.renderAnimatedBalance()}
            </View>
        ) : this.renderBalance();
        return (
            <View {...testIDProp} style={this.props.containerStyle}>
                {visibleBalance}
                {this.renderAuxBalance()}
                {this.renderDescription()}
            </View>
        );
    }
}
