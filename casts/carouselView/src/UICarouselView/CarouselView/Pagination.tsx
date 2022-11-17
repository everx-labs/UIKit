import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UIBackgroundView, UIBackgroundViewColors } from '@tonlabs/uikit.themes';
import { UIConstant } from '../../constants';
import { usePaginationStyle } from './animations';

type CircleProps = {
    active: boolean;
    onPress: (event: any) => void;
    disabledPress?: boolean;
};

function Circle({ active, onPress, disabledPress }: CircleProps) {
    const { animatedStyles } = usePaginationStyle(active);

    return (
        <Animated.View style={[animatedStyles, styles.circle]}>
            <TouchableOpacity
                hitSlop={UIConstant.carousel.circleHitSlop}
                onPress={onPress}
                disabled={disabledPress}
            >
                <UIBackgroundView
                    color={
                        active
                            ? UIBackgroundViewColors.BackgroundAccent
                            : UIBackgroundViewColors.BackgroundTertiary
                    }
                    style={styles.circle}
                />
            </TouchableOpacity>
        </Animated.View>
    );
}

function getPaginationWidth(amount: number) {
    return amount * (UIConstant.carousel.circleSize + UILayoutConstant.contentOffset);
}

type PaginationProps = {
    pages: React.ReactElement[];
    onSetPage(index: number): void;
    initialPage?: number;
    disabledPress?: boolean;
};

export type PaginationRef = {
    setPage(index: number): void;
};

export const Pagination = React.memo(
    React.forwardRef<PaginationRef, PaginationProps>(
        ({ pages, onSetPage, initialPage, disabledPress }, forwardRef) => {
            const [activeIndex, setActiveIndex] = React.useState(initialPage ?? 0);

            React.useImperativeHandle(forwardRef, () => ({
                setPage(index) {
                    setActiveIndex(index);
                },
            }));

            const onHandlePress = React.useCallback(
                (index: number) => {
                    onSetPage(index);
                },
                [onSetPage],
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
                                disabledPress={disabledPress}
                            />
                        );
                    })}
                </View>
            );
        },
    ),
);

const styles = StyleSheet.create({
    circle: {
        width: UIConstant.carousel.circleSize,
        height: UIConstant.carousel.circleSize,
        borderRadius: UIConstant.carousel.circleSize / 2,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        alignItems: 'center',
        /**
         * It is necessary to pass the height of the maximum possible point size.
         * Otherwise the height will be calculated for the minimum dot size and cut off the scaled dot.
         * So we have to multiply circleSize by max circle scaling
         */
        height: UIConstant.carousel.circleSize * UIConstant.carousel.circleScale.active,
    },
});
