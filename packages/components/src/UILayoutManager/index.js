// @flow
import React from 'react';
import { Animated, View } from 'react-native';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';

import { UIStyle } from '@tonlabs/uikit.core';

import UIComponent from '../UIComponent';

let masterRef = null;

export type Position = ?{ left: number, top: number };

type AnimationParams = ?{
    type?: string,
    showDuration?: number,
    hideDuration?: number,
    delay?: number,
};

type ShowParams = {
    component: React$Node,
    animation: AnimationParams,
    position?: Position,
};

type Props = {};

type State = {
    visible: boolean,
    position: Position,
    component: ?React$Node,
    opacity: AnimatedValue,
};

export default class UILayoutManager extends UIComponent<Props, State> {
    static Animation = {
        Fade: 'fade',
    };

    static showComponent(args: ShowParams) {
        if (masterRef) {
            masterRef.showComponent(args);
        }
    }

    static hideComponent() {
        if (masterRef) {
            masterRef.hideComponent();
        }
    }

    static setPosition(position: Position) {
        if (masterRef) {
            masterRef.setPosition(position);
        }
    }

    animation: AnimationParams;

    constructor(props: Props) {
        super(props);
        this.animation = null;

        this.state = {
            visible: false,
            position: {
                top: 0,
                left: 0,
            },
            component: null,
            opacity: new Animated.Value(0),
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

    // Setters
    setVisible(visible: boolean = true, callback?: () => void) {
        this.setStateSafely({ visible }, callback);
    }

    setComponent(component: React$Node) {
        this.setStateSafely({ component });
    }

    setPosition(position: Position) {
        this.setStateSafely({ position });
    }

    setOpacity(opacity: AnimatedValue) {
        this.setStateSafely({ opacity });
    }

    setParams({ component, position, visible, opacity }: State, callback?: () => void) {
        this.setStateSafely(
            {
                component,
                position,
                visible,
                opacity,
            },
            callback,
        );
    }

    // Getters
    getComponent() {
        return this.state.component;
    }

    getPosition() {
        return this.state.position;
    }

    getOpacity() {
        return this.state.opacity;
    }

    isVisible() {
        return this.state.visible;
    }

    // Actions
    showComponent({ component, animation, position }: ShowParams) {
        this.animation = animation;
        this.setParams(
            {
                visible: true,
                opacity: new Animated.Value(0),
                component,
                position,
            },
            () => this.animateShow(animation),
        );
    }

    animateShow(animationParams: AnimationParams) {
        if (animationParams) {
            const { showDuration, delay } = animationParams;
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: showDuration,
                delay,
                useNativeDriver: true,
            }).start();
        }
    }

    hideComponent() {
        this.animateHide(this.animation, () => {
            this.setParams({
                component: null,
                position: null,
                visible: false,
                opacity: new Animated.Value(0),
            });
        });
    }

    animateHide(animation: AnimationParams, callback?: () => void) {
        if (!animation) {
            return;
        }
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: animation.hideDuration,
            useNativeDriver: true,
        }).start(callback);
    }

    // Render
    render() {
        const position = this.getPosition();
        if (!this.isVisible() || !position) {
            return null;
        }
        const { top, left } = position;
        const opacity = this.getOpacity();
        return (
            <Animated.View
                style={[UIStyle.common.absoluteFillObject(), { opacity }]}
                pointerEvents="none"
            >
                <View style={{ position: 'absolute', top, left }}>{this.getComponent()}</View>
            </Animated.View>
        );
    }
}
