// @flow
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State as RNGHState } from 'react-native-gesture-handler';

import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIStyle, UIColor, UIConstant } from '@tonlabs/uikit.core';
import { UIComponent } from '@tonlabs/uikit.components';
import { UIBackgroundView, UIBackgroundViewColors } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

const styles = StyleSheet.create({
    navigationView: {
        borderTopLeftRadius: UIConstant.borderRadius(),
        borderTopRightRadius: UIConstant.borderRadius(),
    },
    defaultContainer: {
        flexDirection: 'row',
        paddingHorizontal: UIConstant.contentOffset(),
        alignItems: 'center',
        justifyContent: 'center',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelImage: {
        height: UIConstant.smallCellHeight(),
        width: UIConstant.smallCellHeight(),
    },
    bottomLine: {
        borderBottomWidth: 1,
        borderBottomColor: UIColor.light(),
    },
    headerCentral: {
        // marginHorizontal: UIConstant.smallContentOffset(),
    },
});

type RNGHEvent<T> = { nativeEvent: T };

type Props = {
    rightComponent?: React$Node,
    leftComponent?: React$Node,
    centralComponent?: React$Node,
    bottomLine?: boolean,
    height: number,
    title: string,
    cancelImage: ?ImageSource,
    cancelText: string,
    swipeToDismiss: boolean,
    dismissStripeStyle: ViewStyleProp,
    onCancel: ?() => void,
    onMove: ?(event: RNGHEvent<{ translationY: number }>) => void;
    onRelease: ?((translateY: number) => void),
};

type State = {
    //
};

export default class UIModalNavigationBar extends UIComponent<Props, State> {
    static defaultProps = {
        title: '',
        bottomLine: false,
        cancelImage: null,
        cancelText: uiLocalized.Cancel,
        swipeToDismiss: false,
        dismissStripeStyle: null,
        onCancel: null,
        onMove: null,
        onRelease: null,
    };

    // Getters
    get isPanHandlerEnabled() {
        return !!this.props.swipeToDismiss && !!this.props.onMove && !!this.props.onRelease;
    }

    // Events
    onPanGestureEvent = (event: RNGHEvent<{translationY: number }>) => {
        // To make it jump smoothly we allow some negative offset
        if (event.nativeEvent.translationY > -UIConstant.contentOffset()) {
            if (this.props.onMove) {
                this.props.onMove(event);
            }
        }
    };

    onPanHandlerStateChange = ({
        nativeEvent: { state, translationY },
    }: RNGHEvent<{ state: RNGHState, translationY: number }>) => {
        if (state === RNGHState.END) {
            if (this.props.onRelease) {
                this.props.onRelease(translationY);
            }
        }
    };

    // Render
    renderContent() {
        const {
            onCancel, bottomLine, swipeToDismiss, dismissStripeStyle, cancelImage,
            cancelText, leftComponent, centralComponent, rightComponent,
        } = this.props;
        if (swipeToDismiss) {
            return (
                <View
                    style={[
                        UIStyle.Common.rowCenterSpaceContainer(),
                        UIStyle.Width.full(),
                        UIStyle.Padding.horizontal(),
                    ]}
                >
                    <View
                        style={[
                            UIStyle.Common.absoluteFillObject(),
                            UIStyle.Common.centerContainer(),
                        ]}
                    >
                        <View
                            testID="swipe_to_dismiss"
                            style={[UIStyle.Common.dismissStripe(), dismissStripeStyle]}
                        />
                    </View>
                    {leftComponent}
                    {rightComponent}
                </View>
            );
        }
        if (!onCancel) {
            return null;
        }
        const image = (
            <Image
                style={[UIStyle.margin.topSmall(), styles.cancelImage]}
                source={cancelImage}
            />
        );
        const text = (
            <Text style={UIStyle.Text.actionSmallMedium()}>
                {cancelText}
            </Text>
        );
        const separator = bottomLine ? styles.bottomLine : null;
        return (
            <View style={[UIStyle.Common.flex(), styles.defaultContainer, separator]}>
                <TouchableOpacity style={styles.navButton} onPress={onCancel}>
                    {cancelImage ? image : text}
                </TouchableOpacity>
                <View style={[UIStyle.Common.flex(), styles.headerCentral]}>
                    {centralComponent}
                </View>
                <View>
                    {rightComponent}
                </View>
            </View>
        );
    }

    // renderNavigationTitle() {
    //     const { swipeToDismiss, title } = this.props;
    //     if (swipeToDismiss) {
    //         return null;
    //     }
    //     return (
    //         <Text style={UIStyle.navigatorHeaderTitle}>
    //             {title}
    //         </Text>
    //     );
    // }

    render() {
        return (
            <PanGestureHandler
                enabled={this.isPanHandlerEnabled}
                onGestureEvent={this.onPanGestureEvent}
                onHandlerStateChange={this.onPanHandlerStateChange}
            >
                <UIBackgroundView
                    color={UIBackgroundViewColors.BackgroundPrimary}
                    testID="NavigationBar container"
                    style={[styles.navigationView, { height: this.props.height }]}
                >
                    {this.renderContent()}
                </UIBackgroundView>
            </PanGestureHandler>
        );
    }
}
