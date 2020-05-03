// @flow
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type AnimatedInterpolation from 'react-native/Libraries/Animated/src/nodes/AnimatedInterpolation';
import type { ViewStyleProp, TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';

export type Props = {
    balance: string,
    separator?: string,
    loading?: boolean,
    textStyle?: ViewStyleProp,
    fractionalTextStyle?: ViewStyleProp,
    maxFractionalDigits?: ?number,
    maxBalanceLength?: ?number,
};

const BalanceSymbolKind = Object.freeze({
    integer: 'integer',
    fractional: 'fractional',
});
type BalanceSymbol = {
    kind: $Values<typeof BalanceSymbolKind>,
    value: string,
};

const styles = StyleSheet.create({
    container: { overflow: 'hidden', position: 'relative' },
    mainText: {
        letterSpacing: 0,
        color: 'transparent',
    },
});

const UIAnimatedBalanceSymbol = React.memo(
    ({
        animation,
        textStyle,
        fractionalTextStyle,
        children,
    }: {
        animation: AnimatedValue | AnimatedInterpolation,
        textStyle: TextStyleProp,
        fractionalTextStyle: TextStyleProp,
        children: BalanceSymbol,
    }) => (
        <Animated.Text
            style={[
                UIStyle.text.primary(),
                UIStyle.text.titleLight(),
                textStyle,
                children.kind === BalanceSymbolKind.integer
                    ? null
                    : fractionalTextStyle,
                {
                    letterSpacing: 0,
                    transform: [
                        {
                            translateY: animation,
                        },
                    ],
                },
            ]}
        >
            {children.value}
        </Animated.Text>
    ),
    (prev, next) => prev.children === next.children,
);

type InnerProps = {
    onAnimationStart: () => void,
    onAnimationEnd: () => void,
};
type InnerState = {
    prevBalance: BalanceSymbol[],
    nextBalance: BalanceSymbol[],
    queuedBalance: ?(BalanceSymbol[]),
    animationInProgress: boolean,
};

export default class UIAnimatedBalanceInner extends React.Component<
    Props & InnerProps,
    InnerState,
> {
    static defaultProps = {
        separator: '.',
        loading: false,
        textStyle: UIStyle.text.titleLight(),
        fractionalTextStyle: UIStyle.text.tertiary(),
        maxFractionalDigits: null,
        maxBalanceLength: null,
    };

    static processBalanceString(props: Props): BalanceSymbol[] {
        let separatorIndex = 0;

        // eslint-disable-next-line arrow-parens
        return props.balance.split('').reduce((acc, symbol, index) => {
            if (
                props.maxBalanceLength &&
                // i > len + s - 1, where:
                // - len is a passed in props,
                // - s is either 1 or 0 for separator if it's presented
                // - -1 is a constant to align index, as array indexes is started from 0, not 1
                index > props.maxBalanceLength + (separatorIndex ? 1 : 0) - 1
            ) {
                return acc;
            }

            if (
                props.maxFractionalDigits &&
                separatorIndex &&
                // i > (sep + 1) + fraction-len - 1, where:
                // - sep is a separator position, need to be aligned
                // - fraction-len is passed in props,
                // - -1 is a constant to align index, as array indexes is started from 0, not 1
                index > separatorIndex + 1 + props.maxFractionalDigits - 1
            ) {
                return acc;
            }

            if (symbol === props.separator) {
                separatorIndex = index;
            }

            acc.push({
                kind: separatorIndex ? BalanceSymbolKind.fractional : BalanceSymbolKind.integer,
                value: symbol,
            });

            return acc;
        }, []);
    }

    static getDerivedStateFromProps(props: Props, state: InnerState) {
        return {
            prevBalance: state.nextBalance,
            nextBalance: UIAnimatedBalanceInner.processBalanceString(props),
        };
    }

    constructor(props: Props & InnerProps) {
        super(props);

        this.state = {};
    }

    shouldComponentUpdate(newProps: Props) {
        return this.props.balance !== newProps.balance;
    }

    componentDidUpdate() {
        this.props.onAnimationStart();
        Animated.parallel(
            // eslint-disable-next-line arrow-parens
            Object.keys(this.animationsPool).map(indexKey => {
                const index = +indexKey;
                const animation = this.animationsPool[index];
                animation.setValue(0);

                return Animated.timing(animation, {
                    toValue: 1,
                    duration: UIConstant.animationDuration(),
                    delay: index * (UIConstant.animationDuration() / 5),
                    useNativeDriver: true,
                });
            }),
        ).start(() => {
            this.props.onAnimationEnd();
        });
    }

    onBalanceLayout = (e: any) => {
        const { height } = e.nativeEvent.layout;
        this.balanceLineHeight = height;
    };

    getAnimation(index: number) {
        if (this.animationsPool[index] == null) {
            this.animationsPool[index] = new Animated.Value(0);
        }

        return this.animationsPool[index];
    }

    animationsPool: { [number]: Animated.Value } = {};
    balanceLineHeight: number = 0;

    render() {
        return (
            <View style={styles.container}>
                <Text
                    style={[
                        UIStyle.text.primary(),
                        UIStyle.text.titleLight(),
                        this.props.textStyle,
                        styles.mainText,
                    ]}
                >
                    {this.props.balance}
                </Text>
                <View
                    style={[UIStyle.common.positionAbsolute(), UIStyle.common.flexRow()]}
                    onLayout={this.onBalanceLayout}
                >
                    {this.state.nextBalance.map((symbol, index) => (
                        <UIAnimatedBalanceSymbol
                            key={`next-${index}`}
                            animation={this.getAnimation(index).interpolate({
                                inputRange: [0, 1],
                                outputRange: [-this.balanceLineHeight, 0],
                            })}
                            textStyle={this.props.textStyle}
                            fractionalTextStyle={this.props.fractionalTextStyle}
                        >
                            {symbol}
                        </UIAnimatedBalanceSymbol>
                    ))}
                </View>
                {this.state.prevBalance && (
                    <View style={[UIStyle.common.positionAbsolute(), UIStyle.common.flexRow()]}>
                        {this.state.prevBalance.map((symbol, index) => (
                            <UIAnimatedBalanceSymbol
                                key={`prev-${index}`}
                                animation={this.getAnimation(index).interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, this.balanceLineHeight],
                                })}
                                textStyle={this.props.textStyle}
                                fractionalTextStyle={this.props.fractionalTextStyle}
                            >
                                {symbol}
                            </UIAnimatedBalanceSymbol>
                        ))}
                    </View>
                )}
            </View>
        );
    }
}
