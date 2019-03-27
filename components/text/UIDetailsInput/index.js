/* eslint-disable global-require */
// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { TextInput, Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import type { ReturnKeyType, KeyboardType, AutoCapitalize } from 'react-native/Libraries/Components/TextInput/TextInput';

import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIComponent from '../../UIComponent';
import UIFunction from '../../../helpers/UIFunction';

import icoDisabled from '../../../assets/ico-arrow-right/arrow-right-primary-minus.png';
import icoAbled from '../../../assets/ico-arrow-right/arrow-right-primary-1.png';
import icoAbledHover from '../../../assets/ico-arrow-right/arrow-right-white.png';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    textView: {
        paddingTop: UIConstant.tinyContentOffset(),
        paddingBottom: UIConstant.smallContentOffset(),
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export type DetailsProps = {
    accessibilityLabel?: string,
    autoCapitalize: AutoCapitalize,
    autoFocus: boolean,
    containerStyle: StylePropType,
    comment: string,
    commentColor?: string | null,
    dark?: boolean,
    editable: boolean,
    floatingTitle: boolean,
    hideBottomLine: boolean,
    hidePlaceholder: boolean,
    keyboardType: KeyboardType,
    maxLength?: number,
    maxLines: number,
    needArrow?: boolean,
    onBlur?: () => void,
    onChangeText: (text: string) => void,
    onFocus?: () => void,
    onSubmitEditing?: () => void,
    onKeyPress?: (e: any) => void,
    placeholder?: string,
    returnKeyType?: ReturnKeyType,
    secureTextEntry: boolean,
    showSymbolsLeft: boolean,
    token?: string,
    value: string,
    valueType?: string,
    testID?: string,
};
export type DetailsState = {};

export default class UIDetailsInput<Props, State>
    extends UIComponent<Props & DetailsProps, State & DetailsState> {
    textInput: ?TextInput;

    static ValueType = {
        Default: 'default',
        Email: 'email',
    };

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
        needArrow: false,
        onBlur: () => {},
        onChangeText: () => {},
        onFocus: () => {},
        onSubmitEditing: () => {},
        onKeyPress: () => {},
        placeholder: UILocalized.Details,
        secureTextEntry: false,
        showSymbolsLeft: false,
        valueType: UIDetailsInput.ValueType.Default,
        value: '',
    };

    constructor(props) {
        super(props);

        this.state = {
            focused: false,
            arrowHover: false,
        };
    }

    // Setters
    setFocused(focused = true) {
        this.setStateSafely({ focused });
    }

    setArrowHover(arrowHover = true) {
        this.setStateSafely({ arrowHover });
    }

    // Getters
    // isFocused() {
    //     return this.textInput && this.textInput.isFocused();
    // }

    // previous worked only after onChangeText event
    isFocused() {
        return this.state.focused;
    }

    isArrowHover() {
        return this.state.arrowHover;
    }

    isSubmitDisabled() {
        const { valueType, value } = this.props;
        if (valueType === UIDetailsInput.ValueType.Email) {
            return !UIFunction.isEmailAddress(value);
        }
        return !value;
    }

    keyboardType() {
        return this.props.keyboardType;
    }

    containerStyle() {
        return styles.container;
    }

    textInputStyle() {
        const textInputFont = this.props.theme === UIColor.Theme.Dark
            ? UITextStyle.whiteBodyRegular
            : UITextStyle.primaryBodyRegular;
        delete textInputFont.lineHeight;
        return [UIStyle.flex, textInputFont];
    }

    textViewStyle() {
        return styles.textView;
    }

    commentColor() {
        return this.props.commentColor;
    }

    hidePlaceholder() {
        return this.props.hidePlaceholder;
    }

    getValue() {
        const { value } = this.props;
        return `${value}`;
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

    clear() {
        if (this.textInput) {
            this.textInput.clear();
        }
    }

    // Events
    onChangeText(text: string) {
        const { onChangeText } = this.props;
        if (onChangeText) {
            onChangeText(text);
        }
    }

    onKeyPress(e: any) {
        const { onKeyPress } = this.props;
        if (onKeyPress) {
            onKeyPress(e);
        }
    }

    onFocus() {
        this.setFocused();
        this.props.onFocus();
    }

    onBlur() {
        this.setFocused(false);
        this.props.onBlur();
    }


    // Render
    renderFloatingTitle() {
        const {
            floatingTitle, placeholder, theme, value,
        } = this.props;
        const text = !floatingTitle || !value || !value.length ? ' ' : placeholder;
        const textStyle = theme === UIColor.Theme.Dark
            ? UITextStyle.whiteTinyRegular
            : UITextStyle.tertiaryTinyRegular;

        return (
            <Text style={textStyle}>
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
            maxLength,
            maxLines,
            onSubmitEditing,
            placeholder,
            returnKeyType,
            secureTextEntry,
            testID,
            theme,
        } = this.props;

        const accessibilityLabelProp = accessibilityLabel ? { accessibilityLabel } : null;
        const maxLengthProp = maxLength ? { maxLength } : null;
        const multiline = !!maxLines && maxLines > 1;
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        const testIDProp = testID ? { testID } : null;
        const placeholderColor = theme === UIColor.Theme.Dark
            ? UIColor.white40()
            : UIColor.textTertiary();
        return (
            <TextInput
                {...accessibilityLabelProp}
                autoCapitalize={autoCapitalize}
                autoCorrect={false}
                autoFocus={autoFocus}
                editable={editable}
                keyboardType={this.keyboardType()}
                {...maxLengthProp}
                multiline={multiline}
                numberOfLines={maxLines}
                onFocus={() => this.onFocus()}
                onBlur={() => this.onBlur()}
                onChangeText={text => this.onChangeText(text)}
                onSubmitEditing={onSubmitEditing}
                onKeyPress={e => this.onKeyPress(e)}
                placeholder={this.hidePlaceholder() ? '' : placeholder}
                placeholderTextColor={placeholderColor}
                ref={(component) => { this.textInput = component; }}
                {...returnKeyTypeProp}
                style={this.textInputStyle()}
                selectionColor={UIColor.primary()}
                underlineColorAndroid="transparent"
                secureTextEntry={secureTextEntry}
                value={this.getValue()}
                testID={testID}
                {...testIDProp}
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

    renderArrow() {
        const { theme, onSubmitEditing } = this.props;
        let source;
        if (theme === UIColor.Theme.Dark) {
            if (this.isSubmitDisabled()) {
                source = icoDisabled;
            } else if (this.isArrowHover()) {
                source = icoAbledHover;
            } else {
                source = icoAbled;
            }
        }
        const image = (
            <Image
                source={source}
                onMouseEnter={() => this.setArrowHover()}
                onMouseLeave={() => this.setArrowHover(false)}
            />
        );

        if (this.isSubmitDisabled()) {
            return image;
        }
        return (
            <TouchableOpacity onPress={onSubmitEditing}>
                {image}
            </TouchableOpacity>
        );
    }

    renderTexFragment() {
        return (
            <React.Fragment>
                {this.renderTextInput()}
                {this.renderCounter()}
                {this.renderToken()}
                {this.renderArrow()}
            </React.Fragment>
        );
    }

    renderTextView() {
        const { hideBottomLine, theme, value } = this.props;
        const bottomLine = hideBottomLine ? null : UIStyle.borderBottom;
        let bottomLineColor;
        if (this.commentColor()) {
            bottomLineColor = this.commentColor();
        } else if (theme === UIColor.Theme.Dark) {
            if (this.isFocused() || value) {
                bottomLineColor = UIColor.primary3();
            } else {
                bottomLineColor = UIColor.primaryMinus();
            }
        } else {
            bottomLineColor = UIColor.light();
        }
        const bottomLineColorStyle = UIColor.getBorderBottomColorStyle(bottomLineColor);
        return (
            <View style={[this.textViewStyle(), bottomLine, bottomLineColorStyle]}>
                {this.renderTexFragment()}
            </View>
        );
    }

    renderComment() {
        const { comment } = this.props;
        if (!comment) {
            return null;
        }
        const commentColor = this.commentColor();
        const colorStyle = commentColor ? UIColor.getColorStyle(commentColor) : null;
        return (
            <Text
                style={[
                    UITextStyle.secondaryCaptionRegular,
                    UIStyle.marginTopTiny,
                    UIStyle.marginBottomSmall,
                    colorStyle,
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
