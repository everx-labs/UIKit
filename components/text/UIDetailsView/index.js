import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import UITextStyle from '../../../helpers/UITextStyle';
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
        const {
            secondaryCaptionRegular,
            primarySmallMedium,
            primarySmallRegular,
        } = UITextStyle;
        const {
            value, comments, textStyle, commentsStyle, reversed,
        } = this.props;
        const defaultTextStyle = this.props.onPress ? primarySmallMedium : primarySmallRegular;
        if (reversed) {
            return (
                <View>
                    <Text style={[secondaryCaptionRegular, commentsStyle]}>
                        {comments}
                    </Text>
                    <Text style={[defaultTextStyle, textStyle]}>
                        {value}
                    </Text>
                </View>
            );
        }
        return (
            <View>
                <Text style={[defaultTextStyle, textStyle]}>
                    {value}
                </Text>
                <Text style={[secondaryCaptionRegular, commentsStyle]}>
                    {comments}
                </Text>
            </View>
        );
    }

    render() {
        const { onPress, testID } = this.props;
        const Wrapper = onPress ? TouchableOpacity : View;
        const testIDProp = testID ? { testID } : null;
        return (
            <Wrapper
                {...testIDProp}
                style={[styles.container, this.props.containerStyle]}
                onPress={onPress}
            >
                {this.renderContentView()}
            </Wrapper>
        );
    }
}

UIDetailsView.defaultProps = {
    value: '',
    comments: '',
    reversed: false,
    onPress: null,
    containerStyle: {},
    textStyle: {},
    commentsStyle: {},
};

UIDetailsView.propTypes = {
    value: PropTypes.string,
    comments: PropTypes.string,
    reversed: PropTypes.bool,
    onPress: PropTypes.func,
    containerStyle: StylePropType,
    textStyle: StylePropType,
    commentsStyle: StylePropType,
};
