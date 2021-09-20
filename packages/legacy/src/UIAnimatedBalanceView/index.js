/* eslint-disable react/no-multi-comp */
// @flow
import React from 'react';
import { Platform, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIStyle } from '@tonlabs/uikit.core';

import UIAnimatedBalanceOpacity from './UIAnimatedBalanceOpacity';
import type { Props as InnerProps } from './UIAnimatedBalanceInner';

type Props = InnerProps & {
    containerStyle?: ViewStyleProp,
    testID?: string,
    icon?: React$Node,
};

type State = {
    isAnimationInProgress: boolean,
    balance: $PropertyType<Props, 'balance'>,
    queuedBalance: ?$PropertyType<Props, 'balance'>,
};

export default class UIAnimatedBalanceView extends React.Component<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State) {
        // Take a look at `onAnimationEnd` method, to understand what is going on
        if (state.isAnimationInProgress) {
            return {
                ...state,
                queuedBalance: props.balance,
            };
        }

        return {
            ...state,
            balance: props.balance,
        };
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            isAnimationInProgress: false,
            balance: props.balance,
            queuedBalance: null,
        };
    }

    onAnimationStart: () => void = () => {
        this.setState({
            isAnimationInProgress: true,
        });
    };

    onAnimationEnd: () => void = () => {
        const newState = {};
        // To prevent updates of balance during animation, we not pass balance with props
        // but rather keep it in state, and if a new update come when animation is still going,
        // we store new value to a `queuedBalance` variable
        // Then when animation ends we just get it (if it present)
        // and set to the state instead of old one
        newState.isAnimationInProgress = false;

        if (this.state.queuedBalance) {
            newState.balance = this.state.queuedBalance;
            newState.queuedBalance = null;
        }

        this.setState(newState);
    };

    onPress: () => void = () => {
        if (this.props.onPress) {
            this.props.onPress();
        }
    };

    render(): React$Element<any> {
        const { testID, icon, containerStyle, ...rest } = this.props;

        // Add margin as space between value and symbol sometimes is too small
        const iconStyle =
            Platform.OS === 'web' ? UIStyle.margin.leftTiny() : UIStyle.margin.leftSmall();

        return (
            <View
                pointerEvents="none"
                style={[UIStyle.common.flexRow(), UIStyle.common.alignCenter(), containerStyle]}
                testID={testID}
            >
                <UIAnimatedBalanceOpacity
                    {...rest}
                    balance={this.state.balance}
                    onAnimationStart={this.onAnimationStart}
                    onAnimationEnd={this.onAnimationEnd}
                />
                {icon != null ? <View style={iconStyle}>{icon}</View> : null}
            </View>
        );
    }
}
