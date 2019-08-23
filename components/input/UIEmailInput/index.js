// @flow
import React from 'react';

import UIComponent from '../../UIComponent';
import UIDetailsInput, { detailsDefaultProps } from '../UIDetailsInput';
import UIFunction from '../../../helpers/UIFunction';
import UILocalized from '../../../helpers/UILocalized';
import type { DetailsProps } from '../UIDetailsInput';
import type { ActionState } from '../../UIActionComponent';
import UIColor from '../../../helpers/UIColor';

export type EmailState = {
    highlightError: boolean,
};

export default class UIEmailInput extends UIComponent<DetailsProps, ActionState & EmailState> {
    static defaultProps: DetailsProps = detailsDefaultProps;
    emailInput: ?UIDetailsInput<DetailsProps, ActionState>;

    consructor(props: DetailsProps) {
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
        const { value, theme, commentColor } = this.props;
        if (value && this.isSubmitDisabled()) {
            return UIColor.detailsInputComment(theme);
        }
        return commentColor;
    }

    getPlaceholder() {
        const { placeholder } = this.props;
        return placeholder || UILocalized.EmailAddress;
    }

    getComment() {
        const { value, comment } = this.props;
        if (value && this.isSubmitDisabled() && this.state.highlightError) {
            return UILocalized.InvalidEmail;
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
        const commentColor = this.getCommentColor();
        const commentColorProp = commentColor ? { commentColor } : null;
        return (
            <UIDetailsInput
                ref={(component) => { this.emailInput = component; }}
                {...this.props}
                {...commentColorProp}
                onBlur={this.onBlur}
                onChangeText={this.onChangeText}
                keyboardType="email-address"
                comment={this.getComment()}
                placeholder={this.getPlaceholder()}
                submitDisabled={this.isSubmitDisabled()}
                mandatory={this.props.mandatory}
            />
        );
    }
}
