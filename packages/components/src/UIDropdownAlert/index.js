import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';

import { UIColor, UIStyle } from '@uikit/core';

import UIComponent from '../UIComponent';

const DropdownAlert = Platform.OS === 'web' ? null : require('react-native-dropdownalert').default;

let masterRef = null;

export default class UIDropdownAlert extends UIComponent {
    static showNotification(notificationMessage: string, notificationTitle = ' ', callback?: Function) {
        if (masterRef) {
            masterRef.showNotification(notificationMessage, notificationTitle, callback);
        }
    }

    // Lifecycle
    componentDidMount() {
        super.componentDidMount();
        if (this.props.masterAlert) {
            masterRef = this;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.masterAlert) {
            masterRef = null;
        }
    }

    // actions
    showNotification(notificationMessage: string, notificationTitle: string, callback?: Function) {
        this.notificationCallback = callback;
        this.dropdownAlert.alertWithType('custom', notificationTitle, notificationMessage);
    }

    // render
    render() {
        if (Platform.OS === 'web') {
            return null;
        }
        return (
            <DropdownAlert
                key="DropdownAlert"
                ref={(component) => { this.dropdownAlert = component; }}
                onClose={(data) => {
                    if (this.notificationCallback) {
                        this.notificationCallback(data.action === 'tap');
                    }
                }}
                inactiveStatusBarStyle="dark-content"
                activeStatusBarStyle="light-content"
                activeStatusBarBackgroundColor={UIColor.black()}
                defaultTextContainer={[
                    UIStyle.container.center(),
                    UIStyle.common.flexColumn(),
                ]}
                containerStyle={[
                    UIStyle.text.tinyRegular(),
                    UIStyle.color.getBackgroundColorStyle(UIColor.black()),
                ]}
            />
        );
    }
}

UIDropdownAlert.defaultProps = {
    masterAlert: true,
};

UIDropdownAlert.propTypes = {
    masterAlert: PropTypes.bool,
};
