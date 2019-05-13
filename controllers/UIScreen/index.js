// @flow
import React from 'react';
import { ScrollView, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIController from '../../controllers/UIController';
import UIConstant from '../../helpers/UIConstant';
import UIStyle from '../../helpers/UIStyle';
import type { NavigationProps } from '../../helpers/UINavigator';

type ControllerState = {
    screenWidth: number
};

export default class UIScreen<Props, State>
    extends UIController<Props & NavigationProps, any & ControllerState> {
    presetName: string;
    contentContainerStyle: ?ViewStyleProp;
    scrollView: ?ScrollView;

    constructor(props: Props & NavigationProps) {
        super(props);
        this.presetName = '';
        this.contentContainerStyle = {};

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
    onScreenLayout(e: any) {
        const { width } = e.nativeEvent.layout;
        this.setScreenWidth(width);
        const narrow = this.isNarrowScreen(width);
        this.dispatchNarrow(narrow);
    }

    isNarrow() {
        const screenWidth = this.getScreenWidth();
        return screenWidth && screenWidth < UIConstant.elasticWidthBroad();
    }

    isNarrowScreen(width: number) {
        return width < UIConstant.elasticWidthBroad();
    }

    // Setters
    setScreenWidth(screenWidth: number) {
        this.setStateSafely({ screenWidth });
    }

    // Getters
    getScreenWidth() {
        return this.state.screenWidth;
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

    render() {
        return (
            <View
                style={UIStyle.flex}
                onLayout={e => this.onScreenLayout(e)}
            >
                <ScrollView
                    ref={(component) => { this.scrollView = component; }}
                    style={[UIStyle.flex]}
                    contentContainerStyle={this.contentContainerStyle}
                >
                    {this.renderContent()}
                </ScrollView>
            </View>
        );
    }
}
