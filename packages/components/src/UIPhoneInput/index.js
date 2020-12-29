// @flow
import React from 'react';
import { Platform } from 'react-native';

import { UIFunction } from '@tonlabs/uikit.core';
import { UILabelColors } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import UIComponent from '../UIComponent';
import { UIDetailsInput } from '../UIDetailsInput';
import type { UIDetailsInputProps } from '../UIDetailsInput';

export type PhoneState = {
    highlightError: boolean,
    selection: { start: number, end: number },
    textFormated: string,
    prevText: string,
    text: string,
};

type State = {};

export default class UIPhoneInput extends UIComponent<
    UIDetailsInputProps,
    State & PhoneState
> {
    static defaultProps: UIDetailsInputProps = UIDetailsInput.defaultProps;
    phoneInput: ?UIDetailsInput<UIDetailsInputProps, State>;
    textChanged: boolean;

    constructor(props: UIDetailsInputProps) {
        super(props);
        this.state = {
            highlightError: false,
            selection: { start: 0, end: 0 },
            textFormated: '',
            prevText: '',
            text: '',
        };

        this.textChanged = false;
    }

    isSubmitDisabled() {
        const { value } = this.props;
        return !value || !UIFunction.isPhoneNumber(value);
    }

    getCommentColor() {
        const { value, commentColor } = this.props;
        if (value && this.isSubmitDisabled()) {
            return UILabelColors.TextNegative;
        }
        return commentColor;
    }

    getPlaceholder() {
        return this.props.placeholder || uiLocalized.Phone;
    }

    getComment() {
        const { value, comment } = this.props;
        if (value && this.isSubmitDisabled() && this?.state?.highlightError) {
            return uiLocalized.InvalidPhone;
        }
        return comment;
    }

    // Events
    onBlur = () => {
        this.setStateSafely({ highlightError: true });
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    }

    getSelection() {
        if (Platform.OS !== 'web') {
            return null;
        }
        return this.adjustSelection(this.state.selection);
    }

    onSelectionChange = (e: any): void => {
        this.setStateSafely({ selection: e.nativeEvent?.selection });
    };

    adjustSelection(selectionToAdjust: {start: number, end: number}) {
        if (Platform.OS === 'web') {
            if (!this.textChanged) {
                return selectionToAdjust;
            }
            this.textChanged = false;
        }

        const cursorPosition = UIFunction.adjustCursorPosition2(
            this.state.prevText,
            this.state.textFormated,
        );
        return { start: cursorPosition, end: cursorPosition };
    }

    onChangeText = (text: string) => {
        const { onChangeText } = this.props;
        this.setStateSafely({ highlightError: false });
        this.textChanged = true;
        const prevText = this.state.textFormated;
        if (onChangeText) {
            const input = UIFunction.formatPhoneText(text);
            this.setStateSafely({ text, textFormated: input, prevText });
            onChangeText(input);
        }
    };

    // Actions
    focus() {
        if (this.phoneInput) {
            this.phoneInput.focus();
        }
    }

    blur() {
        if (this.phoneInput) {
            this.phoneInput.blur();
        }
    }

    clear() {
        if (this.phoneInput) {
            this.phoneInput.clear();
        }
    }

    // Render
    render() {
        return (
            <UIDetailsInput
                {...this.props}
                commentTestID="phone_input_comment"
                ref={(component) => { this.phoneInput = component; }}
                onBlur={this.onBlur}
                keyboardType="phone-pad"
                placeholder={this.getPlaceholder()}
                comment={this.getComment()}
                commentColor={this.getCommentColor()}
                submitDisabled={this.isSubmitDisabled()}
                onChangeText={this.onChangeText}
                mandatory={this.props.mandatory}
                onSelectionChange={this.onSelectionChange}
                selection={this.getSelection()}
            />
        );
    }
}
