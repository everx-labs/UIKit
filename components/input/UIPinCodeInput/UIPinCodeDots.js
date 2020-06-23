// @flow
import React from 'react';
import { StyleSheet, Animated, Vibration } from 'react-native';

import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';

import UIPinCodeDot from './UIPinCodeDot';

const styles = StyleSheet.create({
    animatedView: {
        alignItems: 'center',
        justifyContent: 'center',
        height: UIConstant.mediumCellHeight(),
        flexDirection: 'row',
    },
});

export default class UIPinCodeDots extends React.Component<
    {
        length: number,
        values: Array<number>,
    },
    { wrongPin: boolean, rightPin: boolean },
> {
    state = {
        wrongPin: false,
        rightPin: false,
    };

    shakeValue = new Animated.Value(0);
    shakeOffset = this.shakeValue.interpolate({
        inputRange: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
        outputRange: [0, -10, 10, -10, 10, -10, 0],
    });
    shakeAnimation = Animated.spring(this.shakeValue, {
        toValue: 1,
        useNativeDriver: true,
    });

    showWrongPin(): Promise<void> {
        this.setState({ wrongPin: true });
        Vibration.vibrate(500);

        return new Promise((resolve) => {
            this.shakeAnimation.start(() => {
                setTimeout(() => {
                    this.setState({ wrongPin: false });
                }, UIConstant.animationAccentInteractionDurationFast());
                this.shakeValue.setValue(0);
                resolve();
            });
        });
    }

    showRightPin(): Promise<void> {
        this.setState({ rightPin: true });

        return new Promise((resolve) => {
            setTimeout(() => {
                this.setState({ rightPin: false });
                resolve();
            }, UIConstant.animationDuration() + UIConstant.animationAccentInteractionDurationFast());
        });
    }

    render() {
        const { length, values } = this.props;
        const dots = [];

        for (let i = 0; i < length; i += 1) {
            let dotColor = UIColor.primary();
            if (this.state.wrongPin) {
                dotColor = UIColor.error();
            } else if (this.state.rightPin) {
                dotColor = UIColor.success();
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
