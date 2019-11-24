/* @flow */
import { Animated } from 'react-native';
import { Animation } from 'react-native-popup-dialog';


type Param = {
    toValue: number,
    slideFrom: string,
}

export default class SlideAnimation extends Animation {
    constructor({ toValue = 0, slideFrom = 'bottom' }: Param) {
        super(toValue);
        this.animations = this.createAnimations(slideFrom);
    }

    toValue(toValue: number, onFinished: ?Function) {
        Animated.spring(this.animate, {
            toValue,
            velocity: 0,
            tension: 15,
            friction: 10,
            useNativeDriver: true,
        }).start(onFinished);
    }

    createAnimations(slideFrom: string): Object {
        const transform = [];

        if (['top', 'bottom'].includes(slideFrom)) {
            if (slideFrom === 'bottom') {
                transform.push({
                    translateY: this.animate.interpolate({
                        inputRange: [0, 1],
                        outputRange: [800, 1],
                    }),
                });
            } else {
                transform.push({
                    translateY: this.animate.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-800, 1],
                    }),
                });
            }
        } else if (['left', 'right'].includes(slideFrom)) {
            if (slideFrom === 'right') {
                transform.push({
                    translateX: this.animate.interpolate({
                        inputRange: [0, 1],
                        outputRange: [800, 1],
                    }),
                });
            } else {
                transform.push({
                    translateX: this.animate.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-800, 1],
                    }),
                });
            }
        }

        // Return animations
        return { transform };
    }
}
