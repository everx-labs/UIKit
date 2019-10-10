// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Moment from 'moment';

import UIDetailsInput from '../UIDetailsInput';

import UIColor from '../../../helpers/UIColor';
import UITextStyle from '../../../helpers/UITextStyle';
import UILocalized from '../../../helpers/UILocalized';

import type { DetailsProps } from '../UIDetailsInput';
import type { ActionState } from '../../UIActionComponent';

const styles = StyleSheet.create({
    missingValueView: {
        zIndex: -1,
        position: 'absolute',
        top: null,
        left: 0,
        bottom: null,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    transparentValue: {
        color: 'transparent',
    },
    trailingValue: {
        color: UIColor.textSecondary(),
    },
});

type Props = DetailsProps & {
    /**
    Together with separator, specifies date patern, for ex:
    for 'YYYY.MM.DD' dateComponents are ['YYYY', 'MM', 'DD']
    and separator is '.'
    @default "['year', 'month', 'day']"
    */
    dateComponents?: string[],
    /**
    @default null
    */
    initialEpochTime?: number | null,
    /**
    Together with dateComponents, specifies date patern, for ex:
    for 'YYYY.MM.DD' dateComponents are ['YYYY', 'MM', 'DD']
    and separator is '.'
    @default '.'
    */
    separator?: string,
    /**
    Callback with text date.
    */
    onChangeDate?: (text: string, isDateValid: boolean) => void,
};
type State = ActionState & {
    date: string,
    highlightError: boolean,
    prevSelection?: ?{start: number, end: number},
};

export default class UIDateInput extends UIDetailsInput<Props, State> {
    static defaultProps: Props = {
        ...UIDetailsInput.defaultProps,
        dateComponents: ['year', 'month', 'day'],
        separator: '.',
        initialEpochTime: null,
        onChangeDate: () => {},
        multiline: Platform.OS === 'web',
    };

    selection: {start: number, end: number};
    oldValueWithSeparators: string;

    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.state,
            date: '',
            highlightError: false,
            prevSelection: { start: 0, end: 0 },
        };

        this.selection = { start: 0, end: 0 };
        this.oldValueWithSeparators = '';
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadInitialDate();
    }

    // Events
    onChangeText = (date: string): void => {
        const { onChangeDate } = this.props;
        this.setStateSafely({ highlightError: false });

        const newDate = date.split(this.getSeparator()).join('');
        if (Number.isNaN(Number(newDate))) return;

        this.setStateSafely({
            date: newDate,
            prevSelection: this.selection,
        }, () => {
            if (onChangeDate) {
                const dateObj = Moment(date, this.getPattern()).toDate();
                onChangeDate(dateObj, this.isValidDate());
            }
        });
    };

    correctCursorPosition(
        currentSelection: {start: number, end: number},
        prevSelection: {start: number, end: number},
        separatorsAt: number[],
    ) {
        if (Platform.OS !== 'web') {
            return null;
        }

        // correct cursor position for web input:
        const newValue = this.getValue();
        if (this.oldValueWithSeparators === newValue) {
            return currentSelection;
        }

        const valuesLengthDiff = (newValue.length - this.oldValueWithSeparators.length);
        this.oldValueWithSeparators = newValue;
        const symbolsWereAdded = (valuesLengthDiff > 0);
        const symbolsWereRemoved = (valuesLengthDiff < 0);
        // prevSelection.start is cursor position before this render:
        const selectionStart = prevSelection.start;
        const separatorPositionsInInputString = separatorsAt.map((posInOriginString, rank) => {
            return posInOriginString + rank;
        });
        const separatorNextPositionsInInputString = separatorsAt.map((posInOriginString, rank) => {
            return posInOriginString + rank + 1;
        });
        const cursorAtSeparatorPosition = separatorPositionsInInputString.includes(selectionStart);
        const cursorAtNextSeparatorPosition = separatorNextPositionsInInputString.includes(selectionStart);

        let offset = symbolsWereAdded ? 1 : symbolsWereRemoved ? -1 : 0;
        if (valuesLengthDiff > 0 && cursorAtSeparatorPosition) {
            ++offset; // +1 for separator symbol
        }
        if (valuesLengthDiff < 0 && cursorAtNextSeparatorPosition) {
            --offset; // -1 for separator symbol
        }
        return { start: selectionStart + offset, end: selectionStart + offset };
    }

    getSelection = (): any => {
        const selectionCorrected = this.correctCursorPosition(
            this.selection,
            this.state.prevSelection,
            this.getSeparatorPositionsForDate(this.getDate()),
        );
        if (selectionCorrected) {
            this.selection = selectionCorrected;
            return this.selection;
        }
        return null;
    }

    onSelectionChange = (e: any): void => {
        this.selection = e.nativeEvent?.selection;
        // correct cursor position if needed
        this.setStateSafely({});
    }

    // Getters
    commentColor() {
        const value = this.getValue();
        if (value && !this.isValidDate()) {
            return UIColor.detailsInputComment();
        }
        return null;
    }

    getComment() {
        const value = this.getValue();
        if (value && !this.isValidDate() && this.state.highlightError) {
            return UILocalized.InvalidDate;
        }
        return '';
    }

    onBlur = () => {
        this.setFocused(false);
        this.setStateSafely({ highlightError: true });
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    }

    keyboardType() {
        return Platform.OS === 'web' ? 'default' : 'number-pad';
    }

    isValidDate() {
        const date = this.getValue();
        const validDate = Moment(date, this.getPattern()).isValid();
        const validLength = date.length === this.getPattern(true).length || date.length === 0;

        return (validDate && validLength);
    }

    // This method returns a localized string that will be rendered
    // in order to indicate the date component that has to be entered.
    // However, internally (programming language), in order to parse/localize
    // a date, pattern symbols have to be provided in English.
    getPattern(localizedPattern: boolean = false) {
        const { dateComponents, separator } = this.props;
        const dateSymbols = localizedPattern ?
            UILocalized.DateSymbols
            : { year: 'YYYY', month: 'MM', day: 'DD' };
        const defaultPattern = 'YYYY.MM.DD';

        if (!dateComponents || !separator) return defaultPattern;

        let pattern = `${dateSymbols[dateComponents[0]]}`;
        for (let i = 1; i < dateComponents.length; i += 1) {
            pattern += `${separator}${dateSymbols[dateComponents[i]]}`;
        }

        return pattern;
    }

    getSeparatorPositionsForDate(dateString: string) {
        const date = dateString;
        const pattern = this.getPattern(true);
        const pos = [];

        let pad = 0;
        for (let i = 0; i < date.length + pad; i += 1) {
            if (pattern.charAt(i) === this.getSeparator()) {
                pos.push(i - pad);
                pad += 1;
            }
        }

        return pos;
    }

    getValue() {
        return this.getValueWithSeparators(this.getDate());
    }

    getValueWithSeparators(dateString: string) {
        const separatorsAt = this.getSeparatorPositionsForDate(dateString);
        const current = dateString;
        let newDate = separatorsAt.length > 0 ? '' : current;

        let last = 0;
        for (let i = 0; i < separatorsAt.length; i += 1) {
            newDate = `${newDate}${current.substring(last, separatorsAt[i])}${this.getSeparator()}`;
            last = separatorsAt[i];
        }
        if (separatorsAt.length > 0) {
            newDate = `${newDate}${current.substring(last)}`;
        }

        return newDate;
    }

    getDate() {
        return this.state.date || '';
    }

    getSeparator() {
        return this.props.separator || '.';
    }

    // Actions
    loadInitialDate() {
        const { initialEpochTime } = this.props;

        if (initialEpochTime) {
            const dateStr = Moment(initialEpochTime).format(this.getPattern());
            const value = dateStr.split(this.getSeparator()).join('');
            this.setStateSafely({ date: value });
        }
    }

    hidePlaceholder() {
        const date = this.getValue().length > 0;
        const isFocused = this.isFocused() || false;

        return (date || isFocused);
    }

    // Render
    renderMissingValue() {
        const date = this.getValue();
        if (date.length === 0 && !this.isFocused()) {
            return null;
        }

        const missing = this.getPattern(true).substring(date.length);
        return (
            <View style={styles.missingValueView}>
                <Text
                    style={[this.textInputStyle(), styles.transparentValue]}
                    selectable={false}
                >
                    {date}
                    <Text
                        style={styles.trailingValue}
                        selectable={false}
                    >
                        {missing}
                    </Text>
                </Text>
            </View>
        );
    }

    renderTextFragment() {
        return (
            <React.Fragment>
                {this.renderTextInput()}
                {this.renderRequiredPlaceholder()}
                {this.renderMissingValue()}
            </React.Fragment>
        );
    }

    render() {
        return super.render();
    }
}
