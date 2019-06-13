// @flow
import React from 'react';

import UIComponent from '../../UIComponent';
import UIDetailsInput, { detailsDefaultProps } from '../UIDetailsInput';
import UIFunction from '../../../helpers/UIFunction';
import UILocalized from '../../../helpers/UILocalized';

import type { DetailsProps } from '../UIDetailsInput';

type State = {};

export default class UIPhoneInput extends UIComponent<DetailsProps, State> {
    static defaultProps: DetailsProps = detailsDefaultProps;
    phoneInput: ?UIDetailsInput<DetailsProps, State>;

    isSubmitDisabled() {
        const { value } = this.props;
        return !UIFunction.isPhoneNumber(value);
    }

    placeholder() {
        return this.props.placeholder || UILocalized.Phone;
    }

    // Events
    onChangeText = (text: string) => {
        const { onChangeText } = this.props;
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
        return (
            <UIDetailsInput
                ref={(component) => { this.phoneInput = component; }}
                {...this.props}
                keyboardType="phone-pad"
                placeholder={this.placeholder()}
                submitDisabled={this.isSubmitDisabled()}
                onChangeText={this.onChangeText}
            />
        );
    }
}
