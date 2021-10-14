// @flow
// In this file some lines disabled because input types conflicts.
import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';
import type { ImageStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { FastImageSource } from 'react-native-fast-image';

import { UIStyle } from '@tonlabs/uikit.core';
import { UIComponent } from '@tonlabs/uikit.components';
import { UILabel, UILabelRoles, UILabelColors } from '@tonlabs/uikit.themes';

const FastImage = Platform.OS !== 'web' ? require('react-native-fast-image') : null;

const ImageComponent: any = Platform.OS === 'web' ? Image : FastImage;

type Props = {
    icon: ImageSource | FastImageSource,
    title: string,
    description: string,
    content?: string,
    iconStyle?: ImageStyleProp,
};

type State = {
    //
};

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
        const { icon, title, description, content } = this.props;

        return (
            <>
                <ImageComponent style={this.props.iconStyle || styles.icon} source={icon} />
                <UILabel
                    color={UILabelColors.TextPrimary}
                    role={UILabelRoles.TitleSmall}
                    style={UIStyle.margin.topMedium()}
                >
                    {title}
                </UILabel>
                <UILabel
                    color={UILabelColors.TextPrimary}
                    role={UILabelRoles.ParagraphNote}
                    style={[UIStyle.margin.topSmall(), !content && styles.descriptionLabel]}
                >
                    {description}
                </UILabel>
                {content}
            </>
        );
    }
}
