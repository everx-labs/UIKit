// @flow

import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import UIStyle from '../../helpers/UIStyle';

type ButtonImage = 'close' | 'back' | ImageSource;

type Props = {
    image: ButtonImage,
    onPress: () => void,
    buttonStyle?: ViewStyleProp,

};
type State = {};

export default class UIImageButton extends React.Component<Props, State> {
    static backImage = 'back';
    static closeImage = 'close';

    static defaultProps = {
        buttonStyle: null,
    };

    // Events
    onPress() {
        if (this.props.onPress) {
            this.props.onPress();
        }
    }

    // Getters
    getButtonStyle() {
        return this.props.buttonStyle;
    }

    getImage(): ImageSource {
        switch (this.props.image) {
        case 'close':
            // eslint-disable-next-line global-require
            return require('../../assets/ico-arrow-left/ico-arrow-left.png');
        case 'back':
            // eslint-disable-next-line global-require
            return require('../../assets/ico-arrow-left/ico-arrow-left.png');
        default:
            return this.props.image;
        }
    }

    // React.Component
    render() {
        return (
            <TouchableOpacity
                style={[UIStyle.navigatorButton, this.getButtonStyle()]}
                onPress={() => this.onPress()}
            >
                <Image source={this.getImage()} />
            </TouchableOpacity>
        );
    }
}
