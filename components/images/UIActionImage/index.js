import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';

import UIActionComponent from '../../UIActionComponent';

import type { EventProps } from '../../../types';

class UIActionImage extends UIActionComponent {
    render() {
        const {
            icoDisabled, icoAbledHover, icoAbled, disabled, onPress,
        } = this.props;

        let source;
        if (disabled) {
            source = icoDisabled;
        } else if (this.isHover()) {
            source = icoAbledHover;
        } else {
            source = icoAbled;
        }
        const mouseEvents: EventProps = {
            onMouseEnter: () => this.setHover(),
            onMouseLeave: () => this.setHover(false),
        };
        const image = (
            <Image
                source={source}
                {...mouseEvents}
            />
        );

        if (disabled) {
            return image;
        }
        return (
            <TouchableOpacity onPress={() => onPress()}>
                {image}
            </TouchableOpacity>
        );
    }
}

export default UIActionImage;

UIActionImage.defaultProps = {
    disabled: false,
    icoDisabled: null,
    icoAbled: null,
    icoAbledHover: null,
    onPress: () => {},
};
