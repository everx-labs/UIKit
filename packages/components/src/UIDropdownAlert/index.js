// @flow
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { UIColor, UIStyle } from '@tonlabs/uikit.core';

import UIComponent from '../UIComponent';

const DropdownAlert = Platform.OS === 'web' ? null : require('react-native-dropdownalert').default;

let masterRef = null;

type Props = {
    masterAlert: boolean,
};

type State = {
    //
};

export default class UIDropdownAlert extends UIComponent<Props, State> {
    static defaultProps = {
        masterAlert: true,
    };

    static showNotification(
        notificationMessage: string,
        notificationTitle: string = ' ',
        callback?: Function,
    ) {
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

    // Actions
    notificationCallback: ?Function;
    dropdownAlert: ?React$ElementRef<any>;
    showNotification(notificationMessage: string, notificationTitle: string, callback?: Function) {
        this.notificationCallback = callback;
        if (this.dropdownAlert) {
            this.dropdownAlert.alertWithType('custom', notificationTitle, notificationMessage);
        }
    }

    // Render
    render() {
        if (!DropdownAlert) {
            return null;
        }
        return (
            <DropdownAlert
                key="DropdownAlert"
                ref={component => {
                    this.dropdownAlert = component;
                }}
                onClose={data => {
                    if (this.notificationCallback) {
                        this.notificationCallback(data.action === 'tap');
                    }
                }}
                inactiveStatusBarStyle="dark-content"
                activeStatusBarStyle="light-content"
                activeStatusBarBackgroundColor={UIColor.black()}
                defaultTextContainer={StyleSheet.flatten([
                    UIStyle.container.center(),
                    UIStyle.common.flexColumn(),
                ])}
                containerStyle={StyleSheet.flatten([
                    UIStyle.text.tinyRegular(),
                    UIStyle.color.getBackgroundColorStyle(UIColor.black()),
                ])}
            />
        );
    }
}
