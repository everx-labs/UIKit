import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';

import UIComponent from '../../UIComponent';

const DropdownAlert = Platform.OS === 'web' ? null : require('react-native-dropdownalert').default;

let masterRef = null;

export default class UIDropdownAlert extends UIComponent {
    static showNotification(notificationTitle, notificationMessage, callback) {
        if (masterRef) {
            masterRef.showNotification(notificationTitle, notificationMessage, callback);
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
    showNotification(notificationTitle, notificationMessage, callback) {
        this.notificationCallback = callback;
        this.dropdownAlert.alertWithType('info', notificationTitle, notificationMessage);
    }

    // render
    render() {
        if (Platform.OS === 'web') {
            return null;
        }
        return (<DropdownAlert
            key="DropdownAlert"
            ref={(component) => { this.dropdownAlert = component; }}
            onClose={(data) => {
                if (this.notificationCallback) {
                    this.notificationCallback(data.action === 'tap');
                }
            }}
            updateStatusBar={false}
        />);
    }
}

UIDropdownAlert.defaultProps = {
    masterAlert: true,
};

UIDropdownAlert.propTypes = {
    masterAlert: PropTypes.bool,
};
