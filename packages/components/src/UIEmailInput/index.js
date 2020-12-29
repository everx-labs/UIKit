// @flow
import React from 'react';

import { UIFunction } from '@tonlabs/uikit.core';
import { UILabelColors } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import UIComponent from '../UIComponent';
import { UIDetailsInput } from '../UIDetailsInput';
import type { UIDetailsInputProps } from '../UIDetailsInput';
import type { UIActionComponentState } from '../UIActionComponent';

export type EmailState = {
    highlightError: boolean,
};

export default class UIEmailInput extends UIComponent<
    UIDetailsInputProps,
    UIActionComponentState & EmailState
> {
    static defaultProps: UIDetailsInputProps = UIDetailsInput.defaultProps;
    emailInput: ?UIDetailsInput<UIDetailsInputProps, UIActionComponentState>;

    consructor(props: UIDetailsInputProps) {
        super.constructor(props);
        this.state = {
            highlightError: false,
            tapped: false,
            hover: false,
        };
    }

    // Events
    onBlur = () => {
        this.setStateSafely({ highlightError: true });
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    };

    onChangeText = (text: string) => {
        this.setStateSafely({ highlightError: false });
        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }
    };

    // Getters
    isSubmitDisabled(value: string = this.props.value) {
        return !UIFunction.isEmail(value);
    }

    getCommentColor() {
        const { value, commentColor } = this.props;
        if (value && this.isSubmitDisabled()) {
            return UILabelColors.TextNegative;
        }
        return commentColor;
    }

    getPlaceholder() {
        const { placeholder } = this.props;
        return placeholder || uiLocalized.EmailAddress;
    }

    getComment() {
        const { value, comment } = this.props;
        if (value && this.isSubmitDisabled() && this.state.highlightError) {
            return uiLocalized.InvalidEmail;
        }
        return comment;
    }

    // Actions
    focus() {
        if (this.emailInput) {
            this.emailInput.focus();
        }
    }

    blur() {
        if (this.emailInput) {
            this.emailInput.blur();
        }
    }

    clear() {
        if (this.emailInput) {
            this.emailInput.clear();
        }
    }

    // Render
    render() {
        return (
            <UIDetailsInput
                {...this.props}
                commentTestID="email_input_comment"
                ref={(component) => { this.emailInput = component; }}
                onBlur={this.onBlur}
                onChangeText={this.onChangeText}
                keyboardType="email-address"
                comment={this.getComment()}
                commentColor={this.getCommentColor()}
                placeholder={this.getPlaceholder()}
                submitDisabled={this.isSubmitDisabled()}
                mandatory={this.props.mandatory}
            />
        );
    }
}
