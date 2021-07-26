// @flow
import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type AnimatedMultiplication from 'react-native/Libraries/Animated/src/nodes/AnimatedMultiplication';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { UIBackgroundView, UIBackgroundViewColors, UIBoxButton, UIBoxButtonType } from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

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

type State = {
    integerIndex: number,
};

const AnimatedUIBackgroundView = Animated.createAnimatedComponent(
    UIBackgroundView,
);

const styles = StyleSheet.create({
    bottomLine: {
        height: 2,
    },
});

export default class UITabView extends UIComponent<TabViewProps, State> {
    static defaultProps: TabViewProps = {
        pages: [],
        width: 0,
        initialIndex: 0,
    };

    static testIDs = {
        tabTitle: (title: string) => `tabTitle_${title}`,
    };

    animatedIndex: AnimatedValue = new Animated.Value(this.props.initialIndex || 0);

    state = {
        integerIndex: this.props.initialIndex || 0,
    };

    // Events
    onPressTab = (index: number) => {
        Animated.timing(this.animatedIndex, {
            toValue: index,
            useNativeDriver: true,
            duration: UIConstant.animationDuration(),
        }).start();
        this.setStateSafely({ integerIndex: index });
    };

    // Getters
    getMarginLeft(width: number): AnimatedMultiplication {
        return Animated.multiply(this.animatedIndex, new Animated.Value(-width));
    }

    // Render
    renderTapBar() {
        return (
            <Animated.View style={UIStyle.common.flexRow()}>
                {this.props.pages.map(({ title }: TabViewPage, index: number) => {
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <TouchableWithoutFeedback
                            onPress={() => this.onPressTab(index)}
                            key={`tab-view-label-${title}`}
                        >
                            <View style={[UIStyle.common.flex(), UIStyle.common.alignCenter()]}>
                                <UIBoxButton
                                    testID={UITabView.testIDs.tabTitle(title)}
                                    title={title}
                                    type={index === this.state.integerIndex
                                        ? UIBoxButtonType.Tertiary
                                        : UIBoxButtonType.Nulled}
                                    onPress={() => this.onPressTab(index)}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </Animated.View>
        );
    }

    renderIndicatorLine() {
        const { width, indicatorWidth, pages } = this.props;
        if (!pages.length || !width) {
            return null;
        }

        const marginLeft = Animated.divide(
            this.getMarginLeft(indicatorWidth || width),
            new Animated.Value(-pages.length),
        );

        return (
            <View style={[UIStyle.common.flex(), UIStyle.common.overflowHidden()]}>
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
    }

    renderPages() {
        const { width, pages, pageStyle } = this.props;
        return (
            <View style={[UIStyle.common.overflowHidden(), pageStyle]}>
                <Animated.View
                    style={[UIStyle.common.flexRow(), { marginLeft: this.getMarginLeft(width) }]}
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
    }

    render() {
        if (!this.props.width) {
            return null;
        }

        return (
            <View style={[UIStyle.common.flex(), this.props.style]}>
                {this.renderTapBar()}
                {this.renderIndicatorLine()}
                {this.renderPages()}
            </View>
        );
    }
}