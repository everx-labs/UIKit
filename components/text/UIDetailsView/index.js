// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { View, StyleSheet, TouchableOpacity } from 'react-native';

import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';
import UILabel from '../UILabel';

const styles = StyleSheet.create({
    container: {
        marginVertical: UIConstant.normalContentOffset(),
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

type Props = {
    value: string | number,
    comments: string,
    reversed: boolean,
    onPress: () => void,
    containerStyle: StylePropType,
    textStyle: StylePropType,
    commentsStyle: StylePropType,
};

export default class UIDetailsView extends UIComponent<Props> {
    // Render
    renderValue() {
        const { value, textStyle, onPress } = this.props;
        return (
            <UILabel
                style={textStyle}
                role={onPress ? UILabel.Role.SmallMedium : UILabel.Role.SmallRegular}
                text={value}
            />
        );
    }

    renderComment() {
        const { comments, commentsStyle } = this.props;
        return (
            <UILabel
                style={commentsStyle}
                role={UILabel.Role.CaptionTertiary}
                text={comments}
            />
        );
    }

    renderContentView() {
        if (this.props.reversed) {
            return (
                <View>
                    {this.renderComment()}
                    {this.renderValue()}
                </View>
            );
        }
        return (
            <View>
                {this.renderValue()}
                {this.renderComment()}
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
