// @flow
import React from 'react';

import UIComponent from '../../UIComponent';
import UIDetailsInput, { detailsDefaultProps } from '../UIDetailsInput';
import UIFunction from '../../../helpers/UIFunction';
import UILocalized from '../../../helpers/UILocalized';
import UIColor from '../../../helpers/UIColor';

import type { DetailsProps } from '../UIDetailsInput';

export type PhoneState = {
    highlightError: boolean,
};

type State = {};

export default class UIPhoneInput extends UIComponent<DetailsProps, State & PhoneState> {
    static defaultProps: DetailsProps = detailsDefaultProps;
    phoneInput: ?UIDetailsInput<DetailsProps, State>;

    consructor(props: DetailsProps) {
        super.constructor(props);
        this.state = {
            highlightError: false,
        };
    }

    isSubmitDisabled() {
        const { value } = this.props;
        return !value || !UIFunction.isPhoneNumber(value);
    }

    getCommentColor() {
        const { value, theme, commentColor } = this.props;
        if (value && this.isSubmitDisabled()) {
            return UIColor.detailsInputComment(theme);
        }
        return commentColor;
    }

    placeholder() {
        return this.props.placeholder || UILocalized.Phone;
    }

    getComment() {
        const { value, comment } = this.props;
        if (value && this.isSubmitDisabled() && this?.state?.highlightError) {
            return UILocalized.InvalidPhone;
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

    onChangeText = (text: string) => {
        const { onChangeText } = this.props;
        this.setStateSafely({ highlightError: false });
        if (onChangeText) {
            const input = UIFunction.formatPhoneText(text);
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
        const commentColor = this.getCommentColor();
        const commentColorProp = commentColor ? { commentColor } : null;
        return (
            <UIDetailsInput
                ref={(component) => { this.phoneInput = component; }}
                {...this.props}
                {...commentColorProp}
                onBlur={this.onBlur}
                keyboardType="phone-pad"
                placeholder={this.placeholder()}
                comment={this.getComment()}
                submitDisabled={this.isSubmitDisabled()}
                onChangeText={this.onChangeText}
                mandatory={this.props.mandatory}
            />
        );
    }
}
