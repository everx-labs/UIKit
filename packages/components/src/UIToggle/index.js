// @flow
import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIConstant } from '@tonlabs/uikit.core';
import { UIBackgroundView, UIBackgroundViewColors, UIImage } from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

const toggleWidth = 32;
const toggleHeight = 18;
const sliderSize = 10;

type Props = {
    iconActive: ?ImageSource,
    iconInactive: ?ImageSource,
    containerStyle: ViewStyleProp,
    active: boolean,
    colored: boolean,
    disabled: boolean,
    onPress: boolean => void,
    testID: ?string,
};

export default class UIToggle extends UIComponent<Props, {}> {
    static defaultProps: Props = {
        containerStyle: {},
        active: false,
        colored: false,
        disabled: false,
        onPress: () => {},
        testID: null,
        iconActive: null,
        iconInactive: null,
    };

    // Events
    onPress = () => {
        const { active, onPress } = this.props;
        onPress(!active);
    };

    // Render
    renderIcon(): React$Element<any> {
        const {
            active, colored, disabled, iconActive, iconInactive,
        } = this.props;

        const {
            BackgroundNeutral: disabledColor,
            BackgroundAccent: activeColor,
            BackgroundTertiaryInverted: inactiveColor,
            BackgroundPrimary: backgroundColor,
        } = UIBackgroundViewColors;

        const toggleColor = disabled ? disabledColor : (active ? activeColor : inactiveColor);
        const toggleStyle = disabled
            ? [styles.toggle, styles.inactivePosition]
            : (active ? [styles.toggle, styles.activePosition] : [styles.toggle, styles.inactivePosition]);

        if (colored) {
            return (
                <UIBackgroundView
                    color={toggleColor}
                    style={toggleStyle}
                >
                    <UIBackgroundView
                        color={backgroundColor}
                        style={styles.slider}
                    />
                </UIBackgroundView>
            );
        }

        return (
            <UIImage
                source={active
                ? iconActive || UIAssets.icons.ui.toggleActive
                : iconInactive || UIAssets.icons.ui.toggleInactive}
                tintColor={toggleColor}
            />
        );
    }

    render() {
        const { containerStyle, testID } = this.props;
        const testIDProp = testID ? { testID } : null;
        const element = this.renderIcon();

        return (
            <TouchableWithoutFeedback
                {...testIDProp}
                onPress={this.onPress}
            >
                <View style={containerStyle}>
                    {React.cloneElement(element, {
                        style: [element.props.style, {
                            cursor: 'pointer',
                            touchAction: 'manipulation',
                        }],
                    })}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    toggle: {
        width: toggleWidth,
        height: toggleHeight,
        borderRadius: toggleHeight / 2,
        padding: UIConstant.tinyContentOffset(),
    },
    slider: {
        width: sliderSize,
        height: sliderSize,
        borderRadius: sliderSize / 2,
    },
    activePosition: {
        alignItems: 'flex-end',
    },
    inactivePosition: {
        alignItems: 'flex-start',
    },
});
