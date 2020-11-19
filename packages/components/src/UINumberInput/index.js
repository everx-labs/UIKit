// @flow
import React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { KeyboardType } from 'react-native/Libraries/Components/TextInput/TextInput';

import { UIStyle } from '@tonlabs/uikit.core';

import { UIDetailsInput } from '../UIDetailsInput';
import type { UIDetailsInputProps } from '../UIDetailsInput';
import type { UIActionComponentState } from '../UIActionComponent';

type Props = UIDetailsInputProps & {
    containerStyle?: ViewStyleProp,
    rightButton?: string,
};

export default class UINumberInput extends UIDetailsInput<
    Props,
    UIActionComponentState
> {
    static defaultProps = {
        ...UIDetailsInput.defaultProps,
        rightButton: '',
        containerStyle: {},
    };

    // Getters
    containerStyle(): ViewStyleProp {
        const { rightButton } = this.props;
        return rightButton && rightButton.length > 0 ? UIStyle.common.flex() : null;
    }

    keyboardType(): KeyboardType {
        return 'numeric';
    }

    // Events
    onChangeText = (newValue: string): void => {
        const { onChangeText } = this.props;

        if (onChangeText && (!newValue?.length || /^\d+$/.test(newValue))) {
            onChangeText(newValue);
        }
    };

    // Render
    renderTextFragment() {
        return (
            <React.Fragment>
                {this.renderTextInput()}
            </React.Fragment>
        );
    }
}
