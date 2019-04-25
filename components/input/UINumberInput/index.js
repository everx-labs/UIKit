// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import UIDetailsInput from '../UIDetailsInput';

import type { DetailsProps, DetailsState } from '../UIDetailsInput';

type Props = DetailsProps & {
    containerStyle?: StylePropType,
};
type State = DetailsState & {};

export default class UINumberInput extends UIDetailsInput<Props, State> {
    static defaultProps = {
        ...UIDetailsInput.defaultProps,
        containerStyle: {},
    };

    // Getters
    containerStyle() {
        const { rightButton } = this.props;
        const flex = rightButton && rightButton.length > 0 ? { flex: 1 } : null;
        return flex;
    }

    keyboardType() {
        return 'numeric';
    }

    // Events
    onChangeText(newValue: string) {
        const { onChangeText } = this.props;

        const isNum = /^\d+$/.test(newValue);
        if ((isNum || newValue.length === 0) && onChangeText) {
            onChangeText(newValue);
        }
    }

    // Render
    renderTexFragment() {
        return (
            <React.Fragment>
                {this.renderTextInput()}
            </React.Fragment>
        );
    }
}
