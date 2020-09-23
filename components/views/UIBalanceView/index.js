// @flow
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

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
    maxBalanceLength: number,
    useMaxBalanceLength: boolean,
    icon?: React$Node,
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
        useMaxBalanceLength: true,
        maxBalanceLength: UIConstant.maxDecimalDigits() + 4, // +1 number, sep, +2 decimal grouping
        icon: null,
    };

    static testIds = {
        auxBalance: 'renderAuxBalance',
    };

    // constructor
    balance: ?string;
    balanceLineHeight: number;
    updatingBalance: boolean;
    animatingBalance: boolean;
    afterAnimationCallback: () => void;
    loading: boolean;

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
        this.loading = false;

        // this.newBalanceSymbolsWidth = 0;
        // this.oldBalanceSymbolsWidth = 0;
    }

    componentDidMount() {
        super.componentDidMount();
        this.updateBalance();
    }

    componentDidUpdate(prevProps: Props) {
        const force = (prevProps.loading !== this.props.loading && this.props.balance === '0')
            || prevProps.balance !== this.props.balance;
        if (force) {
            this.updateBalance(true);
        }
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
        // balance is the same, no ned to re-render!
        const needRerender = this.props.cacheKey
            ? this.getBalance() === this.getCachedBalance()
            : true;

        if (needRerender && balance === this.getCachedBalance()) {
            return;
        }

        if (!this.props.animated) {
            this.setCachedBalance(balance);
            this.setStateSafely({ balance, newBalance: '' });
            return;
        }

        // we need this in order to always have actual value in this.loading;
        this.loading = this.props.loading;

        // const balanceWidthValue = this.state.balanceWidth.__getValue();
        if (balance === this.getNewBalance() && !this.loading) { // && balanceWidthValue !== 0
            return;
        }

        const { length: balanceLen } = this.getBalance();
        // if some animation is already in progress, we add new animation as callback and return
        if (this.animatingBalance) {
            this.afterAnimationCallback = () => {
                setTimeout(() => {
                    this.setBalance(balance, true);
                }, UIConstant.animationDuration());
            };
            return;
        }

        // if this call is a callback, then no need to repeat it more
        if (isCallback) {
            this.afterAnimationCallback = () => {};
        }

        // start animation
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
        // const startWidthAnim
        //    = setWidthAnim(balance.length > balanceLen || balanceWidthValue === 0);
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
                // TODO: see if we can use `useNativeDriver` here!
                const anim = Animated.timing(this.getMarginTop(i), {
                    toValue: 0,
                    duration: UIConstant.animationDuration(),
                    delay: i * (UIConstant.animationDuration() / 5),
                    useNativeDriver: false,
                });
                animations.push(anim);
            }
            Animated.parallel(animations).start(() => {
                // const endWidthAnim = setWidthAnim(balance.length < balanceLen);
                // endWidthAnim.start(() => {

                this.animatingBalance = false;
                this.setCachedBalance(balance);
                // here we check this.loading, cause this.props.loading may obsolete at this moment
                const callback = this.loading
                    ? () => {
                        setTimeout(() => {
                            this.setBalance(this.getAuxBalance());
                        }, UIConstant.animationDuration());
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
        return this.state.balance || `0${this.getSeparatorAndZeroes()}`;
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

    getSeparatorAndZeroes() {
        const { maxFractionalDigits, separator } = this.props;
        const zeroes = '0'.repeat(maxFractionalDigits).match(/.{1,3}/g)?.join('\u2009') || '';
        return `${maxFractionalDigits ? separator : ''}${zeroes}`;
    }

    // Processing
    processAuxBalanceHeight(height: number, auxBalance: string) {
        if (this.balanceLineHeight < height) { // make sure we fit the balance into one line
            const truncatedAuxBalance = auxBalance.slice(0, -1); // reduce balance size
            this.setAuxBalance(truncatedAuxBalance, () => {
                this.measureAuxBalanceText();
            });
        } else {
            this.updatingBalance = false;
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
        const {
            balance, separator, loading, useMaxBalanceLength, maxBalanceLength,
        } = this.props;
        const loadingCondition = loading && this.balance !== '0';
        const updatingCondition = (balance !== this.balance && !loading) || force;
        if (!loadingCondition && !updatingCondition) {
            return;
        }
        let floorBalance;
        if (loadingCondition) {
            this.balance = '0';
            floorBalance = `0${this.getSeparatorAndZeroes()}`;
        } else {
            this.balance = balance;
            const stringParts = `${balance}`.split(separator);
            const formattedBalance = stringParts.length > 1
                ? `${stringParts[0]}${separator}${stringParts[1].substring(0, this.props.maxFractionalDigits + Math.max(0, Math.ceil(this.props.maxFractionalDigits / 3) - 1))}`
                : `${balance}${this.getSeparatorAndZeroes()}`;
            const integer = formattedBalance.split(separator)[0];
            floorBalance = useMaxBalanceLength && integer.length >= maxBalanceLength
                ? integer
                : formattedBalance;
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
            outputRange: ([-this.balanceLineHeight + shift, shift]: $ReadOnlyArray<number>),
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

    renderIcon() {
        const { icon } = this.props;
        if (!icon) {
            return null;
        }
        return (
            <View style={UIStyle.common.alignJustifyCenter()}>
                {icon}
            </View>
        );
    }

    /* eslint-disable-next-line */
    auxBalanceText: ?React$ElementRef<*>;
    renderAuxBalance() {
        const auxBalance = this.getAuxBalance();
        const integer = auxBalance.split(this.getSeparator())[0];
        const smartTruncator = this.props.smartTruncator
            && (integer.length < this.props.maxBalanceLength || !this.props.useMaxBalanceLength);
        return (
            <Text
                testID={UIBalanceView.testIds.auxBalance}
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
                                    ? UILabel.Role.CaptionSuccess
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
        const visibleBalance = this.props.animated
            ? (
                <View style={[UIStyle.common.flexRow(), UIStyle.common.overflowHidden()]}>
                    {this.renderAnimatedBalanceContainer()}
                    {this.renderAnimatedBalance()}
                    {this.renderIcon()}
                </View>
            )
            : (
                <View style={UIStyle.common.flexRow()}>
                    {this.renderBalance()}
                    {this.renderIcon()}
                </View>
            );
        return (
            <View {...testIDProp} style={this.props.containerStyle}>
                {visibleBalance}
                {this.renderAuxBalance()}
                {this.renderDescription()}
            </View>
        );
    }
}
