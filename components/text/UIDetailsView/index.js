import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import UIFontStyle from '../../../helpers/UIFontStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';

const styles = StyleSheet.create({
    container: {
        marginVertical: UIConstant.normalContentOffset(),
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

export default class UIDetailsView extends UIComponent {
    // Render
    renderContentView() {
        const { secondaryCaptionRegular, primarySmallMedium } = UIFontStyle;
        const {
            value, comments, textStyle, commentsStyle,
        } = this.props;
        return (
            <View>
                <Text style={[primarySmallMedium, textStyle]}>
                    {value}
                </Text>
                <Text style={[secondaryCaptionRegular, commentsStyle]}>
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
    commentsStyle: {},
};

UIDetailsView.propTypes = {
    value: PropTypes.string,
    comments: PropTypes.string,
    onPress: PropTypes.func,
    containerStyle: StylePropType,
    textStyle: StylePropType,
    commentsStyle: StylePropType,
};
