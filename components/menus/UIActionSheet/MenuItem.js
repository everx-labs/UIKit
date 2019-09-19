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
    onPress: () => void,
};

const MenuItem = (props): MenuItemType => {
    const {
        title, details, titleStyle, detailsStyle, chosen, onPress,
    } = props;
    const contentStyle = details
        ? UIStyle.Common.justifySpaceBetween()
        : UIStyle.Common.justifyCenter();
    const marginRight = details ? UIStyle.Margin.rightDefault() : null;
    const defaultTitleStyle = chosen ? UIStyle.Text.primary() : UIStyle.Text.action();
    const defaultDetailsStyle = chosen ? UIStyle.Text.primary() : UIStyle.Text.tertiary();
    const Wrapper = chosen ? View : TouchableOpacity;
    const onPressProp = chosen ? {} : { onPress };
    return (
        <Wrapper
            style={[
                UIStyle.Common.centerLeftContainer(),
                UIStyle.Height.buttonHeight(),
                contentStyle,
            ]}
            {...onPressProp}
        >
            <Text
                numberOfLines={1}
                style={[
                    UIStyle.Text.smallMedium(),
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
                    UIStyle.Text.smallRegular(),
                    defaultDetailsStyle,
                    detailsStyle,
                ]}
            >
                {details}
            </Text>
        </Wrapper>
    );
};

export default MenuItem;

MenuItem.defaultProps = {
    title: '',
    chosen: false,
    disabled: false,
    onPress: () => {},
};
