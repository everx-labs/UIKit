import { requireNativeComponent, NativeModules, ColorValue, processColor } from 'react-native';

export const UIKitSkeletonNativeView = requireNativeComponent('UIKitSkeletonView');

type UIKitSkeletonConfig = {
    gradientWidth?: number;
    skewDegrees?: number;
    shimmerDuration?: number;
    skeletonDuration?: number;
    backgroundColor?: ColorValue;
    accentColor?: ColorValue;
};

export class UIKitSkeleton {
    private static prevConfiguration = '';

    static configure(config: UIKitSkeletonConfig) {
        if (!this.shouldUpdateConfig(config)) {
            return;
        }

        const { backgroundColor, accentColor, ...rest } = config;
        NativeModules.UIKitSkeletonModule?.configure({
            ...rest,
            ...(backgroundColor != null
                ? { backgroundColor: processColor(backgroundColor) }
                : null),
            ...(accentColor != null ? { accentColor: processColor(accentColor) } : null),
        });
    }

    private static shouldUpdateConfig(config: UIKitSkeletonConfig) {
        const configJSON = JSON.stringify(config);

        if (this.prevConfiguration !== configJSON) {
            this.prevConfiguration = configJSON;
            return true;
        }

        return false;
    }
}
