// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { TextInput, Text, View, StyleSheet } from 'react-native';
import type { ReturnKeyType, KeyboardType, AutoCapitalize } from 'react-native/Libraries/Components/TextInput/TextInput';

import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIComponent from '../../UIComponent';

const textInputFont = StyleSheet.flatten(UITextStyle.primaryBodyRegular) || {};
delete textInputFont.lineHeight;

const styles = StyleSheet.create({
    container: {
        //
    },
    textView: {
        paddingTop: UIConstant.tinyContentOffset(),
        paddingBottom: UIConstant.smallContentOffset(),
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        ...textInputFont,
        flex: 1,
    },
});

type Props = {
    accessibilityLabel?: string,
    autoCapitalize?: AutoCapitalize,
    autoFocus?: boolean,
    containerStyle?: StylePropType,
    floatingTitle?: boolean,
    value: string,
    comment?: string,
    placeholder?: string,
    hidePlaceholder?: boolean,
    maxLength?: number | null,
    maxLines?: number,
    showSymbolsLeft?: boolean,
    token?: string | null,
    commentColor?: string,
    hideBottomLine?: boolean,
    autoCapitalize?: AutoCapitalize,
    keyboardType?: KeyboardType,
    returnKeyType?: ReturnKeyType | null,
    editable?: boolean,
    commentStyle?: StylePropType,
    onFocus?: () => void,
    onBlur?: () => void,
    onChangeText: (text: string) => void,
    onSubmitEditing?: () => void,
};
type State = {};

export default class UIDetailsInput extends UIComponent<Props, State> {
    textInput: ?TextInput;

    // Getters
    isFocused() {
        return this.textInput && this.textInput.isFocused();
    }

    containerStyle() {
        return styles.container;
    }

    textInputStyle() {
        return styles.textInput;
    }

    textViewStyle() {
        return styles.textView;
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
        const { floatingTitle, placeholder, value } = this.props;
        const text = !floatingTitle || !value || !value.length ? ' ' : placeholder;

        return (
            <Text style={UITextStyle.tertiaryTinyRegular}>
                {text}
            </Text>
        );
    }

    renderTextInput() {
        const {
            accessibilityLabel,
            autoFocus,
            value,
            placeholder,
            onFocus,
            onBlur,
            onChangeText,
            onSubmitEditing,
            maxLength,
            editable,
            autoCapitalize,
            keyboardType,
            returnKeyType,
            maxLines,
            secureTextEntry,
            hidePlaceholder,
        } = this.props;

        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        const accessibilityLabelProp = accessibilityLabel ? { accessibilityLabel } : null;
        const maxLengthProp = maxLength ? { maxLength } : null;
        const multiline = !!maxLines && maxLines > 1;
        const ph = hidePlaceholder ? '' : placeholder;
        return (<TextInput
            ref={(component) => { this.textInput = component; }}
            value={`${value}`}
            placeholder={ph}
            placeholderTextColor={UIColor.textTertiary()}
            editable={editable}
            {...accessibilityLabelProp}
            autoCorrect={false}
            autoFocus={autoFocus}
            underlineColorAndroid="transparent"
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            {...returnKeyTypeProp}
            multiline={multiline}
            numberOfLines={maxLines}
            onFocus={onFocus}
            onBlur={onBlur}
            onChangeText={text => onChangeText(text)}
            onSubmitEditing={onSubmitEditing}
            style={[UITextStyle.primaryBodyRegular, this.textInputStyle()]}
            secureTextEntry={secureTextEntry}
            selectionColor={UIColor.primary()}
            {...maxLengthProp}
        />);
    }

    renderCounter() {
        if (!this.props.showSymbolsLeft) return null;

        const { value, maxLength } = this.props;
        if (!maxLength) {
            return null;
        }
        return (
            <Text
                style={[
                    UITextStyle.secondaryBodyRegular,
                    { marginRight: UIConstant.smallContentOffset() },
                ]}
            >
                {maxLength - value.length}
            </Text>
        );
    }

    renderToken() {
        const { token } = this.props;
        if (!token) return null;
        return (
            <Text style={UITextStyle.secondaryBodyRegular}>
                {token}
            </Text>
        );
    }

    renderTextView() {
        const { hideBottomLine, commentColor } = this.props;
        const bottomLine = hideBottomLine ? null : UIStyle.borderBottom;
        const bottomLineColor = commentColor ? { borderBottomColor: commentColor } : null;
        return (
            <View style={[this.textViewStyle(), bottomLine, bottomLineColor]}>
                {this.renderTextInput()}
                {this.renderCounter()}
                {this.renderToken()}
            </View>
        );
    }

    renderComment() {
        const { comment, commentColor } = this.props;
        if (!comment) {
            return null;
        }
        const color = commentColor ? { color: commentColor } : null;
        return (
            <Text
                style={[
                    UITextStyle.secondaryCaptionRegular,
                    UIStyle.marginTopTiny,
                    UIStyle.marginBottomSmall,
                    color,
                ]}
            >
                {comment}
            </Text>
        );
    }

    render() {
        return (
            <View style={[this.containerStyle(), this.props.containerStyle]}>
                {this.renderFloatingTitle()}
                {this.renderTextView()}
                {this.renderComment()}
            </View>
        );
    }

    static defaultProps: Props;
}

UIDetailsInput.defaultProps = {
    autoFocus: false,
    containerStyle: {},
    floatingTitle: true,
    value: '',
    comment: '',
    placeholder: UILocalized.Details,
    hidePlaceholder: false,
    maxLength: null,
    maxLines: 1,
    showSymbolsLeft: false,
    token: null,
    hideBottomLine: false,
    autoCapitalize: 'sentences',
    keyboardType: 'default',
    secureTextEntry: false,
    returnKeyType: null,
    editable: true,
    commentStyle: {},
    onFocus: () => {},
    onBlur: () => {},
    onChangeText: () => {},
    onSubmitEditing: () => {},
};
