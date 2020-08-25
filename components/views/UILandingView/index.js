// @flow
// In this file some lines disabled because input types conflicts.
import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';

import type { FastImageSource } from 'react-native-fast-image';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';
import type { ImageStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIStyle from '../../../helpers/UIStyle';
import UILabel from '../../text/UILabel';
import UIComponent from '../../UIComponent';

const FastImage = Platform.OS !== 'web' ? require('react-native-fast-image').default : null;

const ImageComponent: any = Platform.OS === 'web' ? Image : FastImage;

type Props = {
    icon: ImageSource | FastImageSource,
    title: string,
    description: string,
    content?: string,
    testID?: string,
    iconStyle?: ImageStyleProp,
};

type State = {};

const iconSize = 128;
const descriptionMaxHeight = 152;

const styles = StyleSheet.create({
    icon: {
        width: iconSize,
        height: iconSize,
    },
    descriptionLabel: {
        flex: 1,
        maxHeight: descriptionMaxHeight,
    },
});

export default class UILandingView extends UIComponent<Props, State> {
    // Render
    render() {
        const {
            icon, title, description, testID, content,
        } = this.props;
        const testIDProp = testID ? { testID } : null;

        return (
            <React.Fragment {...testIDProp} >
                <ImageComponent
                    style={this.props.iconStyle || styles.icon}
                    source={icon}
                />
                <UILabel
                    style={UIStyle.Margin.topDefault()}
                    role={UILabel.Role.Subtitle}
                    text={title}
                />
                <UILabel
                    style={[
                        UIStyle.Margin.topSmall(),
                        !content && styles.descriptionLabel,
                    ]}
                    useDefaultSpace
                    role={UILabel.Role.Description}
                    text={description}
                />
                {content}
            </React.Fragment>
        );
    }
}
