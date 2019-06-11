// @flow
import React from 'react';

import UIComponent from '../../UIComponent';
import UIDetailsInput, { detailsDefaultProps } from '../UIDetailsInput';
import UIFunction from '../../../helpers/UIFunction';
import UILocalized from '../../../helpers/UILocalized';
import type { DetailsProps } from '../UIDetailsInput';
import type { ActionState } from '../../UIActionComponent';
import UIColor from '../../../helpers/UIColor';

export default class UIEmailInput extends UIComponent<DetailsProps, ActionState> {
    static defaultProps: DetailsProps = detailsDefaultProps;
    emailInput: ?UIDetailsInput<DetailsProps, ActionState>;

    // Getters
    isSubmitDisabled() {
        const { value } = this.props;
        return !UIFunction.isEmail(value);
    }

    getCommentColor() {
        const { value, theme } = this.props;
        if (value && this.isSubmitDisabled()) {
            return UIColor.detailsInputComment(theme);
        }
        return null;
    }

    getPlaceholder() {
        const { placeholder } = this.props;
        return placeholder || UILocalized.EmailAddress;
    }

    getComment() {
        const { value } = this.props;
        if (value && this.isSubmitDisabled()) {
            return UILocalized.InvalidEmail;
        }
        return '';
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
                keyboardType="email-address"
                comment={this.getComment()}
                placeholder={this.getPlaceholder()}
                submitDisabled={this.isSubmitDisabled()}
            />
        );
    }
}
