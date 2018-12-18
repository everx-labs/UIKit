import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import UIStyle from '../../helpers/UIStyle';
import UIConstant from '../../helpers/UIConstant';

const styles = StyleSheet.create({
    menuItem: {
        height: UIConstant.actionSheetItemHeight(),
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const MenuItem = (props) => {
    const { title, textStyle, onPress } = props;
    return (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onPress()}
        >
            <Text style={[
                UIStyle.textPrimarySmallMedium,
                textStyle,
            ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default MenuItem;

MenuItem.defaultProps = {
    title: null,
    textStyle: null,
    onPress: () => {},
};

MenuItem.propTypes = {
    title: PropTypes.string,
    textStyle: StylePropType,
    onPress: PropTypes.func,
};
