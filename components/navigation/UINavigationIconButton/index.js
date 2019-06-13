// @flow
import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIStyle from '../../../helpers/UIStyle';

import UIComponent from '../../UIComponent';

type Props = {
    onPress: () => void,
    containerStyle: ViewStyleProp,
    icon: any,
    disabled: boolean,
    testID?: string,
};

type State = {};

export default class UINavigationIconButton extends UIComponent<Props, State> {
    static defaultProps = {
        onPress: () => {},
        containerStyle: {},
        icon: null,
        disabled: false,
    }

    // Render
    render() {
        const {
            testID, containerStyle, disabled, onPress, icon,
        } = this.props;
        const testIDProp = testID ? { testID } : null;
        return (
            <TouchableOpacity
                {...testIDProp}
                style={[UIStyle.navigatorButton, containerStyle]}
                disabled={disabled}
                onPress={() => onPress()}
            >
                <Image source={icon} />
            </TouchableOpacity>
        );
    }
}
