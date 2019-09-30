// @flow
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIStyle from '../../../helpers/UIStyle';
import UIColor from '../../../helpers/UIColor';
import UIFont from '../../../helpers/UIFont';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';


type Props = {
    id?: any,
    initials?: string,
    textStyle?: ViewStyleProp,
    containerStyle?: ViewStyleProp,
    avatarSize: number,
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
        const { initials } = this.props;
        return (
            <View
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
