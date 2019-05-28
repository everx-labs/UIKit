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

    constructor(props) {
        super(props);

        this.state = {
            highlightError: false,
        };
    }

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
        if (value && this.isSubmitDisabled() && this.state.highlightError) {
            return UILocalized.InvalidEmail;
        }
        return '';
    }

    onBlur() {
      this.setStateSafely({highlightError: true});
    }

    onChangeText(text) {
      this.setStateSafely({highlightError: false});
      this.props.onChangeText && this.props.onChangeText(text);
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
                onBlur={this.onBlur.bind(this)}
                onChangeText={this.onChangeText.bind(this)}
                keyboardType="email-address"
                comment={this.getComment()}
                placeholder={this.getPlaceholder()}
                submitDisabled={this.isSubmitDisabled()}
            />
        );
    }
}
