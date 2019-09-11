// @flow
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, PanResponder } from 'react-native';
import type { PressEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import type { GestureState, PanResponderInstance } from 'react-native/Libraries/Interaction/PanResponder';

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
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navButton: {
        flexDirection: 'row',
        position: 'absolute',
        left: 10,
        height: 40,
        minWidth: 40,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelImage: {
        height: UIConstant.tinyButtonHeight(),
        width: UIConstant.tinyButtonHeight(),
    },
    bottomLine: {
        borderBottomWidth: 1,
        borderBottomColor: UIColor.light(),
    },
    headerCentral: {
        marginHorizontal: UIConstant.contentOffset(),
    },
});

type Props = {
    rightComponent: ?React$Node,
    leftComponent: ?React$Node,
    centralComponent: ?React$Node,
    bottomLine: ?boolean,
    height: number,
    title: string,
    cancelImage: ?string,
    cancelText: string,
    swipeToDismiss: boolean,
    onCancel: ?() => void,
    onMove: (event: PressEvent, gestureState: GestureState) => mixed;
    onRelease: (number) => void,
};

type State = {};

export default class UIModalNavigationBar extends UIComponent<Props, State> {
    static defaultProps = {
        title: '',
        cancelImage: null,
        cancelText: UILocalized.Cancel,
        swipeToDismiss: false,
        onCancel: null,
        onMove: () => {},
        onRelease: () => {},
    };

    panResponder: PanResponderInstance;
    constructor(props: Props) {
        super(props);

        if (this.props.swipeToDismiss) {
            this.panResponder = PanResponder.create({
                // Ask to be the responder:
                onStartShouldSetPanResponder: (evt, gestureState) => true,
                onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
                onMoveShouldSetPanResponder: (evt, gestureState) => true,
                onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

                // Handling responder events
                onPanResponderMove: (evt, gestureState) => {
                    if (gestureState.dy > 0) {
                        this.props.onMove(evt, gestureState);
                    }
                },
                onPanResponderRelease: (evt, gestureState) => {
                    this.props.onRelease(gestureState.dy);
                },
            });
        } else {
            this.panResponder = {};
        }
    }

    // Render
    renderContent() {
        const {
            onCancel, bottomLine, swipeToDismiss, cancelImage, cancelText, leftComponent, centralComponent, rightComponent,
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
                        {...this.panResponder.panHandlers}
                    >
                        <View
                            testID="swipe_to_dismiss"
                            style={UIStyle.Common.dismissStripe()}
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
        const image = (<Image style={styles.cancelImage} source={cancelImage} />);
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
        const panHandler = this.props.swipeToDismiss ? {} : { ...this.panResponder.panHandlers };
        return (
            <View
                testID="NavigationBar container"
                style={[
                    styles.navigationView,
                    { height: this.props.height },
                ]}
                {...panHandler}
            >
                {this.renderContent()}
            </View>
        );
    }
}
