import * as React from 'react';
import { LayoutChangeEvent, useWindowDimensions, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useAndroidNavigationBarHeight } from '@tonlabs/uicast.keyboard';

import { useSheetOrigin } from './SheetOriginContext';

type SheetSizeContextT = {
    height: Animated.SharedValue<number>;
    maxPossibleHeight: Animated.SharedValue<number>;
    onSheetLayout?: (ev: LayoutChangeEvent) => void;
    style?: ViewStyle;
};

const SheetSizeContext = React.createContext<SheetSizeContextT | null>(null);

export function useSheetSize() {
    const opts = React.useContext(SheetSizeContext);

    if (opts == null) {
        throw new Error('Have you forgot to wrap <UISheet.Content /> with <SheetSizeContext /> ?');
    }

    return opts;
}

function useSheetHeight() {
    const height = useSharedValue(0);
    const onSheetLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { height: lHeight },
            },
        }) => {
            height.value = lHeight;
        },
        [height],
    );

    return {
        height,
        onSheetLayout,
    };
}

function calcTopSpace(topInset: number) {
    return Math.max(topInset, UILayoutConstant.contentInsetVerticalX4);
}

export function IntrinsicSizeSheet({ children }: { children: React.ReactNode }) {
    const { height: cardHeight, onSheetLayout } = useSheetHeight();

    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const { shared: androidNavigationBarHeightShared } = useAndroidNavigationBarHeight();
    const topSpace = useSharedValue(calcTopSpace(insets.top));

    React.useEffect(() => {
        topSpace.value = calcTopSpace(insets.top);
    }, [insets.top, topSpace]);

    const origin = useSheetOrigin();

    const maxPossibleHeight = useDerivedValue(() => {
        return height + androidNavigationBarHeightShared.value + origin.value - topSpace.value;
    });
    const constrainedHeight = useDerivedValue(() => {
        return Math.min(cardHeight.value, maxPossibleHeight.value);
    });

    const cardStyle = useAnimatedStyle(() => {
        return {
            maxHeight: maxPossibleHeight.value,
        };
    });

    const sizeContextValue = React.useRef<SheetSizeContextT>();

    if (sizeContextValue.current == null) {
        sizeContextValue.current = {
            maxPossibleHeight,
            height: constrainedHeight,
            onSheetLayout,
            style: cardStyle,
        };
    }

    return (
        <SheetSizeContext.Provider value={sizeContextValue.current}>
            {children}
        </SheetSizeContext.Provider>
    );
}

export function FixedSizeSheet({
    height,
    children,
}: {
    height: number;
    children: React.ReactNode;
}) {
    const sizeSizeContextValue = React.useRef<SheetSizeContextT>();

    if (sizeSizeContextValue.current == null) {
        sizeSizeContextValue.current = {
            maxPossibleHeight: { value: height },
            height: { value: height },
            style: { height },
        };
    }

    return (
        <SheetSizeContext.Provider value={sizeSizeContextValue.current}>
            {children}
        </SheetSizeContext.Provider>
    );
}
