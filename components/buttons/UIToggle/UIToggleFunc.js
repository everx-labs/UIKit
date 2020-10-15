// this component can't be used now, because of some error in react inside UIKit
// @flow
import React, { useCallback } from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

import icoInactive from '../../../assets/ico-toggle-inactive/ico-toggle-inactive.png';
import icoActive from '../../../assets/ico-toggle-active/ico-toggle-active.png';
import icoOn from '../../../assets/ico-toggle-on/ico-toggle-on.png';
import icoOff from '../../../assets/ico-toggle-off/ico-toggle-off.png';

type Props = {
    iconActive: ?ImageSource,
    iconInactive: ?ImageSource,
    containerStyle: ViewStyleProp,
    active: boolean,
    colored: boolean,
    onPress: boolean => void,
    testID: ?string,
};

const UIToggle = ({
    active = false,
    onPress = () => {},
    colored = false,
    iconActive = null,
    iconInactive = null,
    containerStyle = {},
    testID = null,
}: Props) => {
    const onPresHandler = useCallback(() => {
        onPress(!active);
    }, [active]);

    let source;
    if (colored) {
        source = active ? (iconActive || icoOn) : (iconInactive || icoOff);
    } else {
        source = active ? (iconActive || icoActive) : (iconInactive || icoInactive);
    }

    const testIDProp = testID ? { testID } : null;

    return (
        <TouchableWithoutFeedback
            {...testIDProp}
            onPress={onPresHandler}
        >
            <View
                style={[containerStyle, {
                    cursor: 'pointer',
                    touchAction: 'manipulation',
                }]}
            >
                <Image
                    source={source}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default UIToggle;
