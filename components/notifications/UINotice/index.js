// @flow
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Platform, SafeAreaView } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from 'react-native-flash-message';

import type { Node } from 'react';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { PositionObject } from '../../../types';

import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UIFont from '../../../helpers/UIFont';
import UIDevice from '../../../helpers/UIDevice';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';

import icoCloseBlue from '../../../assets/ico-close/close-blue.png';
import icoCloseGrey from '../../../assets/ico-close/close-grey.png';

const cardShadowWidth = UIConstant.cardShadowWidth();
const doubleOffset = 2 * cardShadowWidth;
const contentOffset = UIConstant.contentOffset();
const hiddenOffset = cardShadowWidth - contentOffset;

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        paddingVertical: cardShadowWidth,
        margin: -hiddenOffset,
    },
    noticeStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: contentOffset,
        paddingHorizontal: contentOffset,
        borderRadius: UIConstant.smallBorderRadius(),
        backgroundColor: UIColor.white(),
        ...UIConstant.cardShadow(),
    },
    contentContainer: {
        flex: 1,
        marginRight: contentOffset,
    },
    messageStyle: {
        color: UIColor.grey(),
        ...UIFont.captionRegular(),
    },
    actionTitleStyle: {
        color: UIColor.primary(),
        ...UIFont.smallMedium(),
    },
});


export type MessageObject = {
    position?: string | PositionObject,
    animated?: boolean,
    message: string,
    duration?: number,
    animationDuration?: number,
    autoHide?: boolean,
};

export type NoticeAction = {
    title: string,
    onPress: () => void,
};

type Insets = { [string]: number };

type State = {
    marginLeft: AnimatedValue,
    pageWidth: number,
    insets: Insets,
    externalMessageComponent: Node,
};

type Props = {};

type Placement = 'top' | 'bottom' | 'left' | 'right';

type NoticeObject = {
    title?: string,
    message: string,
    subComponent?: Node,
    placement?: Placement,
    autoHide?: boolean,
    action?: NoticeAction,
    onCancel?: () => void,
};

let masterRef = null;

