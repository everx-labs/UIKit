// @flow
import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import type {
    ReturnKeyType,
    AutoCapitalize,
    KeyboardType,
} from 'react-native/Libraries/Components/TextInput/TextInput';

import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import type { PointerEvents } from '@tonlabs/uikit.core';
import {
    ColorVariants,
    UILabel,
    UILabelColors,
    UILabelRoles,
    UITextView,
} from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: UIConstant.textInputHeight(),
        flexDirection: 'row',
        alignItems: 'center',
    },
    beginningTag: {
        margin: 0,
        padding: 0,
        textAlign: 'center',
    },
    textInput: {
        flex: 1,
        margin: 0,
        padding: 0,
        // $FlowExpectedError
        lineHeight: null,
    },
});

type TextInputTransitProps = {
    value: string,
    placeholder?: string,
    placeholderTextColor?: ColorVariants,
    editable?: boolean,
    multiline?: boolean,
    secureTextEntry?: boolean,
    autoFocus?: boolean,
    autoCapitalize?: AutoCapitalize,
    keyboardType?: KeyboardType | null,
    returnKeyType?: ReturnKeyType | null,
    maxLength?: number | null,
    onFocus?: () => void,
    onBlur?: () => void,
    onChangeText: (text: string) => void,
    onSubmitEditing?: () => void,
};

type UITextInputProps = {
    testID?: string,
    beginningTag?: string,
    containerStyle?: any,
    disabled?: boolean,
    needBorderBottom?: boolean,
    onPress?: (() => void) | null,
    textStyle?: any,
};

type Props = UITextInputProps & TextInputTransitProps;
type State = {};

class UITextInput extends UIComponent<Props, State> {
    textInput = React.createRef<UITextView>();

    // Getters
    isFocused() {
        // $FlowFixMe: somehow TextInput is any
        return this.textInput.current && this.textInput.current.isFocused();
    }

    getTransitProps(): $Exact<TextInputTransitProps> {
        const {
            testID,
            beginningTag,
            containerStyle,
            disabled,
            needBorderBottom,
            onPress,
            textStyle,
            // $FlowFixMe
            ...rest
        } = this.props;
        return rest;
    }

    // Actions
    focus() {
        if (this.textInput.current) {
            // $FlowFixMe: somehow TextInput is any
            this.textInput.current.focus();
        }
    }

    blur() {
        if (this.textInput.current) {
            // $FlowFixMe: somehow TextInput is any
            this.textInput.current.blur();
        }
    }

    //  Render
    renderBeginningTag() {
        const { beginningTag, textStyle } = this.props;
        if (!beginningTag) {
            return null;
        }
        return (
            <UILabel
                color={UILabelColors.TextSecondary}
                role={UILabelRoles.ParagraphText}
                style={[
                    styles.beginningTag,
                    textStyle,
                ]}
            >
                {beginningTag}
            </UILabel>
        );
    }

    renderTextInput() {
        const {
            testID,
            value,
            placeholder,
            placeholderTextColor,
            onChangeText,
            onFocus,
            onBlur,
            onSubmitEditing,
            textStyle,
            editable,
            autoFocus,
            autoCapitalize,
            returnKeyType,
            keyboardType,
            multiline,
            secureTextEntry,
        } = this.props;
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        return (
            <UITextView
                testID={testID}
                ref={this.textInput}
                {...this.getTransitProps()}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                autoCorrect={false}
                autoFocus={autoFocus}
                editable={editable}
                multiline={multiline}
                autoCapitalize={autoCapitalize}
                secureTextEntry={secureTextEntry}
                style={[
                    styles.textInput,
                    textStyle,
                ]}
                keyboardType={keyboardType}
                {...returnKeyTypeProp}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={newValue => onChangeText(newValue)}
                onSubmitEditing={onSubmitEditing}
            />
        );
    }

    renderInputView(pointerEvents: PointerEvents = 'auto') {
        return (
            <View
                style={[
                    styles.container,
                    this.props.needBorderBottom ? UIStyle.borderBottom : null,
                    this.props.containerStyle,
                ]}
                pointerEvents={pointerEvents}
            >
                {this.renderBeginningTag()}
                {this.renderTextInput()}
            </View>
        );
    }

    render() {
        const { onPress } = this.props;
        if (onPress) {
            return (
                <TouchableOpacity onPress={onPress}>
                    {this.renderInputView('none')}
                </TouchableOpacity>
            );
        }
        return this.renderInputView();
    }

    static defaultProps: Props = {
        textStyle: {},
        containerStyle: {},
        value: '',
        placeholder: '',
        placeholderTextColor: ColorVariants.TextTertiary,
        beginningTag: '',
        needBorderBottom: false,
        disabled: false,
        editable: true,
        multiline: false,
        secureTextEntry: false,
        autoFocus: false,
        autoCapitalize: 'words',
        keyboardType: 'default',
        returnKeyType: null,
        maxLength: null,
        onPress: null,
        onFocus: () => {},
        onBlur: () => {},
        onChangeText: () => {},
        onSubmitEditing: () => {},
        testID: 'uiTextInput',
    };
}

export default UITextInput;
