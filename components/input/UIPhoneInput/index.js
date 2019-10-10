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
};

type State = {};

export default class UIPhoneInput extends UIComponent<DetailsProps, State & PhoneState> {
    static defaultProps: DetailsProps = UIDetailsInput.defaultProps;
    phoneInput: ?UIDetailsInput<DetailsProps, State>;
    selection: {start: number, end: number};
    textFormated: string;
    text: string;
    prevText: string;

    constructor(props: DetailsProps) {
        super(props);
        this.state = {
            highlightError: false,
        };

        this.selection = { start: 0, end: 0 };
        this.textFormated = '';
        this.text = '';
        this.prevText = '';
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

    onSelectionChange = (e: any): void => {
        this.selection = e.nativeEvent?.selection;
        // correct cursor position if needed
        this.setStateSafely({});
    }

    compareArrays = (arraySmall: any[], arrayBig: any[], position: number, positionInBigArray: boolean = false) => {
        let idx = 0;
        let distance = 0;
        while (idx < position + 1) {
            if (arrayBig[0] === arraySmall[0]) {
                arrayBig.shift();
                arraySmall.shift();
                ++idx;
            } else {
                arrayBig.shift();
                if (positionInBigArray) ++idx;
                ++distance;
            }
        }
        return distance;
    }

    correctCursorPosition = () => {
        if (Platform.OS !== 'web') {
            return null;
        }

        if (this.prevText === this.text || this.textFormated === this.text) {
            return this.selection;
        }

        this.prevText = this.text;
        const textArray = this.text.split('');
        const formatedTextArray = this.textFormated.split('');
        let newCursorPosition = this.selection.start;
        let countOfModifiedSymbolsBeforeCursor = 0;
        if (textArray.length < formatedTextArray.length) {
            countOfModifiedSymbolsBeforeCursor = this.compareArrays(textArray, formatedTextArray, this.selection.start - 1);
            newCursorPosition = this.selection.start + countOfModifiedSymbolsBeforeCursor;
        } else if (textArray.length > formatedTextArray.length) {
            countOfModifiedSymbolsBeforeCursor = this.compareArrays(formatedTextArray, textArray, this.selection.start - 1, true);
            newCursorPosition = this.selection.start - countOfModifiedSymbolsBeforeCursor;
        }

        return { start: newCursorPosition, end: newCursorPosition };
    }

    onChangeText = (text: string) => {
        this.text = text;
        this.prevText = this.props.value;

        const { onChangeText } = this.props;
        this.setStateSafely({ highlightError: false });
        if (onChangeText) {
            const input = UIFunction.formatPhoneText(text);
            this.textFormated = input;
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

    getSelection = (): any => {
        const selectionCorrected = this.correctCursorPosition();
        if (selectionCorrected) {
            this.selection = selectionCorrected;
            return this.selection;
        }
        return null;
    }

    // Render
    render() {
        const selection = this.getSelection();
        const commentColor = this.getCommentColor();
        const commentColorProp = commentColor ? { commentColor } : null;
        return (
            <UIDetailsInput
                ref={(component) => { this.phoneInput = component; }}
                {...this.props}
                {...commentColorProp}
                onBlur={this.onBlur}
                keyboardType="phone-pad"
                multiline={Platform.OS === 'web'}
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
