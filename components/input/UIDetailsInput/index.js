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
        marginLeft: UIConstant.tinyContentOffset(),
        height: undefined,
    },
    requiredAsterisk: {
        color: UIColor.primary(),
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
    comment?: string | null,
    commentColor?: string | null,
    blurOnSubmit?: boolean,
    bottomLineColor?: string | null,
    defaultValue?: string,
    disableSubmitEmpty: boolean,
    editable: boolean,
    inputStyle: ViewStyleProp,
    forceMultiLine: boolean,
    floatingTitle: boolean,
    floatingTitleText: string,
    hideBottomLine: boolean,
    hideFloatingTitle: boolean,
    hidePlaceholder: boolean,
    keyboardType: KeyboardType,
    mandatory?: boolean,
    mandatoryColor?: string | null,
    maxLength?: number,
    maxLines: number,
    maxHeight?: number,
    needArrow?: boolean,
    onBlur: () => void,
    onChangeText: (text: string) => void,
    onFocus: () => void,
    onSubmitEditing?: () => void,
    onKeyPress?: (e: any) => void,
    onHeightChange?: (height: number) => void,
    placeholder?: string,
    required?: boolean,
    returnKeyType?: ReturnKeyType,
    rightComponent?: React$Node,
    secureTextEntry: boolean,
    showSymbolsLeft: boolean,
    submitDisabled?: boolean,
    theme?: UIColorThemeNameType,
    token?: string,
    value: string,
    visible: boolean,
    testID?: string,
};

