// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';

const styles = StyleSheet.create({
    itemContainer: {
        minWidth: UIConstant.menuWidth(),
        height: UIConstant.buttonHeight(),
        justifyContent: 'center',
        padding: UIConstant.contentOffset(),
    },
});

type Props = {
    titleStyle?: StylePropType,
    title: string,
    disabled?: boolean,
    onSelect: () => void,
};

const MenuItem = (props: Props) => {
    const textStyle = props.disabled
        ? UIStyle.textSecondarySmallRegular
        : UIStyle.textPrimarySmallRegular;
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
