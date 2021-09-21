// @flow
import type { Node } from 'react';
import React from 'react';
import {
    Animated,
    Image,
    Platform,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import FlashMessage, { hideMessage, showMessage } from 'react-native-flash-message';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIConstant, UIColor, UIDevice, UIStyle } from '@tonlabs/uikit.core';
import type { PositionObject } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';

import UIComponent from '../UIComponent';

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
    fixTitleOverflow: {
        overflow: 'hidden',
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
    externalMessageComponent: Node,
    flashContainerLayoutWidth: number,
    showOnTop: boolean,
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
const insets: Insets = {};

export default class UINotice extends UIComponent<Props, State> {
    static Type = {
        Default: 'default',
        Alert: 'alert',
    };

    static Place = {
        Top: 'top',
        Bottom: 'bottom',
        BottomRight: 'bottom-right',
    };

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
        showOnTop: boolean = false,
    ) {
        if (masterRef) {
            masterRef.showToastMessage(messageObject, messageComponent, showOnTop);
        }
    }

    static setAdditionalInset(key: string, inset: number) {
        insets[key] = inset;
    }

    static removeAdditionalInset(key: string) {
        delete insets[key];
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            marginLeft: new Animated.Value(0),
            pageWidth: 0,

            externalMessageComponent: null,
            flashContainerLayoutWidth: 0,

            showOnTop: false,
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
    onWindowContainerLayout = (e: ViewLayoutEvent) => {
        const { width } = e.nativeEvent.layout;
        if (width !== this.getPageWidth()) {
            this.setPageWidth(width);
        }
    };

    onFlashContainerLayout = (e: ViewLayoutEvent) => {
        const { width } = e.nativeEvent.layout;
        this.setStateSafely({ flashContainerLayoutWidth: width });
    };

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

    setShowOnTop(showOnTop: boolean) {
        this.setStateSafely({ showOnTop });
    }

    // Getters
    getMarginLeft(): AnimatedValue {
        return this.state.marginLeft;
    }

    getPageWidth(): number {
        return this.state.pageWidth;
    }

    get showOnTop(): boolean {
        return this.state.showOnTop;
    }

    getContainerWidth() {
        const pageNoticeWidth = this.getPageWidth() + hiddenOffset * 2;
        const defaultNoticeWidth = UIConstant.noticeWidth() + doubleOffset;
        return Math.min(pageNoticeWidth, defaultNoticeWidth);
    }

    getExternalMessageComponent() {
        return this.state.externalMessageComponent;
    }

    getMaxInset() {
        let maxInset = 0;
        Object.keys(insets).forEach(key => {
            maxInset = Math.max(insets[key], maxInset);
        });
        return maxInset;
    }

    getPosition(placement: Placement) {
        const { Bottom, BottomRight } = UINotice.Place;

        // if not to set correct 'left/right' property,
        // then flashMessage streches horizontally and
        // blocks touchs on all horizontal space.
        const right = Math.max(this.state.flashContainerLayoutWidth - UIConstant.noticeWidth(), 0);

        if (placement === Bottom) {
            return { bottom: this.getMaxInset(), right };
        }
        // TODO
        if (placement === BottomRight) {
            return { bottom: this.getMaxInset(), right };
        }
        return placement;
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
            title,
            subComponent,
            message,
            action,
            placement = Bottom,
            autoHide = true,
            onCancel = () => {},
        } = args;
        this.subComponent = subComponent || null;
        this.title = title || '';
        this.message = message || '';
        this.action = action || {
            title: '',
            onPress: () => {},
        };
        this.onCancel = onCancel;
        this.setExternalMessageComponent(null);
        const position = this.getPosition(placement);
        showMessage({
            message: '', // unused but required param
            animated: false,
            duration: 10000,
            autoHide,
            position,
        });
        this.animateOpening();
    }

    showToastMessage(
        messageObject: MessageObject,
        messageComponent: Node,
        showOnTop: boolean = false,
    ) {
        this.setExternalMessageComponent(messageComponent);
        this.setShowOnTop(showOnTop);
        const bottom = this.getMaxInset();

        // toast message is centered
        // if not to set correct 'left/right' property,
        // then flashMessage streches horizontally and
        // blocks touchs on all horizontal space.
        const parentSpace = Math.max(
            this.state.flashContainerLayoutWidth - UIConstant.noticeWidth(),
            0,
        );
        const offset = parentSpace / 2;
        const position = messageObject.position || ({ bottom, right: offset, left: offset }: any);

        showMessage({
            animationDuration: UIConstant.animationDuration(),
            position,
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
        this.setMarginLeft(new Animated.Value(-containerWidth - contentOffset), () => {
            // TODO: need to think how to use `useNativeDriver`
            Animated.spring(this.state.marginLeft, {
                toValue: cardShadowWidth,
                duration: UIConstant.animationDuration(),
                useNativeDriver: false,
            }).start();
        });
    }

    animateClosing() {
        const containerWidth = this.getContainerWidth();
        // TODO: need to think how use `useNativeDriver`
        Animated.timing(this.state.marginLeft, {
            toValue: -containerWidth - contentOffset,
            duration: UIConstant.animationDuration(),
            useNativeDriver: false,
        }).start(() => hideMessage());
    }

    // Render
    renderCloseButton() {
        const icoClose =
            this.action && this.action.title
                ? UIAssets.icons.ui.closeGrey
                : UIAssets.icons.ui.closeBlue;
        return (
            <TouchableOpacity onPress={() => this.closeWithCancel()}>
                <Image source={icoClose} />
            </TouchableOpacity>
        );
    }

    renderHeader() {
        const title = (
            <UILabel
                color={UILabelColors.TextPrimary}
                role={UILabelRoles.HeadlineHead}
                style={styles.fixTitleOverflow}
            >
                {this.title}
            </UILabel>
        );
        const titleComponent = this.title ? title : null;
        const subView = <View style={UIStyle.margin.rightNormal()}>{this.subComponent}</View>;
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
                    <UILabel color={UILabelColors.TextPrimary} role={UILabelRoles.ActionCallout}>
                        {this.action.title}
                    </UILabel>
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
            <View style={{ alignItems }} onLayout={this.onWindowContainerLayout}>
                <View style={[styles.container, { width: containerWidth }]}>
                    <Animated.View
                        style={[
                            styles.noticeStyle,
                            {
                                width: noticeWidth,
                                marginLeft,
                            },
                        ]}
                    >
                        <View style={styles.contentContainer}>
                            {this.renderHeader()}

                            <UILabel
                                color={UILabelColors.TextTertiary}
                                role={UILabelRoles.ParagraphFootnote}
                            >
                                {this.message}
                            </UILabel>
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
        // This is ugly and not very performant,
        // but we're going to replace it soon anyway
        // Pick `zIndex` for UINotice thus to overlap all components  http://softwareas.com/whats-the-maximum-z-index/ (as per Safari 0-3 threshold)
        const zIndex = 16777271;
        const MessageComponent = React.forwardRef(() => component);
        return (
            <SafeAreaView style={UIStyle.Common.flex()} pointerEvents="box-none">
                <View
                    style={[UIStyle.Common.flex(), this.showOnTop && { zIndex }]}
                    onLayout={this.onFlashContainerLayout}
                    pointerEvents="box-none"
                >
                    <FlashMessage MessageComponent={MessageComponent} />
                </View>
            </SafeAreaView>
        );
    }
}
