// @flow
import React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import UIStyle from '../../../helpers/UIStyle';
import UIConstant from '../../../helpers/UIConstant';

const styles = StyleSheet.create({
    menuItem: {
        height: UIConstant.actionSheetItemHeight(),
    },
});

type Props = {
    title: string,
    textStyle?: ViewStyleProp,
    onPress?: () => void,
};

const MenuItem = (props): Props => {
    const {
        title, details, textStyle, detailsStyle, onPress,
    } = props;
    const contentStyle = details
        ? UIStyle.Common.justifySpaceBetween()
        : UIStyle.Common.justifyCenter();
    return (
        <TouchableOpacity
            style={[
                UIStyle.Common.centerLeftContainer(),
                contentStyle,
                styles.menuItem,
            ]}
            onPress={onPress}
        >
            <Text style={[
                UIStyle.Text.primarySmallMedium(),
                textStyle,
            ]}
            >
                {title}
            </Text>
            <Text style={[
                UIStyle.Text.tertiarySmallRegular(),
                detailsStyle,
            ]}
            >
                {details}
            </Text>
        </TouchableOpacity>
    );
};

export default MenuItem;

MenuItem.defaultProps = {
    title: '',
    onPress: () => {},
};
