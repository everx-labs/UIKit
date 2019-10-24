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

const AGE_MAX = 100;
const AGE_MIN = 18;

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
    /**
    Is this input for age. Use ageMax/ageMin together with this prop.
    @default false
    */
    age?: boolean,
    /**
    If age is set, use it for max age.
    @default 100
    */
    ageMax?: number,
    /**
    If age is set, use it for min age.
    @default 18
    */
    ageMin?: number,
};
type State = ActionState & {
    date: string,
    highlightError: boolean,
};

export default class UIDateInput extends UIDetailsInput<Props, State> {
    static defaultProps: Props = {
        ...UIDetailsInput.defaultProps,
        dateComponents: ['year', 'month', 'day'],
        separator: '.',
        initialEpochTime: null,
        onChangeDate: () => {},
        age: false,
        ageMax: AGE_MAX,
        ageMin: AGE_MIN,
    };

    textChanged: boolean; // web only

    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.state,
            date: '',
            highlightError: false,
            prevValue: '',
            selection: { start: 0, end: 0 },
        };

        this.textChanged = false;
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

        const prevValue = this.getValue();
        this.textChanged = true;
        this.setStateSafely({ date: newDate, prevValue }, () => {
            if (onChangeDate) {
                const dateObj = Moment(this.getValue(), this.getPattern()).toDate();
                const ageInfo = this.props.age && this.isValidDate() ? this.isAgeValid() : null;
                onChangeDate(dateObj, ageInfo ? ageInfo.isAgeValid : this.isValidDate());
            }
        });
    };

    adjustSelection(selectionToAdjust: {start: number, end: number}) {
        if (Platform.OS === 'web') {
            if (!this.textChanged) {
                return selectionToAdjust;
            }
            this.textChanged = false;
        }

        const newValue = this.getValue();
        const prevValue = this.state.prevValue;
        const diff = newValue.length - prevValue.length;

        let adjustedPosition = selectionToAdjust.start;
        const separatorsAt = this.getSeparatorPositionsForDate();
        const separatorNextPositions = separatorsAt.map((posInOriginString, rank) => {
            return posInOriginString + rank + 1;
        });
        const isCursorAtNextSeparatorPosition = separatorNextPositions.includes(adjustedPosition);

        if (diff > 0 && isCursorAtNextSeparatorPosition) {
            ++adjustedPosition;
        }
        if (diff < 0 && adjustedPosition > newValue.length) {
            adjustedPosition = newValue.length;
        }

        const selection = { start: adjustedPosition, end: adjustedPosition };
        return selection;
    }

    getSelection = (): any => {
        return this.adjustSelection(this.state.selection);
    }

    onSelectionChange = (e: any): void => {
        this.setStateSafely({ selection: e.nativeEvent?.selection });
    }

    // Getters
    isAgeValid() {
        let isAgeValid = true;
        let ageErrorMessage = '';

        // check age:
        const dateObj = Moment(this.getValue(), this.getPattern()).toDate();
        const ageDifMs = Date.now() - dateObj.getTime();
        if (ageDifMs < 0) {
            isAgeValid = false;
            ageErrorMessage = UILocalized.InvalidDate;
        } else {
            const ageDate = new Date(ageDifMs);
            const age = ageDate.getUTCFullYear() - 1970;
            if (age < this.props.ageMin) {
                isAgeValid = false;
                ageErrorMessage = `${UILocalized.DoBMin} ${this.props.ageMin}`;
            } else if (age > this.props.ageMax) {
                isAgeValid = false;
                ageErrorMessage = `${UILocalized.DoBMax} ${this.props.ageMax}`;
            }
        }
        return { isAgeValid, ageErrorMessage };
    }

    commentColor() {
        const value = this.getValue();
        const ageInfo = this.props.age && this.isValidDate() ? this.isAgeValid() : null;

        if (value
            && (
                !this.isValidDate() || !ageInfo?.isAgeValid
            )) {
            return UIColor.detailsInputComment();
        }
        return null;
    }

    getComment() {
        const value = this.getValue();
        const ageInfo = this.props.age && this.isValidDate() ? this.isAgeValid() : null;
        if (value && (
            !this.isValidDate() || !ageInfo?.isAgeValid
        ) && this.state.highlightError) {
            return ageInfo ? ageInfo.ageErrorMessage : UILocalized.InvalidDate;
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

    getSeparatorPositionsForDate() {
        const date = this.getDate();
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
        const separatorsAt = this.getSeparatorPositionsForDate();
        const current = this.getDate();
        let newDate = separatorsAt.length > 0 ? '' : this.getDate();

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
