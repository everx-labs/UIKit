// @flow
import React from 'react';

import UIComponent from '../UIComponent';
import { UIDetailsInput } from '../UIDetailsInput';
import type { UIDetailsInputProps } from '../UIDetailsInput';
import type { UIActionComponentState } from '../UIActionComponent';

export default class UILinkInput extends UIComponent<
    UIDetailsInputProps,
    UIActionComponentState
> {
    static defaultProps: UIDetailsInputProps = UIDetailsInput.defaultProps;
    linkInput: ?UIDetailsInput<UIDetailsInputProps, UIActionComponentState>;

    // Getters
    beginningTag() {
        return this.props.beginningTag || 'https://';
    }

    // Actions
    focus() {
        if (this.linkInput) {
            this.linkInput.focus();
        }
    }

    blur() {
        if (this.linkInput) {
            this.linkInput.blur();
        }
    }

    clear() {
        if (this.linkInput) {
            this.linkInput.clear();
        }
    }

    // Render
    render() {
        return (
            <UIDetailsInput
                {...this.props}
                ref={(component) => { this.linkInput = component; }}
                keyboardType="url"
                beginningTag={this.beginningTag()}
            />
        );
    }
}
