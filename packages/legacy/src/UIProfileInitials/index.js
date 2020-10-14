// @flow
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import {
    UIStyle,
    UIColor,
    UIFont,
    UIConstant,
} from '@uikit/core';
import { UIComponent } from '@uikit/components';


type Props = {
    id?: any,
    initials?: string,
    textStyle?: ViewStyleProp,
    containerStyle?: ViewStyleProp,
    avatarSize: number,
    testID?: ?string,
};

type Style = {};

const styles = StyleSheet.create({
    textStyle: {
        textAlign: 'center',
        alignSelf: 'center',
        ...UIFont.titleLight(),
        color: UIColor.white(),
        letterSpacing: 0,
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
        const { initials, testID } = this.props;
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
                <Text style={[styles.textStyle, this.props.textStyle]}>
                    {initials}
                </Text>
            </View>
        );
    }
}

export default UIProfileInitials;
