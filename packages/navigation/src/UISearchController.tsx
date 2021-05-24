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

import { Portal, ColorVariants, useTheme } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { UISearchBar } from './UISearchBar';
import { ELASTIC_WIDTH_CONTROLLER } from './constants';

const ANIMATION_TRANSITION_SPACE: number = 40;

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
    /* Controller visibility status (0/1) */
    const visibleState = useSharedValue<number>(0);
    /* Indicates that the rendering is the first one. */
    const isFirstRender = useSharedValue<boolean>(true);

    React.useEffect((): void => {
        if (
            (visible && visibleState.value === 0) ||
            (!visible && visibleState.value === 1)
        ) {
            /** State were changed */

            if (isFirstRender.value) {
                isFirstRender.value = false;
            }
            visibleState.value = visible ? 1 : 0;
        }
    }, [visible, visibleState, isFirstRender]);

    const onAnimation = React.useCallback(
        (isFinished: boolean): void => {
            'worklet';

            if (
                isFinished &&
                visibleState.value === 0 &&
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

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: progress.value,
            transform: [
                {
                    translateY: interpolate(
                        progress.value,
                        [0, 1],
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
                {typeof children === 'function'
                    ? children(searchText)
                    : children}
            </SafeAreaView>
        </Animated.View>
    );
}

export function UISearchController({
    forId,
    ...props
}: UISearchControllerProps) {
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

    const progress: Readonly<Animated.SharedValue<
        number
    >> = useProgress(visible, onClosed);

    if (!isVisible) {
        return null;
    }

    return (
        <Portal forId={forId} absoluteFill>
            <UISearchControllerContent
                {...props}
                progress={progress}
            >
                {children}
            </UISearchControllerContent>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: -ANIMATION_TRANSITION_SPACE,
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: ANIMATION_TRANSITION_SPACE,
    },
    contentInner: {
        width: '100%',
        maxWidth: ELASTIC_WIDTH_CONTROLLER,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
        flex: 1,
    },
});
