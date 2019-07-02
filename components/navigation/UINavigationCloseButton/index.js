// @flow
import React from 'react';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIComponent from '../../UIComponent';

import UINavigationIconButton from '../UINavigationIconButton';

import UIAssets from '../../../assets/UIAssets';

type Props = {
    onPress: () => void,
    containerStyle: ViewStyleProp,
    testID?: string,
}

type State = {
    //
}

export default class UINavigationCloseButton extends UIComponent<Props, State> {
    static defaultProps = {
        onPress: () => {},
        containerStyle: {},
    };

    // Render
    render() {
        const { containerStyle, onPress, testID } = this.props;
        const testIDProp = testID ? { testID } : null;
        return (
            <UINavigationIconButton
                {...testIDProp}
                containerStyle={containerStyle}
                onPress={() => onPress()}
                icon={UIAssets.btnClose()}
            />
        );
    }
}
