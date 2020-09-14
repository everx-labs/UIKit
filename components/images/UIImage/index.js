// @flow
import React from 'react';
import { Image, Platform } from 'react-native';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIColor from '../../../helpers/UIColor';

const FastImage = Platform.OS !== 'web' ? require('react-native-fast-image').default : null;

const ImageComponent: any = Platform.OS === 'web' ? Image : FastImage;

type Props = {
    color?: string,
    source: ImageSource,
    style?: ViewStyleProp,
};

const UIImage = ({ color, source, style }: Props) => {
    const colorStyle = color ? UIColor.getTintColorStyle(color) : null;
    return (
        <ImageComponent
            source={source}
            style={[colorStyle, style]}
        />
    );
};

export { UIImage as default };

UIImage.defaultProps = {
    color: null,
    style: {},
};
