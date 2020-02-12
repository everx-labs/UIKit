// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { TextInput, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import type { ReturnKeyType, AutoCapitalize, KeyboardType } from 'react-native/Libraries/Components/TextInput/TextInput';
import type { PointerEvents } from '../../../types';

import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';

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
    placeholderTextColor? : string,
    editable?: boolean,
    multiline?: boolean,
    secureTextEntry?: boolean,
    autoFocus?: boolean,
    autoCapitalize?: AutoCapitalize,
    keyboardType?: KeyboardType,
    returnKeyType?: ReturnKeyType | null,
    maxLength?: number | null,
    onFocus?: () => void,
    onBlur?: () => void,
    onChangeText: (text: string) => void,
    onSubmitEditing?: () => void,
};

type UITextInputProps = {
    beginningTag?: string,
    containerStyle?: StylePropType,
    disabled?: boolean,
    needBorderBottom?: boolean,
    onPress?: (() => void) | null,
    textStyle?: StylePropType,
    className?: string,
};

type Props = TextInputTransitProps & UITextInputProps;
type State = {};

class UITextInput extends UIComponent<Props, State> {
    textInput: ?TextInput;

    // Getters
    isFocused() {
        return this.textInput && this.textInput.isFocused();
    }

    getTransitProps() {
        const result = { ...this.props };
        delete result.containerStyle;
        delete result.textStyle;
        delete result.beginningTag;
        delete result.needBorderBottom;
        delete result.onPress;
        return result;
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

    //  Render
    renderBeginningTag() {
        const { beginningTag, textStyle } = this.props;
        if (!beginningTag) {
            return null;
        }
        return (
            <Text
                style={[
                    UIStyle.text.secondaryBodyRegular(),
                    styles.beginningTag,
                    textStyle,
                ]}
            >
                {beginningTag}
            </Text>
        );
    }

    renderTextInput() {
        const {
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
        const underlineColorAndroid = secureTextEntry ? null : { underlineColorAndroid: 'transparent' };
        return (<TextInput
            ref={(component) => { this.textInput = component; }}
            {...(this.getTransitProps(): TextInputTransitProps)}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            autoCorrect={false}
            autoFocus={autoFocus}
            editable={editable}
            multiline={multiline}
            {...underlineColorAndroid}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
            style={[
                UIStyle.text.primaryBodyRegular(),
                styles.textInput,
                textStyle,
            ]}
            selectionColor={UIColor.primary()}
            keyboardType={keyboardType}
            {...returnKeyTypeProp}
            onFocus={onFocus}
            onBlur={onBlur}
            onChangeText={newValue => onChangeText(newValue)}
            onSubmitEditing={onSubmitEditing}
        />);
    }

    renderInputView(pointerEvents: PointerEvents = 'auto') {
        const setClassNameTrick: {} = {
            className: this.props.className,
        };
        return (
            <View
                style={[
                    styles.container,
                    this.props.needBorderBottom ? UIStyle.borderBottom : null,
                    this.props.containerStyle,
                ]}
                pointerEvents={pointerEvents}
                {...setClassNameTrick}
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

    static defaultProps: Props;
}

export default UITextInput;

UITextInput.defaultProps = {
    textStyle: {},
    containerStyle: {},
    value: '',
    placeholder: '',
    placeholderTextColor: UIColor.textTertiary(),
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
    className: '',
    maxLength: null,
    onPress: null,
    onFocus: () => {},
    onBlur: () => {},
    onChangeText: () => {},
    onSubmitEditing: () => {},
};
