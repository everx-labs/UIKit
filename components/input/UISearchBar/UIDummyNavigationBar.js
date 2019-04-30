import React from 'react';
import { Animated } from 'react-native';

import UIDevice from '../../../helpers/UIDevice';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';

class UIDummyNavigationBar extends UIComponent {
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
        super.componentDidMount();
        this.animateRollUp();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
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
