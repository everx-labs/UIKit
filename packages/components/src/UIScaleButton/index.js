// @flow
import React from 'react';
import { Animated } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIConstant } from '@tonlabs/uikit.core';

import { UIActionComponent } from '../UIActionComponent';
import type { UIActionComponentProps, UIActionComponentState } from '../UIActionComponent';

type Props = UIActionComponentProps & {
    content: React$Node,
    style: ViewStyleProp,
};

type State = UIActionComponentState;

export default class UIScaleButton extends UIActionComponent<Props, State> {
    static defaultProps = {
        ...UIActionComponent.defaultProps,
        style: {},
        scaleInFactor: UIConstant.animationScaleInFactor(),
    };

    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.state,
            scale: new Animated.Value(1.0),
        };
    }

    // Events
    onPressIn: () => void = () => {
        this.setTapped(true);
        this.scaleIn();
    };

    onPressOut: () => void = () => {
        this.setTapped(false);
        this.scaleOut();
    };

    // Getters

    // Actions
    scaleIn() {
        Animated.spring(this.state.scale, {
            toValue: this.props.scaleInFactor,
            useNativeDriver: true,
        }).start();
    }

    scaleOut() {
        Animated.spring(this.state.scale, {
            toValue: 1.0,
            useNativeDriver: true,
        }).start();
    }

    // render
    renderContent() {
        const { scale } = this.state;
        return (
            <Animated.View style={[this.props.style, { transform: [{ scale }] }]}>
                {this.props.content || this.props.children}
            </Animated.View>
        );
    }
}
