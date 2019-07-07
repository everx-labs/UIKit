// @flow
import React from 'react';
import type { TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import UIConstant from '../../../helpers/UIConstant';
import UITextStyle from '../../../helpers/UITextStyle';

const styles = StyleSheet.create({
    itemContainer: {
        minWidth: UIConstant.menuWidth(),
        height: UIConstant.buttonHeight(),
        justifyContent: 'center',
        padding: UIConstant.contentOffset(),
    },
});

type Props = {
    titleStyle?: TextStyleProp,
    title: string,
    disabled?: boolean,
    onSelect: () => void,
};

const MenuItem = (props: Props) => {
    const textStyle = props.disabled
        ? UITextStyle.secondarySmallRegular
        : UITextStyle.primarySmallRegular;
    return (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={props.disabled ? null : (() => props.onSelect())}
            key={Math.random()}
        >
            <Text style={[textStyle, props.titleStyle]}>{props.title}</Text>
        </TouchableOpacity>
    );
};

export default MenuItem;

MenuItem.defaultProps = {
    titleStyle: {},
    disabled: false,
};
