import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, TouchableOpacity, PanResponder } from 'react-native';

import UIStyle from '../../helpers/UIStyle';
import UILocalized from '../../helpers/UILocalized';
import UIConstant from '../../helpers/UIConstant';
import UIComponent from '../../components/UIComponent';

const navigationBarHeight = 48.0;

const styles = StyleSheet.create({
    navigationView: {
        borderTopLeftRadius: UIConstant.borderRadius(),
        borderTopRightRadius: UIConstant.borderRadius(),
        paddingHorizontal: 15,
        height: navigationBarHeight,
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

export default class UIModalNavigationBar extends UIComponent {
    static getBarHeight() {
        return navigationBarHeight;
    }

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

    // Render
    renderCancelButton() {
        const {
            onCancel, swipeToDismiss, cancelImage, cancelText,
        } = this.props;
        if (swipeToDismiss) {
            return (
                <View style={UIStyle.dismissStripe} />
            );
        }
        if (!onCancel) {
            return null;
        }
        const image = (<Image style={styles.cancelImage} source={cancelImage} />);
        const text = (
            <Text style={UIStyle.navigatorHeaderTitle}>
                {cancelText}
            </Text>
        );
        return (
            <TouchableOpacity style={styles.navButton} onPress={() => onCancel()}>
                {cancelImage ? image : text}
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View
                style={styles.navigationView}
                {...this.panResponder.panHandlers}
            >
                {this.renderCancelButton()}
                <Text style={UIStyle.navigatorHeaderTitle}>
                    {this.props.title}
                </Text>
            </View>
        );
    }
}

UIModalNavigationBar.defaultProps = {
    title: '',
    cancelImage: null,
    cancelText: UILocalized.Cancel,
    swipeToDismiss: false,
    onCancel: null,
    onMove: null,
    onRelease: null,
};

UIModalNavigationBar.propTypes = {
    title: PropTypes.string,
    cancelImage: PropTypes.any,
    cancelText: PropTypes.string,
    swipeToDismiss: PropTypes.bool,
    onCancel: PropTypes.func,
    onMove: PropTypes.func,
    onRelease: PropTypes.func,
};
