/* eslint-disable global-require */
// @flow
import * as React from 'react';
import { Platform, TextInput, View, StyleSheet, Image } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {
    ReturnKeyType,
    KeyboardType,
    AutoCapitalize,
} from 'react-native/Libraries/Components/TextInput/TextInput';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIColor, UIConstant, UIStyle } from '@tonlabs/uikit.core';
import type { UIColorThemeNameType, EventProps } from '@tonlabs/uikit.core';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    UILinkButton,
    UILinkButtonSize,
    UILinkButtonVariant,
    UITextView,
} from '@tonlabs/uikit.hydrogen';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';

import UIActionImage from '../UIActionImage';
import { UIActionComponent } from '../UIActionComponent';
import type { UIActionComponentProps, UIActionComponentState } from '../UIActionComponent';

const styles = StyleSheet.create({
    container: {
        //
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
    prefixIcon: {
        marginRight: UIConstant.smallContentOffset(),
    },
});

export type UIDetailsInputProps = UIActionComponentProps & {
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
    Object to describe right button, contains properties like UILinkButton.
    For ex, {title: "Action", icon: iconSrc, textStyle: onPress: ()=>{}}
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
    commentColor?: ColorVariants | null,
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
    bottomLineColor?: ColorVariants | null,
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
    mandatoryColor?: ColorVariants | null,
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
    do not render right component if input not focused
    @default null
    */
    renderRightComponentOnlyOnFocus?: boolean,
    /**
    If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
    The default value is false. Does not work with multiline={true}.
    @default false
    */
    secureTextEntry: boolean,
    /**
    If true, text becomes unselectable for copy to clipboard
    @default false
    */
    copyingLocked: boolean,
    /**
    Set cursor position. May not work correctly with `copyingLocked = true`
    @default null
    */
    selection?: ?{ start: number, end: number },
    /**
    If maxLength is set, show how many symbols left to enter.
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
    /**
    The token symbol
    */
    token?: string | React$Element<any>,
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

type Selection = {
    start: number,
    end: number,
};

type UIDetailsInputState = UIActionComponentState & {
    focused: boolean,
    selection: ?Selection,
};

const TextViewWrapper = React.forwardRef<*, UIDetailsInputProps>(
    (
        { value, bottomLineColor, mandatoryColor, commentColor, focused, hover, style, ...rest }: *,
        ref,
    ) => {
        const theme = useTheme();

        const borderBottomColor = React.useMemo(() => {
            let color: ColorVariants;
            if (bottomLineColor) {
                color = bottomLineColor;
            } else if (mandatoryColor && value) {
                color = mandatoryColor;
            } else if (commentColor) {
                color = commentColor;
            } else if (focused) {
                color = ColorVariants.LineAccent;
            } else if (hover) {
                color = ColorVariants.LineNeutral;
            } else {
                color = ColorVariants.LinePrimary;
            }
            return color;
        }, [bottomLineColor, mandatoryColor, commentColor, focused, hover]);

        return (
            <View
                // $FlowFixMe
                ref={ref}
                {...rest}
                style={[style, { borderBottomColor: theme[borderBottomColor] }]}
            />
        );
    },
);

export class UIDetailsInput<Props, State> extends UIActionComponent<
    $Shape<Props & UIDetailsInputProps>,
    $Shape<State & UIDetailsInputState>,
> {
    textInput = React.createRef<UITextView>();
    auxTextInput = React.createRef<?any>();

    static defaultProps: Props & UIDetailsInputProps;

    constructor(props: Props & UIDetailsInputProps) {
        super(props);
        this.state = {
            focused: false,
            tapped: false,
            hover: false,
            selection: undefined,
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
    };

    onWebChange = () => {
        this.setStateSafely({}, () => {
            const aux = this.auxTextInput.current;
            if (aux) {
                const height = (aux._node ? aux._node.scrollHeight : aux.scrollHeight) || 0;
                this.onHeightChange(height);
            }
        });
    };

    onHeightChange = (height: number) => {
        if (height) {
            this.adjustInputAreaHeightIfNeeded(height);

            const { onHeightChange } = this.props;
            if (onHeightChange) {
                onHeightChange(height);
            }
        }
    };

    adjustInputAreaHeightIfNeeded = (height: number) => {
        if (Platform.OS === 'ios') {
            // iOS input have the own multiline native auto-grow behaviour
            // No need to adjust the height
            return;
        }
        const newSize = Math.min(height, UIConstant.smallCellHeight() * 5);
        const inH = newSize;
        this.onContentSizeChange(inH);
    };

    onContentSizeChange = (height: number): void => {
        // Not implemented in here
    };

    onLayout = (e: any): void => {
        // Not implemented in here
    };

    onChangeText = (text: string, callback: ?(finalValue: string) => void): void => {
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
        if (this.props.copyingLocked && Platform.OS !== 'ios') {
            // more priority than external prop
            const {
                nativeEvent: { selection },
            } = e;
            const value = this.getValue();
            if (selection.start !== selection.end) {
                const selectionToSet = {
                    start: value.length,
                    end: value.length,
                };
                this.setStateSafely({ selection: selectionToSet }, () => {
                    // set cursor to end
                    this.setStateSafely({ selection: undefined }); // stop control cursor
                });
            }
        }
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

    // Getters
    getCommentTestID(): ?string {
        return this.props.commentTestID ? this.props.commentTestID : null;
    }

    getCommentRightTestID(): ?string {
        return this.props.commentRightTestID ? this.props.commentRightTestID : null;
    }

    isFocused(): boolean {
        return (
            this.state.focused ||
            (this.textInput.current && this.textInput.current.isFocused()) ||
            false
        );
    }

    isHover(): boolean {
        return this.state.hover;
    }

    isSubmitDisabled(value: string = this.props.value): boolean {
        return (this.props.disableSubmitEmpty && !value) || this.props.submitDisabled || false;
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
        const { inputStyle } = this.props;
        // We remove the fontFamily for Android in oder to eliminate jumping input behaviour
        const androidFix = Platform.OS === 'android' ? { fontFamily: undefined } : {};
        return [styles.textInput, UIStyle.common.flex(), inputStyle, androidFix];
    }

    beginningTag() {
        return this.props.beginningTag;
    }

    commentColor() {
        return this.props.commentColor;
    }

    commentButtonVariant(): UILinkButtonVariant {
        const commentColor = this.commentColor();
        if (commentColor === ColorVariants.TextPositive) {
            return UILinkButtonVariant.Positive;
        } else if (commentColor === ColorVariants.TextNegative) {
            return UILinkButtonVariant.Negative;
        } else {
            return UILinkButtonVariant.Neutral;
        }
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
        return this.state.selection || this.props.selection;
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
        if (this.textInput.current) {
            this.textInput.current.focus();
        }
    }

    blur() {
        if (this.textInput.current) {
            this.textInput.current.blur();
        }
    }

    clear() {
        if (this.textInput.current) {
            this.textInput.current.clear();
        }
    }

    // Render
    renderFloatingTitle() {
        const { floatingTitle, floatingTitleText, hideFloatingTitle } = this.props;
        if (hideFloatingTitle) {
            return null;
        }
        const value = this.getValue();
        const emptyValue = !value || !value.length;
        const text =
            !floatingTitle || (emptyValue && !this.isFocused())
                ? ' '
                : floatingTitleText || this.getPlaceholder();

        return (
            <UILabel color={UILabelColors.TextTertiary} role={UILabelRoles.ParagraphLabel}>
                {text}
            </UILabel>
        );
    }

    renderPrefixIcon() {
        const { prefixIcon, prefixIconColor } = this.props;
        if (!prefixIcon) return null;

        const styleColor = prefixIconColor
            ? UIStyle.color.getTintColorStyle(prefixIconColor)
            : null;
        return <Image source={this.props.prefixIcon} style={[styles.prefixIcon, styleColor]} />;
    }

    renderBeginningTag() {
        const beginningTag = this.beginningTag();
        const emptyValue = !this.props.value || !this.props.value.length;
        if (!beginningTag || (!this.isFocused() && emptyValue)) {
            return null;
        }
        return (
            <UILabel
                color={UILabelColors.TextTertiary}
                role={UILabelRoles.ParagraphText}
                style={styles.beginningTag}
            >
                {beginningTag}
            </UILabel>
        );
    }

    renderAuxTextInput() {
        if (!this.isMultiline()) {
            return null;
        }

        const webStyle = Platform.OS === 'web' ? { overflow: 'hidden' } : null;

        return (
            <UITextView
                ref={this.auxTextInput}
                numberOfLines={1}
                editable={false}
                value={this.getValue()}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                onKeyPress={this.onKeyPress}
                style={[this.textInputStyle(), styles.textInputAux, webStyle]}
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
            maxHeight,
            value,
            noPersonalizedLearning,
        } = this.props;

        // The keyboardType used for UISeedPhraseInput on Android breaks the multiline native
        // behavior that auto-grows the input text.
        // In order to fix it, we handle the `onContentSizeChange` to set manually the input height,
        // but on Android the behavior is not synchronized.
        // Using this to set a minimum height, based on a state, fixes the problem.
        const minHeight = Platform.OS === 'android' ? { minHeight: this.state.inputHeight } : null;

        const accessibilityLabelProp = accessibilityLabel ? { accessibilityLabel } : null;
        const maxLengthProp = maxLength ? { maxLength } : null;
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        const blurOnSubmitProp = blurOnSubmit ? { blurOnSubmit } : null;
        const testIDProp = testID ? { testID } : null;
        // Existence of value prop is define either component controlled or uncontrolled
        // https://reactjs.org/docs/uncontrolled-components.html
        const valueProp = value != null ? { value: this.getValue() } : null;
        const placeholderColor = editable
            ? UILabelColors.TextSecondary
            : UILabelColors.TextTertiary;
        return (
            <UITextView
                contextMenuHidden={this.props.copyingLocked && value.length !== 0} // iOS only
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
                ref={this.textInput}
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
                secureTextEntry={secureTextEntry}
                inputAccessoryViewID={this.props.inputAccessoryViewID}
                // $FlowFixMe
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
            <UILabel
                color={UILabelColors.TextSecondary}
                role={UILabelRoles.ParagraphText}
                style={UIStyle.margin.rightSmall()}
            >
                {maxLength - value.length}
            </UILabel>
        );
    }

    renderToken() {
        const { token } = this.props;
        if (!token) {
            return null;
        }
        return <UILabel role={UILabel.Role.DescriptionTertiary} text={token} />;
    }

    renderButton() {
        const { button } = this.props;
        if (!button) {
            return null;
        }

        return (
            <UILinkButton
                {...button}
                layout={{
                    marginLeft: UIConstant.tinyContentOffset(),
                }}
            />
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
                iconEnabled: UIAssets.icons.ui.arrowRightPrimary,
                iconHovered: UIAssets.icons.ui.arrowRightWhite,
                iconDisabled: UIAssets.icons.ui.arrowRightPrimaryMinus,
            };
        }

        return (
            <UIActionImage
                {...icons}
                source={theme === UIColor.Theme.Light && UIAssets.icons.ui.arrowRight}
                disabled={this.isSubmitDisabled()}
                onPress={this.onSubmitEditing}
            />
        );
    }

    renderRightComponent() {
        if (this.props.renderRightComponentOnlyOnFocus && !this.isFocused()) {
            return null;
        }
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
            <UILabel
                color={UILabelColors.TextTertiary}
                role={UILabelRoles.ParagraphText}
                style={UIStyle.common.positionAbsolute()}
            >
                {placeholder}
                <UILabel color={UILabelColors.TextAccent} role={UILabelRoles.ParagraphText}>
                     *
                </UILabel>
            </UILabel>
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
        const { hideBottomLine, bottomLineColor, mandatory, mandatoryColor } = this.props;
        const bottomLine = hideBottomLine ? null : UIStyle.border.bottom();

        return (
            <TextViewWrapper
                value={this.getValue()}
                bottomLineColor={bottomLineColor}
                mandatoryColor={mandatory ? mandatoryColor : null}
                commentColor={this.commentColor()}
                focused={this.isFocused()}
                hover={this.isHover()}
                style={[
                    UIStyle.padding.topTiny(),
                    UIStyle.padding.bottomSmall(),
                    UIStyle.flex.row(),
                    UIStyle.flex.alignCenter(),
                    bottomLine,
                ]}
            >
                {this.renderTextFragment()}
            </TextViewWrapper>
        );
    }

    renderComment() {
        const { onPressComment } = this.props;
        const comment = this.getComment();
        const commentColor = this.commentColor();
        const commentButtonVariant = this.commentButtonVariant();
        const commentRight = this.getCommentRight();
        const testID = this.getCommentTestID();
        const testIDProp = testID ? { testID } : null;

        if (!comment && !commentRight) {
            return null;
        }

        const component = onPressComment ? (
            <View style={styles.commentStyle}>
                <UILinkButton
                    {...testIDProp}
                    title={comment}
                    size={UILinkButtonSize.Small}
                    variant={commentButtonVariant}
                    onPress={onPressComment}
                    layout={{
                        marginTop: UIConstant.smallContentOffset() - 2,
                        marginBottom: UIConstant.smallContentOffset() - 2,
                    }}
                />
            </View>
        ) : (
            <UILabel
                {...testIDProp}
                color={commentColor || UILabelColors.TextTertiary}
                role={UILabelRoles.ParagraphNote}
                style={[
                    styles.commentStyle,
                    UIStyle.margin.topSmall(),
                    UIStyle.margin.bottomSmall(),
                ]}
            >
                {comment}
            </UILabel>
        );

        const commentRightLabel = (
            <UILabel
                color={commentColor || UILabelColors.TextTertiary}
                role={UILabelRoles.ParagraphNote}
                style={[
                    styles.commentStyle,
                    UIStyle.margin.topSmall(),
                    UIStyle.margin.bottomSmall(),
                ]}
            >
                {commentRight}
            </UILabel>
        );

        return (
            <View
                style={[
                    UIStyle.common.flex(),
                    UIStyle.common.flexRow(),
                    UIStyle.common.justifySpaceBetween(),
                    UIStyle.common.alignCenter(),
                ]}
            >
                <View style={commentRight ? UIStyle.common.flex2() : UIStyle.common.flex()}>
                    {component}
                </View>
                <View
                    style={
                        commentRight
                            ? [
                                  UIStyle.common.flex2(),
                                  UIStyle.common.alignEnd(),
                                  UIStyle.margin.leftDefault(),
                              ]
                            : null
                    }
                >
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
                style={[this.containerStyle(), this.props.containerStyle, this.props.style]}
                // $FlowFixMe
                {...eventProps}
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
    mandatoryColor: ColorVariants.LineNegative,
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
    copyingLocked: false,
};
