/* eslint-disable global-require */
// @flow
import * as React from 'react';
import { Platform, TextInput, Text, View, StyleSheet, Image } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ReturnKeyType, KeyboardType, AutoCapitalize } from 'react-native/Libraries/Components/TextInput/TextInput';

import UILabel from '../../../components/text/UILabel';
import UITextButton from '../../../components/buttons/UITextButton';
import UIColor from '../../../helpers/UIColor';
import UIActionImage from '../../images/UIActionImage';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIFont from '../../../helpers/UIFont';
import UIStyleColor from '../../../helpers/UIStyle/UIStyleColor';
import UIActionComponent from '../../UIActionComponent';

import iconDisabled from '../../../assets/ico-arrow-right/arrow-right-primary-minus.png';
import iconEnabled from '../../../assets/ico-arrow-right/arrow-right-primary-1.png';
import iconHovered from '../../../assets/ico-arrow-right/arrow-right-white.png';
import iconArrowDefault from '../../../assets/ico-arrow-right/ico-arrow-right.png';

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
        paddingBottom: 0,
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
    prefixIcon: {
        marginRight: UIConstant.smallContentOffset(),
    },
});

export type DetailsProps = ActionProps & {
    /**
    @ignore
    */
    accessibilityLabel?: string,
    /**
    If false, disables auto-correct.
    @default false
    */
    autoCorrect: boolean,
    /**
    Can tell TextInput to automatically capitalize certain characters.
    This property is not supported by some keyboard types such as name-phone-pad.
    characters: all characters.
    words: first letter of each word.
    sentences: first letter of each sentence (default).
    none: don't auto capitalize anything.
    @default 'sentences'
    */
    autoCapitalize: AutoCapitalize,
    /**
    If true, focuses the input on componentDidMount.
    @default false
    */
    autoFocus: boolean,
    /**
    If false, disable auto complete
    */
    autoCompleteType?: string,
    /**
    Prefix for input value.
    @default ''
    */
    beginningTag: string,
    /**
    Object to describe right button, contains properties like UITextButton.
    For ex, {title: "Action", icon: iconSrc, textStyle: {color: UIColor.black(), onPress: ()=>{}}}
    @default null
    */
    button?: Object,
    /**
    Style of container
    @default null
    */
    style?: ViewStyleProp,
    /**
    Style of container, deprecated
    @ignore
    */
    containerStyle: ViewStyleProp,
    /**
    Comment string (bottom)
    @default null
    */
    comment?: string | null,
    /**
    Comment string for the right side of comment line
    @default null
    */
    commentRight?: string | null,
    /**
    Color of comment string
    @default
    */
    commentColor?: string | null,
    /**
    If true, the text field will blur when submitted.
    Note that for multiline fields, setting blurOnSubmit to true means that pressing return
    will blur the field and trigger the onSubmitEditing event instead of inserting
    a newline into the field.
    @default 'true for single-line fields and false for multiline fields.'
    */
    blurOnSubmit?: boolean,
    /**
    Color of bottom line
    @default null
    */
    bottomLineColor?: string | null,
    /**
    Initial value of input
    @ignore
    */
    defaultValue?: string,
    /**
    Cursor will return to input (focus again) if try to submit empty value
    @default false
    */
    disableSubmitEmpty: boolean,
    /**
    If false, text is not editable. The default value is true.
    @default true
    */
    editable: boolean,
    /**
    Text style.
    @default {}
    */
    inputStyle: ViewStyleProp,
    /**
    Use it for multiline input.
    @default false
    */
    forceMultiLine: boolean,
    /**
    Use it to show top label text.
    @default false
    */
    floatingTitle: boolean,
    /**
    Top label text. If not set and floatingTitle is true then placeholder is used.
    @default ''
    */
    floatingTitleText: string,
    /**
    Don't draw bottom input line.
    @default false
    */
    hideBottomLine: boolean,
    /**
    Don't draw top label text.
    @default false
    */
    hideFloatingTitle: boolean,
    /**
    Don't draw placeholder.
    @default false
    */
    hidePlaceholder: boolean,
    /**
    Determines which keyboard to open, e.g.numeric.
    See https://facebook.github.io/react-native/docs/textinput#keyboardtype
    @default 'default'
    */
    keyboardType: KeyboardType,
    /**
    If true - highlight comment if empty value.
    @default null
    */
    mandatory?: boolean,
    /**
    Color of error comment on empty value.
    @default null
    */
    mandatoryColor?: string | null,
    /**
    Limits the maximum number of characters that can be entered.
    @default null
    */
    maxLength?: number,
    /**
    Limits the maximum lines of input field.
    @default 1
    */
    maxLines: number,
    /**
    Limits the maximum height of input field (in units, used in style).
    @default null
    */
    maxHeight?: number,
    /**
    @ignore
    */
    needArrow?: boolean,
    /**
    Callback that is called when the text input is blurred.
    */
    onBlur: () => void,
    /**
    Callback that is called when the text input's text changes.
    Changed text is passed as a single string argument to the callback handler.
    */
    onChangeText: (text: string) => void,
    /**
    Callback that is called when the text input is focused.
    This is called with { nativeEvent: { target } }
    */
    onFocus: () => void,
    /**
    Callback that is called when the text input's submit button is pressed
    with the argument {nativeEvent: {text, eventCount, target}}.
    Invalid if multiline={true} is specified.
    */
    onSubmitEditing?: () => void,
    /**
    Callback that is called when the text input selection is changed.
    This will be called with { nativeEvent: { selection: { start, end } } }.
    This prop requires multiline={true} to be set.
    */
    onSelectionChange?: ?(e: any) => void,
    /**
    Callback that is called when a key is pressed.
    This will be called with { nativeEvent: { key: keyValue } } where keyValue is 'Enter' or 'Backspace'
    for respective keys and the typed-in character otherwise including ' ' for space.
    Fires before onChange callbacks.
    Note: on Android only the inputs from soft keyboard are handled, not the hardware keyboard inputs.
    */
    onKeyPress?: (e: any) => void,
    /**
    Callback that is called when onChange called, with the new height
    */
    onHeightChange?: (height: number) => void,
    /**
    The string that will be rendered before text input has been entered.
    Also used as top label, if floatingTitle is true and floatingTitleText not set.
    @default ''
    */
    placeholder?: string,
    /**
    The placeholder string that is rendered before the start of text input entering
    meanwhile the field is focused
    @default ''
    */
    secondaryPlaceholder?: string,
    /**
    Use this flag to render * symbol, indicating that field is required.
    @default false
    */
    required?: boolean,
    /**
    Determines how the return key should look.
    See https://facebook.github.io/react-native/docs/textinput#returnkeytype
    @default null
    */
    returnKeyType?: ReturnKeyType,
    /**
    Use any component for rendering in the right of input (such as actions, images etc.).
    @default null
    */
    rightComponent?: React$Node,
    /**
    If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
    The default value is false. Does not work with multiline={true}.
    @default false
    */
    secureTextEntry: boolean,
    /**
    Set cursor position.
    @default null
    */
    selection?: ?{start: number, end: number},
    /**
    If maxLengh is set, show how many symbols left to enter.
    @default false
    */
    showSymbolsLeft: boolean,
    /**
    True if submitting value is disabled.
    @default false
    */
    submitDisabled?: boolean,
    /**
    @ignore
    */
    theme?: UIColorThemeNameType,
    token?: string,
    /**
    The value to show for the text input.
    @default ''
    */
    value: string,
    /**
    The value to show for the text input.
    @default true
    */
    visible: boolean,
    /**
    @ignore
    */
    testID?: string,
    /**
    Prefix icon
    @default null
    */
    prefixIcon?: ?string,
    /**
    Prefix icon color
    @default null
    */
    prefixIconColor?: ?string,
    /**
    ID for InputAccessoryView
    */
    inputAccessoryViewID?: string,
    /**
    Set https://developer.android.com/reference/android/widget/TextView#attr_android:imeOptions to flagNoPersonalizedLearning
    IMPORTANT: not a part of RN yet, we extended TextInput
    */
    noPersonalizedLearning?: boolean,
};

