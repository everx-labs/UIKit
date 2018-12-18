import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { View, StyleSheet, Text } from 'react-native';

import UIColor from '../../helpers/UIColor';
import UIFont from '../../helpers/UIFont';
import UIConstant from '../../helpers/UIConstant';

class UIProfileInitials extends Component {
    getBackgroundColor() {
        const { id } = this.props;
        return UIColor.getAvatarBackgroundColor(id);
    }

    render() {
        const { avatarSize, initials } = this.props;
        const styles = StyleSheet.create({
            avatarContainer: {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2.0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: this.getBackgroundColor(),
            },
            textStyle: {
                textAlign: 'center',
                alignSelf: 'center',
                ...UIFont.titleLight(),
                color: UIColor.white(),
            },
        });

        const { avatarContainer, textStyle } = styles;
        return (
            <View style={[avatarContainer, this.props.containerStyle]}>
                <Text style={[textStyle, this.props.textStyle, { letterSpacing: 0 }]}>
                    {initials}
                </Text>
            </View>
        );
    }
}

export default UIProfileInitials;

UIProfileInitials.defaultProps = {
    id: null,
    initials: '',
    textStyle: null,
    containerStyle: null,
    avatarSize: UIConstant.profilePhotoSize(),
};

UIProfileInitials.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    initials: PropTypes.string,
    textStyle: StylePropType,
    containerStyle: StylePropType,
    avatarSize: PropTypes.number,
};
