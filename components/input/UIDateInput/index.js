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
    containerStyle?: StylePropType,
    dateComponents?: string[],
    initialEpochTime?: number | null,
    separator?: string,
    maxLength?: number,
    onChangeDate?: (text: string, isDateValid: boolean) => void,
};
type State = ActionState & {
    date: string,
    highlightError: boolean,
};

export default class UIDateInput extends UIDetailsInput<Props, State> {
    static defaultProps: DetailsProps = {
        ...UIDetailsInput.defaultProps,
        containerStyle: {},
        dateComponents: ['year', 'month', 'day'],
        separator: '.',
        initialEpochTime: null,
        onChangeDate: () => {},
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.state,
            date: '',
            highlightError: false,
        };
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

        this.setStateSafely({ date: newDate }, () => {
            if (onChangeDate) {
                const dateObj = Moment(date, this.getPattern()).toDate();
                onChangeDate(dateObj, this.isValidDate());
            }
        });
    };

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
    renderFloatingTitle() {
        const { floatingTitle } = this.props;
        const date = this.getValue();
        const text = !floatingTitle || !date ? ' ' : this.placeholder();
        return (
            <Text style={UITextStyle.tertiaryTinyRegular}>
                {text}
            </Text>
        );
    }

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
                {this.renderMissingValue()}
            </React.Fragment>
        );
    }
}
