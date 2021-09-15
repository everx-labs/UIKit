import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { UIConstant } from '@tonlabs/uikit.core';
import { Theme, TouchableOpacity, useTheme } from '@tonlabs/uikit.hydrogen';
import { usePaginationStyle } from './animations';

const circleSize = 6;

type CircleProps = {
    active: boolean;
    onPress: (event: any) => void;
    theme: Theme;
};

const CircleHitSlop = {
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
};

const Circle: React.FC<CircleProps> = ({ active, onPress, theme }: CircleProps) => {
    const { animatedStyles } = usePaginationStyle(active, theme);

    return (
        <TouchableOpacity hitSlop={CircleHitSlop} onPress={onPress}>
            <Animated.View style={[styles.circle, animatedStyles]} />
        </TouchableOpacity>
    );
};

function getPaginationWidth(amount: number) {
    return UIConstant.contentOffset() + amount * (circleSize + UIConstant.contentOffset());
}

type PaginationProps = {
    pages: React.ReactElement[];
    setPage: (index: number) => void;
    activeIndex: number;
};

export const Pagination: React.FC<PaginationProps> = React.memo(
    ({ pages, setPage, activeIndex }: PaginationProps) => {
        const theme = useTheme();

        const onHandlePress = React.useCallback(
            (index: number) => {
                setPage(index);
            },
            [setPage],
        );

        return (
            <View style={[{ width: getPaginationWidth(pages.length) }, styles.pagination]}>
                {pages.map((_, index) => {
                    return (
                        <Circle
                            // eslint-disable-next-line react/no-array-index-key
                            key={`Circles_${index}`}
                            active={index === activeIndex}
                            onPress={() => onHandlePress(index)}
                            theme={theme}
                        />
                    );
                })}
            </View>
        );
    },
);

const styles = StyleSheet.create({
    circle: {
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
});
