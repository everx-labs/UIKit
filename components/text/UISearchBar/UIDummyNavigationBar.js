import React, { Component } from 'react';
import { Animated } from 'react-native';

import UIDevice from '../../../helpers/UIDevice';
import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';

class UIDummyNavigationBar extends Component {
    static calcFullHeight() {
        return UIDevice.statusBarHeight() + UIDevice.navigationBarHeight();
    }

    constructor(props) {
        super(props);

        this.state = {
            height: new Animated.Value(UIDummyNavigationBar.calcFullHeight()),
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.animateRollUp();
    }

    componentWillUnmount() {
        this.mounted = false;
        this.animateRollDown();
    }

    // Getters
    getHeight() {
        return this.state.height;
    }

    // Actions
    animateRollUp(callback) {
        if (!this.mounted) return;
        setTimeout(() => {
            requestAnimationFrame(() => {
                Animated.timing(this.state.height, {
                    toValue: UIDevice.statusBarHeight(),
                    duration: UIConstant.animationDuration(),
                }).start(callback);
            });
        }, 0);
    }

    animateRollDown(callback) {
        if (!this.mounted) return;
        setTimeout(() => {
            requestAnimationFrame(() => {
                Animated.timing(this.state.height, {
                    toValue: UIDummyNavigationBar.calcFullHeight(),
                    duration: UIConstant.animationDuration(),
                }).start(callback);
            });
        }, 0);
    }

    // Render
    render() {
        return (
            <Animated.View
                style={{
                    height: this.getHeight(),
                    backgroundColor: UIColor.backgroundPrimary(),
                }}
            />
        );
    }
}

export default UIDummyNavigationBar;
