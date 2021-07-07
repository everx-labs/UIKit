// this component can't be used now, because of some error in react inside UIKit
// @flow
import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import type { TextStyleProp, ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type AnimatedMultiplication from 'react-native/Libraries/Animated/src/nodes/AnimatedMultiplication';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { UIBackgroundView, UIBackgroundViewColors, UIBoxButton, UIBoxButtonType } from '@tonlabs/uikit.hydrogen';

export type TabViewPage = {
    title: string,
    component: React$Node,
};

export type TabViewProps = {
    pages: TabViewPage[],
    width: number,
    indicatorWidth?: number,
    style?: ViewStyleProp,
    pageStyle?: ViewStyleProp,
    titleStyle?: TextStyleProp,
    initialIndex?: number,
};

export const tabViewTestIDs = {
    tabTitle: (title: string) => `tabTitle_${title}`,
};

const AnimatedUIBackgroundView = Animated.createAnimatedComponent(
    UIBackgroundView,
);

const styles = StyleSheet.create({
    bottomLine: {
        height: 2,
    },
});

const UITabView = ({
   pages = [],
   width,
   indicatorWidth,
   style,
   pageStyle,
   initialIndex = 0,
}: TabViewProps) => {
    const [animatedIndex] = useState<AnimatedValue>(new Animated.Value(initialIndex));
    const [integerIndex, setIntegerIndex] = useState<number>(initialIndex);

    // Events
    const onPressTab = (index: number) => {
        Animated.timing(animatedIndex, {
            toValue: index,
            useNativeDriver: true,
            duration: UIConstant.animationDuration(),
        }).start();
        setIntegerIndex(index);
    };

    // Getters
    const getMarginLeft = (widthParam: number): AnimatedMultiplication => {
        return Animated.multiply(animatedIndex, new Animated.Value(-widthParam));
    };

    // Render
    const tapBar = (
        <Animated.View style={UIStyle.flex.row()}>
            {pages.map(({ title }: TabViewPage, index: number) => {
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <TouchableWithoutFeedback
                        onPress={() => onPressTab(index)}
                        key={`tab-view-label-${title}`}
                    >
                        <View style={[UIStyle.flex.x1(), UIStyle.flex.alignCenter()]}>
                            <UIBoxButton
                                testID={tabViewTestIDs.tabTitle(title)}
                                title={title}
                                type={index === integerIndex
                                    ? UIBoxButtonType.Tertiary
                                    : UIBoxButtonType.Nulled}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                );
            })}
        </Animated.View>
    );

    const marginLeft = Animated.divide(
        getMarginLeft(indicatorWidth || width),
        new Animated.Value(-pages.length),
    );

    const indicatorLine = (pages.length && width) && (
        <View style={[UIStyle.flex.x1(), UIStyle.common.overflowHidden()]}>
            <AnimatedUIBackgroundView
                color={UIBackgroundViewColors.BackgroundAccent}
                style={[
                    styles.bottomLine,
                    {
                        width: (indicatorWidth || width) / pages.length,
                        marginLeft,
                    },
                ]}
            />
        </View>
    );

    const pagesComponent = (
        <View style={[UIStyle.common.overflowHidden(), pageStyle]}>
            <Animated.View
                style={[UIStyle.flex.row(), { marginLeft: getMarginLeft(width) }]}
            >
                {pages.map(({ title, component }: TabViewPage) => {
                    return (
                        <View style={{ width }} key={`tab-view-page-${title}`}>
                            {component}
                        </View>
                    );
                })}
            </Animated.View>
        </View>
    );

    return !!width && (
        <View style={[UIStyle.flex.x1(), style]}>
            {tapBar}
            {indicatorLine}
            {pagesComponent}
        </View>
    );
};

export default UITabView;
