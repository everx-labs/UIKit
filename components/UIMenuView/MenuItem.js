import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import UIConstant from '../../helpers/UIConstant';
import UIStyle from '../../helpers/UIStyle';

const styles = StyleSheet.create({
    itemContainer: {
        minWidth: UIConstant.menuWidth(),
        height: UIConstant.buttonHeight(),
        justifyContent: 'center',
        padding: UIConstant.contentOffset(),
    },
});

const MenuItem = (props) => {
    return (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => props.onSelect()}
            key={Math.random()}
        >
            <Text style={[UIStyle.primarySmallRegular, props.titleStyle]}>
                {props.title}
            </Text>
        </TouchableOpacity>
    );
};

export default MenuItem;

MenuItem.defaultProps = {
    titleStyle: {},
    title: '',
    onSelect: () => {},
};

MenuItem.propTypes = {
    titleStyle: StylePropType,
    title: PropTypes.string,
    onSelect: PropTypes.func,
};
