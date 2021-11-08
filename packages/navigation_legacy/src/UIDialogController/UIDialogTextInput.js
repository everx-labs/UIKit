import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

import { UIStyle, UITextStyle } from '@tonlabs/uikit.core';
import { UITextView } from '@tonlabs/uikit.inputs';

import { UIComponent } from '@tonlabs/uikit.components';

const styles = StyleSheet.create({
    inputView: {
        flex: 1,
    },
    inputViewCenteredContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    beginningTag: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    textInput: {
        height: 32,
        padding: 0,
        lineHeight: null,
    },
    androidInputAlignment: {
        textAlign: 'left',
    },
});

export default class UIDialogTextInput extends UIComponent {
    textInputRef = React.createRef();

    // Events
    onChangeText = text => {
        const { beginningTag, tagSeparator, onChangeText } = this.props;
        let value = text;
        if (beginningTag && value.startsWith(beginningTag)) {
            value = value.substring(beginningTag.length);
        }
        if (tagSeparator && value.startsWith(tagSeparator)) {
            value = value.substring(tagSeparator.length);
        }
        onChangeText(value);
    };

    // Getters
    getTextAlign() {
        return { textAlign: this.props.textAlign };
    }

    getTextInputAlign() {
        // FIXME(savelichalex): `textAlign: center` doesn't work good on Android for now
        // https://github.com/facebook/react-native/issues/27658
        // https://github.com/facebook/react-native/issues/26512
        // I couldn't find a fix that could be applied from our side
        // So for now `textAlign: left` is looks like the best available solution
        if (Platform.OS === 'android' && this.props.textAlign === 'center') {
            return styles.androidInputAlignment;
        }
        return this.getTextAlign();
    }

    getBeginningTagStyle() {
        return this.props.textAlign === 'center' ? styles.beginningTag : { flex: 0 };
    }

    // Actions
    focus() {
        if (this.textInputRef.current != null) {
            this.textInputRef.current.focus();
        }
    }

    blur() {
        if (this.textInputRef.current != null) {
            this.textInputRef.current.blur();
        }
    }

    // Render
    renderBeginningTagExpander() {
        if (this.props.textAlign === 'left') {
            return null;
        }
        const { beginningTag, tagSeparator, placeholder } = this.props;
        return (
            <Text style={[UITextStyle.primarySubtitleLight, { color: 'transparent' }]}>
                {`${tagSeparator}${placeholder.trim()}${tagSeparator}${tagSeparator}${beginningTag}`}
            </Text>
        );
    }

    renderBeginningTag() {
        const { value, beginningTag, tagSeparator, textStyle } = this.props;
        if (value.length || !beginningTag) {
            return null;
        }
        return (
            <Text
                style={[
                    UITextStyle.primarySubtitleLight,
                    styles.textInput,
                    textStyle,
                    this.getTextAlign(),
                    this.getBeginningTagStyle(),
                ]}
            >
                {`${beginningTag}${tagSeparator}`}
                {this.renderBeginningTagExpander()}
            </Text>
        );
    }

    render() {
        const {
            beginningTag,
            tagSeparator,
            placeholder,
            value,
            editable,
            autoFocus,
            autoCapitalize,
            maxLength,
            returnKeyType,
            keyboardType,
            needBorderBottom,
            style,
            textStyle,
            secureTextEntry,
            onSubmitEditing,
        } = this.props;
        const input = value ? `${beginningTag}${value}` : ''; // ${tagSeparator} between was removed
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        const underlineColorAndroid = secureTextEntry
            ? null
            : { underlineColorAndroid: 'transparent' };
        const inputComponent = (
            <UITextView
                ref={this.textInputRef}
                value={input}
                placeholder={`${tagSeparator}${placeholder}${tagSeparator}`}
                onChangeText={this.onChangeText}
                onSubmitEditing={onSubmitEditing}
                keyboardType={keyboardType}
                {...returnKeyTypeProp}
                {...underlineColorAndroid}
                autoCapitalize={autoCapitalize}
                secureTextEntry={secureTextEntry}
                autoCorrect={false}
                editable={editable}
                autoFocus={autoFocus}
                maxLength={maxLength}
                style={[
                    input.length
                        ? UITextStyle.primarySubtitleRegular
                        : UITextStyle.primarySubtitleLight,
                    styles.textInput,
                    textStyle,
                    this.getTextInputAlign(),
                ]}
            />
        );
        if (Platform.OS === 'android' && this.props.textAlign === 'center') {
            return (
                <View
                    style={[
                        styles.inputView,
                        styles.inputViewCenteredContent,
                        style,
                        needBorderBottom ? UIStyle.borderBottom : null,
                    ]}
                >
                    {inputComponent}
                </View>
            );
        }
        return (
            <View style={[styles.inputView, style, needBorderBottom ? UIStyle.borderBottom : null]}>
                {inputComponent}
            </View>
        );
    }
}

UIDialogTextInput.defaultProps = {
    beginningTag: '',
    tagSeparator: '',
    placeholder: '',
    value: '',
    keyboardType: 'default',
    returnKeyType: null,
    autoCapitalize: 'none',
    textAlign: 'left',
    needBorderBottom: false,
    style: null,
    textStyle: null,
    secureTextEntry: false,
    editable: true,
    autoFocus: false,
    maxLength: null,
    onChangeText: () => {},
    onSubmitEditing: () => {},
};
