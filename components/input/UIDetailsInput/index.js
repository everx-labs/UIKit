/* eslint-disable global-require */
// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { TextInput, Text, View, StyleSheet } from 'react-native';
import type { ReturnKeyType, KeyboardType, AutoCapitalize } from 'react-native/Libraries/Components/TextInput/TextInput';

import UIColor from '../../../helpers/UIColor';
import UIActionImage from '../../images/UIActionImage';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIComponent from '../../UIComponent';

import iconDisabled from '../../../assets/ico-arrow-right/arrow-right-primary-minus.png';
import iconEnabled from '../../../assets/ico-arrow-right/arrow-right-primary-1.png';
import iconHovered from '../../../assets/ico-arrow-right/arrow-right-white.png';

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
    beginningTag: {
        margin: 0,
        padding: 0,
        textAlign: 'center',
    },
});

export type DetailsProps = {
    accessibilityLabel?: string,
    autoCapitalize: AutoCapitalize,
    autoFocus: boolean,
    beginningTag: string,
    containerStyle: StylePropType,
    comment: string,
    commentColor?: string | null,
    editable: boolean,
    floatingTitle: boolean,
    hideBottomLine: boolean,
    hidePlaceholder: boolean,
    keyboardType: KeyboardType,
    maxLength?: number,
    maxLines: number,
    needArrow?: boolean,
    onBlur: () => void,
    onChangeText: (text: string) => void,
    onFocus: () => void,
    onSubmitEditing?: () => void,
    onKeyPress?: (e: any) => void,
    placeholder?: string,
    returnKeyType?: ReturnKeyType,
    secureTextEntry: boolean,
    showSymbolsLeft: boolean,
    submitDisabled?: boolean,
    token?: string,
    theme?: string,
    value: string,
    testID?: string,
};

export type DetailsState = {
    focused: boolean,
};

export const detailsDefaultProps = {
    autoCapitalize: 'sentences',
    autoFocus: false,
    beginningTag: '',
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
    placeholder: '',
    secureTextEntry: false,
    showSymbolsLeft: false,
    submitDisabled: false,
    theme: UIColor.Theme.Light,
    value: '',
};

export default class UIDetailsInput<Props, State>
    extends UIComponent<Props & DetailsProps, any & DetailsState> {
    textInput: ?TextInput;

    static defaultProps: DetailsProps = detailsDefaultProps;

    constructor(props: Props & DetailsProps) {
        super(props);

        this.state = {
            focused: false,
        };
    }

    // Setters
    setFocused(focused: boolean = true) {
        this.setStateSafely({ focused });
    }

    // Getters
    isFocused() {
        return this.state.focused;
    }

    isSubmitDisabled() {
        return !this.props.value || this.props.submitDisabled;
    }

    keyboardType() {
        return this.props.keyboardType;
    }

    containerStyle() {
        return styles.container;
    }

    textInputStyle() {
        const { theme } = this.props;
        const textColorStyle = UIColor.textPrimaryStyle(theme);
        const fontStyle = UITextStyle.bodyRegular;
        delete fontStyle.lineHeight;
        return [
            fontStyle,
            textColorStyle,
            UIStyle.flex,
        ];
    }

    textViewStyle() {
        return styles.textView;
    }

    beginningTag() {
        return this.props.beginningTag;
    }

    commentColor() {
        return this.props.commentColor;
    }

    placeholder() {
        return this.props.placeholder;
    }

    hidePlaceholder() {
        return this.props.hidePlaceholder;
    }

    getValue() {
        const { value } = this.props;
        return `${value}`;
    }

    getInlinePlaceholder() {
        return this.hidePlaceholder() ? '' : this.placeholder();
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

    onSubmitEditing() {
        if (this.isSubmitDisabled()) {
            setTimeout(() => {
                this.focus();
            }, UIConstant.feedbackDelay());
        } else {
            const { onSubmitEditing } = this.props;
            if (onSubmitEditing) {
                onSubmitEditing();
            }
        }
    }

    // Render
    renderFloatingTitle() {
        const { floatingTitle, theme, value } = this.props;
        const text = !floatingTitle || !value || !value.length ? ' ' : this.placeholder();
        const colorStyle = UIColor.textTertiaryStyle(theme);

        return (
            <Text style={[UITextStyle.tinyRegular, colorStyle]}>
                {text}
            </Text>
        );
    }

    renderBeginningTag() {
        const beginningTag = this.beginningTag();
        if (!beginningTag) {
            return null;
        }
        return (
            <Text
                style={[
                    UITextStyle.quaternaryBodyRegular,
                    styles.beginningTag,
                ]}
            >
                {beginningTag}
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
        const placeholderColor = UIColor.textPlaceholder(theme);
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
                onSubmitEditing={() => this.onSubmitEditing()}
                onKeyPress={e => this.onKeyPress(e)}
                placeholder={this.getInlinePlaceholder()}
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
        const { value, maxLength, showSymbolsLeft } = this.props;
        if (!maxLength || !showSymbolsLeft) {
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
        const { theme, needArrow } = this.props;
        if (!needArrow) {
            return null;
        }
        let icons = {};
        if (theme === UIColor.Theme.Action) {
            icons = {
                icoEnabled: iconEnabled,
                icoAbledHover: iconHovered,
                icoDisabled: iconDisabled,
            };
        }

        return (
            <UIActionImage
                {...icons}
                disabled={this.isSubmitDisabled()}
                onPress={() => this.onSubmitEditing()}
            />
        );
    }

    renderTexFragment() {
        return (
            <React.Fragment>
                {this.renderBeginningTag()}
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
        } else {
            const focused = this.isFocused() || value;
            bottomLineColor = UIColor.borderBottomColor(theme, focused);
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
