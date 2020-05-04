// @flow
import React from 'react';

import UIComponent from '../../UIComponent';
import UIDetailsInput from '../UIDetailsInput';
import type { DetailsProps } from '../UIDetailsInput';
import type { ActionState } from '../../UIActionComponent';

export default class UILinkInput extends UIComponent<DetailsProps, ActionState> {
    static defaultProps: DetailsProps = UIDetailsInput.defaultProps;
    linkInput: ?UIDetailsInput<DetailsProps, ActionState>;

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
                ref={(component) => {
                    this.linkInput = component;
                }}
                // $FlowFixMe
                {...this.props}
                keyboardType="url"
                beginningTag={this.beginningTag()}
            />
        );
    }
}
