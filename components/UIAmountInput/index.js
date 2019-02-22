// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import UIDetailsInput from '../text/UIDetailsInput';

import UIStyle from '../../helpers/UIStyle';
import UITextStyle from '../../helpers/UITextStyle';

const textInputFont = StyleSheet.flatten(UITextStyle.primaryBodyRegular) || {};
delete textInputFont.lineHeight;

const styles = StyleSheet.create({
    textInputView: {
        zIndex: -1,
        flex: 1,
        position: 'absolute',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        overflow: 'scroll',
    },
});

type Props = {
    containerStyle?: StylePropType,
    decimalValue?: string,
    rightButton?: string,
    rightButtonDisabled: boolean,
    onRightButtonPress?: () => void,
};
type State = {};

export default class UIAmountInput extends UIDetailsInput<Props, State> {
    containerStyle() {
        const { rightButton } = this.props;
        const flex = rightButton && rightButton.length > 0 ? { flex: 1 } : null;

        return flex;
    }

    renderRightButton() {
        const {
            rightButton,
            onRightButtonPress, rightButtonDisabled,
        } = this.props;
        if (!rightButton || rightButton.length === 0) {
            return null;
        }

        const defaultTitleStyle = rightButtonDisabled ?
            UITextStyle.secondarySmallMedium : UITextStyle.actionSmallMedium;
        return (
            <TouchableOpacity
                disabled={rightButtonDisabled}
                onPress={onRightButtonPress}
            >
                <Text style={[UITextStyle.secondaryBodyRegular, defaultTitleStyle]}>
                    {rightButton}
                </Text>
            </TouchableOpacity>
        );
    }

    renderDecimalValue() {
        const { value, decimalValue } = this.props;
        if (decimalValue.length === 0) return null;

        return (
            <View style={styles.textInputView}>
                <Text
                    style={UITextStyle.primaryBodyRegular}
                    selectable={false}
                >
                    {value}
                    <Text style={UITextStyle.secondaryBodyRegular} selectable={false}>
                        {decimalValue}
                    </Text>
                </Text>
            </View>
        );
    }

    renderTextView() {
        const { hideBottomLine, commentColor } = this.props;
        const bottomLine = hideBottomLine ? null : UIStyle.borderBottom;
        const bottomLineColor = commentColor ? { borderBottomColor: commentColor } : null;

        return (
            <View style={[this.textViewStyle(), bottomLine, bottomLineColor]}>
                {this.renderTextInput()}
                {this.renderDecimalValue()}
                {this.renderRightButton()}
            </View>
        );
    }
}

UIAmountInput.defaultProps = {
    containerStyle: {},
    decimalValue: '',
    rightButton: '',
    rightButtonDisabled: false,
    onRightButtonPress: () => {},
};

