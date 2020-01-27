// @flow
import React from 'react';
import { Platform, StyleSheet, View, Text, StatusBar } from 'react-native';

import UILocalized from '../../../helpers/UILocalized';
import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIDevice from '../../../helpers/UIDevice';
import UIComponent from '../../UIComponent';

const NetInfo = Platform.OS === 'web'
    ? (require('react-native') || {}).NetInfo // to suppress flow warning!
    : require('@react-native-community/netinfo');

const STATUS_HEIGHT = 24; // Based on Figma design

const styles = StyleSheet.create({
    connectionSnack: {
        paddingTop: UIDevice.statusBarHeight(),
        height: UIDevice.statusBarHeight() + STATUS_HEIGHT,
        backgroundColor: UIColor.blackLight(),
    },
});

type Props = {
    onConnected: (boolean) => void,
}

type State = {
    connected: boolean,
};

export default class UINetworkStatus extends UIComponent<Props, State> {
    static statusHeight() {
        return STATUS_HEIGHT;
    }

    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            connected: true,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.startListeningToConnectionInfo();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.stopListeningToConnectionInfo();
    }

    // Setters
    setConnected(connected: boolean) {
        this.setStateSafely({ connected });
    }

    // Getters
    isConnected(): boolean {
        return this.state.connected;
    }

    // Actions
    startListeningToConnectionInfo() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    }

    stopListeningToConnectionInfo() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = (connected: boolean) => {
        this.setConnected(connected);
        // Change status bar color style
        const statusBarStyle = connected ? 'dark-content' : 'light-content';
        StatusBar.setBarStyle(statusBarStyle, true);
        const statusBarColor = connected ? 'white' : 'black';
        StatusBar.setBackgroundColor(statusBarColor, true);
        // Pass connection status to props
        this.props.onConnected(connected);
    };

    // Render
    renderSnack() {
        const isConnected = this.isConnected();
        if (isConnected) {
            return null;
        }
        return (
            <View style={[styles.connectionSnack, UIStyle.centerContainer]}>
                <Text style={UITextStyle.secondaryDarkTinyRegular}>
                    {UILocalized.PleaseGoOnline}
                </Text>
            </View>
        );
    }

    render() {
        return (
            <View style={UIStyle.topScreenContainer} pointerEvents="none">
                {this.renderSnack()}
            </View>
        );
    }

    static defaultProps: Props;
}

UINetworkStatus.defaultProps = {
    onConnected: () => {},
};
