// @flow
import React from 'react';

import UIComponent from '../../UIComponent';
import UIDetailsInput, { detailsDefaultProps } from '../UIDetailsInput';
import type { DetailsProps, DetailsState } from '../UIDetailsInput';

export default class UILinkInput extends UIComponent<DetailsProps, DetailsState> {
    static defaultProps: DetailsProps = detailsDefaultProps;
    linkInput: ?UIDetailsInput<DetailsProps, DetailsState>;

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
                ref={(component) => { this.linkInput = component; }}
                {...this.props}
                keyboardType="url"
                beginningTag={this.beginningTag()}
            />
        );
    }
}
