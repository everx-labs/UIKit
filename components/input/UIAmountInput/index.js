// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { Platform, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import UIDetailsInput from '../UIDetailsInput';

import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';

import type { DetailsProps } from '../UIDetailsInput';
import type { ActionState } from '../../UIActionComponent';

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
type State = ActionState & {};

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
        return this.hidePlaceholder() || this.isFocused() ? '' : this.getPlaceholder();
    }

    getInputPlaceholderColor() {
        const { theme } = this.props;
        return UIStyle.color.getColorStyle(UIColor.amountInputPlaceholder(theme));
    }

    containerStyle() {
        const { rightButton } = this.props;
        return rightButton && rightButton.length > 0 ? { flex: 1 } : null;
    }

    keyboardType() {
        return 'decimal-pad';
    }

    // Events
    onChangeText = (newValue: string): void => {
        const { onChangeText } = this.props;

        // This prevents to type the symbols: - / * =
        if (newValue.match(/-|\/|\*|=/)) {
            return;
        }

        if (onChangeText) {
            onChangeText(newValue);
        }
    };

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
            UIStyle.text.secondarySmallMedium() : UIStyle.text.actionSmallMedium();
        const button = rightButton instanceof String || typeof rightButton === 'string'
            ? (
                <Text style={[UIStyle.text.secondaryBodyRegular, defaultTitleStyle]}>
                    {rightButton}
                </Text>
            )
            : rightButton;
        return (
            <TouchableOpacity
                testID="amount_input_right_button"
                disabled={rightButtonDisabled}
                onPress={onRightButtonPress}
            >
                {button}
            </TouchableOpacity>
        );
    }

    renderFloatingTitle() {
        const { floatingTitle, value, theme } = this.props;
        const text = (!floatingTitle || !value) && !this.isFocused()
            ? ' '
            : this.getPlaceholder();
        const colorStyle = UIColor.textTertiaryStyle(theme);
        return (
            <Text style={[UIStyle.text.tinyRegular(), colorStyle]}>
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
