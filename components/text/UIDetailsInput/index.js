// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { TextInput, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
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
        flexGrow: 1,
        paddingTop: UIConstant.tinyContentOffset(),
        paddingBottom: UIConstant.smallContentOffset(),
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        ...textInputFont,
        flex: 1,
        backgroundColor: 'transparent',
    },
    complementaryInput: {
        zIndex: 1,
        color: 'transparent',
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
    accessibilityLabel?: string,
    autoCapitalize?: AutoCapitalize,
    autoFocus?: boolean,
    containerStyle?: StylePropType,
    comment?: string,
    commentColor?: string,
    complementaryValue: string,
    editable?: boolean,
    floatingTitle?: boolean,
    hideBottomLine?: boolean,
    keyboardType?: KeyboardType,
    maxLength?: number | null,
    maxLines?: number,
    onFocus?: () => void,
    onBlur?: () => void,
    onChangeText: (text: string) => void,
    onSubmitEditing?: () => void,
    onRightButtonPress?: () => void,
    placeholder?: string,
    returnKeyType?: ReturnKeyType | null,
    rightButton?: string,
    rightButtonDisabled: boolean,
    secureTextEntry?: boolean,
    showSymbolsLeft?: boolean,
    token?: string | null,
    value: string,
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
            accessibilityLabel,
            autoCapitalize,
            autoFocus,
            complementaryValue,
            editable,
            keyboardType,
            maxLength,
            maxLines,
            onFocus,
            onBlur,
            onChangeText,
            onSubmitEditing,
            placeholder,
            returnKeyType,
            secureTextEntry,
            value,
        } = this.props;
        const accessibilityLabelProp = accessibilityLabel ? { accessibilityLabel } : null;
        const maxLengthProp = maxLength ? { maxLength } : null;
        const multiline = !!maxLines && maxLines > 1;
        const position = !value || value === 0 ? { position: 'relative' } : null;
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        const complementaryStyle = complementaryValue.length > 0
            ? styles.complementaryInput
            : null;
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
                placeholder={placeholder}
                placeholderTextColor={UIColor.textTertiary()}
                ref={(component) => { this.textInput = component; }}
                {...returnKeyTypeProp}
                style={[styles.textInput, complementaryStyle, position]}
                selectionColor={UIColor.primary()}
                underlineColorAndroid="transparent"
                secureTextEntry={secureTextEntry}
                value={`${value}`}
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
        const { hideBottomLine, commentColor } = this.props;
        const bottomLine = hideBottomLine ? null : UIStyle.borderBottom;
        const bottomLineColor = commentColor ? { borderBottomColor: commentColor } : null;
        return (
            <View style={[styles.textView, bottomLine, bottomLineColor]}>
                {this.renderTextInput()}
                {this.renderComplementaryText()}
                {this.renderCounter()}
                {this.renderToken()}
                {this.renderRightButton()}
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
        const { rightButton } = this.props;
        const flex = rightButton && rightButton.length > 0 ? { flex: 1 } : null;
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
    autoCapitalize: 'sentences',
    autoFocus: false,
    containerStyle: {},
    commentColor: null,
    complementaryValue: '',
    floatingTitle: true,
    comment: '',
    editable: true,
    hideBottomLine: false,
    keyboardType: 'default',
    maxLength: null,
    maxLines: 1,
    onFocus: () => {},
    onBlur: () => {},
    onChangeText: () => {},
    onSubmitEditing: () => {},
    onRightButtonPress: () => {},
    placeholder: UILocalized.Details,
    returnKeyType: null,
    rightButton: '',
    rightButtonDisabled: false,
    secureTextEntry: false,
    showSymbolsLeft: false,
    token: null,
    value: '',
};
