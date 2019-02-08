import React from 'react';
import { Animated, View } from 'react-native';

import UIStyle from '../../helpers/UIStyle';
import UIComponent from '../../components/UIComponent';

let masterRef = null;

export default class UILayoutManager extends UIComponent {
    static Animation = {
        Fade: 'fade',
    };

    static showComponent(args) {
        if (masterRef) {
            masterRef.showComponent(args);
        }
    }

    static hideComponent(args) {
        if (masterRef) {
            masterRef.hideComponent(args);
        }
    }

    static setPosition(position) {
        if (masterRef) {
            masterRef.setPosition(position);
        }
    }

    constructor(props) {
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
    setVisible(visible = true, callback) {
        this.setStateSafely({ visible }, callback);
    }

    setComponent(component) {
        this.setStateSafely({ component });
    }

    setPosition(position) {
        this.setStateSafely({ position });
    }

    setOpacity(opacity) {
        this.setStateSafely({ opacity });
    }

    setParams({
        component, position, visible, opacity,
    }, callback) {
        this.setStateSafely({
            component, position, visible, opacity,
        }, callback);
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
    showComponent({ component, animation, position }) {
        this.animation = animation;
        this.setParams({
            visible: true,
            opacity: new Animated.Value(0),
            component,
            position,
        }, () => this.animateShow(animation));
    }

    animateShow({ showDuration, delay }) {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: showDuration,
            delay,
        }).start();
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

    animateHide(animation, callback) {
        if (!animation) {
            return;
        }
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: animation.hideDuration,
        }).start(callback);
    }

    // Render
    render() {
        if (!this.isVisible() || !this.getPosition()) {
            return null;
        }
        const { top, left } = this.getPosition();
        const opacity = this.getOpacity();
        return (
            <Animated.View
                style={[UIStyle.absoluteFillObject, { opacity }]}
                pointerEvents="none"
            >
                <View style={{ position: 'absolute', top, left }}>
                    {this.getComponent()}
                </View>
            </Animated.View>
        );
    }
}
