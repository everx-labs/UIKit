import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from 'react-native-flash-message';

import UIConstant from '../../helpers/UIConstant';
import UIColor from '../../helpers/UIColor';
import UIFont from '../../helpers/UIFont';

import icoClose from '../../assets/ico-close/close.png';

const styles = StyleSheet.create({
    containerStyle: {
        height: 84,
        justifyContent: 'center',
        paddingHorizontal: UIConstant.contentOffset(),
    },
    toastStyle: {
        width: 328,
        height: 52,
        borderRadius: UIConstant.smallBorderRadius(),
        paddingHorizontal: UIConstant.contentOffset(),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleStyle: {
        color: UIColor.fa(),
        ...UIFont.captionRegular(),
    },
    actionTitleStyle: {
        color: UIColor.fa(),
        ...UIFont.smallMedium(),
    },
});

let masterRef = null;

export default class UIToastMessage extends Component {
    static Type = {
        Default: 'default',
        Alert: 'alert',
    }

    static Place = {
        Center: 'center',
        Left: 'flex-start',
    }

    static showMessage(args) {
        if (typeof args === 'string') {
            masterRef.showMessage({ message: args });
        } else {
            masterRef.showMessage(args);
        }
    }

    componentDidMount() {
        masterRef = this;
    }

    componentWillUnmount() {
        masterRef = null;
    }

    // Actions
    showMessage({
        message, type, placement, autoHide = true, action,
    }) {
        this.message = message || '';
        this.type = type || UIToastMessage.Type.Default;
        this.placement = placement || UIToastMessage.Place.Center;
        this.action = action || { title: '', onPress: () => {} };
        showMessage({
            message: '', // unused but required param
            duration: 5000,
            autoHide,
        });
    }

    closeToast() {
        this.action.onPress();
        hideMessage();
    }

    // Render
    renderCloseButton() {
        if (this.type === UIToastMessage.Type.Alert) {
            return (
                <TouchableOpacity onPress={() => this.closeToast()} >
                    <Image source={icoClose} />
                </TouchableOpacity>
            );
        }
        if (this.type === UIToastMessage.Type.Default && this.action) {
            return (
                <TouchableOpacity onPress={() => this.closeToast()} >
                    <Text style={styles.actionTitleStyle}>{this.action.title}</Text>
                </TouchableOpacity>
            );
        }
        return null;
    }

    renderMessageComponent() {
        const color = this.type === UIToastMessage.Type.Alert ? UIColor.error() : UIColor.black();
        return (
            <View style={[styles.containerStyle, { alignItems: this.placement }]}>
                <View style={[styles.toastStyle, { backgroundColor: color }]}>
                    <Text style={styles.titleStyle}>
                        {this.message}
                    </Text>
                    {this.renderCloseButton()}
                </View>
            </View>
        );
    }

    render() {
        return (
            <FlashMessage
                position="bottom"
                MessageComponent={() => this.renderMessageComponent()}
            />
        );
    }
}
