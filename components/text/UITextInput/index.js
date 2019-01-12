import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { TextInput, View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';
import UIConstant from '../../../helpers/UIConstant';

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
        lineHeight: null,
    },
});

class UITextInput extends Component {
    // Getters
    isFocused() {
        return this.textInput && this.textInput.isFocused();
    }

    // Actions
    focus() {
        this.textInput.focus();
    }

    blur() {
        this.textInput.blur();
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
                    UIStyle.textSecondaryBodyRegular,
                    styles.beginningTag,
                    textStyle,
                ]}
            >
                {beginningTag}
            </Text>);
    }

    renderTextInput() {
        const {
            value,
            placeholder,
            onChangeText,
            onFocus,
            onBlur,
            onSubmitEditing,
            textStyle,
            editable,
            disabled,
            autoFocus,
            autoCapitalize,
            returnKeyType,
            keyboardType,
            multiline,
            secureTextEntry,
        } = this.props;
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        return (<TextInput
            ref={(component) => { this.textInput = component; }}
            {...this.props}
            value={value}
            placeholder={placeholder}
            autoCorrect={false}
            autoFocus={autoFocus}
            editable={editable}
            disabled={disabled}
            multiline={multiline}
            underlineColorAndroid="transparent"
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
            style={[
                UIStyle.textPrimaryBodyRegular,
                styles.textInput,
                textStyle,
            ]}
            selectionColor={UIColor.primary()}
            keyboardType={keyboardType}
            {...returnKeyTypeProp}
            onFocus={() => onFocus()}
            onBlur={() => onBlur()}
            onChangeText={newValue => onChangeText(newValue)}
            onSubmitEditing={() => onSubmitEditing()}
        />);
    }

    renderInputView(pointerEvents = 'auto') {
        return (
            <View
                style={[
                    styles.container,
                    this.props.needBorderBottom ? UIStyle.borderBottom : null,
                    this.props.containerStyle,
                ]}
                pointerEvents={pointerEvents}
                className={this.props.className}
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
                <TouchableOpacity onPress={() => onPress()}>
                    {this.renderInputView('none')}
                </TouchableOpacity>
            );
        }
        return this.renderInputView();
    }
}

export default UITextInput;

UITextInput.defaultProps = {
    textStyle: {},
    containerStyle: {},
    value: '',
    placeholder: '',
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

UITextInput.propTypes = {
    textStyle: StylePropType,
    containerStyle: StylePropType,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    beginningTag: PropTypes.string,
    needBorderBottom: PropTypes.bool,
    disabled: PropTypes.bool,
    editable: PropTypes.bool,
    multiline: PropTypes.bool,
    secureTextEntry: PropTypes.bool,
    autoFocus: PropTypes.bool,
    autoCapitalize: PropTypes.string,
    keyboardType: PropTypes.string,
    returnKeyType: PropTypes.string,
    className: PropTypes.string,
    maxLength: PropTypes.number,
    onPress: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,
    onSubmitEditing: PropTypes.func,
};
