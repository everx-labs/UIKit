// @flow
import React from 'react';
import { Platform, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { Popover } from 'react-native-simple-popover';

import Mnemonic from 'bitcore-mnemonic';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';
import UIStyle from '../../../helpers/UIStyle';
import UIDevice from '../../../helpers/UIDevice';

import UIDetailsInput from '../UIDetailsInput';

import UISeedPhraseHintsView from './UISeedPhraseHintsView';

import type { DetailsProps } from '../UIDetailsInput';
import type { ActionState } from '../../UIActionComponent';

type Props = DetailsProps & {
    containerStyle?: ViewStyleProp,
    phraseToCheck: string,
    isSeedPhraseValid?: boolean,
    onChangeIsValidPhrase?: (isValid: boolean) => void,
};

type State = ActionState & {
    popoverPlacement: string,
    wordThatChangedIndex: number,
    inputHeight: number,
    inputWidth: number,
};

export default class UISeedPhraseInput extends UIDetailsInput<Props, State> {
    static defaultProps = {
        ...UIDetailsInput.defaultProps,
        isSeedPhraseValid: null,
        autoCapitalize: 'none',
        returnKeyType: 'done',
        blurOnSubmit: true,
        placeholder: UILocalized.Password,
        autoFocus: false,
        containerStyle: { },
        forceMultiLine: true,
        keyboardType: 'default', /* Platform.OS === 'android'
            ? 'visible-password' // to fix Android bug with keyboard suggestions
            : 'default', */ // CRAP, we can't use the hack as it breaks the multiline support :(
        phraseToCheck: '',
        onChangeIsValidPhrase: () => {},
        onBlur: () => {},
    };

    static splitPhrase(phrase: string): Array<string> {
        const noRegularDash = phrase.replace(/-+/g, ` ${UIConstant.dashSymbol()} `);
        const noExtraSpaces = noRegularDash.replace(/\s+/g, ' ');
        const words = noExtraSpaces.split(' ');
        const normalized = [];
        for (let i = 0; i < words.length; i += 1) {
            if (i === 0 && words[0] === '') {
                continue;
            }
            if (words[i] !== UIConstant.dashSymbol() && words[i] !== '-') {
                normalized.push(words[i]);
            }
        }
        return normalized;
    }

    lastWords: Array<string>;
    totalWords: number;
    popOverRef: Popover;
    seedPhraseHintsView: ?UISeedPhraseHintsView;
    clickListener: ?(e: any) => void;

    constructor(props: Props) {
        super(props);

        this.lastWords = [];
        this.totalWords = 12;
        this.clickListener = null;

        this.state = {
            ...this.state,
            popoverPlacement: 'bottom',
            wordThatChangedIndex: -1,
            inputHeight: UIConstant.smallCellHeight(),
            inputWidth: UIConstant.toastWidth(),
            comment: '',
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.setTotalWords();
        this.updateInputRef();
        this.initClickListenerForWeb();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.deinitClickListenerForWeb();
    }

    initClickListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        const listenerType = UIDevice.isDesktopWeb() ? 'click' : 'touchend';
        this.clickListener = (e: any) => {
            this.hideHints();
        };
        window.addEventListener(listenerType, this.clickListener);
    }

    deinitClickListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        const listenerType = UIDevice.isDesktopWeb() ? 'click' : 'touchend';
        window.removeEventListener(listenerType, this.clickListener);
    }

    // Events
    onKeyPress = (e: any): void => {
        if (this.seedPhraseHintsView) {
            this.seedPhraseHintsView.onKeyPress(e);
        }
    }

    // Setters
    setTotalWords() {
        const { phraseToCheck } = this.props;
        if (phraseToCheck.length === 0) {
            this.totalWords = 12;
        } else {
            const words = UISeedPhraseInput.splitPhrase(phraseToCheck);
            this.totalWords = words.length;
        }
    }

    // Getters
    containerStyle(): ViewStyleProp {
        const { rightButton } = this.props;
        const flex = rightButton && rightButton.length > 0 ? UIStyle.flex : null;
        return flex;
    }

    numOfLines(): number {
        return this.state.inputHeight / UIConstant.smallCellHeight();
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

    areHintsVisible(): boolean {
        const wtc = this.getWordThatChangedIndex();
        return wtc !== -1;
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
        const dictionary = Mnemonic.Words.ENGLISH;

        let result = true;
        for (let i = 0; i < words.length; i += 1) {
            if (words[i].length === 0) {
                break;
            }

            const included = dictionary.filter(word => word === words[i]);
            if (included.length === 0) {
                result = false;
                break;
            }
        }

        return result;
    }

    // Events
    onLayout(e: any) {
        const { nativeEvent } = e;
        if (nativeEvent) {
            const { layout } = nativeEvent;
            this.setStateSafely({ inputWidth: layout.width });
        }
    }

    onBlur() {
        if (Platform.OS === 'web') {
            return;
        }

        super.onBlur();
        this.hideHints();
    }

    onContentSizeChange(height: number) {
        this.setStateSafely({ inputHeight: height });
    }

    onChangeText = (newValue: string, callback: ?((finalValue: string) => void)): void => {
        const { onChangeText, onChangeIsValidPhrase } = this.props;
        const split = UISeedPhraseInput.splitPhrase(newValue);
        if (split.length > this.totalWords) {
            return;
        }

        const finalValue = this.addDashes(split);
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
            const element = this.popOverRef?._element;
            if (element) {
                element.focus();

                // Apply a fix to move the cursor to the right
                if (Platform.OS === 'android') {
                    // Actually Android moves the cursor to the the right visually,
                    // BUT physically it's not moved, and when the user continues typing
                    // the cursor stays wherever it was before, but not at the right.

                    // Thus we change the native position of it ...
                    element.setNativeProps({
                        selection: {
                            start: finalValue.length - 1,
                            end: finalValue.length - 1,
                        },
                    });
                    // ... in order to return it back to the right
                    element.setNativeProps({
                        selection: {
                            start: finalValue.length,
                            end: finalValue.length,
                        },
                    });
                }
            }
        });
    }

    // methods
    updateInputRef() {
        const element = this.popOverRef?._element;
        if (element) {
            element.focus();
            this.setTextInputRef(element);
        } else {
            throw new Error('No element has been found for popover');
        }
    }

    hideHints() {
        this.setStateSafely({ wordThatChangedIndex: -1 });
    }

    addDashes(words: Array<string>): string {
        if (words.length) {
            let newPhrase = `${words[0]}`;
            for (let i = 1; i < words.length; i += 1) {
                if (words[i - 1] !== '') {
                    newPhrase = `${newPhrase} ${UIConstant.dashSymbol()} ${words[i]}`;
                }
            }
            return newPhrase;
        }

        return '';
    }

    identifyWordThatChanged(currentWords: Array<string>, callback: ?(() => void)) {
        let i = 0;
        let index = 0;
        while (i < this.lastWords.length && i < currentWords.length) {
            if (this.lastWords[i] !== currentWords[i]) {
                index = i;
                break;
            }
            i += 1;
        }
        this.lastWords = Array.from(currentWords);

        this.setStateSafely({ wordThatChangedIndex: index }, () => {
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

        const wA = UISeedPhraseInput.splitPhrase(phraseToCheck);
        const wB = UISeedPhraseInput.splitPhrase(typedPhrase);

        let result = false;
        if (wA.length === wB.length) {
            result = true;
            for (let i = 0; i < wA.length; i += 1) {
                if (wA[i] !== wB[i]) {
                    result = false;
                    break;
                }
            }
        }

        return result;
    }

    // Render
    renderHintsView() {
        return (<UISeedPhraseHintsView
            ref={(component) => { this.seedPhraseHintsView = component; }}
            width={this.getInputWidth()}
            onHintSelected={this.onHintSelected}
            yOffset={this.state.inputHeight - UIConstant.contentOffset()}
        />);
    }

    renderInputWithPopOver() {
        const isVisible = this.areHintsVisible();
        return (
            <Popover
                ref={(c) => { this.popOverRef = c; }}
                placement={this.state.popoverPlacement}
                arrowWidth={0}
                arrowHeight={0}
                isVisible={isVisible}
                offset={{
                    x: 0,
                    y: 1,
                }}
                component={() => this.renderHintsView()}
            >
                {this.renderTextInput()}
            </Popover>
        );
    }

    renderTextFragment() {
        return (
            <React.Fragment>
                <View style={UIStyle.Common.flex()}>
                    {this.renderAuxTextInput()}
                    {this.renderInputWithPopOver()}
                </View>
            </React.Fragment>
        );
    }
}
