/* eslint-disable global-require */
// @flow
import React from 'react';
import { Platform, TextInput, Text, View, StyleSheet } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ReturnKeyType, KeyboardType, AutoCapitalize } from 'react-native/Libraries/Components/TextInput/TextInput';

import UIColor from '../../../helpers/UIColor';
import UIActionImage from '../../images/UIActionImage';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIStyleColor from '../../../helpers/UIStyle/UIStyleColor';
import UIActionComponent from '../../UIActionComponent';

import iconDisabled from '../../../assets/ico-arrow-right/arrow-right-primary-minus.png';
import iconEnabled from '../../../assets/ico-arrow-right/arrow-right-primary-1.png';
import iconHovered from '../../../assets/ico-arrow-right/arrow-right-white.png';

import type {
    UIColorData,
    UIColorThemeNameType,
} from '../../../helpers/UIColor/UIColorTypes';

import type { EventProps } from '../../../types';
import type { ActionProps, ActionState } from '../../UIActionComponent';

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
        padding: 0,
    },
    beginningTag: {
        margin: 0,
        padding: 0,
        textAlign: 'center',
    },
});

export type DetailsProps = ActionProps & {
    accessibilityLabel?: string,
    autoCapitalize: AutoCapitalize,
    autoFocus: boolean,
    beginningTag: string,
    containerStyle: ViewStyleProp,
    comment: string,
    commentColor?: string | null,
    defaultValue?: string,
    editable: boolean,
    floatingTitle: boolean,
    floatingTitleText: string,
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
    theme?: UIColorThemeNameType,
    value: string,
    visible: boolean,
    testID?: string,
};

export const detailsDefaultProps = {
    autoCapitalize: 'sentences',
    autoFocus: false,
    beginningTag: '',
    containerStyle: {},
    comment: '',
    editable: true,
    floatingTitle: true,
    floatingTitleText: '',
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
    visible: true,
};

export default class UIDetailsInput<Props, State>
    extends UIActionComponent<$Shape<Props & DetailsProps>, $Shape<State & ActionState>> {
    textInput: ?TextInput;

    static defaultProps: DetailsProps = detailsDefaultProps;

    componentDidMount() {
        super.componentDidMount();

        setTimeout(() => {
            const defaultValue = this.defaultValue();
            if (defaultValue) {
                this.onChangeText(defaultValue);
            }
        }, 0);
    }

    // Events
    onChangeText = (text: string) => {
        const { onChangeText } = this.props;
        if (onChangeText) {
            onChangeText(text);
        }
    };

    onKeyPress = (e: any) => {
        const { onKeyPress } = this.props;
        if (onKeyPress) {
            onKeyPress(e);
        }
    };

    onFocus = () => {
        this.setFocused();
        this.props.onFocus();
    };

    onBlur = () => {
        this.setFocused(false);
        this.props.onBlur();
    };

    onSubmitEditing = () => {
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
    };

    // Setters
    setFocused(focused: boolean = true) {
        this.setStateSafely({ focused });
    }

    setHover(hover: boolean = true) {
        this.setStateSafely({ hover });
    }

    // Getters
    isFocused(): boolean {
        return this.state.focused || (this.textInput && this.textInput.isFocused()) || false;
    }

    isHover(): boolean {
        return this.state.hover;
    }

    isSubmitDisabled(): boolean {
        return !this.props.value || this.props.submitDisabled || false;
    }

    keyboardType(): KeyboardType {
        return this.props.keyboardType;
    }

    containerStyle(): ViewStyleProp {
        return styles.container;
    }

    textInputStyle() {
        const { theme } = this.props;
        const textColorStyle = UIColor.textPrimaryStyle(theme);
        const fontStyle = UITextStyle.bodyRegular;
        delete fontStyle.lineHeight;
        return [
            styles.textInput,
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

    defaultValue() {
        return this.props.defaultValue;
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
        return this.hidePlaceholder() || this.isFocused() ? '' : this.placeholder();
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

    // Render
    renderFloatingTitle() {
        const {
            floatingTitle, floatingTitleText, theme, value,
        } = this.props;
        const emptyValue = !value || !value.length;
        const text = !floatingTitle || emptyValue && !this.isFocused() ? ' ' : floatingTitleText || this.placeholder();
        const colorStyle = UIColor.textTertiaryStyle(theme);

        return (
            <Text style={[UITextStyle.tinyRegular, colorStyle]}>
                {text}
            </Text>
        );
    }

    renderBeginningTag() {
        const beginningTag = this.beginningTag();
        const emptyValue = !this.props.value || !this.props.value.length;
        if (!beginningTag || !this.isFocused() && emptyValue) {
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
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChangeText={this.onChangeText}
                onSubmitEditing={this.onSubmitEditing}
                onKeyPress={this.onKeyPress}
                placeholder={this.getInlinePlaceholder()}
                placeholderTextColor={placeholderColor}
                ref={(component) => { this.textInput = component; }}
                {...returnKeyTypeProp}
                style={[
                    this.textInputStyle(),
                    {
                        marginTop: Platform.OS === 'ios' && process.env.NODE_ENV === 'production'
                            ? 5 // seems to be smth connected to iOS's textContainerInset
                            : 0,
                    },
                ]}
                selectionColor={UIColor.primary()}
                underlineColorAndroid="transparent"
                secureTextEntry={secureTextEntry}
                value={this.getValue()}
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
                iconEnabled,
                iconHovered,
                iconDisabled,
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

    renderTextFragment() {
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
        const { comment, hideBottomLine, theme } = this.props;
        const bottomLine = hideBottomLine ? null : UIStyle.borderBottom;
        let bottomLineColor: UIColorData;
        if (comment && this.commentColor()) {
            bottomLineColor = this.commentColor() || UIColor.detailsInputComment(theme);
        } else {
            bottomLineColor = UIColor.borderBottomColor(theme, this.isFocused(), this.isHover());
        }
        const bottomLineColorStyle = UIStyleColor.getBorderBottomColorStyle(bottomLineColor);
        return (
            <View style={[this.textViewStyle(), bottomLine, bottomLineColorStyle]}>
                {this.renderTextFragment()}
            </View>
        );
    }

    renderComment() {
        const { comment, theme } = this.props;
        if (!comment) {
            return null;
        }
        const defaultColorStyle = UIColor.textSecondaryStyle(theme);
        const commentColor = this.commentColor();
        const colorStyle = commentColor ? UIColor.getColorStyle(commentColor) : null;
        return (
            <Text
                style={[
                    UITextStyle.captionRegular,
                    UIStyle.marginTopTiny,
                    UIStyle.marginBottomSmall,
                    defaultColorStyle,
                    colorStyle,
                ]}
            >
                {comment}
            </Text>
        );
    }

    render() {
        if (!this.props.visible) {
            return <View />;
        }
        const eventProps: EventProps = {
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave,
        };
        return (
            <View
                {...eventProps}
                style={[this.containerStyle(), this.props.containerStyle]}
            >
                {this.renderFloatingTitle()}
                {this.renderTextView()}
                {this.renderComment()}
            </View>
        );
    }
}
