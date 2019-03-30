// @flow
import React from 'react';
import { Image } from 'react-native';
import StylePropType from 'react-style-proptype';

import UIColor from '../../helpers/UIColor';

type Props = {
    color?: string,
    source: string,
    style?: StylePropType,
};

const UIImage = ({ color, source, style }: Props) => {
    const colorStyle = color ? UIColor.getTintColorStyle(color) : null;
    return (
        <Image
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
