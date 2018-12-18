import React from 'react';
import { View } from 'react-native';

import UIController from '../UIController';
import UIDevice from '../UIDevice';
import UIStyle from '../UIStyle';

export default class UISplitViewController extends UIController {
    // constructor
    constructor(props) {
        super(props);

        this.state = {
            shouldSplitView: !UIDevice.isMobile(),
            fbLoginPhone: '',
            fbLoginVisible: false,
            fbLoginCallback: () => {},
        };
    }

    // Events
    onLayout(e) {
        // const { layout } = e.nativeEvent;
        // this.setShouldSplitView(layout.width > UIConstant.elasticWidthMedium());
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
