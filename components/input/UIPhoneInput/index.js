// @flow
import React from 'react';
import { Platform } from 'react-native';

import UIComponent from '../../UIComponent';
import UIDetailsInput from '../UIDetailsInput';
import UIFunction from '../../../helpers/UIFunction';
import UILocalized from '../../../helpers/UILocalized';
import UIColor from '../../../helpers/UIColor';

import type { DetailsProps } from '../UIDetailsInput';

export type PhoneState = {
    highlightError: boolean,
    selection: { start: number, end: number },
    textFormated: string,
    prevText: string,
    text: string,
};

type State = {};

export default class UIPhoneInput extends UIComponent<DetailsProps, State & PhoneState> {
    static defaultProps: DetailsProps = UIDetailsInput.defaultProps;
    phoneInput: ?UIDetailsInput<DetailsProps, State>;
    textChanged: boolean;

    constructor(props: DetailsProps) {
        super(props);
        this.state = {
            highlightError: false,
            selection: { start: 0, end: 0 },
            textFormated: '',
            prevText: '',
            text: '',
        };

        this.textChanged = false;
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

    getPlaceholder() {
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

    getSelection() {
        if (Platform.OS !== 'web') {
            return null;
        }
        return this.adjustSelection(this.state.selection);
    }

    onSelectionChange = (e: any): void => {
        this.setStateSafely({ selection: e.nativeEvent?.selection });
    };

    adjustSelection(selectionToAdjust: {start: number, end: number}) {
        if (Platform.OS === 'web') {
            if (!this.textChanged) {
                return selectionToAdjust;
            }
            this.textChanged = false;
        }

        const cursorPosition = UIFunction.adjustCursorPosition2(
            this.state.prevText,
            this.state.textFormated,
        );
        return { start: cursorPosition, end: cursorPosition };
    }

    onChangeText = (text: string) => {
        const { onChangeText } = this.props;
        this.setStateSafely({ highlightError: false });
        this.textChanged = true;
        const prevText = this.state.textFormated;
        if (onChangeText) {
            const input = UIFunction.formatPhoneText(text);
            this.setStateSafely({ text, textFormated: input, prevText });
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
        const selection = this.getSelection();
        const commentColor = this.getCommentColor();
        const commentColorProp = commentColor ? { commentColor } : null;
        return (
            <UIDetailsInput
                {...this.props}
                {...commentColorProp}
                commentTestID="phone_input_comment"
                ref={(component) => { this.phoneInput = component; }}
                onBlur={this.onBlur}
                keyboardType="phone-pad"
                placeholder={this.getPlaceholder()}
                comment={this.getComment()}
                submitDisabled={this.isSubmitDisabled()}
                onChangeText={this.onChangeText}
                mandatory={this.props.mandatory}
                onSelectionChange={this.onSelectionChange}
                selection={selection}
            />
        );
    }
}
