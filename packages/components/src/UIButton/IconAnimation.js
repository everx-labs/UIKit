// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { Animated, Easing } from 'react-native';
import type { CompositeAnimation } from 'react-native/Libraries/Animated/src/AnimatedImplementation';

import UIComponent from '../UIComponent';

const iconDefault = require('@uikit/assets/ico-triangle/ico-triangle.png');

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
  icon: any,
  animation: string,
  iconTintStyle?: StylePropType,
}

type State = {}

export default class IconAnimation extends UIComponent<Props, State> {
    static Animation = {
        Spin: 'spin',
        Round: 'round',
        Sandglass: 'sandglass',
        Pulse: 'pulse',
        Forward: 'forward',
    };

    animation: CompositeAnimation;

    constructor(props: Props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.animation = Animated.timing(this.animatedValue, {
            toValue: 1,
            duration: this.getDuration(),
            easing:
                this.props.animation === IconAnimation.Animation.Pulse ||
                this.props.animation === IconAnimation.Animation.Forward
                    ? Easing.ease
                    : Easing.linear,
            useNativeDriver: true,
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.animate();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.animation.stop();
    }

    getDuration() {
        if (this.props.animation === IconAnimation.Animation.Pulse) {
            return 600;
        }
        if (this.props.animation === IconAnimation.Animation.Forward) {
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
            this.props.animation === IconAnimation.Animation.Forward
                ? null
                : this.animate;

        this.animation.start(callback);
    };

    render() {
        const transform = [];
        if (this.props.animation === IconAnimation.Animation.Spin) {
            const rotateY = this.animatedValue.interpolate(spinInterpolateValues);
            transform.push({ rotateY });
        } else if (this.props.animation === IconAnimation.Animation.Round) {
            const rotate = this.animatedValue.interpolate(roundInterpolateValues);
            transform.push({ rotate });
        } else if (this.props.animation === IconAnimation.Animation.Sandglass) {
            const scaleX = this.animatedValue.interpolate(sandglassInterpolateValues.x);
            const scaleY = this.animatedValue.interpolate(sandglassInterpolateValues.y);
            transform.push({ scaleX });
            transform.push({ scaleY });
        } else if (this.props.animation === IconAnimation.Animation.Pulse) {
            const scale = this.animatedValue.interpolate(scaleInterpolateValues);
            transform.push({ scale });
        } else if (this.props.animation === IconAnimation.Animation.Forward) {
            const translateX = this.animatedValue.interpolate(forwardInterpolateValues);
            transform.push({ translateX });
        }
        return (
            <Animated.Image
                style={[{ transform }, this.props.iconTintStyle]}
                source={this.props.icon}
            />
        );
    }

    static defaultProps: Props;
    animatedValue: any;
}

IconAnimation.defaultProps = {
    icon: iconDefault,
    animation: IconAnimation.Animation.Spin,
    iconTintStyle: null,
};
