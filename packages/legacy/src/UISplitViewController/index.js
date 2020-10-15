import React from 'react';
import { View, Dimensions } from 'react-native';

import {
    UIDevice,
    UIStyle,
    UIConstant,
} from '@uikit/core';
import { UIController } from '@uikit/navigation';

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
            <View
                style={[UIStyle.screenBackground, UIStyle.backgroundLightColor]}
                onLayout={e => this.onLayout(e)}
            >
                {this.renderSplitViewController()}
            </View>
        );
    }
}
