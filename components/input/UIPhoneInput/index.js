// @flow
import React from 'react';

import UIComponent from '../../UIComponent';
import UIDetailsInput, { detailsDefaultProps } from '../UIDetailsInput';
import UIFunction from '../../../helpers/UIFunction';
import UILocalized from '../../../helpers/UILocalized';

import type { DetailsProps, DetailsState } from '../UIDetailsInput';

export default class UIPhoneInput extends UIComponent<DetailsProps, DetailsState> {
    static defaultProps: DetailsProps = detailsDefaultProps;
    phoneInput: ?UIDetailsInput<DetailsProps, DetailsState>;

    isSubmitDisabled() {
        const { value } = this.props;
        return !UIFunction.isPhoneValid(value);
    }

    placeholder() {
        return this.props.placeholder || UILocalized.Phone;
    }

    onChangeText(text: string) {
        const { onChangeText } = this.props;
        if (onChangeText) {
            const input = UIFunction.formatPhoneText(text);
            onChangeText(input);
        }
    }

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
                onChangeText={newText => this.onChangeText(newText)}
            />
        );
    }
}