type DetailsState = ActionState & {
    focused: boolean,
};

export default class UIDetailsInput<Props, State> extends UIActionComponent<
    $Shape<Props & DetailsProps>,
    $Shape<State & DetailsState>,
> {
    textInput: ?React.ElementRef<typeof TextInput>;
    auxTextInput: ?any;

    static defaultProps: Props & DetailsProps;

    constructor(props: Props & DetailsProps) {
        super(props);
        this.state = {
            focused: false,
            tapped: false,
            hover: false,
        };
    }

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
    onChange = (event: any): void => {
        if (Platform.OS === 'web') {
            this.onWebChange();
        } else {
            this.onMobileChange(event);
        }
    };

    onMobileChange = (event: any) => {
        if (event && event.nativeEvent) {
            const { contentSize } = event.nativeEvent;
            const height = contentSize?.height || 0;
            if (height > 0) {
                this.onHeightChange(height);
            }
        }
    }

    onWebChange = () => {
        this.setStateSafely({}, () => {
            const aux = this.auxTextInput;
            if (aux?._node) {
                const height = aux?._node.scrollHeight || 0;
                this.onHeightChange(height);
            }
        });
    }

    onHeightChange = (height: number) => {
        if (height) {
            this.setInputAreaHeightOnWeb(height);

            const { onHeightChange } = this.props;
            if (onHeightChange) {
                onHeightChange(height);
            }
        }
    }

    setInputAreaHeightOnWeb = (height: number) => {
        if (Platform.OS !== 'web') {
            return;
        }
        const newSize = Math.min(height, UIConstant.smallCellHeight() * 5);
        const inH = newSize;
        this.onContentSizeChange(inH);
    }

    onContentSizeChange = (height: number): void => {
        // Not implemented in here
    };

    onLayout = (e: any): void => {
        // Not implemented in here
    };

    onChangeText = (text: string, callback: ?((finalValue: string) => void)): void => {
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

    onFocus = (): void => {
        this.setFocused();
        this.props.onFocus();
    };

    onBlur = (): void => {
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

    onSelectionChange = (e: any): void => {
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(e);
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
    setTextInputRef(inputRef: ?React.ElementRef<typeof TextInput>) {
        this.textInput = inputRef;
    }

    // Getters
    getCommentTestID(): ?string {
        return this.props.commentTestID ? this.props.commentTestID : null;
    }

    getCommentRightTestID(): ?string {
        return this.props.commentRightTestID ? this.props.commentRightTestID : null;
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
        const fontStyle = UIStyle.text.bodyRegular();
        delete fontStyle.lineHeight;
        return [
            styles.textInput,
            fontStyle,
            textColorStyle,
            UIStyle.common.flex(),
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

    getSecondaryPlaceholder(): string {
        return this.props.secondaryPlaceholder;
    }

    getRequired(): boolean {
        return this.props.required;
    }

    getSelection() {
        return this.props.selection;
    }

    hidePlaceholder() {
        return this.props.hidePlaceholder;
    }

    getValue() {
        const { value } = this.props;
        if (!value) {
            return '';
        }
        return `${value}`;
    }

    getComment() {
        const { comment } = this.props;
        if (comment === null) {
            return '';
        }
        return `${comment || ' '}`; // space is needed to have fixed height of component
    }

    getCommentRight() {
        const { commentRight } = this.props;
        if (!commentRight) {
            return '';
        }
        return commentRight;
    }

    getInlinePlaceholder() {
        const required = this.getRequired();
        if (required) {
            return '';
        } else if (this.hidePlaceholder()) {
            return ' ';
        } else if (this.isFocused()) {
            return this.getSecondaryPlaceholder();
        }
        return this.getPlaceholder();
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
            floatingTitle, floatingTitleText, theme, hideFloatingTitle,
        } = this.props;
        if (hideFloatingTitle) {
            return null;
        }
        const value = this.getValue();
        const emptyValue = !value || !value.length;
        const text = !floatingTitle || (emptyValue && !this.isFocused())
            ? ' '
            : floatingTitleText || this.getPlaceholder();

        const colorStyle = UIColor.textTertiaryStyle(theme);

        return (
            <Text style={[UIFont.tinyRegular(), colorStyle]}>
                {text}
            </Text>
        );
    }

    renderPrefixIcon() {
        const { prefixIcon, prefixIconColor } = this.props;
        if (!prefixIcon) return null;

        const styleColor = prefixIconColor
            ? UIStyle.color.getTintColorStyle(prefixIconColor)
            : null;
        return (
            <Image source={this.props.prefixIcon} style={[styles.prefixIcon, styleColor]} />
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
                    UIStyle.text.quaternaryBodyRegular(),
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

        const webStyle = Platform.OS === 'web' ? { overflow: 'hidden' } : null;

        return (
            <TextInput
                ref={(component) => { this.auxTextInput = component; }}
                style={[this.textInputStyle(), styles.textInputAux, webStyle]}
                numberOfLines={1}
                editable={false}
                value={this.getValue()}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                onKeyPress={this.onKeyPress}
            />
        );
    }

    renderTextInput() {
        const {
            accessibilityLabel,
            autoCompleteType,
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
            value,
            noPersonalizedLearning,
        } = this.props;

        // The keyboarftype used for UISeedPhraseInput on Android breaks the multiline native behavior
        // that autogrows the input text, in order to fix it, we handle the onContentSizeChange to set
        // manually the input height, but on Android the behavior is not synchronized, using this to set
        // a minimum height, based on a state, fixes the problem.
        const minHeight = Platform.OS === 'android' ? { minHeight: this.state.inputHeight } : null;

        const accessibilityLabelProp = accessibilityLabel ? { accessibilityLabel } : null;
        const maxLengthProp = maxLength ? { maxLength } : null;
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        const blurOnSubmitProp = blurOnSubmit ? { blurOnSubmit } : null;
        const testIDProp = testID ? { testID } : null;
        // Existance of value prop is define either component controlled or uncontrolled
        // https://reactjs.org/docs/uncontrolled-components.html
        const valueProp = value != null ? { value: this.getValue() } : null;
        const placeholderColor = editable
            ? UIColor.textPlaceholder(theme)
            : UIColor.textDisabled(theme);
        return (
            // $FlowFixMe
            <TextInput
                onLayout={this.onLayout}
                {...accessibilityLabelProp}
                autoCapitalize={autoCapitalize}
                autoCompleteType={autoCompleteType}
                autoCorrect={autoCorrect}
                autoFocus={autoFocus}
                editable={editable}
                enablesReturnKeyAutomatically={this.props.disableSubmitEmpty}
                keyboardType={this.keyboardType()}
                {...maxLengthProp}
                multiline={this.isMultiline()}
                numberOfLines={this.numOfLines()}
                noPersonalizedLearning={noPersonalizedLearning}
                clearButtonMode="never"
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChangeText={this.onChangeText}
                onChange={this.onChange}
                onContentSizeChange={this.onChange}
                onSubmitEditing={this.onSubmitEditing}
                onKeyPress={this.onKeyPress}
                placeholder={this.getInlinePlaceholder()}
                placeholderTextColor={placeholderColor}
                ref={(component) => { this.textInput = component; }}
                onSelectionChange={this.onSelectionChange}
                selection={this.getSelection()}
                {...returnKeyTypeProp}
                {...blurOnSubmitProp}
                style={[
                    this.textInputStyle(),
                    {
                        marginTop:
                            Platform.OS === 'ios' && process.env.NODE_ENV === 'production'
                                ? 5 // seems to be smth connected to iOS's textContainerInset
                                : 0,
                        maxHeight,
                        ...minHeight,
                    },
                ]}
                selectionColor={UIColor.primary()}
                underlineColorAndroid="transparent"
                secureTextEntry={secureTextEntry}
                inputAccessoryViewID={this.props.inputAccessoryViewID}
                {...valueProp}
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
            <Text style={[UIStyle.text.secondaryBodyRegular(), UIStyle.margin.rightSmall()]}>
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

        const buttonTextStyle = [];
        if (button.onPress && !button.disabled) {
            buttonTextStyle.push(UIStyle.text.primaryBodyMedium());
        } else {
            buttonTextStyle.push(UIStyle.text.tertiaryBodyRegular());
        }

        return (<UITextButton
            textStyle={buttonTextStyle}
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
                source={theme === UIColor.Theme.Light && iconArrowDefault}
                disabled={this.isSubmitDisabled()}
                onPress={this.onSubmitEditing}
            />
        );
    }

    renderRightComponent() {
        return this.props.rightComponent || null;
    }

    renderRequiredPlaceholder() {
        if (this.hidePlaceholder()) {
            return null;
        }
        const required = this.getRequired();
        if (!required) {
            return null;
        }
        if ((this.state.focused && !this.getSecondaryPlaceholder()) || this.props.value) {
            return null;
        }
        const placeholder = this.state.focused
            ? this.getSecondaryPlaceholder()
            : this.getPlaceholder();
        return (
            <Text style={[UIStyle.text.tertiaryBodyRegular(), UIStyle.common.positionAbsolute()]}>
                {placeholder}
                <Text
                    style={[
                        UIStyle.text.tertiaryBodyRegular(),
                        styles.requiredAsterisk,
                    ]}
                > *
                </Text>
            </Text>
        );
    }

    renderTextFragment(): React$Node {
        return (
            <React.Fragment>
                {this.renderPrefixIcon()}
                {this.renderBeginningTag()}
                <View style={UIStyle.container.screen()}>
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
            hideBottomLine, theme, mandatory, mandatoryColor,
        } = this.props;
        const bottomLine = hideBottomLine ? null : UIStyle.border.bottom();
        let bottomLineColor: UIColorData;
        if (this.props.bottomLineColor) {
            ({ bottomLineColor } = this.props);
        } else if (mandatory && !this.getValue()) {
            bottomLineColor = mandatoryColor;
        } else if (this.commentColor()) {
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
        const commentRight = this.getCommentRight();
        if (!comment && !commentRight) {
            return null;
        }
        const defaultColorStyle = UIColor.textTertiaryStyle(theme);
        const commentColor = this.commentColor();
        const colorStyle = commentColor
            ? UIColor.getColorStyle(commentColor)
            : null;
        const containerStyle = [
            styles.commentStyle,
            UIStyle.margin.topSmall(),
            UIStyle.margin.bottomSmall(),
        ];
        const textStyle = [colorStyle, UIStyle.text.captionRegular()];
        const containerViewStyle = [
            UIStyle.common.flex(),
            UIStyle.common.flexRow(),
            UIStyle.common.justifySpaceBetween(),
            UIStyle.common.alignCenter(),
        ];
        const leftViewContainer = commentRight
            ? UIStyle.common.flex2() : UIStyle.common.flex();
        const rightViewContainer = commentRight
            ? [
                UIStyle.common.flex2(),
                UIStyle.common.alignEnd(),
                UIStyle.margin.leftDefault(),
            ] : null;
        const commentRightLabel = (
            <UILabel
                role={UILabel.Role.CaptionTertiary}
                style={[
                    ...textStyle,
                    ...containerStyle,
                ]}
                text={commentRight}
            />
        );
        const component = onPressComment ? (
            <UITextButton
                {...testIDProp}
                style={[...containerStyle, UIStyle.height.littleCell()]}
                textStyle={[UIColor.actionTextPrimaryStyle(theme), ...textStyle]}
                title={comment}
                onPress={onPressComment}
            />
        ) : (
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

        return (
            <View style={containerViewStyle}>
                <View style={leftViewContainer}>
                    {component}
                </View>
                <View style={rightViewContainer}>
                    {commentRightLabel}
                </View>
            </View>
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
                style={[this.containerStyle(), this.props.containerStyle, this.props.style]}
            >
                {this.renderFloatingTitle()}
                {this.renderTextView()}
                {this.renderComment()}
            </View>
        );
    }
}

UIDetailsInput.defaultProps = {
    autoCapitalize: 'sentences',
    autoCorrect: false,
    autoFocus: false,
    beginningTag: '',
    containerStyle: {},
    comment: null,
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
    noPersonalizedLearning: false,
    onBlur: () => {},
    onChangeText: () => {},
    onFocus: () => {},
    onSubmitEditing: () => {},
    onKeyPress: () => {},
    onHeightChange: () => {},
    onSelectionChange: null,
    onPressComment: null,
    placeholder: '',
    secondaryPlaceholder: '',
    required: false,
    secureTextEntry: false,
    selection: null,
    showSymbolsLeft: false,
    style: null,
    submitDisabled: false,
    theme: UIColor.Theme.Light,
    value: '',
    visible: true,
    prefixIcon: null,
    prefixIconColor: null,
};
