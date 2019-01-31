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
import UIFont from '../../../helpers/UIFont';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textView: {
        paddingTop: UIConstant.tinyContentOffset(),
        paddingBottom: UIConstant.smallContentOffset(),
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleText: {
        color: UIColor.primary(),
        ...UIFont.smallMedium(),
    },
    hiddenTextInput: {
        zIndex: 1000,
        position: 'absolute',
        color: 'transparent',
        backgroundColor: 'transparent',
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
        const pos = !value || value.length === 0 ? { position: 'relative' } : null;
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
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
                        styles.hiddenTextInput,
                        pos, {
                            flex: 1,
                            lineHeight: null,
                        }]}
                    selectionColor={UIColor.primary()}
                    {...maxLengthProp}
                />
                <ScrollView horizontal style={{ marginRight: UIConstant.contentOffset() }}>
                    <Text
                        style={[UITextStyle.primaryBodyRegular, {
                            zIndex: -1000,
                        }]}
                        selectable={false}
                    >
                        {value}
                    </Text>
                    <Text
                        style={[UITextStyle.secondaryBodyRegular, {
                            zIndex: -1000,
                        }]}
                        selectable={false}
                    >
                        {complementaryValue}
                    </Text>
                </ScrollView>
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

    renderComplementaryValue() {
        const { complementaryValue } = this.props;

        if (!complementaryValue || complementaryValue.length === 0) {
            return null;
        }

        return (
            <Text style={{ backgroundColor: 'green' }}>
                {complementaryValue}
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
            UITextStyle.secondarySmallMedium : styles.titleText;
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
            <View style={[styles.textView, bottomLine, { flex: 1, justifyContent: 'space-between' }]}>
                {this.renderTextInput()}
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
    rightButton: '',
    rightButtonDisabled: false,
    complementaryValue: '',
    onFocus: () => {},
    onBlur: () => {},
    onChangeText: () => {},
    onSubmitEditing: () => {},
    onRightButtonPress: () => {},
};
