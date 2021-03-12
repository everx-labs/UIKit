// @flow
import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import {
    ColorVariants,
    UIBackgroundView,
    UIBackgroundViewColors,
} from '@tonlabs/uikit.hydrogen';

const dotSize = UIConstant.tinyCellHeight();

const styles = StyleSheet.create({
    dot: {
        width: dotSize / 2,
        height: dotSize / 2,
        borderRadius: dotSize / 4,
    },
    dotView: {
        width:
            UIConstant.smallContentOffset() +
            dotSize +
            UIConstant.smallContentOffset(),
        height:
            UIConstant.smallContentOffset() +
            dotSize +
            UIConstant.smallContentOffset(),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: UIConstant.smallContentOffset(),
    },
});

type UIPinCodeDotProps = { valueDefined: boolean, color: ColorVariants };
type UIPinCodeDotState = {
    show: boolean,
    hide: boolean,
    savedIsValueDefined: boolean,
};

const AnimatedWithColor = Animated.createAnimatedComponent(UIBackgroundView);

export default class UIPinCodeDot extends React.Component<
    UIPinCodeDotProps,
    UIPinCodeDotState,
> {
    static getDerivedStateFromProps(
        props: UIPinCodeDotProps,
        state: UIPinCodeDotState,
    ) {
        return {
            hide: state.savedIsValueDefined && !props.valueDefined,
            show: !state.savedIsValueDefined && props.valueDefined,
            savedIsValueDefined: props.valueDefined,
        };
    }

    state = {
        show: false,
        hide: false,
        savedIsValueDefined: false,
    };

    componentDidUpdate() {
        if (this.state.show) {
            this.animationShow.start();
            return;
        }
        if (this.state.hide) {
            this.animationHide.start();
        }
    }

    animation = new Animated.Value(0);

    animationShow = Animated.spring(this.animation, {
        toValue: 1,
        useNativeDriver: true,
    });
    animationHide = Animated.spring(this.animation, {
        toValue: 0,
        useNativeDriver: true,
    });

    invertedAnimation = this.animation.interpolate({
        inputRange: [0, 1],
        outputRange: ([1, 0]: $ReadOnlyArray<number>),
    });
    scaleAnimation = this.animation.interpolate({
        inputRange: [0, 1],
        outputRange: ([1, 2]: $ReadOnlyArray<number>),
    });

    render() {
        return (
            <View style={styles.dotView}>
                <AnimatedWithColor
                    color={UIBackgroundViewColors.BackgroundNeutral}
                    style={[
                        UIStyle.common.positionAbsolute(),
                        styles.dot,
                        {
                            opacity: this.invertedAnimation,
                            transform: [{ scale: this.scaleAnimation }],
                        },
                    ]}
                />
                <AnimatedWithColor
                    color={this.props.color}
                    style={[
                        styles.dot,
                        {
                            opacity: this.animation,
                            transform: [{ scale: this.scaleAnimation }],
                        },
                    ]}
                />
            </View>
        );
    }
}
