// @flow
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Platform, View, Keyboard } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { Popover } from 'react-native-simple-popover';

import {
    UIColor,
    UIConstant,
    UIFunction,
    UILocalized,
    UIStyle,
    UIDevice,
} from '@uikit/core';

import UIDetailsInput from '../UIDetailsInput';
import type { DetailsProps } from '../UIDetailsInput';
import type { ActionState } from '../UIActionComponent';

import UISeedPhraseHintsView from './UISeedPhraseHintsView';


type Props = DetailsProps & {
    containerStyle?: ViewStyleProp,
    phraseToCheck: string,
    isSeedPhraseValid?: ?boolean,
    onChangeIsValidPhrase?: (isValid: boolean) => void,
    totalWords: number,
    words: string[],
};

type State = ActionState & {
    wordThatChangedIndex: number,
    inputHeight: number,
    inputWidth: number,
    heightChanging: boolean,
};

const space = ' ';

export default class UISeedPhraseInput extends UIDetailsInput<Props, State> {
    static defaultProps = {
        ...UIDetailsInput.defaultProps,
        isSeedPhraseValid: null,
        autoCapitalize: 'none',
        returnKeyType: 'done',
        blurOnSubmit: true,
        placeholder: UILocalized.MasterPassword,
        autoFocus: false,
        containerStyle: {},
        forceMultiLine: true,
        // To prevent Android keyboard suggestions
        // Btw it could break multiline support, need to keep an eye on it
        keyboardType: Platform.OS === 'android' ? 'visible-password' : 'default',
        phraseToCheck: '',
        commentTestID: 'comment',
        onChangeIsValidPhrase: () => {},
        onBlur: () => {},
        totalWords: 12, // default value
        words: [],
        // Set an InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS flag to a keyboard on Android.
        // Needed by security reasons.
        autoCorrect: false,
        autoCompleteType: 'off',
        noPersonalizedLearning: true,
    };

    static splitPhrase(phrase: string): Array<string> {
        return (phrase.match(/\w+|\s$/g) || []).map(s => (s === space ? '' : s));
    }

    static addDashes(words: Array<string> = []): string {
        return words.join(`${space}${UIConstant.dashSymbol()}${space}`);
    }

    lastWords: Array<string>;
    totalWords: number;
    seedPhraseHintsView: ?UISeedPhraseHintsView;
    clickListener: ?(e: any) => void;
    keyboardWillHideListener: any;

    constructor(props: Props) {
        super(props);

        this.lastWords = [];
        this.totalWords = props.totalWords;
        this.clickListener = null;

        this.state = {
            ...this.state,
            wordThatChangedIndex: -1,
            inputHeight: UIConstant.smallCellHeight(),
            inputWidth: UIConstant.toastWidth(),
            comment: '',
            heightChanging: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.setTotalWords();
        this.initKeyboardListeners();
        this.initClickListenerForWeb();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.deinitKeyboardListeners();
        this.deinitClickListenerForWeb();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.isSeedPhraseValid && !prevProps.isSeedPhraseValid) {
            Keyboard.dismiss();
        }
    }

