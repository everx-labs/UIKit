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

type ColoredDigit = {
    value: string,
    primary?: boolean,
};

type Props = {
    animated: boolean,
    balance: string,
    separator: string,
    description: string,
    tokenSymbol: string,
    testID?: string,
    cacheKey?: string,
    containerStyle?: ViewStyleProp,
    textStyle?: ViewStyleProp,
    fractionalTextStyle?: ViewStyleProp,
    smartTruncator: boolean,
    loading: boolean,
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

const maxNumberOfZeroes = '0'.repeat(UIConstant.maxDecimalDigits());
const maxBalanceLength = UIConstant.maxDecimalDigits() + 2;

export default class UIBalanceView extends UIComponent<Props, State> {
    static defaultProps = {
        balance: '',
        description: '',
        tokenSymbol: '',
        textStyle: UIStyle.Text.titleLight(),
        fractionalTextStyle: UIStyle.Text.tertiary(),
        smartTruncator: true,
        animated: false,
        loading: false,
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

    // Setters
    async setBalance(balance: string, isCallback: boolean = false) {
        this.updatingBalance = false;
        const balanceWidthValue = this.state.balanceWidth.__getValue();

        const { loading, animated } = this.props;
        if ((balance === this.getNewBalance() || balance === this.getBalance())
                && balanceWidthValue !== 0 && !loading) {
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

        const setWidthAnim = condition => (condition
            ? Animated.timing(this.state.balanceWidth, {
                toValue: balance.length * (this.balanceLineHeight / 2),
                duration: UIConstant.animationSmallDuration(),
            }) : {
                start: (callback) => { callback(); },
            }
        );

        const startWidthAnim = setWidthAnim(balance.length > balanceLen
            || balanceWidthValue === 0);
        // $FlowExpectedError
        startWidthAnim.start(async () => {
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
                const endWidthAnim = setWidthAnim(balance.length < balanceLen);
                endWidthAnim.start(() => {
                    this.animatingBalance = false;
                    this.setCachedBalance(balance);
                    const callback = loading
                        ? () => { this.setBalance(this.getAuxBalance()); }
                        : this.afterAnimationCallback;
                    this.setStateSafely({
                        balance,
                        newBalance: '',
                    }, callback);
                });
            });
        });
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
        return this.state.balance || `0${this.getSeparator()}${maxNumberOfZeroes}`;
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
        const loadingCondition = loading && this.balance !== '0';
        const updatingCondition = (balance !== this.balance && !loading) || force;
        if (!loadingCondition && !updatingCondition) {
            return;
        }
        let floorBalance;
        if (loadingCondition) {
            this.balance = '0';
            floorBalance = `0${separator}${maxNumberOfZeroes}`;
        } else {
            this.balance = balance;
            const formattedBalance = balance.split(separator).length > 1
                ? balance
                : `${balance}${separator}${maxNumberOfZeroes}`;
            const integer = formattedBalance.split(separator)[0];
            floorBalance = integer.length > maxBalanceLength ? integer : formattedBalance;
        }
        this.setAuxBalance(floorBalance, () => { // start component layout and measuring
            this.measureAuxBalanceText();
        });
    }

    // Render
    renderBalance() {
        const balance = this.getBalance();
        const separator = this.getSeparator();
        const stringParts = balance.split(separator);
        const integer = stringParts[0];
        const fractional = stringParts.length > 1
            ? (
                <Text style={this.props.fractionalTextStyle}>
                    {`${separator}${stringParts[1]} ${this.getTokenSymbol()}`}
                </Text>
            )
            : null;
        return (
            <Text
                style={[UIStyle.Text.primary(), this.props.textStyle]}
                onLayout={this.onBalanceLayout}
                numberOfLines={1}
            >
                {integer}{fractional}
            </Text>
        );
    }

    renderDigits(text: string, keyWord: string) {
        const width = this.balanceLineHeight / 2;
        return text.split('').map<*>((sym: string): React$Node => {
            return (
                <View style={{ width }} key={`${keyWord}-digit-${sym}-${Math.random()}`}>
                    <Text>
                        {sym}
                    </Text>
                </View>
            );
        });
    }

    renderAnimatedBalanceContainer() {
        const text = this.getBalance().length > this.getNewBalance().length
            ? this.getBalance()
            : this.getNewBalance();
        return (
            <Text
                style={[this.props.textStyle, styles.auxBalance]}
                onLayout={this.onBalanceLayout}
                numberOfLines={1}
            >
                {this.renderDigits(text, 'container')}
                {` ${this.getTokenSymbol()}`}
            </Text>
        );
    }

    renderAnimatedSymbol(digit: ColoredDigit, newDigit: ColoredDigit, index: number) {
        const {
            fractionalTextStyle, textStyle, loading, animated,
        } = this.props;
        const digitStyle = digit.primary ? null : fractionalTextStyle;
        const newDigitStyle = newDigit.primary ? null : fractionalTextStyle;
        const similar = newDigit.value === digit.value
            && newDigit.primary === digit.primary && !loading;
        const newDigitValue = similar ? '' : newDigit.value || (this.getNewBalance() && ' ') || '';
        const marginTop = this.getMarginTop(index); // 0 or index
        const margin = similar || !animated ? {} : { marginTop };
        return (
            <Animated.View
                key={`${index}-${digit.value}-${Math.random()}`}
                style={{
                    ...margin,
                    width: this.balanceLineHeight / 2,
                }}
            >
                <Text style={[UIStyle.Text.primary(), textStyle, newDigitStyle]}>
                    {newDigitValue}
                </Text>
                <Text style={[UIStyle.Text.primary(), textStyle, digitStyle]}>
                    {digit.value}
                </Text>
            </Animated.View>
        );
    }

    renderAnimatedBalance() {
        if (!this.props.animated) {
            return null;
        }

        const balance = this.getBalance();
        const separator = this.getSeparator();
        const stringParts = balance.split(separator);
        const integer = stringParts[0];
        const fractional = stringParts.length > 1 ? `${separator}${stringParts[1]}` : '';

        const symbols = [];
        let i = 0;
        const newBalance = this.getNewBalance();
        const separatorIndex = newBalance.indexOf(separator);

        const pushSymbols = (digit) => {
            const newDigit = {
                value: newBalance[i],
                primary: separatorIndex === -1 || separatorIndex > i,
            };
            symbols.push(this.renderAnimatedSymbol(digit, newDigit, i));
            i += 1;
        };

        integer.split('').forEach((sym) => {
            const digit = { value: sym, primary: true };
            pushSymbols(digit);
        });
        fractional.split('').forEach((sym) => {
            const digit = { value: sym, primary: false };
            pushSymbols(digit);
        });
        while (i < newBalance.length) {
            const digit = { value: '' };
            pushSymbols(digit);
        }

        return (
            <View style={[UIStyle.Common.positionAbsolute(), UIStyle.Common.flexRow()]}>
                <Animated.View
                    style={[
                        UIStyle.Common.flexRow(),
                        UIStyle.Common.overflowHidden(),
                        { width: this.state.balanceWidth },
                    ]}
                >
                    {symbols}
                </Animated.View>
                <Text style={[this.props.textStyle, this.props.fractionalTextStyle]}>
                    {` ${this.getTokenSymbol()}`}
                </Text>
            </View>
        );
    }

    /* eslint-disable-next-line */
    auxBalanceText: ?(React$Component<*> & NativeMethodsMixinType);
    renderAuxBalance() {
        const auxBalance = this.getAuxBalance();
        const integer = auxBalance.split(this.getSeparator())[0];
        const smartTruncator = this.props.smartTruncator && integer.length < maxBalanceLength;
        const digits = this.props.animated
            ? this.renderDigits(auxBalance, 'aux')
            : auxBalance;
        return (
            <Text
                ref={(component) => { this.auxBalanceText = component; }}
                style={[
                    UIStyle.topScreenContainer,
                    UIStyle.Text.primaryTitleLight(),
                    styles.auxBalance,
                    this.props.textStyle,
                ]}
                onLayout={this.onAuxBalanceLayout}
                numberOfLines={smartTruncator ? 2 : 1}
            >
                {digits}
                {` ${this.getTokenSymbol()}`}
            </Text>
        );
    }

    renderDescription() {
        const description = this.getDescription();
        if (!description) {
            return null;
        }
        return (<UILabel
            style={UIStyle.Margin.topSmall()}
            text={description}
            role={UILabel.Role.CaptionTertiary}
        />);
    }

    render() {
        const testID = this.getTestID();
        const testIDProp = testID ? { testID } : null;
        const visibleBalance = this.props.animated ? (
            <View style={UIStyle.Common.overflowHidden()}>
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
