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

export type DetailsProps = {
    accessibilityLabel?: string,
    autoCapitalize: AutoCapitalize,
    autoFocus: boolean,
    containerStyle: StylePropType,
    comment: string,
    commentColor?: string,
    editable: boolean,
    floatingTitle: boolean,
    hideBottomLine: boolean,
    hidePlaceholder: boolean,
    keyboardType: KeyboardType,
    maxLength?: number,
    maxLines: number,
    onBlur?: () => void,
    onChangeText: (text: string) => void,
    onFocus?: () => void,
    onSubmitEditing?: () => void,
    placeholder?: string,
    returnKeyType?: ReturnKeyType,
    secureTextEntry: boolean,
    showSymbolsLeft: boolean,
    token?: string,
    value: string,
    testID?: string,
};
export type DetailsState = {};

export default class UIDetailsInput<Props, State>
    extends UIComponent<Props & DetailsProps, State & DetailsState> {
    textInput: ?TextInput;

    static defaultProps: DetailsProps = {
        autoCapitalize: 'sentences',
        autoFocus: false,
        containerStyle: {},
        comment: '',
        editable: true,
        floatingTitle: true,
        hideBottomLine: false,
        hidePlaceholder: false,
        keyboardType: 'default',
        maxLines: 1,
        onBlur: () => {},
        onChangeText: () => {},
        onFocus: () => {},
        onSubmitEditing: () => {},
        placeholder: UILocalized.Details,
        secureTextEntry: false,
        showSymbolsLeft: false,
        value: '',
    };

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
            autoCapitalize,
            autoFocus,
            editable,
            keyboardType,
            maxLength,
            maxLines,
            onFocus,
            onBlur,
            onChangeText,
            onSubmitEditing,
            placeholder,
            hidePlaceholder,
            returnKeyType,
            secureTextEntry,
            value,
            testID,
        } = this.props;

        const accessibilityLabelProp = accessibilityLabel ? { accessibilityLabel } : null;
        const maxLengthProp = maxLength ? { maxLength } : null;
        const multiline = !!maxLines && maxLines > 1;
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        return (
            <TextInput
                {...accessibilityLabelProp}
                autoCapitalize={autoCapitalize}
                autoCorrect={false}
                autoFocus={autoFocus}
                editable={editable}
                keyboardType={keyboardType}
                {...maxLengthProp}
                multiline={multiline}
                numberOfLines={maxLines}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={text => onChangeText(text)}
                onSubmitEditing={onSubmitEditing}
                placeholder={hidePlaceholder ? '' : placeholder}
                placeholderTextColor={UIColor.textTertiary()}
                ref={(component) => { this.textInput = component; }}
                {...returnKeyTypeProp}
                style={this.textInputStyle()}
                selectionColor={UIColor.primary()}
                underlineColorAndroid="transparent"
                secureTextEntry={secureTextEntry}
                value={`${value}`}
                testID={testID}
            />
        );
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
}