    // Keyboard
    initKeyboardListeners() {
        if (Platform.OS === 'web') {
            return; // no need
        }
        this.keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            e => this.onKeyboardWillHide(e),
        );
    }

    deinitKeyboardListeners() {
        if (this.keyboardWillHideListener) {
            this.keyboardWillHideListener.remove();
        }
    }

    // Clicks
    initClickListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        const listenerType = UIDevice.isDesktopWeb() || UIDevice.isWebkit() ? 'click' : 'touchend';
        this.clickListener = () => {
            this.hideHints();
        };
        window.addEventListener(listenerType, this.clickListener);
    }

    deinitClickListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        const listenerType = UIDevice.isDesktopWeb() || UIDevice.isWebkit() ? 'click' : 'touchend';
        window.removeEventListener(listenerType, this.clickListener);
    }

    // Events
    onKeyboardWillHide = (e: any) => {
        this.hideHints();
    };

    onKeyPress = (e: any): void => {
        if (this.seedPhraseHintsView) {
            this.seedPhraseHintsView.onKeyPress(e);
        }
    };

    // Setters
    setTotalWords() {
        const { phraseToCheck, totalWords } = this.props;
        if (phraseToCheck.length === 0) {
            this.totalWords = totalWords;
        } else {
            const words = UISeedPhraseInput.splitPhrase(phraseToCheck);
            this.totalWords = words.length;
        }
    }

    setInputHeight(inputHeight: number) {
        this.setStateSafely({ inputHeight });
    }

    setWordThatChangedIndex(wordThatChangedIndex: number, callback?: () => void) {
        this.setStateSafely({ wordThatChangedIndex }, callback);
    }

    setHeightChanging(heightChanging: boolean, callback?: () => void) {
        this.setStateSafely({ heightChanging }, callback);
    }

    // Getters
    getCommentTestID(): string {
        const { commentTestID } = this.props;
        const comment = this.getComment();
        if (comment === UILocalized.seedPhraseTypo) {
            return `${commentTestID}_error`;
        } else if (comment.includes('more')) {
            return `${commentTestID}_counter_${comment.split(' ')[0]}`;
        } else if (comment === UILocalized.greatMemory) {
            return `${commentTestID}_success`;
        }
        return commentTestID;
    }

    containerStyle(): ViewStyleProp {
        const { rightButton } = this.props;
        return rightButton && rightButton.length > 0 ? UIStyle.common.flex() : null;
    }

    getInputHeight(): number {
        return this.state.inputHeight;
    }

    numOfLines(): number {
        return Math.round(this.getInputHeight() / UIConstant.smallCellHeight());
    }

    commentColor(): ?string {
        const { commentColor } = this.props;
        if (commentColor) {
            return commentColor;
        }

        const valid = this.areWordsValid();
        const count = this.getRemainingCount();

        if (!valid && count === 0) {
            return UIColor.error();
        } else if (valid && count === 0) {
            return UIColor.success();
        }

        return null;
    }

    getComment(): string {
        const { comment } = this.props;
        if (comment) {
            return comment;
        }

        const valid = this.areWordsValid();
        const count = this.getRemainingCount();

        if (!valid && count === 0) {
            return UILocalized.seedPhraseTypo;
        } else if (valid && count === 0) {
            return UILocalized.greatMemory;
        }

        return UILocalized.localizedStringForValue(count, 'moreWords');
    }

    getRemainingCount(): number {
        const phrase = this.getValue().trim();
        const words = UISeedPhraseInput.splitPhrase(phrase);
        const count = phrase.length === 0 ? 0 : words.length;
        return this.totalWords - count;
    }

    getWordThatChangedIndex(): number {
        return this.state.wordThatChangedIndex;
    }

    getInputWidth() {
        return this.state.inputWidth || UIConstant.toastWidth();
    }

    isHeightChanging(): boolean {
        return this.state.heightChanging;
    }

    areHintsVisible(): boolean {
        const wtc = this.getWordThatChangedIndex();
        return wtc !== -1 && !this.isHeightChanging();
    }

    areWordsValid(currentPhrase?: string): boolean {
        const { phraseToCheck, isSeedPhraseValid } = this.props;
        if (isSeedPhraseValid !== null) {
            return isSeedPhraseValid;
        }
        if (phraseToCheck.length > 0) {
            return this.areSeedPhrasesEqual(currentPhrase);
        }

        const phrase = currentPhrase || this.getValue();
        const words = UISeedPhraseInput.splitPhrase(phrase);

        let result = true;
        for (let i = 0; i < words.length; i += 1) {
            if (words[i].length === 0) {
                break;
            }

            const included = this.props.words.filter(word => word === words[i]);
            if (included.length === 0) {
                result = false;
                break;
            }
        }

        return result;
    }

    // Events
    onLayout = (e: any) => {
        const { nativeEvent } = e;
        // If the browser window is resized, this forces the input
        // to adjust its size so that the full phrase is displayed.
        if (Platform.OS === 'web') {
            this.onChange(e);
        }
        if (nativeEvent) {
            const { layout } = nativeEvent;
            this.setStateSafely({ inputWidth: layout.width });
        }
    };

    onBlur = () => {
        this.setFocused(false);
        this.props.onBlur();
        if (Platform.OS !== 'web') {
            this.hideHints();
        }
    };

    /**
     * @override as it's important to know about the changes in the height for seed phrase input
     */
    adjustInputAreaHeightIfNeeded = (height: number) => {
        const newSize = Math.min(height, UIConstant.smallCellHeight() * 5);
        const inH = newSize;
        this.onContentSizeChange(inH);
    }

    onContentSizeChange = (height: number) => {
        this.setInputHeight(height);
        this.rerenderPopoverForAndroid();
    };

    onChangeText = (newValue: string, callback: ?((finalValue: string) => void)): void => {
        const { onChangeText, onChangeIsValidPhrase } = this.props;
        const split = UISeedPhraseInput.splitPhrase(newValue);
        if (split.length > this.totalWords) {
            return;
        }

        const finalValue = UISeedPhraseInput.addDashes(split);
        onChangeText(finalValue);

        this.identifyWordThatChanged(split, () => {
            if (callback) {
                callback(finalValue);
            }
        });

        if (onChangeIsValidPhrase) {
            onChangeIsValidPhrase(this.areWordsValid(finalValue));
        }
    };

    onHintSelected = (hint: string) => {
        const phrase = this.getValue();
        const words = UISeedPhraseInput.splitPhrase(phrase);
        const wtc = this.getWordThatChangedIndex();

        let newPhrase = '';
        const extraSpace = words.length === this.totalWords ? '' : ' ';
        for (let i = 0; i < words.length; i += 1) {
            const wordToAdd = i === wtc ? hint : words[i];
            newPhrase = `${newPhrase} ${wordToAdd}`;
        }
        newPhrase = `${newPhrase}`.trim();
        newPhrase = `${newPhrase}${extraSpace}`;

        this.onChangeText(newPhrase, (finalValue) => {
            const { textInput } = this;
            if (textInput) {
                if (!this.props.isSeedPhraseValid) {
                    textInput.focus();
                }

                // Apply a fix to move the cursor to the right
                if (Platform.OS === 'web') {
                    textInput.setSelectionRange(finalValue.length, finalValue.length);
                } else if (Platform.OS === 'ios') {
                    // nothing
                } else if (Platform.OS === 'android') {
                    // Actually Android moves the cursor to the the right visually,
                    // BUT physically it's not moved, and when the user continues typing
                    // the cursor stays wherever it was before, but not at the right.

                    /*
                    At the moment the hack bellow behaves even more terrible then the issue above,
                    because a native selection of Android's TextInput gets stuck since RN0.60:
                    https://github.com/facebook/react-native/issues/26047

                    Have to comment this scope for now and live with the bug described above...

                    // Thus we change the native position of it ...
                    textInput.setNativeProps({
                        selection: {
                            start: finalValue.length - 1,
                            end: finalValue.length - 1,
                        },
                    });
                    // ... in order to return it back to the right
                    textInput.setNativeProps({
                        selection: {
                            start: finalValue.length,
                            end: finalValue.length,
                        },
                    });
                    */

                    // Another hack...
                    // Remove the ending space in order to force the input updating its cursor!
                    // It doesn't affect UX dramatically: the caret just jumps one position left
                    if (finalValue.endsWith(space)) {
                        textInput.setNativeProps({
                            text: finalValue.substr(0, finalValue.length - 1),
                        });
                    }
                }
            }
        });
    };

    // methods
    hideHints() {
        this.setWordThatChangedIndex(-1); // hides hints container
    }

    identifyWordThatChanged(currentWords: Array<string>, callback: ?(() => void)) {
        let i = 0;
        let index = !this.lastWords.length ? 0 : -1;
        while (i < this.lastWords.length && i < currentWords.length) {
            if (this.lastWords[i] !== currentWords[i]) {
                index = i;
                break;
            }
            i += 1;
        }
        this.lastWords = Array.from(currentWords);

        this.setWordThatChangedIndex(index, () => {
            setTimeout(() => {
                const wordThatChanged = currentWords[index];
                if (this.seedPhraseHintsView) {
                    this.seedPhraseHintsView.wordChanged(wordThatChanged);
                }
                if (callback) {
                    callback();
                }
            }, UIConstant.animationSmallDuration()); // Give some time to render
        });
    }

    areSeedPhrasesEqual(currentPhrase?: string): boolean {
        const { phraseToCheck } = this.props;
        const typedPhrase = currentPhrase || this.getValue();
        return UIFunction.normalizeKeyPhrase(typedPhrase)
            === UIFunction.normalizeKeyPhrase(phraseToCheck);
    }

    rerenderPopoverForAndroid() {
        // This hack is needed to rerender the popover on Android, as changing `key` is not enough!
        if (Platform.OS === 'android') {
            this.setHeightChanging(true, () => {
                setTimeout(() => {
                    this.setHeightChanging(false);
                }, UIConstant.animationSmallDuration());
            });
        }
    }

    // Render
    renderHintsView() {
        const { words } = this.props;
        return (<UISeedPhraseHintsView
            ref={(component) => { this.seedPhraseHintsView = component; }}
            words={words}
            width={this.getInputWidth()}
            onHintSelected={this.onHintSelected}
            yOffset={UIConstant.normalContentOffset()}
        />);
    }

    renderHintsPopover() {
        return (
            <Popover
                key={`hintsPopover~${this.getInputHeight()}`}
                placement="bottom"
                arrowWidth={0}
                arrowHeight={0}
                isVisible={this.areHintsVisible()}
                component={() => this.renderHintsView()}
            >
                <View />
            </Popover>
        );
    }

    renderTextFragment() {
        return (
            <React.Fragment>
                <View style={UIStyle.screenContainer}>
                    {this.renderAuxTextInput()}
                    {this.renderTextInput()}
                    {this.renderHintsPopover()}
                </View>
            </React.Fragment>
        );
    }
}
