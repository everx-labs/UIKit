// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { Platform, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import UIDetailsInput from '../UIDetailsInput';

import UIColor from '../../../helpers/UIColor';
import UITextStyle from '../../../helpers/UITextStyle';
import UIStyleColor from '../../../helpers/UIStyle/UIStyleColor';

import type { DetailsProps, DetailsState } from '../UIDetailsInput';

const styles = StyleSheet.create({
    inputPlaceholder: {
        zIndex: -1,
        position: 'absolute',
        top: null,
        left: 0,
        bottom: null,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    transparentValue: {
        color: 'transparent',
    },
    // TODO: Bad practice – padding was selected by eye.
    // Need better solution. (Michael V.)
    androidTextInputPadding: {
        paddingBottom: 6,
        paddingLeft: 4,
    },
});

type Props = DetailsProps & {
    containerStyle?: StylePropType,
    inputPlaceholder?: string,
    trailingValue?: string,
    rightButton?: string,
    rightButtonDisabled: boolean,
    onRightButtonPress?: () => void,
};
type State = DetailsState & {};

export default class UIAmountInput extends UIDetailsInput<Props, State> {
    static defaultProps = {
        ...UIDetailsInput.defaultProps,
        containerStyle: {},
        inputPlaceholder: '',
        trailingValue: '',
        rightButton: '',
        rightButtonDisabled: false,
        onRightButtonPress: () => {},
    };

    static getInputPlaceholderStyle() {
        // TODO: Bad practice – fast coding.
        // Need better solution. (Michael V.)
        return Platform.OS === 'android'
            ? [styles.inputPlaceholder, styles.androidTextInputPadding]
            : styles.inputPlaceholder;
    }

    // Getters
    getInlinePlaceholder() {
        return this.hidePlaceholder() || this.isFocused() ? '' : this.placeholder();
    }

    getInputPlaceholderColor() {
        const { theme } = this.props;
        return UIStyleColor.getColorStyle(UIColor.amountInputPlaceholder(theme));
    }

    containerStyle() {
        const { rightButton } = this.props;
        const flex = rightButton && rightButton.length > 0 ? { flex: 1 } : null;
        return flex;
    }

    keyboardType() {
        return 'decimal-pad';
    }

    // Events
    onChangeText(newValue: string) {
        const { onChangeText } = this.props;

        // This prevents to type the symbols: + - / * =
        if (newValue.match(/\+|-|\/|\*|=/)) {
            return;
        }

        if (onChangeText) {
            onChangeText(newValue);
        }
    }

    // Render
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
                testID="amount_input_right_button"
                disabled={rightButtonDisabled}
                onPress={onRightButtonPress}
            >
                <Text style={[UITextStyle.secondaryBodyRegular, defaultTitleStyle]}>
                    {rightButton}
                </Text>
            </TouchableOpacity>
        );
    }

    renderFloatingTitle() {
        const { floatingTitle, value, theme } = this.props;
        const text = (!floatingTitle || !value) && !this.isFocused()
            ? ' '
            : this.placeholder();
        const colorStyle = UIColor.textTertiaryStyle(theme);
        return (
            <Text style={[UITextStyle.tinyRegular, colorStyle]}>
                {text}
            </Text>
        );
    }

    renderInputPlaceholder() {
        if (!this.isFocused() || this.props.value) {
            return null;
        }
        return (
            <View style={UIAmountInput.getInputPlaceholderStyle()}>
                <Text
                    style={[this.textInputStyle(), this.getInputPlaceholderColor()]}
                    selectable={false}
                >
                    {this.props.inputPlaceholder}
                </Text>
            </View>
        );
    }

    renderTrailingValue() {
        const { trailingValue } = this.props;
        if (!trailingValue) {
            return null;
        }
        return (
            <View style={UIAmountInput.getInputPlaceholderStyle()}>
                <Text
                    onPress={() => this.focus()}
                    style={[this.textInputStyle(), styles.transparentValue]}
                    selectable={false}
                >
                    {this.props.value}
                    <Text
                        style={this.getInputPlaceholderColor()}
                        selectable={false}
                    >
                        {trailingValue}
                    </Text>
                </Text>
            </View>
        );
    }

    renderTextFragment() {
        return (
            <React.Fragment>
                {this.renderTextInput()}
                {this.renderInputPlaceholder()}
                {this.renderTrailingValue()}
                {this.renderToken()}
                {this.renderRightButton()}
            </React.Fragment>
        );
    }
}
