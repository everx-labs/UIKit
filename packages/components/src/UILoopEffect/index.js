// @flow
import React from 'react';
import { Animated, Easing, Platform } from 'react-native';
import type { CompositeAnimation } from 'react-native/Libraries/Animated/src/AnimatedImplementation';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIComponent from '../UIComponent';

const spinInterpolateValues = {
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
};

const roundInterpolateValues = {
    inputRange: [0, 0.08, 0.32, 0.4, 0.64, 0.72, 0.96, 1],
    outputRange: ['0deg', '60deg', '80deg', '180deg', '200deg', '300deg', '320deg', '360deg'],
};

// similar to heartbeat
const scaleInterpolateValues = {
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: [1, 0.9, 1.1, 1],
};

const forwardInterpolateValues = {
    inputRange: [0, 0.5, 1],
    outputRange: [0, 8, 0],
};

const sandglassInterpolateValues = {
    x: {
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [1, 0, 1, 0, 1],
    },
    y: {
        inputRange: [0, 0.25, 0.25, 0.75, 0.75, 1],
        outputRange: [1, 1, -1, -1, 1, 1],
    },
};

type Props = {
    children?: React$Node,
    style?: ViewStyleProp,
    animation?: string,
    animated?: boolean,
};

type State = {};

export default class UILoopEffect extends UIComponent<Props, State> {
    static Animation = {
        Spin: 'spin',
        Round: 'round',
        Sandglass: 'sandglass',
        Pulse: 'pulse',
        Forward: 'forward',
    };

    static defaultProps: Props = {
        animation: UILoopEffect.Animation.Spin,
        animated: true,
    };

    animation: CompositeAnimation;
    value: number = 0;

    constructor(props: Props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.animatedValue.addListener(({ value }) => {
            this.value = value;
        });

        this.animation = Animated.loop(this.getAnimation());
    }

    componentDidMount() {
        super.componentDidMount();

        if (this.props.animated) {
            this.animation.start();
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.animation !== this.props.animation) {
            this.animation = Animated.loop(this.getAnimation());
        }

        if (prevProps.animated !== this.props.animated) {
            if (this.props.animated) {
                this.reset();
                this.animation.start();
            } else {
                this.animation.stop();
                this.getAnimation().start(this.reset);
            }
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.animation.stop();
    }

    reset = () => {
        this.animation.reset();
        this.animatedValue.setValue(0);
        this.value = 0;
    };

    getAnimation = () => {
        return Animated.timing(this.animatedValue, {
            toValue: 1,
            duration: this.getDuration() * (1 - this.value),
            easing:
                this.props.animation === UILoopEffect.Animation.Pulse ||
                this.props.animation === UILoopEffect.Animation.Forward
                    ? Easing.ease
                    : Easing.linear,
            useNativeDriver: Platform.OS !== 'web',
        });
    };

    getDuration = () => {
        if (this.props.animation === UILoopEffect.Animation.Pulse) {
            return 600;
        }
        if (this.props.animation === UILoopEffect.Animation.Forward) {
            return 600;
        }
        return 3000;
    };

    getTransform = () => {
        if (this.props.animation === UILoopEffect.Animation.Spin) {
            const rotateY = this.animatedValue.interpolate(spinInterpolateValues);
            return [{ rotateY }];
        }
        if (this.props.animation === UILoopEffect.Animation.Round) {
            const rotate = this.animatedValue.interpolate(roundInterpolateValues);
            return [{ rotate }];
        }
        if (this.props.animation === UILoopEffect.Animation.Sandglass) {
            const scaleX = this.animatedValue.interpolate(sandglassInterpolateValues.x);
            const scaleY = this.animatedValue.interpolate(sandglassInterpolateValues.y);
            return [{ scaleX }, { scaleY }];
        }
        if (this.props.animation === UILoopEffect.Animation.Pulse) {
            const scale = this.animatedValue.interpolate(scaleInterpolateValues);
            return [{ scale }];
        }

        if (this.props.animation === UILoopEffect.Animation.Forward) {
            const translateX = this.animatedValue.interpolate(forwardInterpolateValues);
            return [{ translateX }];
        }

        return [];
    };

    render() {
        return (
            <Animated.View style={[{ transform: this.getTransform() }, this.props.style]}>
                {this.props.children}
            </Animated.View>
        );
    }

    animatedValue: any;
}
