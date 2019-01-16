import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, StatusBar } from 'react-native';

import { NetInfoProvider } from 'react-native-netinfo';

import UILocalized from '../../../helpers/UILocalized';
import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';
import UIDevice from '../../../helpers/UIDevice';
import UIComponent from '../../UIComponent';

const STATUS_HEIGHT = 20; // Same as typical iPhone status bar height before X models

const styles = StyleSheet.create({
    connectionSnack: {
        paddingTop: UIDevice.statusBarHeight(),
        height: UIDevice.statusBarHeight() + STATUS_HEIGHT,
        backgroundColor: UIColor.black(),
    },
});

let connected;

export default class UINetworkStatus extends UIComponent {
    static setIsConnected(isConnected) {
        connected = isConnected;
        // Change status bar color style
        const statusBarStyle = connected ? 'dark-content' : 'light-content';
        StatusBar.setBarStyle(statusBarStyle, true);
        const statusBarColor = connected ? 'white' : 'black';
        StatusBar.setBackgroundColor(statusBarColor, true);
    }

    static isConnected() {
        return connected;
    }

    static statusHeight() {
        return STATUS_HEIGHT;
    }

    static renderSnack(isConnected) {
        if (isConnected) {
            return null;
        }
        return (
            <View style={[styles.connectionSnack, UIStyle.centerContainer]}>
                <Text style={UIStyle.textWhiteTinyRegular}>
                    {`${UILocalized.Warning}! ${UILocalized.ConnectionHasBeenLost}`}
                </Text>
            </View>
        );
    }

    // Render
    render() {
        return (
            <View
                style={UIStyle.topScreenContainer}
                pointerEvents="none"
            >
                <NetInfoProvider
                    onChange={({ isConnected, connectionInfo }) => {
                        console.log('[UINetworkStatus] Connection changed with info:', { connected, connectionInfo });
                        UINetworkStatus.setIsConnected(isConnected);
                        this.props.isConnected(isConnected);
                    }}
                    render={({ isConnected }) => UINetworkStatus.renderSnack(isConnected)}
                />
            </View>
        );
    }
}

UINetworkStatus.defaultProps = {
    isConnected: () => {},
};

UINetworkStatus.propTypes = {
    isConnected: PropTypes.func,
};
