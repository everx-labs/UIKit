// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewStyleProp, TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIStyle, UIColor, UIConstant } from '@tonlabs/uikit.core';
import { UIComponent } from '@tonlabs/uikit.components';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';

type Props = {
    id?: any,
    initials?: string,
    textStyle?: TextStyleProp,
    containerStyle?: ViewStyleProp,
    avatarSize: number,
    testID?: ?string,
};

type Style = {};

const styles = StyleSheet.create({
    textStyle: {
        textAlign: 'center',
        alignSelf: 'center',
    },
});

class UIProfileInitials extends UIComponent<Props, Style> {
    static defaultProps = {
        id: null,
        initials: '',
        textStyle: null,
        containerStyle: null,
        avatarSize: UIConstant.profilePhotoSize(),
        testID: null,
    };

    getBackgroundColor() {
        const { id } = this.props;
        return UIColor.getAvatarBackgroundColor(id);
    }

    getAvatarContainer(): ViewStyleProp {
        const { avatarSize } = this.props;
        return {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2.0,
            backgroundColor: this.getBackgroundColor(),
        };
    }

    render() {
        const { initials, testID, textStyle } = this.props;
        return (
            <View
                testID={testID || 'profile_testID'}
                style={[
                    UIStyle.Common.alignCenter(),
                    UIStyle.justifyCenter,
                    this.getAvatarContainer(),
                    this.props.containerStyle,
                ]}
            >
                <UILabel
                    color={UILabelColors.StaticTextPrimaryLight}
                    role={textStyle || UILabelRoles.PromoHuge}
                    style={styles.textStyle}
                >
                    {initials}
                </UILabel>
            </View>
        );
    }
}

export default UIProfileInitials;
