// @flow
import React from 'react';

import UIComponent from '../../UIComponent';
import UIDetailsInput, { detailsDefaultProps } from '../UIDetailsInput';
import UIFunction from '../../../helpers/UIFunction';
import UILocalized from '../../../helpers/UILocalized';
import type { DetailsProps, DetailsState } from '../UIDetailsInput';
import UIColor from '../../../helpers/UIColor';

export default class UIEmailInput extends UIComponent<DetailsProps, DetailsState> {
    static defaultProps: DetailsProps = detailsDefaultProps;
    emailInput: ?UIDetailsInput<DetailsProps, DetailsState>;

    // Getters
    isSubmitDisabled() {
        const { value } = this.props;
        return !UIFunction.isEmail(value);
    }

    getCommentColor() {
        const { value } = this.props;
        if (value && this.isSubmitDisabled()) {
            return UIColor.error();
        }
        return null;
    }

    placeholder() {
        const { placeholder, value } = this.props;
        if (value && this.isSubmitDisabled()) {
            return UILocalized.InvalidEmail;
        }
        return placeholder || UILocalized.EmailAddress;
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
                placeholder={this.placeholder()}
                submitDisabled={this.isSubmitDisabled()}
            />
        );
    }
}
