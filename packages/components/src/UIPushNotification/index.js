// @flow
import React from 'react';
import { StyleSheet, Animated, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { hideMessage } from 'react-native-flash-message';
import { PanGestureHandler, State as RNGHState } from 'react-native-gesture-handler';

import { UIConstant } from '@tonlabs/uikit.core';
import {
    UIBackgroundView,
    UIBackgroundViewColors,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';

import UINotice from '../UINotice';
import type { MessageObject } from '../UINotice';

type RNGHEvent<T> = { nativeEvent: T };

const { width } = Dimensions.get('window');
const pageToastWidth = width - UIConstant.contentOffset() * 2;

const styles = StyleSheet.create({
    containerStyle: {
        // TODO: seems like it's missing
    },
    pnStyle: {
        width: Math.min(UIConstant.toastWidth(), pageToastWidth),
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'center',
        padding: UIConstant.contentOffset(),
        top: UIConstant.contentOffset(),
        borderRadius: UIConstant.mediumBorderRadius(),
        ...UIConstant.commonShadow(),
    },
});

type ToastObject = {
    title: string,
    message: string,
    type?: string,
    autoHide?: boolean,
    onPress?: () => void,
    duration?: number,
    showOnTop?: boolean,
};

export default class UIPushNotification {
    static showNotification(args: string | ToastObject, duration?: number) {
        if (typeof args === 'string') {
            this.prepareAndShowNotification({ message: args, title: '', duration });
        } else {
            this.prepareAndShowNotification(args);
        }
    }

    // Internals
    static title: string;
    static message: string;
    static onPress: () => void;
    static shouldClose = false;
    static touchY = new Animated.Value(0);
    static swiping = false;

    // Actions
    static prepareAndShowNotification(args: ToastObject) {
        const { message, title, autoHide = true, onPress, showOnTop } = args;
        this.title = title || '';
        this.message = message || '';
        this.onPress = onPress || (() => {});
        const messageComponent = this.renderMessageComponent();
        const messageObject: MessageObject = {
            message: '', // unused but required param
            animated: true,
            duration: UIConstant.notificationDuration(),
            autoHide,
            position: { top: 0 },
        };
        this.touchY.setValue(0);
        UINotice.showToastMessage(messageObject, messageComponent, showOnTop);
    }

    static closeNotification() {
        this.onPress();
        hideMessage();
    }

    // Events
    static onPanGestureEvent = ({
        nativeEvent: { translationY },
    }: RNGHEvent<{ translationY: number }>) => {
        if (translationY < 0) {
            this.swiping = true;
            this.touchY.setValue(translationY);
            this.shouldClose = Math.abs(translationY) > UIConstant.mediumContentOffset();
            Animated.event([{ nativeEvent: { y: this.touchY } }], { useNativeDriver: true });
        }
    };

    static onPanHandlerStateChange = ({
        nativeEvent: { state, translationY },
    }: RNGHEvent<{ state: RNGHState, translationY: number }>) => {
        if (this.shouldClose) {
            // Moves toast outside screen and then it "closes" it.
            Animated.spring(this.touchY, {
                speed: 40,
                toValue: -UIConstant.enormousContentOffset(),
                useNativeDriver: true,
            }).start(() => {
                hideMessage();
            });
        } else {
            // If the toast wasn't dragged enough distance to close, we want to
            // reset its initial position.
            Animated.spring(this.touchY, {
                toValue: 0,
                useNativeDriver: true, // for smother animation
            }).start();
        }
        this.shouldClose = false;
    };

    static renderMessageComponent() {
        return (
            <PanGestureHandler
                onGestureEvent={this.onPanGestureEvent}
                onHandlerStateChange={this.onPanHandlerStateChange}
            >
                <Animated.View
                    style={[
                        styles.containerStyle,
                        {
                            transform: [
                                {
                                    translateY: Animated.add(this.touchY, new Animated.Value(0)),
                                },
                            ],
                        },
                    ]}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (!this.swiping) {
                                this.closeNotification();
                            }
                            this.swiping = false;
                        }}
                    >
                        <UIBackgroundView
                            color={UIBackgroundViewColors.StaticBackgroundBlack}
                            style={styles.pnStyle}
                        >
                            {this.title.length > 0 ? (
                                <UILabel
                                    color={UILabelColors.StaticTextPrimaryLight}
                                    role={UILabelRoles.HeadlineFootnote}
                                    testID="title_notification"
                                >
                                    {this.title}
                                </UILabel>
                            ) : undefined}
                            <UILabel
                                color={UILabelColors.StaticTextPrimaryLight}
                                role={UILabelRoles.ParagraphFootnote}
                                testID="message_notification"
                            >
                                {this.message}
                            </UILabel>
                        </UIBackgroundView>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </PanGestureHandler>
        );
    }
}
