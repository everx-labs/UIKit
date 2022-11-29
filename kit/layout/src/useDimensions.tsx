import * as React from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useDimensions() {
    const { bottom: androidNavigationBarHeight } = useSafeAreaInsets();

    const [windowDimensions, setWindowDimensions] = React.useState(() => Dimensions.get('window'));
    const [screenDimensions, setScreenDimensions] = React.useState(() => Dimensions.get('screen'));

    React.useEffect(() => {
        function handleChange({ window, screen }: { window: ScaledSize; screen: ScaledSize }) {
            if (
                windowDimensions.width !== window.width ||
                windowDimensions.height !== window.height ||
                windowDimensions.scale !== window.scale ||
                windowDimensions.fontScale !== window.fontScale
            ) {
                setWindowDimensions(window);
            }
            if (
                screenDimensions.width !== screen.width ||
                screenDimensions.height !== screen.height ||
                screenDimensions.scale !== screen.scale ||
                screenDimensions.fontScale !== screen.fontScale
            ) {
                setScreenDimensions(window);
            }
        }
        const subscription = Dimensions.addEventListener('change', handleChange);
        // We might have missed an update between calling `get` in render and
        // `addEventListener` in this handler, so we set it here. If there was
        // no change, React will filter out this update as a no-op.
        handleChange({ window: Dimensions.get('window'), screen: Dimensions.get('screen') });
        return () => {
            subscription.remove();
        };
    }, [windowDimensions, screenDimensions]);

    return {
        window: windowDimensions,
        screen: screenDimensions,
        androidNavigationBarHeight,
    };
}
