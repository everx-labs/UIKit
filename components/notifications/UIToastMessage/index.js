// @flow
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { hideMessage } from 'react-native-flash-message';

import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UIFont from '../../../helpers/UIFont';
import UINotice from '../UINotice';

import icoClose from '../../../assets/ico-close/close-light.png';
import type { MessageObject, NoticeAction } from '../UINotice';

const { width } = Dimensions.get('window');
const pageToastWidth = width - (UIConstant.contentOffset() * 2);

const styles = StyleSheet.create({
    containerStyle: {
        height: 84,
        justifyContent: 'center',
        paddingHorizontal: UIConstant.contentOffset(),
    },
    toastStyle: {
        width: Math.min(UIConstant.toastWidth(), pageToastWidth),
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

type Placement = 'center' | 'flex-start';

type ToastObject = {
    message: string,
    type?: string,
    placement?: Placement,
    autoHide?: boolean,
    action?: NoticeAction,
    duration?: number,
}

export default class UIToastMessage {
    static Type = {
        Default: 'default',
        Alert: 'alert',
    }

    static Place = {
        Center: 'center',
        Left: 'flex-start',
    }

    static showMessage(args: string | ToastObject, duration?: number) {
        if (typeof args === 'string') {
            this.prepareAndShowMessage({ message: args, duration });
        } else {
            this.prepareAndShowMessage(args);
        }
    }

    // Internals
    static message: string;
    static type: string;
    static placement: Placement;
    static action: NoticeAction;

    // Actions
    static prepareAndShowMessage(args: ToastObject) {
        const {
            message, type, placement, autoHide = true, action, duration,
        } = args;
        this.message = message || '';
        this.type = type || this.Type.Default;
        this.placement = placement || this.Place.Center;
        this.action = action || { title: '', onPress: () => {} };
        const messageComponent = this.renderMessageComponent();
        const messageObject: MessageObject = {
            message: '', // unused but required param
            animated: true,
            duration: duration || 5000,
            autoHide,
        };
        UINotice.showToastMessage(messageObject, messageComponent);
    }

    static closeToast() {
        this.action.onPress();
        hideMessage();
    }

    // Render
    static renderCloseButton() {
        if (this.type === this.Type.Alert) {
            return (
                <TouchableOpacity onPress={() => this.closeToast()} >
                    <Image source={icoClose} />
                </TouchableOpacity>
            );
        }
        if (this.type === this.Type.Default && this.action.title) {
            return (
                <TouchableOpacity onPress={() => this.closeToast()} >
                    <Text style={styles.actionTitleStyle}>{this.action.title}</Text>
                </TouchableOpacity>
            );
        }
        return null;
    }

    static renderMessageComponent() {
        const color = this.type === this.Type.Alert ? UIColor.error() : UIColor.black();
        return (
            <View style={[styles.containerStyle, { alignItems: this.placement }]}>
                <View style={[styles.toastStyle, { backgroundColor: color }]}>
                    <Text
                        testID={`message_${this.type}`}
                        style={styles.titleStyle}
                    >
                        {this.message}
                    </Text>
                    {this.renderCloseButton()}
                </View>
            </View>
        );
    }
}
