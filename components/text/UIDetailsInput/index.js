// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';


import { TextInput, Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import type { ReturnKeyType, KeyboardType, AutoCapitalize } from 'react-native/Libraries/Components/TextInput/TextInput';

import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIComponent from '../../UIComponent';

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
        zIndex: 1,
        flex: 1,
        color: 'transparent',
        backgroundColor: 'transparent',
        lineHeight: null,
    },
    textInputDefault: {
        flex: 1,
        lineHeight: null,
    },
    textInputView: {
        zIndex: -1,
        flex: 1,
        position: 'absolute',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        overflow: 'scroll',
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
    rightButton?: string,
    rightButtonDisabled: boolean,
    complementaryValue: string,
    onFocus?: () => void,
    onBlur?: () => void,
    onChangeText: (text: string) => void,
    onSubmitEditing?: () => void,
    onRightButtonPress?: () => void,
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
            <Text style={UITextStyle.tertiaryTinyRegular}>
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
            complementaryValue,
        } = this.props;
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        const maxLengthProp = maxLength ? { maxLength } : null;
        const multiline = !!maxLines && maxLines > 1;
        const position = !value || value === 0 ? { position: 'relative' } : null;
        const currentStyle = complementaryValue.length > 0 ? styles.textInput : styles.textInputDefault;
        return (
            <TextInput
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
                style={[
                    UITextStyle.primaryBodyRegular,
                    currentStyle,
                    position]}
                selectionColor={UIColor.primary()}
                {...maxLengthProp}
            />
        );
    }

    renderComplementaryText() {
        const { value, complementaryValue } = this.props;
        if (complementaryValue.length === 0) return null;
        return (
            <View style={styles.textInputView}>
                <Text
                    style={UITextStyle.primaryBodyRegular}
                    selectable={false}
                >
                    {value}
                    <Text style={UITextStyle.secondaryBodyRegular} selectable={false}>
                        {complementaryValue}
                    </Text>
                </Text>
            </View>
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

    renderRightButton() {
        const {
            rightButton,
            onRightButtonPress, rightButtonDisabled,
        } = this.props;
        if (!rightButton || rightButton.length === 0) {
            return null;
        }

        const defaultTitleStyle = rightButtonDisabled ?
            UITextStyle.secondarySmallMedium : UITextStyle.actionSmallMedium;
        return (
            <TouchableOpacity
                disabled={rightButtonDisabled}
                onPress={onRightButtonPress}
            >
                <Text style={[UITextStyle.secondaryBodyRegular, defaultTitleStyle]}>
                    {rightButton}
                </Text>
            </TouchableOpacity>
        );
    }

    renderTextView() {
        const { hideBottomLine } = this.props;
        const bottomLine = hideBottomLine ? {} : UIStyle.borderBottom;
        return (
            <View style={[styles.textView, bottomLine]}>
                {this.renderTextInput()}
                {this.renderComplementaryText()}
                {this.renderCounter()}
                {this.renderToken()}
                {this.renderRightButton()}
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
        const { rightButton } = this.props;
        const flex = rightButton.length > 0 ? { flex: 1 } : null;
        return (
            <View style={[styles.container, this.props.containerStyle, flex]}>
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
    rightButton: '',
    rightButtonDisabled: false,
    complementaryValue: '',
    onFocus: () => {},
    onBlur: () => {},
    onChangeText: () => {},
    onSubmitEditing: () => {},
    onRightButtonPress: () => {},
};
