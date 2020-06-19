// @flow
import React from 'react';
import {
    StyleSheet, View, Text,
    Image, TouchableOpacity, Dimensions,
    TouchableWithoutFeedback, Animated
} from 'react-native';
import { hideMessage } from 'react-native-flash-message';

import {
    PanGestureHandler,
} from 'react-native-gesture-handler';

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

type RNGHEvent<T> = { nativeEvent: T };

export default class UIToastMessage {
    static Type = {
        Default: 'default',
        Alert: 'alert',
    }

    static Place = {
        Center: 'center',
        Left: 'flex-start',
    }

    static Duration = {
        Long: UIConstant.toastDurationLong(),
        Short: UIConstant.toastDurationLong(),
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
    static touchX = new Animated.Value(0);
    static shouldClose = false;
    static swiping = false;

    // Actions
    static prepareAndShowMessage(args: ToastObject) {
        const {
            message, type, placement, 
            autoHide = true, action, duration = this.Duration.Long,
        } = args;
        this.message = message || '';
        this.type = type || this.Type.Default;
        this.placement = placement || this.Place.Center;
        this.action = action || { title: '', onPress: () => {} };
        const messageComponent = this.renderMessageComponent();
        const messageObject: MessageObject = {
            message: '', // unused but required param
            animated: true,
            duration,
            autoHide,
        };
        this.touchX.setValue(0);
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

    static _onPanGestureEvent = ({ nativeEvent: { translationX } }: RNGHEvent<{ translationX: number }>) => {
        this.swiping = true;
        this.touchX.setValue(translationX);
        this.shouldClose = Math.abs(translationX) > 100;
        Animated.event([{nativeEvent: {x: this.touchX}}], { useNativeDriver: true });
    };

    static _onPanHandlerStateChange = ({
        nativeEvent: { state, translationX },
    }: RNGHEvent<{ state: RNGHState, translationX: number }>) => {
        if (this.shouldClose) {
            hideMessage();
            setTimeout(() => this.touchX.setValue(0), UIConstant.animationDuration());
        } else {
            this.touchX.setValue(0)
        }
        this.shouldClose = false;
    };

    static renderMessageComponent() {
        const color = this.type === this.Type.Alert ? UIColor.error() : UIColor.black();
        return (
            <PanGestureHandler onGestureEvent={this._onPanGestureEvent} onHandlerStateChange={this._onPanHandlerStateChange} >
                <Animated.View style={[styles.containerStyle, {transform: [{translateX: Animated.add(this.touchX, new Animated.Value(0))}]}]}>
                    <TouchableWithoutFeedback onPress={() => {
                            if (!this.swiping) {
                                hideMessage()
                            }
                            this.swiping = false;
                        } 
                    }>
                        <View style={[styles.toastStyle, { backgroundColor: color }]}>
                            <Text
                                testID={`message_${this.type}`}
                                style={styles.titleStyle}
                            >
                                {this.message}
                            </Text>
                            {this.renderCloseButton()}
                        </View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </PanGestureHandler>
        );
    }   
}
