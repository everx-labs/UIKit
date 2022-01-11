import * as React from 'react';
import { StyleSheet, Animated as RNAnimated } from 'react-native';
import { MaybeScreen } from './ScreenFallback';

type TabScreenProps = {
    isVisible: boolean;
    children: React.ReactNode;
};

function useLazyRef<T>(init: () => T): T {
    const ref = React.useRef<T>(null);
    if (ref.current == null) {
        // @ts-ignore
        ref.current = init();
    }
    return ref.current;
}

export function TabScreen({ isVisible, children }: TabScreenProps) {
    /**
     * Reanimated had a bug (possibly due to Freeze) on web
     * when after stack push animation a screen become invisible
     * (opacity was set to 0, even though a SharedValue wasn't 0).
     */
    const opacity = useLazyRef(() => new RNAnimated.Value(0));
    /**
     * The state is needed to pass it to MaybeScreen,
     * that has Freeze (from react-freeze) under the hood
     * to set it only when animation is finished
     */
    const [visible, setVisible] = React.useState(false);

    const hide = React.useCallback(() => {
        setVisible(false);
    }, []);

    React.useEffect(() => {
        if (visible === isVisible) {
            return;
        }
        if (visible === false && isVisible === true) {
            RNAnimated.spring(opacity, {
                toValue: 1,
                overshootClamping: true,
                useNativeDriver: true,
            }).start();
            setVisible(true);
        } else {
            RNAnimated.spring(opacity, {
                toValue: 0,
                overshootClamping: true,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) hide();
            });
        }
    }, [isVisible, opacity, hide, visible]);

    const fadeStyle = React.useMemo(() => [styles.container, { opacity }], [opacity]);

    return (
        <MaybeScreen enabled visible={visible} style={StyleSheet.absoluteFill}>
            <RNAnimated.View style={fadeStyle}>{children}</RNAnimated.View>
        </MaybeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
