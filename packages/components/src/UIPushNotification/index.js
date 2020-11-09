// @flow
import React from 'react';
import {
    StyleSheet, View, Text,
    TouchableWithoutFeedback,
} from 'react-native';
import { hideMessage } from 'react-native-flash-message';

import {
    UIConstant,
    UIColor,
    UIFont,
} from '@uikit/core';

import UINotice from '../UINotice';
import type { MessageObject, NoticeAction } from '../UINotice';

const styles = StyleSheet.create({
    pnStyle: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        padding: UIConstant.contentOffset(),
    },
    titleStyle: {
        color: UIColor.fa(),
        ...UIFont.captionBold(),
    },
    msgStyle: {
        color: UIColor.fa(),
        ...UIFont.captionRegular(),
    },
});

type ToastObject = {
    title: string,
    message: string,
    type?: string,
    autoHide?: boolean,
    action?: NoticeAction,
    duration?: number,
    showOnTop?: boolean,
}

export default class UIPushNotification {
    static showNotification(args: string | ToastObject, duration?: number) {
        if (typeof args === 'string') {
            this.prepareAndShowNotification({ message: args, duration });
        } else {
            this.prepareAndShowNotification(args);
        }
    }

    // Internals
    static title: string;
    static message: string;
    static placement: Placement;
    static onPress: () => void;
    static shouldClose = false;

    // Actions
    static prepareAndShowNotification(args: ToastObject) {
        const {
            message, title,
            autoHide = true, onPress,
            showOnTop,
        } = args;
        this.title = title || '';
        this.message = message || '';
        this.onPress = onPress;
        const messageComponent = this.renderMessageComponent();
        const messageObject: MessageObject = {
            message: '', // unused but required param
            animated: true,
            duration: UIConstant.notificationDuration(),
            autoHide,
            position: { top: 0 },
        };
        UINotice.showToastMessage(messageObject, messageComponent, showOnTop);
    }

    static closeNotification() {
        this.onPress();
        hideMessage();
    }

    static renderMessageComponent() {
        return (
            <TouchableWithoutFeedback
                onPress={() => this.closeNotification()}
            >
                <View style={[styles.pnStyle, { backgroundColor: UIColor.black() }]}>
                    <Text
                        testID={`title_notification`}
                        style={styles.titleStyle}
                    >
                        {this.title}
                    </Text>
                    <Text
                        testID={`message_notification`}
                        style={styles.msgStyle}
                    >
                        {this.message}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
