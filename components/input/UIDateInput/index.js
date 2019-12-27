// @flow
import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Moment from 'moment';

import UIDetailsInput from '../UIDetailsInput';

import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';
import UIFunction from '../../../helpers/UIFunction';

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
    /**
     Range for checking is current date before end and after start.
     @default []
     */
    validateRange?: Date[],
};

type State = ActionState & {
    date: string,
    highlightError: boolean,
    selection: { start: number, end: number },
    textFormated: string,
    text: string,
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
        validateRange: [],
    };

    textChanged: boolean; // web only

    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.state,
            date: '',
            highlightError: false,
            selection: { start: 0, end: 0 },
            textFormated: '',
            text: '',
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

        this.setStateSafely({ date: newDate, text: date }, () => {
            this.textChanged = true;
            if (onChangeDate) {
                const dateObj = this.getDateObj();
                const ageInfo = this.props.age && this.isDateValid() ? this.isAgeValid() : null;
                onChangeDate(dateObj, ageInfo ? ageInfo.isAgeValid : this.isDateValid());
            }
        });
    };

    onSelectionChange = (e: any): void => {
        this.setStateSafely({ selection: e.nativeEvent?.selection });
    };

    onBlur = () => {
        this.setFocused(false);
        this.setStateSafely({ highlightError: true });
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    };

    // Getters
    getSelection() {
        if (Platform.OS !== 'web') {
            return null;
        }
        return this.adjustSelection(this.state.selection);
    }

    adjustSelection(selectionToAdjust: {start: number, end: number}) {
        if (Platform.OS === 'web') {
            if (!this.textChanged) {
                return selectionToAdjust;
            }
            this.textChanged = false;
        }

        const cursorPosition = UIFunction.adjustCursorPosition(
            this.state.text,
            selectionToAdjust.start,
            this.getValue(),
        );
        return { start: cursorPosition, end: cursorPosition };
    }

    commentColor() {
        if (this.isInputInvalid()) {
            return UIColor.detailsInputComment();
        }
        return null;
    }

    getComment() {
        const ageInfo = this.props.age && this.isDateValid() ? this.isAgeValid() : null;
        if (this.isInputInvalid() && this.state.highlightError) {
            return ageInfo ? ageInfo.ageErrorMessage : UILocalized.InvalidDate;
        }
        return '';
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

    keyboardType() {
        return Platform.OS === 'web' ? 'default' : 'number-pad';
    }

    getMomentObj() {
        return Moment(this.getValue(), this.getPattern());
    }

    getDateObj() {
        return this.getMomentObj().toDate();
    }

    isAgeValid() {
        let isAgeValid = true;
        let ageErrorMessage = '';

        // check age:
        const dateObj = this.getDateObj();
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

    isDateInRange() {
        const { validateRange } = this.props;
        const momentObj = this.getMomentObj();
        const start = validateRange[0] && Moment(validateRange[0]);
        const end = validateRange[1] && Moment(validateRange[1]);
        const isMomentBeforeEnd = !end || momentObj.isBefore(end);
        const isMomentAfterStart = !start || momentObj.isAfter(start);
        return isMomentBeforeEnd && isMomentAfterStart;
    }

    isDateValid() {
        const date = this.getValue();
        const validDate = Moment(date, this.getPattern()).isValid();
        const validLength = date.length === this.getPattern(true).length || date.length === 0;
        return (validDate && validLength && this.isDateInRange());
    }

    isInputInvalid() {
        const value = this.getValue();
        const ageInfo = this.props.age && this.isDateValid() ? this.isAgeValid() : null;
        return value && (!this.isDateValid() || (ageInfo && !ageInfo.isAgeValid));
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
