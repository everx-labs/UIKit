// @flow
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, PanResponder } from 'react-native';
import type { PressEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import type { GestureState, PanResponderInstance } from 'react-native/Libraries/Interaction/PanResponder';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIStyle from '../../helpers/UIStyle';
import UIColor from '../../helpers/UIColor';
import UILocalized from '../../helpers/UILocalized';
import UIConstant from '../../helpers/UIConstant';
import UIComponent from '../../components/UIComponent';

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
    onMove: ?((event: PressEvent, gestureState: GestureState) => mixed);
    onRelease: ?((number) => void),
};

type State = {};

export default class UIModalNavigationBar extends UIComponent<Props, State> {
    static defaultProps = {
        title: '',
        bottomLine: false,
        cancelImage: null,
        cancelText: UILocalized.Cancel,
        swipeToDismiss: false,
        dismissStripeStyle: null,
        onCancel: null,
        onMove: null,
        onRelease: null,
    };

    panResponder: ?PanResponderInstance;
    constructor(props: Props) {
        super(props);

        if (this.props.swipeToDismiss && this.props.onMove && this.props.onRelease) {
            this.panResponder = PanResponder.create({
                // Ask to be the responder:
                onStartShouldSetPanResponder: (evt, gestureState) => true,
                onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
                onMoveShouldSetPanResponder: (evt, gestureState) => true,
                onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

                // Handling responder events
                onPanResponderMove: (evt, gestureState) => {
                    if (gestureState.dy > 0 && this.props.onMove) {
                        this.props.onMove(evt, gestureState);
                    }
                },
                onPanResponderRelease: (evt, gestureState) => {
                    if (this.props.onRelease) {
                        this.props.onRelease(gestureState.dy);
                    }
                },
            });
        }
    }

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
        const panHandlers = this.panResponder ? { ...this.panResponder.panHandlers } : {};
        return (
            <View
                testID="NavigationBar container"
                style={[
                    styles.navigationView,
                    { height: this.props.height },
                ]}
                {...panHandlers}
            >
                {this.renderContent()}
            </View>
        );
    }
}
