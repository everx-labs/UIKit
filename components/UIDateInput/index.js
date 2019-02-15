// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { TextInput, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import type { ReturnKeyType, KeyboardType, AutoCapitalize } from 'react-native/Libraries/Components/TextInput/TextInput';

import UIColor from '../../helpers/UIColor';
import UILocalized from '../../helpers/UILocalized';
import UIConstant from '../../helpers/UIConstant';
import UIStyle from '../../helpers/UIStyle';
import UITextStyle from '../../helpers/UITextStyle';
import UIComponent from '../UIComponent';
import { UIFunction } from '../../UIKit';
import Moment from 'moment';

const textInputFont = StyleSheet.flatten(UITextStyle.primaryBodyRegular) || {};
delete textInputFont.lineHeight;

const styles = StyleSheet.create({
    container: {
        //
    },
    textView: {
        flexGrow: 1,
        paddingTop: UIConstant.tinyContentOffset(),
        paddingBottom: UIConstant.smallContentOffset(),
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        ...textInputFont,
        flex: 1,
        zIndex: 1,
        color: 'transparent',
        backgroundColor: 'transparent',
    },
    textInputEmpty: {
        ...textInputFont,
        flex: 1,
        zIndex: 1,
    },
    textInputView: {
        zIndex: -1,
        flex: 1,
        position: 'absolute',
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
});

type Props = {
    containerStyle?: StylePropType,
    floatingTitle?: boolean,
    date: Date | null,
    comment?: string,
    placeholder?: string,
    hideBottomLine?: boolean,
    returnKeyType?: ReturnKeyType | null,
    dateFormat?: string,
    editable?: boolean,
    commentStyle?: StylePropType,
    complementaryValue: string,
    onFocus?: () => void,
    onBlur?: () => void,
    onKeyPress?: () => void,
    onChangeDate: (text: string) => void,
    onSubmitEditing?: () => void,
};
type State = {
    date: string,
    dateComplementary: string,
    localeFormat: string[],
    separator: string,
    isValidDate: boolean,
};

export default class UIDateInput extends UIComponent<Props, State> {
    textInput: ?TextInput;
    constructor(props: Props) {
        super(props);

        this.state = {
            date: '',
            dateComplementary: '',
            localeFormat: [],
            separator: '',
            isValidDate: true,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadLocaleFormat();
    }

    // Actions
    determineSeparator(localeDate: string) {
        let char = '';

        for (let i = 0; i < localeDate.length; i += 1) {
            if (Number(localeDate.charAt(i))) continue;
            char = `${localeDate.charAt(i)}`;
            break;
        }

        return char || '.';
    }

    loadLocaleFormat() {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const separator = this.determineSeparator(date.toLocaleDateString());
        const splitDate = date.toLocaleDateString().split(separator);

        const localeFormat = [];
        splitDate.forEach((item) => {
            if (Number(item) === Number(day)) {
                localeFormat.push(UILocalized.DayShort);
            } else if (Number(item) === Number(month)) {
                localeFormat.push(UILocalized.MonthShort);
            } else if (Number(item) === Number(year)) {
                localeFormat.push(UILocalized.Year);
            }
        });

        // For some reason, Android returns undefined for a localized date
        if (localeFormat === undefined) {
            localeFormat.push('DD');
            localeFormat.push('MM');
            localeFormat.push('YYYY');
        }

        const initialDate = this.initialDateString();
        this.setStateSafely({
            separator,
            localeFormat,
            date: initialDate,
        }, () => {
            this.setDateComplementary(initialDate);
        });
    }

    initialDateString(): string {
        const initialDate = this.props.date;

        if (initialDate) {
            const strdate = initialDate.toLocaleDateString(undefined, {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
            });
            return strdate;
        }

        return '';
    }

    // Events
    onKeyPress(e: any) {
        const { key } = e.nativeEvent;
        const current = this.getDateValue();
        const separator = this.getSeparator();

        if (Number(key) >= 0 && current.length < 10) {
            this.onChangeDate(`${this.getDateValue()}${key}`);
        } else if (key === 'Backspace' && current.length > 0) {
            const del = current.charAt(current.length - 1) === separator ? 2 : 1;
            this.onChangeDate(current.substring(0, current.length - del));
        }
    }

    onChangeDate(newDate: string) {
        let tmp = `${newDate}`;
        if (newDate.length === 2 || newDate.length === 5) {
            tmp = `${newDate}${this.getSeparator()}`;
        }

        const mDate = Moment(tmp, this.getLocaleFormat());
        this.setStateSafely(
            { date: tmp },
            () => {
                this.setDateComplementary(tmp);
                this.props.onChangeDate(mDate.toDate());
            },
        );
    }

    onFocus() {
        const { onFocus } = this.props;

        if (onFocus) {
            onFocus();
        }
    }

    onBlur() {
        const { onBlur } = this.props;
        const isValidDate = this.hasValidDate();
        this.setStateSafely({ isValidDate });

        if (onBlur) {
            onBlur();
        }
    }

    // Getters
    isFocused() {
        return this.textInput && this.textInput.isFocused();
    }

    hasValidDate() {
        const date = this.getDateValue();
        const valid = UIFunction.isValidDate(date, this.getLocaleFormatString());

        return ((date.length === 10 && valid) || date.length === 0);
    }

    getDateValue(): string {
        return this.state.date;
    }

    getDateComplementary(): string {
        return this.state.dateComplementary;
    }

    getSeparator(): string {
        return this.state.separator;
    }

    getLocaleFormat(): string[] {
        return this.state.localeFormat;
    }

    getIsValidDate(): boolean {
        return this.state.isValidDate;
    }

    getLocaleFormatString(): string {
        const format = this.getLocaleFormat();
        let strFormat = '';

        for (let i = 0; i < format.length - 1; i += 1) {
            strFormat = `${strFormat}${format[i]}${this.getSeparator()}`;
        }
        strFormat = `${strFormat}${format[format.length - 1]}`;

        return strFormat;
    }

    // Setters
    setDateComplementary(date: string) {
        this.setStateSafely({
            dateComplementary: this.getLocaleFormatString().substring(date.length),
        });
    }

    setSeparator(separator: string) {
        this.setStateSafely({ separator });
    }

    setLocaleFormat(localeFormat: string[]) {
        this.setStateSafely({ localeFormat });
    }

    // Actions
    focus() {
        if (this.textInput) {
            this.textInput.focus();
        }
    }

    blur() {
        if (this.textInput) {
            this.textInput.blur();
        }
    }

    // Render
    renderFloatingTitle() {
        const { floatingTitle, placeholder } = this.props;
        const value = this.getDateValue();
        const focused = this.isFocused();
        const text = (!floatingTitle || !value || !value.length) && !focused ? ' ' : placeholder;
        const color = this.getIsValidDate() ? null : { color: UIColor.error() };

        return (
            <Text style={[UITextStyle.tertiaryTinyRegular, color]}>
                {text}
            </Text>
        );
    }

    renderTextInput() {
        const {
            placeholder,
            onSubmitEditing,
            editable,
            returnKeyType,
        } = this.props;
        const value = this.getDateValue();
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        const currentStyle = value.length > 0 || this.isFocused()
            ? styles.textInput
            : styles.textInputEmpty;
        const pholder = value.length > 0 || this.isFocused() ? '' : placeholder;
        return (
            <TextInput
                ref={(component) => { this.textInput = component; }}
                value={value}
                placeholder={pholder}
                placeholderTextColor={UIColor.textTertiary()}
                editable={editable}
                autoCorrect={false}
                underlineColorAndroid="transparent"
                {...returnKeyTypeProp}
                onFocus={() => this.onFocus()}
                onBlur={() => this.onBlur()}
                onSubmitEditing={onSubmitEditing}
                style={[currentStyle]}
                selectionColor={UIColor.primary()}
                keyboardType="number-pad"
                onKeyPress={(e) => { this.onKeyPress(e); }}
                maxLength={10}
            />
        );
    }

    renderComplementaryText() {
        const value = this.getDateValue();
        const dateComplementary = this.getDateComplementary();

        if (value.length === 0 && !this.isFocused()) return null;
        return (
            <View style={styles.textInputView}>
                <Text
                    style={UITextStyle.primaryBodyRegular}
                    selectable={false}
                >
                    {value}
                    <Text style={UITextStyle.secondaryBodyRegular} selectable={false}>
                        {dateComplementary}
                    </Text>
                </Text>
            </View>
        );
    }

    renderTextView() {
        const { hideBottomLine } = this.props;
        const bottomLine = hideBottomLine ? {} : UIStyle.borderBottom;
        const color = this.getIsValidDate() ? null : { borderBottomColor: UIColor.error() };
        return (
            <View style={[styles.textView, bottomLine, color]}>
                {this.renderTextInput()}
                {this.renderComplementaryText()}
            </View>
        );
    }

    renderComment() {
        const { comment, commentStyle } = this.props;
        if (!comment) {
            return null;
        }
        return (
            <Text
                style={[
                    UITextStyle.secondaryCaptionRegular,
                    UIStyle.marginTopTiny,
                    UIStyle.marginBottomSmall,
                    commentStyle,
                ]}
            >
                {comment}
            </Text>
        );
    }

    render() {
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                {this.renderFloatingTitle()}
                {this.renderTextView()}
                {this.renderComment()}
            </View>
        );
    }

    static defaultProps: Props;
}

UIDateInput.defaultProps = {
    containerStyle: {},
    floatingTitle: true,
    date: null,
    dateFormat: '',
    comment: '',
    placeholder: UILocalized.Details,
    hideBottomLine: false,
    returnKeyType: null,
    editable: true,
    commentStyle: {},
    complementaryValue: '',
    onFocus: () => {},
    onBlur: () => {},
    onChangeDate: () => {},
    onKeyPress: () => {},
    onSubmitEditing: () => {},
    onRightButtonPress: () => {},
};