export const detailsDefaultProps = {
    autoCapitalize: 'sentences',
    autoCorrect: false,
    autoFocus: false,
    beginningTag: '',
    containerStyle: {},
    comment: '',
    disableSubmitEmpty: false,
    editable: true,
    floatingTitle: true,
    floatingTitleText: '',
    forceMultiLine: false,
    hideBottomLine: false,
    hideFloatingTitle: false,
    hidePlaceholder: false,
    inputStyle: {},
    keyboardType: 'default',
    mandatory: false,
    mandatoryColor: UIColor.error(),
    maxLines: 1,
    needArrow: false,
    onBlur: () => {},
    onChangeText: () => {},
    onFocus: () => {},
    onSubmitEditing: () => {},
    onKeyPress: () => {},
    onHeightChange: () => {},
    onPressComment: null,
    placeholder: '',
    required: false,
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
        if (Platform.OS === 'web') {
            this.onWebChange();
        } else {
            this.onMobileChange(event);
        }
    }

    onMobileChange(event: any) {
        if (event && event.nativeEvent) {
            const { contentSize } = event.nativeEvent;
            const height = contentSize?.height || 0;
            this.onHeightChange(height);
        }
    }

    onWebChange() {
        this.setStateSafely({}, () => {
            const aux = this.auxTextInput;
            if (aux?._node) {
                const height = aux?._node.scrollHeight || 0;
                this.onHeightChange(height);
            }
        });
    }

    onHeightChange(height: number) {
        const { onHeightChange } = this.props;
        if (height) {
            this.setInputAreaHeight(height);
            if (onHeightChange) {
                onHeightChange(height);
            }
        }
    }

    setInputAreaHeight(height: number) {
        const newSize = Math.min(height, UIConstant.smallCellHeight() * 5);
        const inH = newSize;
        this.onContentSizeChange(inH);
    }

    onContentSizeChange(height: number) {
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

    onFocus() {
        this.setFocused();
        this.props.onFocus();
    }

    onBlur() {
        this.setFocused(false);
        this.props.onBlur();
    }

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
    getCommentTestID(): ?string {
        return this.props.commentTestID ? this.props.commentTestID : null;
    }

    isFocused(): boolean {
        return this.state.focused || (this.textInput && this.textInput.isFocused()) || false;
    }

    isHover(): boolean {
        return this.state.hover;
    }

    isSubmitDisabled(value: string = this.props.value): boolean {
        return (this.props.disableSubmitEmpty && !value) ||
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
        const { theme, inputStyle } = this.props;
        const textColorStyle = UIColor.textPrimaryStyle(theme);
        const fontStyle = UIStyle.Text.bodyRegular();
        delete fontStyle.lineHeight;
        return [
            styles.textInput,
            fontStyle,
            textColorStyle,
            UIStyle.Common.flex(),
            inputStyle,
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

    getPlaceholder(): string {
        return this.props.placeholder;
    }

    getRequired(): boolean {
        return this.props.required;
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
        const required = this.getRequired();
        if (required) {
            return '';
        }
        return this.hidePlaceholder() || this.isFocused() ? ' ' : this.getPlaceholder();
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
            floatingTitle, floatingTitleText, theme, value, hideFloatingTitle,
        } = this.props;
        if (hideFloatingTitle) {
            return null;
        }
        const emptyValue = !value || !value.length;
        const text = !floatingTitle || (emptyValue && !this.isFocused())
            ? ' '
            : floatingTitleText || this.getPlaceholder();
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
            blurOnSubmit,
            testID,
            theme,
            maxHeight,
        } = this.props;
        const accessibilityLabelProp = accessibilityLabel ? { accessibilityLabel } : null;
        const maxLengthProp = maxLength ? { maxLength } : null;
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        const blurOnSubmitProp = blurOnSubmit ? { blurOnSubmit } : null;
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
                onFocus={() => this.onFocus()}
                onBlur={() => this.onBlur()}
                onChangeText={this.onChangeText}
                onChange={e => this.onChange(e)}
                onContentSizeChange={e => this.onChange(e)}
                onSubmitEditing={this.onSubmitEditing}
                onKeyPress={this.onKeyPress}
                placeholder={this.getInlinePlaceholder()}
                placeholderTextColor={placeholderColor}
                ref={(component) => { this.textInput = component; }}
                {...returnKeyTypeProp}
                {...blurOnSubmitProp}
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

    renderRightComponent() {
        return this.props.rightComponent;
    }

    renderRequiredPlaceholder() {
        const required = this.getRequired();
        if (!required) {
            return null;
        }
        if (this.state.focused || this.props.value) {
            return null;
        }
        const placeholder = this.getPlaceholder();
        return (
            <Text style={[UIStyle.Text.tertiaryBodyRegular(), UIStyle.Common.positionAbsolute()]}>
                {placeholder}
                <Text
                    style={[
                        UIStyle.Text.tertiaryBodyRegular(),
                        styles.requiredAsterisk,
                    ]}
                > *
                </Text>
            </Text>
        );
    }

    renderTextFragment() {
        return (
            <React.Fragment>
                {this.renderBeginningTag()}
                <View style={UIStyle.Container.screen()}>
                    {this.renderAuxTextInput()}
                    {this.renderTextInput()}
                    {this.renderRequiredPlaceholder()}
                </View>
                {this.renderCounter()}
                {this.renderToken()}
                {this.renderButton()}
                {this.renderArrow()}
                {this.renderRightComponent()}
            </React.Fragment>
        );
    }

    renderTextView() {
        const {
            comment, hideBottomLine, theme, mandatory, mandatoryColor,
        } = this.props;
        const bottomLine = hideBottomLine ? null : UIStyle.borderBottom;
        let bottomLineColor: UIColorData;
        if (this.props.bottomLineColor) {
            bottomLineColor = this.props.bottomLineColor;
        } else if (mandatory && !this.getValue()) {
            bottomLineColor = mandatoryColor;
        } else if (comment && this.commentColor()) {
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
        const { theme, onPressComment } = this.props;
        const comment = this.getComment();
        const testID = this.getCommentTestID();
        const testIDProp = testID ? { testID } : null;
        if (!comment) {
            return null;
        }
        const defaultColorStyle = UIColor.textTertiaryStyle(theme);
        const commentColor = this.commentColor();
        const colorStyle = commentColor ? UIColor.getColorStyle(commentColor) : null;
        const containerStyle = [
            styles.commentStyle,
            UIStyle.Margin.topTiny(),
            UIStyle.Margin.bottomSmall(),
        ];
        const textStyle = [
            colorStyle,
            UIStyle.Text.captionRegular(),
        ];
        if (onPressComment) {
            return (
                <UITextButton
                    {...testIDProp}
                    buttonStyle={containerStyle}
                    textStyle={[UIColor.actionTextPrimaryStyle(theme), ...textStyle]}
                    title={comment}
                    onPress={onPressComment}
                />
            );
        }
        return (
            <Text
                {...testIDProp}
                style={[
                    defaultColorStyle,
                    ...textStyle,
                    ...containerStyle,
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
