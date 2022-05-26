import type { WithSpringConfig } from 'react-native-reanimated';

export const DOT_WITH_SPRING_CONFIG: WithSpringConfig = {
    damping: 100,
    stiffness: 500,
};

export enum UIPinCodeBiometryType {
    Fingerprint = 'Fingerprint',
    Face = 'Face',
    None = 'None',
}

export const DOTS_STATE_PRESENTATION_DURATION = 300;
export const DEFAULT_DOTS_COUNT = 6;
export const KEY_WIDTH = 90; // 1 + 88 + 1
export const KEY_HEIGHT = 74; // 1 + 72 + 1
