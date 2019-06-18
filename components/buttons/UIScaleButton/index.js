// @flow
import React from 'react';
import { Animated } from 'react-native';

import UIActionComponent from '../../UIActionComponent';

import type { ActionProps, ActionState } from '../../UIActionComponent';

type Props = ActionProps & {
    content: React$Node,
}

type State = ActionState;

const SCALE_IN_FACTOR = 0.94;
const SCALE_OUT_FACTOR = 1.0;

export default class UIScaleButton extends UIActionComponent<Props, State> {
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
            toValue: SCALE_IN_FACTOR,
        }).start();
    }

    scaleOut() {
        Animated.spring(this.state.scale, {
            toValue: SCALE_OUT_FACTOR,
        }).start();
    }

    // render
    renderContent() {
        const { scale } = this.state;
        return (
            <Animated.View
                style={{ transform: [{ scale }] }}
            >
                {this.props.content || this.props.children}
            </Animated.View>
        );
    }
}
