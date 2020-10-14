// @flow
import React from 'react';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIComponent } from '@uikit/components';
import UIAssets from '@uikit/assets';

import UINavigationIconButton from '../UINavigationIconButton';

type Props = {
    onPress: () => void,
    containerStyle: ViewStyleProp,
    testID?: string,
}

type State = {
    //
}

export default class UINavigationPlusButton extends UIComponent<Props, State> {
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
                onPress={onPress}
                icon={UIAssets.icoPlus()}
            />
        );
    }
}
