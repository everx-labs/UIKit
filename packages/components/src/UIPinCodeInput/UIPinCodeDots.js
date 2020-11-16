// @flow
import React from 'react';
import { StyleSheet, Animated, Vibration } from 'react-native';

import { UIConstant, UIColor } from '@tonlabs/uikit.core';

import UIPinCodeDot from './UIPinCodeDot';

const styles = StyleSheet.create({
    animatedView: {
        alignItems: 'center',
        justifyContent: 'center',
        height: UIConstant.bigCellHeight(),
        flexDirection: 'row',
    },
});

type State = { wrongPin: boolean, rightPin: boolean };

export default class UIPinCodeDots extends React.Component<
    {
        length: number,
        values: Array<number>,
    },
    State,
> {
    state = {
        wrongPin: false,
        rightPin: false,
    };

    componentWillUnmount() {
        this.shakeAnimation.stop();
        if (this.resetTimeoutId) {
            clearTimeout(this.resetTimeoutId);
        }
    }

    shakeValue = new Animated.Value(0);
    shakeOffset = this.shakeValue.interpolate({
        inputRange: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
        outputRange: ([0, -10, 10, -10, 10, -10, 0]: $ReadOnlyArray<number>),
    });
    shakeAnimation = Animated.spring(this.shakeValue, {
        toValue: 1,
        useNativeDriver: true,
    });
    resetTimeoutId: ?TimeoutID = null;

    resetState(state: $Shape<State>) {
        // Reset state, to prevent race conditions
        this.setState({ wrongPin: false, rightPin: false, ...state });
        if (this.resetTimeoutId) {
            // If there was some state before, clear it
            clearTimeout(this.resetTimeoutId);
            this.resetTimeoutId = null;
        }
    }

    showWrongPin(): Promise<void> {
        this.resetState({ wrongPin: true });
        Vibration.vibrate(500);

        return new Promise((resolve) => {
            this.shakeAnimation.start(() => {
                this.resetTimeoutId = setTimeout(() => {
                    this.resetState({ wrongPin: false });
                }, UIConstant.animationAccentInteractionDurationFast());
                this.shakeValue.setValue(0);
                resolve();
            });
        });
    }

    showRightPin(): Promise<void> {
        this.resetState({ rightPin: true });

        return new Promise((resolve) => {
            this.resetTimeoutId = setTimeout(() => {
                this.resetState({ rightPin: false });
                resolve();
            }, UIConstant.animationDuration()
                + UIConstant.animationAccentInteractionDurationFast());
        });
    }

    render() {
        const { length, values } = this.props;
        const dots = [];

        for (let i = 0; i < length; i += 1) {
            let dotColor = UIColor.primary();
            if (this.state.wrongPin) {
                dotColor = UIColor.backgroundNegative();
            } else if (this.state.rightPin) {
                dotColor = UIColor.backgroundPositive();
            }

            dots.push(<UIPinCodeDot
                key={i}
                valueDefined={values[i] != null}
                color={dotColor}
            />);
        }

        return (
            <Animated.View
                style={[
                    styles.animatedView,
                    { transform: [{ translateX: this.shakeOffset }] },
                ]}
            >
                {dots}
            </Animated.View>
        );
    }
}
