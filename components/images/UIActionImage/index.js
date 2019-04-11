import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

import UIActionComponent from '../../UIActionComponent';

import type { EventProps } from '../../../types';

class UIActionImage extends UIActionComponent {
    render() {
        const {
            iconDisabled, iconHovered, iconEnabled, disabled, onPress,
        } = this.props;

        let source;
        if (disabled) {
            source = iconDisabled;
        } else if (this.isHover()) {
            source = iconHovered;
        } else {
            source = iconEnabled;
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
    iconDisabled: null,
    iconEnabled: null,
    iconHovered: null,
    onPress: () => {},
};
