import React from 'react';
import { Image } from 'react-native';

import UIActionComponent from '../../UIActionComponent';

class UIActionImage extends UIActionComponent {
    renderContent() {
        const {
            iconDisabled, iconHovered, iconEnabled, disabled,
        } = this.props;

        let source;
        if (disabled) {
            source = iconDisabled;
        } else if (this.isHover()) {
            source = iconHovered;
        } else {
            source = iconEnabled;
        }
        return (
            <Image
                source={source}
            />
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
