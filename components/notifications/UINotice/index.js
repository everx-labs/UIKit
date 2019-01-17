import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Platform } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from 'react-native-flash-message';

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

let masterRef = null;

export default class UINotice extends UIComponent {
    static Type = {
        Default: 'default',
        Alert: 'alert',
    }

    static Place = {
        Top: 'top',
        Bottom: 'bottom',
    }

    static showMessage(args) {
        if (masterRef) {
            if (typeof args === 'string') {
                masterRef.showMessage({ message: args });
            } else {
                masterRef.showMessage(args);
            }
        }
    }

    static showToastMessage(messageObject, messageComponent) {
        if (masterRef) {
            masterRef.showToastMessage(messageObject, messageComponent);
        }
    }

    static setAdditionalInset(key, inset) {
        if (masterRef) {
            masterRef.setAdditionalInset(key, inset);
        }
    }

    static removeAdditionalInset(key) {
        if (masterRef) {
            masterRef.removeAdditionalInset(key);
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            marginLeft: 0,
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
    onWindowContainerLayout(e) {
        const { width } = e.nativeEvent.layout;
        if (width !== this.getPageWidth()) {
            this.setPageWidth(width);
        }
    }

    // Setters
    setMarginLeft(marginLeft, callback) {
        this.setStateSafely({ marginLeft }, callback);
    }

    setPageWidth(pageWidth) {
        this.setStateSafely({ pageWidth });
    }

    setExternalMessageComponent(externalMessageComponent) {
        this.setStateSafely({ externalMessageComponent });
    }

    setInsets(insets) {
        this.setStateSafely({ insets });
    }

    setInsets(insets) {
        this.setState({ insets });
    }

    // Getters
    getMarginLeft() {
        return this.state.marginLeft;
    }

    getPageWidth() {
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
        const insets = this.getInsets();
        let maxInset = 0;
        Object.keys(insets).forEach((key) => {
            maxInset = Math.max(insets[key], maxInset);
        });
        return maxInset;
    }

    // Actions
    showMessage({
        title, subComponent, message, action,
        placement = UINotice.Place.Bottom,
        autoHide = true,
        onCancel = () => {},
    }) {
        this.subComponent = subComponent || null;
        this.title = title || '';
        this.message = message || '';
        this.action = action || { title: '', onPress: () => {} };
        this.onCancel = onCancel;
        this.setExternalMessageComponent(null);
        showMessage({
            position: placement,
            animated: false,
            message: '', // unused but required param
            duration: 10000,
            autoHide,
        });
        this.animateOpening();
    }

    showToastMessage({
        position, animated, duration, autoHide,
    }, messageComponent) {
        this.setExternalMessageComponent(messageComponent);
        showMessage({
            message: '', // unused but required param
            animationDuration: UIConstant.animationDuration(),
            animated,
            position,
            duration,
            autoHide,
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

    setAdditionalInset(key, inset) {
        const insets = this.getInsets();
        insets[key] = inset;
        this.setInsets(insets);
    }

    removeAdditionalInset(key) {
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
        const marginBottom = this.getMaxInset();

        return (
            <View
                style={{ alignItems, marginBottom }}
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
        const marginBottom = this.getMaxInset();
        let component = null;
        const externalComponent = this.getExternalMessageComponent();
        if (externalComponent) {
            component = <View style={{ marginBottom }}>{externalComponent}</View>;
        } else {
            component = this.renderMessageComponent();
        }
        return (
            <FlashMessage
                MessageComponent={() => component}
            />
        );
    }
}
