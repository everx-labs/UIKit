/* eslint-disable global-require */
// @flow
import React from 'react';
import { Platform, TextInput, Text, View, StyleSheet } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ReturnKeyType, KeyboardType, AutoCapitalize } from 'react-native/Libraries/Components/TextInput/TextInput';

import UILabel from '../../../components/text/UILabel';
import UITextButton from '../../../components/buttons/UITextButton';
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
        zIndex: 1,
    },
    textInputAux: {
        marginBottom: -UIConstant.smallCellHeight(),
        height: UIConstant.smallCellHeight(),
        backgroundColor: 'transparent',
        color: 'transparent',
        zIndex: -1,
    },
    beginningTag: {
        margin: 0,
        padding: 0,
        textAlign: 'center',
    },
    commentStyle: {
        zIndex: -1,
    },
    button: {
        height: undefined,
    },
});

export type DetailsProps = ActionProps & {
    accessibilityLabel?: string,
    autoCorrect: boolean,
    autoCapitalize: AutoCapitalize,
    autoFocus: boolean,
    beginningTag: string,
    button?: Object,
    containerStyle: ViewStyleProp,
    inputStyle: ViewStyleProp,
    comment?: string | null,
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
    maxHeight?: number,
    forceMultiLine: boolean,
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
    disableSubmitEmpty: boolean,
};

export const detailsDefaultProps = {
    autoCapitalize: 'sentences',
    autoCorrect: false,
    autoFocus: false,
    beginningTag: '',
    containerStyle: {},
    inputStyle: {},
    comment: '',
    editable: true,
    floatingTitle: true,
    floatingTitleText: '',
    hideBottomLine: false,
    hidePlaceholder: false,
    keyboardType: 'default',
    maxLines: 1,
    forceMultiLine: false,
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
    disableSubmitEmpty: false,
};

export default class UIDetailsInput<Props, State>
    extends UIActionComponent<$Shape<Props & DetailsProps>, $Shape<State & ActionState>> {
    textInput: ?TextInput;
    auxTextInput: ?any;

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
    onChange(event: any) {
        let newHeight = 0;

        if (Platform.OS === 'web' && this.auxTextInput) {
            const aux = this.auxTextInput;
            if (aux?._node) {
                newHeight = aux?._node.scrollHeight;
            }
        } else if (event && event.nativeEvent) {
            const { contentSize } = event.nativeEvent;
            newHeight = contentSize?.height || 0;
        }

        if (newHeight) {
            this.setInputAreaHeight(newHeight - UIConstant.smallCellHeight());
        }
    }

    setInputAreaHeight(height: number) {
        const newSize = Math.min(height, UIConstant.smallCellHeight() * 4);
        const inH = UIConstant.smallCellHeight() + newSize;
        this.onContentSizeChange(inH);
    }

    onContentSizeChange(heigh: number) {
        // Not implemented in here
    }

    onLayout(e: any) {
        // Not implemented in here
    }

    onChangeText = (text: string, callback: ?((finalValue: string) => void)) => {
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

    // TODO: For some reason, when this component is wrapped with the Popover component,
    // the reference is always 'null', but, on the parent control (the Popover), there is
    // a property called '_elements', there you can access to the refenrence, so, we can
    // pass it here.
    setTextInputRef(inputRef: TextInput) {
        this.textInput = inputRef;
    }

    // Getters
    isFocused(): boolean {
        return this.state.focused || (this.textInput && this.textInput.isFocused()) || false;
    }

    isHover(): boolean {
        return this.state.hover;
    }

    isSubmitDisabled(): boolean {
        return (this.props.disableSubmitEmpty && !this.props.value) ||
                this.props.submitDisabled || false;
    }

    isMultiline(): boolean {
        const { maxLines, forceMultiLine } = this.props;
        const shouldMultiline = !!maxLines && maxLines > 1;
        return shouldMultiline || forceMultiLine;
    }

    keyboardType(): KeyboardType {
        return this.props.keyboardType;
    }

    containerStyle(): ViewStyleProp {
        return styles.container;
    }

    numOfLines(): number {
        return this.props.maxLines;
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

    getComment() {
        const { comment } = this.props;
        return `${comment}`;
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
        const text = !floatingTitle || (emptyValue && !this.isFocused())
            ? ' '
            : floatingTitleText || this.placeholder();
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
        if (!beginningTag || (!this.isFocused() && emptyValue)) {
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

    renderAuxTextInput() {
        if (!this.isMultiline()) {
            return null;
        }

        return (
            <TextInput
                ref={(component) => { this.auxTextInput = component; }}
                style={[this.textInputStyle(), styles.textInputAux]}
                numberOfLines={1}
                editable={false}
                value={this.getValue()}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
            />
        );
    }

    renderTextInput() {
        const {
            accessibilityLabel,
            autoCorrect,
            autoCapitalize,
            autoFocus,
            editable,
            maxLength,
            returnKeyType,
            secureTextEntry,
            testID,
            theme,
            maxHeight,
        } = this.props;
        const accessibilityLabelProp = accessibilityLabel ? { accessibilityLabel } : null;
        const maxLengthProp = maxLength ? { maxLength } : null;
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        const testIDProp = testID ? { testID } : null;
        const placeholderColor = UIColor.textPlaceholder(theme);
        return (
            <TextInput
                onLayout={e => this.onLayout(e)}
                {...accessibilityLabelProp}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                autoFocus={autoFocus}
                editable={editable}
                keyboardType={this.keyboardType()}
                {...maxLengthProp}
                multiline={this.isMultiline()}
                numberOfLines={this.numOfLines()}
                clearButtonMode="never"
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChangeText={this.onChangeText}
                onChange={e => this.onChange(e)}
                onContentSizeChange={e => this.onChange(e)}
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
                        maxHeight,
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
        if (!token) {
            return null;
        }
        return (<UILabel role={UILabel.Role.DescriptionTertiary} text={token} />);
    }

    renderButton() {
        const { button } = this.props;
        if (!button) {
            return null;
        }
        return (<UITextButton
            textStyle={UIStyle.Color.getColorStyle(UIColor.textPrimary())}
            {...button}
            buttonStyle={[styles.button, button.buttonStyle]}
        />);
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
                onPress={this.onSubmitEditing}
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
                {this.renderButton()}
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
        const { theme } = this.props;
        const comment = this.getComment();
        if (!comment) {
            return null;
        }
        const defaultColorStyle = UIColor.textTertiaryStyle(theme);
        const commentColor = this.commentColor();
        const colorStyle = commentColor ? UIColor.getColorStyle(commentColor) : null;
        return (
            <Text
                style={[
                    styles.commentStyle,
                    defaultColorStyle,
                    colorStyle,
                    UITextStyle.captionRegular,
                    UIStyle.marginTopTiny,
                    UIStyle.marginBottomSmall,
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