export default class UINotice
    extends UIComponent<Props, State> {
    static Type = {
        Default: 'default',
        Alert: 'alert',
    }

    static Place = {
        Top: 'top',
        Bottom: 'bottom',
    }

    static showMessage(args: string | NoticeObject) {
        if (masterRef) {
            if (typeof args === 'string') {
                masterRef.showMessage({ message: args });
            } else {
                masterRef.showMessage(args);
            }
        }
    }

    static showToastMessage(
        messageObject: MessageObject,
        messageComponent: Node,
    ) {
        if (masterRef) {
            masterRef.showToastMessage(messageObject, messageComponent);
        }
    }

    static setAdditionalInset(key: string, inset: number) {
        if (masterRef) {
            masterRef.setAdditionalInset(key, inset);
        }
    }

    static removeAdditionalInset(key: string) {
        if (masterRef) {
            masterRef.removeAdditionalInset(key);
        }
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            marginLeft: new Animated.Value(0),
            pageWidth: 0,

            insets: {},
            externalMessageComponent: null,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        masterRef = this;
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        masterRef = null;
    }

    // Events
    onWindowContainerLayout(e: ViewLayoutEvent) {
        const { width } = e.nativeEvent.layout;
        if (width !== this.getPageWidth()) {
            this.setPageWidth(width);
        }
    }

    // Setters
    setMarginLeft(marginLeft: AnimatedValue, callback?: () => void) {
        this.setStateSafely({ marginLeft }, callback);
    }

    setPageWidth(pageWidth: number) {
        this.setStateSafely({ pageWidth });
    }

    setExternalMessageComponent(externalMessageComponent: Node) {
        this.setStateSafely({ externalMessageComponent });
    }

    setInsets(insets: Insets) {
        this.setStateSafely({ insets });
    }

    // Getters
    getMarginLeft(): AnimatedValue {
        return this.state.marginLeft;
    }

    getPageWidth(): number {
        return this.state.pageWidth;
    }

    getContainerWidth() {
        const pageNoticeWidth = this.getPageWidth() + (hiddenOffset * 2);
        const defaultNoticeWidth = UIConstant.noticeWidth() + doubleOffset;
        return Math.min(pageNoticeWidth, defaultNoticeWidth);
    }

    getExternalMessageComponent() {
        return this.state.externalMessageComponent;
    }

    getInsets() {
        return this.state.insets;
    }

    getMaxInset() {
        const insets: Insets = this.getInsets();
        let maxInset = 0;
        Object.keys(insets).forEach((key) => {
            maxInset = Math.max(insets[key], maxInset);
        });
        return maxInset;
    }

    // Internals
    subComponent: Node;
    title: string;
    message: string;
    action: NoticeAction;
    onCancel: () => void;

    // Actions
    showMessage(args: NoticeObject) {
        const { Bottom } = UINotice.Place;
        const {
            title, subComponent, message, action,
            placement = Bottom,
            autoHide = true,
            onCancel = () => {},
        } = args;
        this.subComponent = subComponent || null;
        this.title = title || '';
        this.message = message || '';
        this.action = action || { title: '', onPress: () => {} };
        this.onCancel = onCancel;
        this.setExternalMessageComponent(null);
        const position = placement === Bottom ? { bottom: this.getMaxInset() } : placement;
        showMessage({
            message: '', // unused but required param
            animated: false,
            duration: 10000,
            autoHide,
            position,
        });
        this.animateOpening();
    }

    showToastMessage(messageObject: MessageObject, messageComponent: Node) {
        this.setExternalMessageComponent(messageComponent);
        const bottom = this.getMaxInset();
        showMessage({
            animationDuration: UIConstant.animationDuration(),
            position: ({ bottom }: any),
            ...messageObject,
        });
    }

    closeWithCancel() {
        this.onCancel();
        this.animateClosing();
    }

    closeWithAction() {
        this.action.onPress();
        this.animateClosing();
    }

    animateOpening() {
        const containerWidth = this.getContainerWidth();
        this.setMarginLeft(new Animated.Value(containerWidth + contentOffset), () => {
            Animated.spring(this.state.marginLeft, {
                toValue: cardShadowWidth,
                duration: UIConstant.animationDuration(),
            }).start();
        });
    }

    animateClosing() {
        const containerWidth = this.getContainerWidth();
        Animated.timing(this.state.marginLeft, {
            toValue: containerWidth + contentOffset,
            duration: UIConstant.animationDuration(),
        }).start(() => hideMessage());
    }

    setAdditionalInset(key: string, inset: number) {
        const insets = this.getInsets();
        insets[key] = inset;
        this.setInsets(insets);
    }

    removeAdditionalInset(key: string) {
        const insets = this.getInsets();
        delete insets[key];
        this.setInsets(insets);
    }

    // Render
    renderCloseButton() {
        const icoClose = this.action && this.action.title ? icoCloseGrey : icoCloseBlue;
        return (
            <TouchableOpacity onPress={() => this.closeWithCancel()} >
                <Image source={icoClose} />
            </TouchableOpacity>
        );
    }

    renderHeader() {
        const title = (
            <Text style={UIStyle.textPrimaryBodyBold}>
                {this.title}
            </Text>
        );
        const titleComponent = this.title ? title : null;
        const subView = (
            <View style={{ marginRight: UIConstant.normalContentOffset() }}>
                {this.subComponent}
            </View>
        );
        const subComponent = this.subComponent ? subView : null;
        if (titleComponent) {
            return (
                <View style={[UIStyle.centerLeftContainer, UIStyle.marginBottomSmall]}>
                    {subComponent}
                    {titleComponent}
                </View>
            );
        }
        return null;
    }

    renderActionButton() {
        if (this.action && this.action.title) {
            return (
                <TouchableOpacity
                    style={{ marginTop: UIConstant.mediumContentOffset() }}
                    onPress={() => this.closeWithAction()}
                >
                    <Text style={styles.actionTitleStyle}>{this.action.title}</Text>
                </TouchableOpacity>
            );
        }
        return null;
    }

    renderMessageComponent() {
        const alignItems = Platform.OS === 'web' || UIDevice.isTablet() ? 'flex-start' : 'center';
        const marginLeft = this.getMarginLeft();
        const containerWidth = this.getContainerWidth();
        const noticeWidth = containerWidth - doubleOffset;

        return (
            <View
                style={{ alignItems }}
                onLayout={e => this.onWindowContainerLayout(e)}
            >
                <View style={[styles.container, { width: containerWidth }]}>
                    <Animated.View style={[styles.noticeStyle, { width: noticeWidth, marginLeft }]}>
                        <View style={styles.contentContainer}>
                            {this.renderHeader()}
                            <Text style={styles.messageStyle}>
                                {this.message}
                            </Text>
                            {this.renderActionButton()}
                        </View>
                        {this.renderCloseButton()}
                    </Animated.View>
                </View>
            </View>
        );
    }

    render() {
        const component = this.getExternalMessageComponent() || this.renderMessageComponent();
        return (
            <View style={UIStyle.absoluteFillObject} pointerEvents="box-none">
                <SafeAreaView style={{ flex: 1 }} pointerEvents="box-none">
                    <View style={{ flex: 1 }} pointerEvents="box-none">
                        <FlashMessage
                            MessageComponent={() => component}
                        />
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}
