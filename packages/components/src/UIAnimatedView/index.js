// @flow
import React from 'react';
import { Animated, Easing } from 'react-native';
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
}

type State = {}

export default class UIAnimatedView extends UIComponent<Props, State> {
    static Animation = {
        Spin: 'spin',
        Round: 'round',
        Sandglass: 'sandglass',
        Pulse: 'pulse',
        Forward: 'forward',
    };

    static defaultProps: Props = {
        animation: UIAnimatedView.Animation.Spin,
        animated: true,
    };

    animation: CompositeAnimation;

    constructor(props: Props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.animation = Animated.timing(this.animatedValue, {
            toValue: 1,
            duration: this.getDuration(),
            easing:
                this.props.animation === UIAnimatedView.Animation.Pulse ||
                this.props.animation === UIAnimatedView.Animation.Forward
                    ? Easing.ease
                    : Easing.linear,
            useNativeDriver: true,
        });
    }

    componentDidMount() {
        super.componentDidMount();

        if (this.props.animated) {
            this.animate();
        }
    }

    componentDidUpdate() {
        if (this.props.animated) {
            this.animate();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.animation.stop();
    }

    getDuration() {
        if (this.props.animation === UIAnimatedView.Animation.Pulse) {
            return 600;
        }
        if (this.props.animation === UIAnimatedView.Animation.Forward) {
            return 600;
        }
        return 3000;
    }

    animate = ({ finished }: { finished: boolean } = { finished: true }) => {
        this.animatedValue.setValue(0);

        if (!finished) {
            return;
        }

        const callback =
            this.props.animation === UIAnimatedView.Animation.Forward
                ? null
                : this.animate;

        this.animation.start(callback);
    };

    getTransform = () => {
        if (!this.props.animated) {
            return []
        }

        if (this.props.animation === UIAnimatedView.Animation.Spin) {
            const rotateY = this.animatedValue.interpolate(spinInterpolateValues);
            return [{ rotateY }];
        }
        if (this.props.animation === UIAnimatedView.Animation.Round) {
            const rotate = this.animatedValue.interpolate(roundInterpolateValues);
            return [{ rotate }];
        }
        if (this.props.animation === UIAnimatedView.Animation.Sandglass) {
            const scaleX = this.animatedValue.interpolate(sandglassInterpolateValues.x);
            const scaleY = this.animatedValue.interpolate(sandglassInterpolateValues.y);
            return [{ scaleX }, { scaleY }];
        }
        if (this.props.animation === UIAnimatedView.Animation.Pulse) {
            const scale = this.animatedValue.interpolate(scaleInterpolateValues);
            return [{ scale }];
        }

        if (this.props.animation === UIAnimatedView.Animation.Forward) {
            const translateX = this.animatedValue.interpolate(forwardInterpolateValues);
            return [{ translateX }];
        }

        return [];
    }

    render() {
        return (
            <Animated.View
                style={[{ transform: this.getTransform() }, this.props.style]}
            >
                {this.props.children}
            </Animated.View>
        );
    }

    animatedValue: any;
}
