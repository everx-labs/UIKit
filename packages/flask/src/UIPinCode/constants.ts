/* eslint-disable no-shadow */
import type Animated from 'react-native-reanimated';

export const DOT_WITH_SPRING_CONFIG: Animated.WithSpringConfig = {
    damping: 100,
    stiffness: 500,
};

export enum DotAnimationStatus {
    NotActive = 0,
    Active = 1,
}

export enum ShakeAnimationStatus {
    NotActive = 0,
    Active = 1,
}

export enum CircleAnimationStatus {
    Active = 0,
    NotActive = 1,
}

export enum ValidationState {
    None = 0,
    Success = 1,
    Error = 2,
}

export enum UIPinCodeBiometryType {
    Fingerprint = 'Fingerprint',
    Face = 'Face',
}

export const DOTS_STATE_PRESENTATION_DURATION = 300;
export const DEFAULT_DOTS_COUNT = 6;
export const KEY_WIDTH = 90; // 1 + 88 + 1
export const KEY_HEIGHT = 74; // 1 + 72 + 1
