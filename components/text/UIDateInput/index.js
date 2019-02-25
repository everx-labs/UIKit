// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View, Text, Platform } from 'react-native';
import type { KeyboardType } from 'react-native/Libraries/Components/TextInput/TextInput';

import UIDetailsInput from '../UIDetailsInput';

import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';

import type { DetailsProps, DetailsState } from '../UIDetailsInput';

import Moment from 'moment';

const textInputFont = StyleSheet.flatten(UITextStyle.primaryBodyRegular) || {};
delete textInputFont.lineHeight;

const styles = StyleSheet.create({
    textInputView: {
        zIndex: -1,
        flex: 1,
        position: 'absolute',
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    textInput: {
        ...textInputFont,
        flex: 1,
    },
});

type Props = DetailsProps & {
    containerStyle?: StylePropType,
    dateComponents?: string[],
    initialEpochTime?: number | null,
    separator?: string,
    keyboardType?: KeyboardType,
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
        keyboardType: Platform.OS === 'web' ? 'default' : 'number-pad',
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

    onChangeText(date: string) {
        const { onChangeDate } = this.props;

        const newDate = date.split(this.getSeparator()).join('');
        if (Number.isNaN(Number(newDate))) return;

        this.setStateSafely({ date: newDate }, () => {
            if (onChangeDate) {
                const dateObj = Moment(date, this.getPattern()).toDate();
                onChangeDate(dateObj, this.isValidDate());
            }
        });
    }

    // Getters
    textInputStyle() {
        return styles.textInput;
    }

    isValidDate() {
        const date = this.getValue();
        const validDate = Moment(date, this.getPattern()).isValid();
        const validLength = date.length === UIConstant.shortDateLength() || date.length === 0;

        return (validDate && validLength);
    }

    getPattern() {
        const { dateComponents, separator } = this.props;
        const dateSymbols = UILocalized.DateSymbols;
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
            <View style={styles.textInputView}>
                <Text
                    style={UITextStyle.primaryBodyRegular}
                    selectable={false}
                >
                    {date}
                    <Text style={UITextStyle.secondaryBodyRegular} selectable={false}>
                        {missing}
                    </Text>
                </Text>
            </View>
        );
    }

    renderTextView() {
        const { hideBottomLine } = this.props;
        const bottomLine = hideBottomLine ? null : UIStyle.borderBottom;
        const bottomLineColor = !this.isValidDate() ? { borderBottomColor: UIColor.error() } : null;

        return (
            <View style={[this.textViewStyle(), bottomLine, bottomLineColor]}>
                {this.renderTextInput()}
                {this.renderMissingValue()}
            </View>
        );
    }
}
