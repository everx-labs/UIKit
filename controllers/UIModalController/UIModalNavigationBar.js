// @flow
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, PanResponder } from 'react-native';

import UIStyle from '../../helpers/UIStyle';
import UILocalized from '../../helpers/UILocalized';
import UIConstant from '../../helpers/UIConstant';
import UIComponent from '../../components/UIComponent';
import UITextStyle from '../../helpers/UITextStyle';

const styles = StyleSheet.create({
    navigationView: {
        borderTopLeftRadius: UIConstant.borderRadius(),
        borderTopRightRadius: UIConstant.borderRadius(),
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
        height: 18,
        width: 18,
    },
});

type Props = {
    title: string,
    cancelImage: string,
    cancelText: string,
    swipeToDismiss: boolean,
    onCancel: () => void,
    onMove: () => void,
    onRelease: () => void,
};

export default class UIModalNavigationBar extends UIComponent {
    static defaultProps = {
        title: '',
        cancelImage: null,
        cancelText: UILocalized.Cancel,
        swipeToDismiss: false,
        onCancel: null,
        onMove: null,
        onRelease: null,
    };

    constructor(props) {
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

    // Getters
    getBarHeight(shouldSwipeToDismiss = false) {
        return this.props.height || (shouldSwipeToDismiss ? 30 : 48);
    }

    // Render
    renderCancelButton() {
        const {
            onCancel, swipeToDismiss, cancelImage, cancelText,
        } = this.props;
        if (swipeToDismiss) {
            return (
                <View
                    testID="swipe_to_dismiss"
                    style={UIStyle.dismissStripe}
                />
            );
        }
        if (!onCancel) {
            return null;
        }
        const image = (<Image style={styles.cancelImage} source={cancelImage} />);
        const text = (
            <Text style={UITextStyle.actionSmallMedium}>
                {cancelText}
            </Text>
        );
        return (
            <TouchableOpacity style={styles.navButton} onPress={onCancel}>
                {cancelImage ? image : text}
            </TouchableOpacity>
        );
    }

    renderNavigationTitle() {
        const { swipeToDismiss, title } = this.props;
        if (swipeToDismiss) {
            return null;
        }
        return (
            <Text style={UIStyle.navigatorHeaderTitle}>
                {title}
            </Text>
        );
    }

    render() {
        return (
            <View
                style={[
                    styles.navigationView,
                    { height: UIModalNavigationBar.getBarHeight(this.props.swipeToDismiss) },
                ]}
                {...this.panResponder.panHandlers}
            >
                {this.renderCancelButton()}
            </View>
        );
    }
}
