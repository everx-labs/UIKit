// @flow
import React, { PureComponent } from 'react';
import { PanResponder, View } from 'react-native';
import type { PanResponderInstance } from 'react-native/Libraries/Interaction/PanResponder';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

type Props = {
    timeForInactivity?: number,
    children: React$Node,
    style?: ViewStyleProp,
    onIdle: () => void,
};

type State = {};

export default class UIIdleDetector extends PureComponent<Props, State> {
    static defaultProps = {
        style: {
            flex: 1,
        },
        timeForInactivity: 1000,
    };

    // Lifecycle
    componentDidMount() {
        this.onActivityDetected();
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    // Events
    onActivityDetected() {
        this.restart();
    }

    onShouldSetPanResponderCapture = () => {
        this.onActivityDetected();
        return false;
    };

    onTimeout = () => {
        this.props.onIdle();
    };

    panResponder: PanResponderInstance = PanResponder.create({
        onMoveShouldSetPanResponderCapture: this.onShouldSetPanResponderCapture,
        onPanResponderTerminationRequest: this.onShouldSetPanResponderCapture,
        onStartShouldSetPanResponderCapture: this.onShouldSetPanResponderCapture,
    });
    timeout: ?TimeoutID;

    // Actions
    restart() {
        this.clearTimer();
        this.timeout = setTimeout(this.onTimeout, this.props.timeForInactivity);
    }

    clearTimer() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    render() {
        const { style, children } = this.props;
        return (
            <View style={style} collapsable={false} {...this.panResponder.panHandlers}>
                {children}
            </View>
        );
    }
}
