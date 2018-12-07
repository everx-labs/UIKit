import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import UIStyle from '../UIStyle';
import UIConstant from '../UIConstant';

const styles = StyleSheet.create({
    container: {
        marginVertical: UIConstant.normalContentOffset(),
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

export default class UIDetailsView extends Component {
    // Render
    renderContentView() {
        const { textSecondaryCaptionRegular, textPrimarySmallMedium } = UIStyle;
        const {
            value, comments, textStyle,
        } = this.props;
        return (
            <View>
                <Text style={[textPrimarySmallMedium, textStyle]}>
                    {value}
                </Text>
                <Text style={textSecondaryCaptionRegular}>
                    {comments}
                </Text>
            </View>
        );
    }

    render() {
        const { onPress } = this.props;
        const Wrapper = onPress ? TouchableOpacity : View;
        return (
            <Wrapper
                style={[styles.container, this.props.containerStyle]}
                onPress={() => onPress()}
            >
                {this.renderContentView()}
            </Wrapper>
        );
    }
}

UIDetailsView.defaultProps = {
    value: '',
    comments: '',
    onPress: null,
    containerStyle: {},
    textStyle: {},
};

UIDetailsView.propTypes = {
    value: PropTypes.string,
    comments: PropTypes.string,
    onPress: PropTypes.func,
    containerStyle: StylePropType,
    textStyle: StylePropType,
};
