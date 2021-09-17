// @flow
import React from 'react';
import { Platform, View, StyleSheet, ScrollView } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';

import UIController from '../UIController';

const styles = StyleSheet.create({
    // $FlowExpectedError
    scrollDisabled: Platform.select({
        web: {
            // this style does not work on mobile
            overflowX: 'hidden',
            overflowY: 'hidden',
            touchAction: 'none',
        },
    }),
});

type ControllerState = {
    screenWidth: number,
    scrollDisabled: boolean,
};

export type ContentOffset = {
    x: number,
    y: number,
};

export type ContentSize = {
    width: number,
    height: number,
};

type NavigationProps = {
    navigation: any,
};

let staticNarrow;

export default class UIScreen<Props, State> extends UIController<
    Props & NavigationProps,
    any & ControllerState,
> {
    scrollView: ?React$ElementRef<*>;
    listenScrollOffset: boolean;

    static isNarrow(width: number) {
        return width && width < UIConstant.elasticWidthBroad();
    }

    constructor(props: Props & NavigationProps) {
        super(props);
        this.listenScrollOffset = true;

        // Events
        this.state = {
            ...this.state,
            narrow: staticNarrow,
            screenWidth: 0,
            scrollDisabled: false,
            scrollOffset: { x: 0, y: 0 },
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.handleNavigation();
    }

    componentWillFocus() {
        super.componentWillFocus();
        this.setBackgroundPreset();
    }

    // Events
    onScreenLayoutDefault = (e: any) => {
        const { width, height } = e.nativeEvent.layout;
        if (width && width !== this.getScreenWidth()) {
            this.setScreenWidth(width);

            const narrow = !!width && width < UIConstant.elasticWidthBroad();
            if (narrow !== this.isNarrow()) {
                this.setNarrow(narrow);
                this.dispatchNarrow(narrow);
            }
            this.onScreenLayout(width, height);
        }
    };

    onScrollDefault = (e: any) => {
        const { contentOffset, contentSize } = e.nativeEvent;
        if (this.listenScrollOffset) {
            this.setScrollOffset(contentOffset);
        }
        this.onScroll(contentOffset, contentSize);
    };

    // Virtual
    onScroll(contentOffset: ContentOffset, contentSize: ContentSize) {
        //
    }

    onScreenLayout(width: string, height: string) {
        //
    }

    // Setters
    setScreenWidth(screenWidth: number) {
        this.setStateSafely({ screenWidth });
    }

    setScrollDisabled(scrollDisabled: boolean = true) {
        this.setStateSafely({ scrollDisabled });
    }

    setScrollOffset(scrollOffset: ContentOffset) {
        this.setState({ scrollOffset });
    }

    setNarrow(narrow: boolean = true) {
        this.setStateSafely({ narrow });
        staticNarrow = narrow;
    }

    // Getters
    getScreenWidth() {
        return this.state.screenWidth;
    }

    getRouteName() {
        return this.props.navigation.state.routeName;
    }

    getScrollOffset() {
        return this.state.scrollOffset;
    }

    getNavigation() {
        return this.props.navigation;
    }

    getPreviousRouteName() {
        const { state } = this.props.navigation.dangerouslyGetParent();
        if (state.routes && state.routes.length >= 2) {
            const { routeName } = state.routes[state.routes.length - 2];
            return routeName;
        }
        return null;
    }

    isNarrow() {
        return this.state.narrow;
    }

    isScrollDisabled() {
        return this.state.scrollDisabled;
    }

    // Virtual
    getContentContainerStyle(): ?ViewStyleProp | ViewStyleProp[] {
        return null;
    }

    // Actions
    // Virtual
    dispatchNarrow(narrow: boolean) {
        //
    }

    handleNavigation() {
        //
    }

    setBackgroundPreset() {
        //
    }

    scrollTo(scroll: number) {
        if (this.scrollView) {
            this.scrollView.scrollTo({ y: scroll, animated: true });
        }
    }

    // Render
    // Virtual
    renderContent(): React$Node {
        return null;
    }

    renderTopContent() {
        return null;
    }

    renderBottomContent() {
        return null;
    }

    render() {
        const scrollStyle = this.isScrollDisabled() ? styles.scrollDisabled : null;
        return (
            <View style={UIStyle.flex.x1()} onLayout={this.onScreenLayoutDefault}>
                {this.renderTopContent()}
                <ScrollView
                    ref={component => {
                        this.scrollView = component;
                    }}
                    style={[UIStyle.flex.x1(), scrollStyle]}
                    contentContainerStyle={this.getContentContainerStyle()}
                    scrollEventThrottle={UIConstant.maxScrollEventThrottle()}
                    onScroll={this.onScrollDefault}
                    scrollEnabled={!this.isScrollDisabled()}
                >
                    {this.renderContent()}
                </ScrollView>
                {this.renderBottomContent()}
            </View>
        );
    }
}
