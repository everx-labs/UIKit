import React from 'react';
import { Text } from 'react-native';

import UIActionComponent from '../../UIActionComponent';

class UIActionText extends UIActionComponent {
    getTextStyle() {
        const { tappedTextStyle, hoverTextStyle, defaultTextStyle } = this.props;
        if (this.isTapped()) {
            return tappedTextStyle;
        }
        if (this.isHover()) {
            return hoverTextStyle;
        }
        return defaultTextStyle;
    }

    renderContent() {
        const { onPress, value } = this.props;
        return (
            <Text
                onPress={() => onPress()}
                onPressIn={() => this.setTapped()}
                onPressOut={() => this.setTapped(false)}
                onMouseEnter={() => this.setHover()}
                onMouseLeave={() => this.setHover(false)}
                style={this.getTextStyle()}
            >
                {value}
            </Text>
        );
    }
}

export default UIActionText;

UIActionText.defaultProps = {
    value: '',
    defaultTextStyle: {},
    hoverTextStyle: {},
    tappedTextStyle: {},
    onPress: () => {},
};
