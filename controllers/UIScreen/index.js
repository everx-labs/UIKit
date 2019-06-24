// @flow
import React from 'react';
import { ScrollView, View } from 'react-native';

import UIController from '../../controllers/UIController';
import UIConstant from '../../helpers/UIConstant';
import UIStyle from '../../helpers/UIStyle';
import type { NavigationProps } from '../../helpers/UINavigator';

type ControllerState = {
    screenWidth: number
};

export type ContentOffset = {
    x: number,
    y: number,
}

export type ContentSize = {
    width: number,
    height: number,
}

export default class UIScreen<Props, State>
    extends UIController<Props & NavigationProps, any & ControllerState> {
    presetName: string;
    scrollView: ?ScrollView;

    constructor(props: Props & NavigationProps) {
        super(props);
        this.presetName = '';

        // Events
        this.state = {
            screenWidth: 0,
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
        const { width } = e.nativeEvent.layout;
        this.setScreenWidth(width);
        const narrow = this.isNarrowScreen(width);
        this.dispatchNarrow(narrow);
        this.onScreenLayout(width);
    };

    onScrollDefault = (e: any) => {
        const { contentOffset, contentSize } = e.nativeEvent;
        this.onScroll(contentOffset, contentSize);
    };

    // Virtual
    onScroll(contentOffset: ContentOffset, contentSize?: ContentSize) {
        //
    }

    onScreenLayout(width: string) {
        //
    }

    // Setters
    setScreenWidth(screenWidth: number) {
        this.setStateSafely({ screenWidth });
    }

    // Getters
    getScreenWidth() {
        return this.state.screenWidth;
    }

    isNarrow() {
        const screenWidth = this.getScreenWidth();
        return screenWidth && screenWidth < UIConstant.elasticWidthBroad();
    }

    isNarrowScreen(width: number) {
        return width < UIConstant.elasticWidthBroad();
    }

    // Virtual
    getContentContainerStyle() {
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
        return (
            <View
                style={UIStyle.flex}
                onLayout={this.onScreenLayoutDefault}
            >
                {this.renderTopContent()}
                <ScrollView
                    ref={(component) => { this.scrollView = component; }}
                    style={UIStyle.flex}
                    contentContainerStyle={this.getContentContainerStyle()}
                    scrollEventThrottle={UIConstant.maxScrollEventThrottle()}
                    onScroll={this.onScrollDefault}
                >
                    {this.renderContent()}
                </ScrollView>
                {this.renderBottomContent()}
            </View>
        );
    }
}
