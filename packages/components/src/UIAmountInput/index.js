// @flow
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIStyle } from '@tonlabs/uikit.core';

import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';

import { UIDetailsInput } from '../UIDetailsInput';
import type { UIDetailsInputProps } from '../UIDetailsInput';
import type { UIActionComponentState } from '../UIActionComponent';

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
});

type Props = UIDetailsInputProps & {
    containerStyle?: ViewStyleProp | ViewStyleProp[],
    inputPlaceholder?: string,
    trailingValue?: string,
    rightButton?: string,
    rightButtonDisabled: boolean,
    onRightButtonPress?: () => void,
};
type State = UIActionComponentState & {};

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

    // Getters
    getInlinePlaceholder() {
        return this.hidePlaceholder() || this.isFocused() ? '' : this.getPlaceholder();
    }

    containerStyle() {
        const { rightButton } = this.props;
        return rightButton && rightButton.length > 0 ? UIStyle.common.flex() : null;
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
        const { rightButton, onRightButtonPress, rightButtonDisabled } = this.props;
        if (!rightButton || rightButton.length === 0) {
            return null;
        }

        const button =
            rightButton instanceof String || typeof rightButton === 'string' ? (
                <UILabel
                    color={
                        rightButtonDisabled ? UILabelColors.TextSecondary : UILabelColors.TextAccent
                    }
                    role={UILabelRoles.ActionCallout}
                >
                    {rightButton}
                </UILabel>
            ) : (
                rightButton
            );
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
        const { floatingTitle, value } = this.props;
        const text = (!floatingTitle || !value) && !this.isFocused() ? ' ' : this.getPlaceholder();
        return (
            <UILabel color={UILabelColors.TextTertiary} role={UILabelRoles.ParagraphLabel}>
                {text}
            </UILabel>
        );
    }

    renderInputPlaceholder() {
        if (!this.isFocused() || this.props.value) {
            return null;
        }
        return (
            <View style={styles.inputPlaceholder}>
                <UILabel
                    color={UILabelColors.TextSecondary}
                    role={UILabelRoles.ParagraphText}
                    selectable={false}
                    style={this.textInputStyle()}
                >
                    {this.props.inputPlaceholder}
                </UILabel>
            </View>
        );
    }

    renderTrailingValue() {
        const { trailingValue } = this.props;
        if (!trailingValue) {
            return null;
        }
        return (
            <View style={styles.inputPlaceholder}>
                <UILabel
                    color={UILabelColors.Transparent}
                    onPress={() => this.focus()}
                    selectable={false}
                    style={this.textInputStyle()}
                >
                    {this.props.value}
                    <UILabel color={UILabelColors.TextSecondary} selectable={false}>
                        {trailingValue}
                    </UILabel>
                </UILabel>
            </View>
        );
    }

    renderTextFragment() {
        return (
            <>
                {this.renderTextInput()}
                {this.renderInputPlaceholder()}
                {this.renderTrailingValue()}
                {this.renderToken()}
                {this.renderRightButton()}
            </>
        );
    }
}
