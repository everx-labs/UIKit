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
        Short: UIConstant.toastDurationShort(),
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
    static touchY = new Animated.Value(0);
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
        this.touchY.setValue(0);
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

    static _onPanGestureEvent = ({ nativeEvent: { translationY } }: RNGHEvent<{ translationY: number }>) => {
        // Only swipes down:
        if (translationY > 0){
            this.swiping = true;
            this.touchY.setValue(translationY);
            this.shouldClose = Math.abs(translationY) > UIConstant.tinyContentOffset();
            Animated.event([{nativeEvent: {y: this.touchY}}], { useNativeDriver: true });
        }
    };

    static _onPanHandlerStateChange = ({
        nativeEvent: { state, translationY },
    }: RNGHEvent<{ state: RNGHState, translationY: number }>) => {
        if (this.shouldClose) {
            hideMessage();
            // Hiding the toast message includes a "fading" animation, after hiding we need to
            // reset the component position, in order to avoid restoring the position while the
            // fading animation is still "happening", we set a timeout to wait for the animation
            // to complete, and then restore the position once is not visible. 
            setTimeout(() => this.touchY.setValue(0), UIConstant.animationDuration());
        } else {
            // If the toast wasn't dragged enough distance to close, we want to reset its initial
            // position immediately.
            this.touchY.setValue(0)
        }
        this.shouldClose = false;
    };

    static renderMessageComponent() {
        const color = this.type === this.Type.Alert ? UIColor.error() : UIColor.black();
        return (
            <PanGestureHandler onGestureEvent={this._onPanGestureEvent} onHandlerStateChange={this._onPanHandlerStateChange} >
                <TouchableWithoutFeedback onPress={() => {
                        if (!this.swiping) {
                            hideMessage()
                        }
                        this.swiping = false;
                    } 
                }>
                    <Animated.View style={[styles.containerStyle, {transform: [{translateY: Animated.add(this.touchY, new Animated.Value(0))}]}]}>
                        <View style={[styles.toastStyle, { backgroundColor: color }]}>
                            <Text
                                testID={`message_${this.type}`}
                                style={styles.titleStyle}
                            >
                                {this.message}
                            </Text>
                            {this.renderCloseButton()}
                        </View>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </PanGestureHandler>
        );
    }   
}
