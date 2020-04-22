// @flow
import React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { KeyboardType } from 'react-native/Libraries/Components/TextInput/TextInput';

import UIStyle from '../../../helpers/UIStyle';
import UIDetailsInput from '../UIDetailsInput';
import type { DetailsProps } from '../UIDetailsInput';
import type { ActionState } from '../../UIActionComponent';

type Props = DetailsProps & {
    containerStyle?: ViewStyleProp,
    rightButton?: string,
};

export default class UINumberInput extends UIDetailsInput<Props, ActionState> {
    static defaultProps = {
        ...UIDetailsInput.defaultProps,
        rightButton: '',
        containerStyle: {},
    };

    // Getters
    containerStyle(): ViewStyleProp {
        const { rightButton } = this.props;
        const flex = rightButton && rightButton.length > 0 ? UIStyle.flex : null;
        return flex;
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
