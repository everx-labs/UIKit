import * as React from 'react';
import {
    useWindowDimensions,
    ViewStyle,
    StyleSheet,
} from 'react-native';
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
    animationValue: Readonly<Animated.SharedValue<number>>;
};

const withSpringConfig: Animated.WithSpringConfig = {
    damping: 18,
    mass: 1,
    stiffness: 200,
    // overshootClamping: true,
    // velocity?: number;
};

const useAnimationValue = (
    visible: boolean,
    onClosed: () => void,
): Readonly<Animated.SharedValue<number>> => {
    const progress = useSharedValue<number>(0);

    React.useEffect(() => {
        progress.value = visible ? 1 : 0;
    }, [visible, progress]);

    const onAnimation = React.useCallback(
        (isFinished: boolean) => {
            'worklet';

            if (isFinished && progress.value === 0) {
                runOnJS(onClosed)();
            }
        },
        [onClosed, progress.value],
    );

    const animationValue = useDerivedValue(() => {
        return withSpring(progress.value, withSpringConfig, onAnimation);
    }, [progress.value]);

    return animationValue;
};

function UISearchControllerContent({
    placeholder,
    onCancel,
    children,
    searching,
    onChangeText: onChangeTextProp,
    animationValue,
}: UISearchControllerContentProps) {
    const [searchText, setSearchText] = React.useState('');
    const theme = useTheme();

    const { height } = useWindowDimensions();
    const animatedStyle = useAnimatedStyle(
        () => {
            return {
                opacity: animationValue.value,
                transform: [
                    {
                        translateY: interpolate(
                            animationValue.value,
                            [0, 1],
                            [-height / 2, 0],
                        ),
                    },
                ],
            }
        },
        [height, animationValue],
    );

    const baseStyle: ViewStyle = {
        flex: 1,
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
        <Animated.View style={[baseStyle, animatedStyle]}>
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

    const onClosed = React.useCallback(() => {
        setIsVisible(false);
    }, [setIsVisible]);

    const animationValue: Readonly<Animated.SharedValue<
        number
    >> = useAnimationValue(visible, onClosed);

    if (!isVisible) {
        return null;
    }

    return (
        <Portal forId={forId} absoluteFill>
            <UISearchControllerContent
                {...props}
                animationValue={animationValue}
            >
                {children}
            </UISearchControllerContent>
        </Portal>
    );
}

const styles = StyleSheet.create({
    contentInner: {
        width: '100%',
        maxWidth: ELASTIC_WIDTH_CONTROLLER,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
        flex: 1,
    },
});
