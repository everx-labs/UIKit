// @flow
import React, { PureComponent } from 'react';
import {
    PanResponder,
    View,
} from 'react-native';
import type { PanResponderInstance } from 'react-native/Libraries/Interaction/PanResponder';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

type Props = {
    timeForInactivity?: number;
    children: React$Node;
    style?: ViewStyleProp;
    onIdle: () => void;
};

type State = {
}

export default class UIIdleDetector extends PureComponent<Props, State> {
    static defaultProps = {
        style: {
            flex: 1,
        },
        timeForInactivity: 1000,
    };

    panResponder: PanResponderInstance;
    timeout: ?TimeoutID;

    clearTimer() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponderCapture: this.onShouldSetPanResponderCapture,
            onPanResponderTerminationRequest: this.onShouldSetPanResponderCapture,
            onStartShouldSetPanResponderCapture: this.onShouldSetPanResponderCapture,
        });
        this.onActivityDetected();
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    onActivityDetected() {
        this.restart();
    }

    onTimeout = () => {
        this.props.onIdle();
    };

    restart() {
        this.clearTimer();
        this.timeout = setTimeout(this.onTimeout, this.props.timeForInactivity);
    }

    onShouldSetPanResponderCapture = () => {
        this.onActivityDetected();
        return false;
    };

    render() {
        const {
            style,
            children,
        } = this.props;
        return (
            <View
                style={style}
                collapsable={false}
                {...this.panResponder.panHandlers}
            >
                {children}
            </View>
        );
    }
}
