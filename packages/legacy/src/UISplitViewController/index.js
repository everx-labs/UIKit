import React from 'react';
import { View, Dimensions } from 'react-native';

import { UIDevice, UIStyle, UIConstant } from '@tonlabs/uikit.core';
import {
    UIBackgroundView,
    UIBackgroundViewColors,
} from '@tonlabs/uikit.hydrogen';
import { UIController } from '@tonlabs/uikit.navigation_legacy';

export default class UISplitViewController extends UIController {
    static shouldSplitView() {
        // TODO: make it dynamic by listening to the shared split view instance
        const { width } = Dimensions.get('window');
        return !UIDevice.isMobile() && width > UIConstant.elasticWidthNormal();
    }

    // constructor
    constructor(props) {
        super(props);
        this.state = {
            shouldSplitView: UISplitViewController.shouldSplitView(),
        };
    }

    // Events
    onLayout(e) {
        const { layout } = e.nativeEvent;
        this.setShouldSplitView(layout.width > UIConstant.elasticWidthNormal());
        // TODO: Think how to handle split navigation when detailView is added/removed dynamically!
    }

    // Setters
    setShouldSplitView(shouldSplitView) {
        this.setStateSafely({ shouldSplitView });
    }

    // Getters
    shouldSplitView() {
        return !!this.renderMasterView && !!this.renderDetailView && this.state.shouldSplitView;
    }

    // Render
    renderMasterController() {
        return (
            <View style={UIStyle.masterViewController}>
                {this.renderMasterView()}
            </View>
        );
    }

    renderDetailController() {
        return (
            <View style={UIStyle.detailViewController}>
                {this.renderDetailView()}
            </View>
        );
    }

    renderSplitViewController() {
        if (this.shouldSplitView()) {
            return (
                <View style={UIStyle.splitViewController}>
                    {this.renderMasterController()}
                    {this.renderDetailController()}
                </View>
            );
        }
        return this.renderMasterView ? this.renderMasterView() : (<View />);
    }

    render() {
        return (
            <UIBackgroundView
                color={UIBackgroundViewColors.BackgroundPrimary}
                style={UIStyle.absoluteFillObject}
                onLayout={e => this.onLayout(e)}
            >
                {this.renderSplitViewController()}
            </UIBackgroundView>
        );
    }
}
