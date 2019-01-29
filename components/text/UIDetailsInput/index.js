// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { TextInput, Text, View, StyleSheet } from 'react-native';
import type { ReturnKeyType, KeyboardType, AutoCapitalize } from 'react-native/Libraries/Components/TextInput/TextInput';

import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';

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
});

type Props = {
    containerStyle?: StylePropType,
    floatingTitle?: boolean,
    value: string,
    comment?: string,
    placeholder?: string,
    maxLength?: number | null,
    maxLines?: number,
    showSymbolsLeft?: boolean,
    token?: string | null,
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
            <Text style={UIStyle.textTertiaryTinyRegular}>
                {text}
            </Text>
        );
    }

    renderTextInput() {
        const {
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
        } = this.props;
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        const maxLengthProp = maxLength ? { maxLength } : null;
        const multiline = !!maxLines && maxLines > 1;
        return (<TextInput
            ref={(component) => { this.textInput = component; }}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={UIColor.textTertiary()}
            editable={editable}
            autoCorrect={false}
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
            style={[UIStyle.textPrimaryBodyRegular, { flex: 1, lineHeight: null }]}
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
                    UIStyle.textSecondaryBodyRegular,
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
            <Text style={UIStyle.textSecondaryBodyRegular}>
                {token}
            </Text>
        );
    }

    renderTextView() {
        const { hideBottomLine } = this.props;
        const bottomLine = hideBottomLine ? {} : UIStyle.borderBottom;
        return (
            <View style={[styles.textView, bottomLine]}>
                {this.renderTextInput()}
                {this.renderCounter()}
                {this.renderToken()}
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
                    UIStyle.textSecondaryCaptionRegular,
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

UIDetailsInput.defaultProps = {
    containerStyle: {},
    floatingTitle: true,
    value: '',
    comment: '',
    placeholder: UILocalized.Details,
    maxLength: null,
    maxLines: 1,
    showSymbolsLeft: false,
    token: null,
    hideBottomLine: false,
    autoCapitalize: 'sentences',
    keyboardType: 'default',
    returnKeyType: null,
    editable: true,
    commentStyle: {},
    onFocus: () => {},
    onBlur: () => {},
    onChangeText: () => {},
    onSubmitEditing: () => {},
};
