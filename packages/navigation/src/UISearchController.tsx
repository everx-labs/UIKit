import * as React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useDerivedValue,
    withSpring,
    useAnimatedStyle,
    interpolate,
    runOnJS,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBackHandler } from '@react-native-community/hooks';

import { Portal, ColorVariants, useTheme } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { UISearchBar } from './UISearchBar';
import { UIConstant } from './constants';

const ANIMATION_TRANSITION_SPACE: number = 40;

const VISIBLE_STATE_CLOSED: number = 0;
const VISIBLE_STATE_OPENED: number = 1;

export type UISearchControllerProps = {
    forId?: string;
    visible: boolean;
    placeholder?: string;
    onCancel: () => void | Promise<void>;
    onChangeText?: React.ComponentProps<typeof UISearchBar>['onChangeText'];
    children: ((searchText: string) => React.ReactNode) | React.ReactNode;
    searching?: boolean;
};

type UISearchControllerContentProps = Omit<UISearchControllerProps, 'forId'> & {
    progress: Readonly<Animated.SharedValue<number>>;
};

const withSpringConfig: Animated.WithSpringConfig = {
    damping: 16,
    stiffness: 200,
};

const useProgress = (
    visible: boolean,
    onClosed: () => void,
): Readonly<Animated.SharedValue<number>> => {
    /* Controller visibility status (VISIBLE_STATE_CLOSED/VISIBLE_STATE_OPENED) */
    const visibleState = useSharedValue<number>(VISIBLE_STATE_CLOSED);

    /* Indicates that the rendering is the first one. */
    const isFirstRender = useSharedValue<boolean>(true);

    React.useEffect((): void => {
        if (
            (visible && visibleState.value === VISIBLE_STATE_CLOSED) ||
            (!visible && visibleState.value === VISIBLE_STATE_OPENED)
        ) {
            /** State were changed */

            if (isFirstRender.value) {
                isFirstRender.value = false;
            }
            visibleState.value = visible ? VISIBLE_STATE_OPENED : VISIBLE_STATE_CLOSED;
        }
    }, [visible, visibleState, isFirstRender]);

    const onAnimation = React.useCallback(
        (isFinished: boolean): void => {
            'worklet';

            if (
                isFinished &&
                visibleState.value === VISIBLE_STATE_CLOSED &&
                /** On web `reanimated` tries to call onAnimation
                 * (passed to `withSpring`) on the first render
                 * when controller still closed. Preventing this.
                 *
                 * This is probably a bug in reanimation.
                 * TODO: create an issue in reanimated repo
                 */
                !isFirstRender.value
            ) {
                runOnJS(onClosed)();
            }
        },
        [onClosed, visibleState.value, isFirstRender.value],
    );

    const progress: Readonly<Animated.SharedValue<number>> = useDerivedValue((): number => {
        return withSpring(visibleState.value, withSpringConfig, onAnimation);
    }, []);

    return progress;
};

function UISearchControllerContent({
    placeholder,
    onCancel,
    children,
    searching,
    onChangeText: onChangeTextProp,
    progress,
}: UISearchControllerContentProps) {
    const [searchText, setSearchText] = React.useState('');
    const theme = useTheme();

    useBackHandler(() => {
        if (onCancel) {
            onCancel();
            return true;
        }
        return false;
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: progress.value,
            transform: [
                {
                    translateY: interpolate(
                        progress.value,
                        [VISIBLE_STATE_CLOSED, VISIBLE_STATE_OPENED],
                        [-ANIMATION_TRANSITION_SPACE, 0],
                    ),
                },
            ],
        };
    }, []);

    const baseStyle: ViewStyle = {
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
    };

    const onChangeText = React.useCallback(
        (text: string) => {
            if (onChangeTextProp) {
                onChangeTextProp(text);
            }

            setSearchText(text);
        },
        [onChangeTextProp, setSearchText],
    );

    return (
        <Animated.View style={[styles.container, baseStyle, animatedStyle]}>
            <SafeAreaView style={styles.contentInner} edges={['top']}>
                <UISearchBar
                    autoFocus
                    searching={searching}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    headerRightLabel={uiLocalized.Cancel}
                    headerRightOnPress={onCancel}
                />
                {typeof children === 'function' ? children(searchText) : children}
            </SafeAreaView>
        </Animated.View>
    );
}

export function UISearchController({ forId, ...props }: UISearchControllerProps) {
    const { visible, children } = props;
    const [isVisible, setIsVisible] = React.useState(visible);

    React.useEffect(() => {
        if (!visible) {
            return;
        }
        setIsVisible(true);
    }, [visible]);

    const onClosed = React.useCallback((): void => {
        setIsVisible(false);
    }, [setIsVisible]);

    const progress: Readonly<Animated.SharedValue<number>> = useProgress(visible, onClosed);

    if (!isVisible) {
        return null;
    }

    return (
        <Portal forId={forId} absoluteFill>
            <UISearchControllerContent {...props} progress={progress}>
                {children}
            </UISearchControllerContent>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,

        /** Since the view moves with a spring it goes out of bounds from above
         * and there is an empty space left.
         * To eliminate this, we use this hack to "compensate" the space */
        top: -ANIMATION_TRANSITION_SPACE,
        paddingTop: ANIMATION_TRANSITION_SPACE,
    },
    contentInner: {
        width: '100%',
        maxWidth: UIConstant.elastiicWidthController,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
        flex: 1,
    },
});
