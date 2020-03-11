// @flow
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import type { TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIStyle from '../../../helpers/UIStyle';

export type MenuItemType = {
    title: string,
    titleStyle?: TextStyleProp,
    details?: string,
    detailsStyle?: TextStyleProp,
    disabled?: boolean,
    chosen?: boolean,
    onPress?: () => void,
};

const MenuItem = (props: MenuItemType) => {
    const {
        title, details, titleStyle, detailsStyle, chosen, onPress, disabled,
    } = props;

    const contentStyle = details
        ? UIStyle.common.justifySpaceBetween()
        : UIStyle.common.justifyCenter();
    const marginRight = details ? UIStyle.margin.rightDefault() : null;
    const defaultTitleStyle = chosen ? UIStyle.text.primary() : UIStyle.text.action();
    const defaultDetailsStyle = chosen ? UIStyle.text.primary() : UIStyle.text.tertiary();
    const containerStyle = [
        UIStyle.common.centerLeftContainer(),
        UIStyle.height.buttonHeight(),
        contentStyle,
    ];

    const content = (
        <React.Fragment>
            <Text
                numberOfLines={1}
                style={[
                    UIStyle.text.smallMedium(),
                    marginRight,
                    defaultTitleStyle,
                    titleStyle,
                ]}
            >
                {title}
            </Text>
            <Text
                numberOfLines={1}
                style={[
                    UIStyle.text.smallRegular(),
                    defaultDetailsStyle,
                    detailsStyle,
                ]}
            >
                {details}
            </Text>
        </React.Fragment>
    );
    if (chosen) {
        return (
            <View style={containerStyle}>
                {content}
            </View>
        );
    }
    return (
        <TouchableOpacity
            style={containerStyle}
            disabled={disabled}
            onPress={onPress}
        >
            {content}
        </TouchableOpacity>
    );
};

export default MenuItem;

MenuItem.defaultProps = {
    chosen: false,
    disabled: false,
    titleStyle: null,
    details: '',
    detailsStyle: null,
    onPress: () => {},
};
