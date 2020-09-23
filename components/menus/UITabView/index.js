// @flow
import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type AnimatedMultiplication from 'react-native/Libraries/Animated/src/nodes/AnimatedMultiplication';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextButton from '../../buttons/UITextButton';

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
    initialIndex?: number,
};

const styles = StyleSheet.create({
    bottomLine: {
        height: 2,
        backgroundColor: UIColor.primary(),
    },
});

const UITabView = ({
    pages,
    width,
    indicatorWidth,
    style,
    pageStyle,
    initialIndex,
}: TabViewProps) => {
    // const animatedIndex = useRef(new Animated.Value(initialIndex)).current;
    // const [animatedIndex] = useState<AnimatedValue>(new Animated.Value(initialIndex));
    const [integerIndex, setIntegerIndex] = useState<number>(initialIndex);
    const animatedIndex = 0;
    // const integerIndex = 0;

    // Events
    const onPressTab = (index: number) => {
        Animated.timing(animatedIndex, {
            toValue: index,
            useNativeDriver: true,
            duration: UIConstant.animationDuration(),
        }).start();
        // setIntegerIndex(index);
    };

    // Getters
    const getMarginLeft = (widthParam: number): AnimatedMultiplication => {
        return Animated.multiply(animatedIndex, new Animated.Value(-widthParam));
    };

    // Render
    const tapBar = (
        <Animated.View style={UIStyle.flex.row()}>
            {pages.map(({ title }: TabViewPage, index: number) => {
                const textStyle = index === integerIndex
                    ? UIStyle.text.actionBodyBold()
                    : UIStyle.text.secondaryBodyBold();
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <TouchableWithoutFeedback
                        onPress={() => onPressTab(index)}
                        key={`tab-view-label-${title}`}
                    >
                        <View style={[UIStyle.flex.x1(), UIStyle.flex.alignCenter()]}>
                            <UITextButton
                                title={title}
                                textStyle={textStyle}
                                // onPress={() => onPressTab(index)}
                                testID={UITabView.testIDs.tabTitle(title)}
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
            <Animated.View
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

UITabView.defaultProps = {
    pages: [],
    width: 0,
    initialIndex: 0,
};

UITabView.testIDs = {
    tabTitle: (title: string) => `tabTitle_${title}`,
};

export default UITabView;
