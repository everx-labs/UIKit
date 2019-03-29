// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View, Text, Platform } from 'react-native';
import type { KeyboardType } from 'react-native/Libraries/Components/TextInput/TextInput';

import UIDetailsInput from '../UIDetailsInput';

import UIColor from '../../../helpers/UIColor';
import UITextStyle from '../../../helpers/UITextStyle';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';

import type { DetailsProps, DetailsState } from '../UIDetailsInput';

import Moment from 'moment';

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
type State = DetailsState & {
    date: string
};

export default class UIDateInput extends UIDetailsInput<Props, State> {
    static defaultProps: DetailsProps = {
        ...UIDetailsInput.defaultProps,
        containerStyle: {},
        dateComponents: ['year', 'month', 'day'],
        separator: '.',
        initialEpochTime: null,
        maxLength: UIConstant.shortDateLength(),
        onChangeDate: () => {},
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            date: '',
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadInitialDate();
    }

    loadInitialDate() {
        const { initialEpochTime } = this.props;

        if (initialEpochTime) {
            const dateStr = Moment(initialEpochTime).format(this.getPattern(true));
            const value = dateStr.split(this.getSeparator()).join('');
            this.setStateSafely({ date: value });
        }
    }

    hidePlaceholder() {
        const date = this.getValue().length > 0;
        const isFocused = this.isFocused() || false;

        return (date || isFocused);
    }

    onChangeText(date: string) {
        const { onChangeDate } = this.props;

        const newDate = date.split(this.getSeparator()).join('');
        if (Number.isNaN(Number(newDate))) return;

        this.setStateSafely({ date: newDate }, () => {
            if (onChangeDate) {
                const dateObj = Moment(date, this.getPattern(true)).toDate();
                onChangeDate(dateObj, this.isValidDate());
            }
        });
    }

    // Getters
    commentColor() {
        return this.isValidDate() ? null : UIColor.error();
    }

    keyboardType() {
        return Platform.OS === 'web' ? 'default' : 'number-pad';
    }

    isValidDate() {
        const date = this.getValue();
        const validDate = Moment(date, this.getPattern(true)).isValid();
        const validLength = date.length === UIConstant.shortDateLength() || date.length === 0;

        return (validDate && validLength);
    }

    // This method returns a localized string that will be rendered
    // in order to indicate the date component that has to be entered.
    // However, internally (programming language), in order to parse/localized
    // a date, patter symbols have to be provided in English.
    getPattern(internalPattern: boolean = false) {
        const { dateComponents, separator } = this.props;
        const dateSymbols = internalPattern ?
            { year: 'YYYY', month: 'MM', day: 'DD' }
            : UILocalized.DateSymbols;
        const defaultPattern = 'YYYY.MM.DD';

        if (!dateComponents || !separator) return defaultPattern;

        let pattern = `${dateSymbols[dateComponents[0]]}${separator}`;
        pattern = `${pattern}${dateSymbols[dateComponents[1]]}${separator}`;
        pattern = `${pattern}${dateSymbols[dateComponents[2]]}`;

        return pattern;
    }

    getSeparatorPositionsForDate() {
        const date = this.getDate();
        const pattern = this.getPattern();
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

    // Render
    renderFloatingTitle() {
        const { floatingTitle, placeholder } = this.props;
        const date = this.getValue();
        const text = !floatingTitle || !date ? ' ' : placeholder;

        const color = !this.isValidDate() ? { color: UIColor.error() } : null;
        return (
            <Text style={[UITextStyle.tertiaryTinyRegular, color]}>
                {text}
            </Text>
        );
    }

    renderMissingValue() {
        const date = this.getValue();
        if (date.length === 0 && !this.isFocused()) {
            return null;
        }

        const missing = this.getPattern().substring(date.length);
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

    renderTexFragment() {
        return (
            <React.Fragment>
                {this.renderTextInput()}
                {this.renderMissingValue()}
            </React.Fragment>
        );
    }
}
