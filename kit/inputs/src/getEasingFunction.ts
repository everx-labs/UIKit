import { LayoutAnimation, Easing } from 'react-native';

export function getEasingFunction(easing: string): (t: number) => number {
    switch (easing) {
        case LayoutAnimation.Types.spring:
            // @ts-ignore
            return Easing.elastic();
        case LayoutAnimation.Types.linear:
            return Easing.linear;
        case LayoutAnimation.Types.easeIn:
            return Easing.in(Easing.ease);
        case LayoutAnimation.Types.easeOut:
            return Easing.out(Easing.ease);
        case LayoutAnimation.Types.easeInEaseOut:
            return Easing.inOut(Easing.ease);
        case LayoutAnimation.Types.keyboard:
            // There is no information about real easing function for keyboard animation.
            // But people on Internet try to find closely easing functions.
            return Easing.bezier(0.17, 0.59, 0.4, 0.77);
        // return Easing.bezier(0.19, 0.35, 0.0625, 0.5);
        default:
            return Easing.out(Easing.ease);
    }
}
