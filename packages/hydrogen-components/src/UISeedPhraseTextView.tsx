import * as React from 'react';
import {
    TextInput,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ColorValue,
} from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/uikit.localization';
import {
    useTheme,
    ColorVariants,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';

import { UIMaterialTextView } from './UIMaterialTextView';

type UISeedPhrasePopoverProps = {
    currentHighlightedItemIndex: number;
    hints: string[];
    onHintSelected: (item: string) => void;
};

function UISeedPhrasePopover(props: UISeedPhrasePopoverProps) {
    const { currentHighlightedItemIndex, hints, onHintSelected } = props;
    const theme = useTheme();
    const maxHintsToShow = Math.min(hints.length, MAX_CELLS);
    const height =
        hints.length > 0 ? UIConstant.defaultCellHeight() * maxHintsToShow : 0;
    // Calculate the padding bottom to view cells even if clipped
    // TODO: why decrease by 1?
    const paddingBottom = UIConstant.defaultCellHeight() * (maxHintsToShow - 1);

    return (
        <View
            nativeID="hints-view"
            style={[
                styles.hintsContainer,
                {
                    height,
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                },
            ]}
        >
            <FlatList
                contentContainerStyle={{ paddingBottom }}
                scrollEnabled
                showsVerticalScrollIndicator
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="handled"
                data={hints}
                extraData={currentHighlightedItemIndex}
                renderItem={({ item, index }) => {
                    const cellBgStyle: {
                        backgroundColor: ColorValue;
                    } = {
                        backgroundColor:
                            theme[
                                currentHighlightedItemIndex === index
                                    ? ColorVariants.BackgroundSecondary
                                    : ColorVariants.BackgroundPrimary
                            ],
                    };
                    return (
                        <TouchableOpacity
                            testID={`profile_backup_key_phrase_${item}`}
                            style={[styles.cellHint, cellBgStyle]}
                            onPress={() => {
                                onHintSelected(item);
                            }}
                        >
                            <UILabel
                                color={UILabelColors.TextSecondary}
                                role={UILabelRoles.ParagraphNote}
                            >
                                {item}
                            </UILabel>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const MAX_CELLS = 3; // TODO: why it's 3?
const SPLITTER = ` ${UIConstant.dashSymbol()} `;

const identifyWordThatChanged = (
    phrase: string,
    lastPhrase: string,
): [string, number] => {
    const currentWords = phrase.split(SPLITTER);
    const lastWords = lastPhrase.split(SPLITTER);

    for (
        let i = Math.max(currentWords.length, lastWords.length) - 1;
        i >= 0;
        i -= 1
    ) {
        if (
            lastWords[i] != null &&
            currentWords[i] != null &&
            lastWords[i] !== currentWords[i]
        ) {
            return [currentWords[i], i];
        }
    }

    return ['', -1];
};

export type UISeedPhraseTextViewProps = {
    words: string[];
};

export const UISeedPhraseTextView = React.forwardRef<
    TextInput,
    UISeedPhraseTextViewProps
>(function UISeedPhraseTextViewForwarded(
    { words }: UISeedPhraseTextViewProps,
    ref,
) {
    const textInputRef = React.useRef(null);
    const refToUse = ref || textInputRef;

    const [currentlyTyped, setCurrentlyTyped] = React.useState({
        word: '',
        index: -1,
    });

    const hints = React.useMemo(() => {
        if (currentlyTyped.word.length === 0) {
            return [];
        }
        return words.filter((word) => word.indexOf(currentlyTyped.word) === 0);
    }, [words, currentlyTyped]);

    const savedText = React.useRef('');

    const [
        currentHighlightedItemIndex,
        setCurrentHighlightedItemIndex,
    ] = React.useState(-1); // Do not highlight anything at start

    const onHintSelected = React.useCallback(
        (item: string) => {
            const parts = savedText.current.split(SPLITTER);

            parts[currentlyTyped.index] = item;

            let newText = parts.join(SPLITTER);

            if (currentlyTyped.index === parts.length - 1) {
                newText = `${newText}${SPLITTER}`;
            }

            if (refToUse && 'current' in refToUse) {
                refToUse.current?.setNativeProps({
                    text: newText,
                });
                refToUse.current?.focus();
            }

            savedText.current = newText;
            setCurrentHighlightedItemIndex(-1);
            setCurrentlyTyped({ word: '', index: -1 });
        },
        [
            refToUse,
            savedText,
            currentlyTyped,
            setCurrentlyTyped,
            setCurrentHighlightedItemIndex,
        ],
    );

    const onKeyPress = React.useCallback(
        (e: any) => {
            const event = e.nativeEvent;

            if (event.key === 'ArrowUp') {
                e.preventDefault();
                setCurrentHighlightedItemIndex(
                    Math.max(currentHighlightedItemIndex - 1, 0),
                );
                return;
            }
            if (event.key === 'ArrowDown') {
                e.preventDefault();
                setCurrentHighlightedItemIndex(
                    Math.min(currentHighlightedItemIndex + 1, hints.length - 1),
                );
                return;
            }
            if (event.key === 'Enter' && currentHighlightedItemIndex >= 0) {
                e.preventDefault();
                onHintSelected(hints[currentHighlightedItemIndex]);
            }
        },
        [
            hints,
            currentHighlightedItemIndex,
            setCurrentHighlightedItemIndex,
            savedText,
            onHintSelected,
        ],
    );

    const onChangeText = React.useCallback(
        (text: string) => {
            const lastSymbol = text[text.length - 1];

            if (text.length > savedText.current.length && lastSymbol === ' ') {
                const newText = `${text}${UIConstant.dashSymbol()} `;

                if (refToUse && 'current' in refToUse) {
                    refToUse.current?.setNativeProps({
                        text: newText,
                    });
                }

                savedText.current = newText;
                setCurrentHighlightedItemIndex(-1);
                setCurrentlyTyped({ word: '', index: -1 });

                return;
            }

            if (
                text.length < savedText.current.length &&
                lastSymbol === UIConstant.dashSymbol()
            ) {
                const newText = text.slice(0, text.length - 2);

                if (refToUse && 'current' in refToUse) {
                    refToUse.current?.setNativeProps({
                        text: newText,
                    });
                }

                savedText.current = newText;
                setCurrentHighlightedItemIndex(-1);
                return;
            }

            const [currentWord, currentWordIndex] = identifyWordThatChanged(
                text,
                savedText.current,
            );

            setCurrentlyTyped({
                word: currentWord,
                index: currentWordIndex,
            });

            savedText.current = text;
        },
        [
            savedText,
            refToUse,
            setCurrentHighlightedItemIndex,
            setCurrentlyTyped,
        ],
    );

    const onBlur = React.useCallback(() => {
        setCurrentHighlightedItemIndex(-1);
        setCurrentlyTyped({ word: '', index: -1 });
    }, [setCurrentHighlightedItemIndex, setCurrentlyTyped]);

    return (
        <View style={styles.container}>
            <UIMaterialTextView
                ref={refToUse}
                label={uiLocalized.MasterPassword}
                onChangeText={onChangeText}
                onKeyPress={onKeyPress}
                onBlur={onBlur}
            />
            <View style={styles.popover}>
                <UISeedPhrasePopover
                    currentHighlightedItemIndex={currentHighlightedItemIndex}
                    hints={hints}
                    onHintSelected={onHintSelected}
                />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'column',
    },
    popover: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
    },
    hintsContainer: {
        flex: 1,
        ...UIConstant.cardShadow(),
        borderBottomLeftRadius: UIConstant.borderRadius(),
        borderBottomRightRadius: UIConstant.borderRadius(),
        overflow: 'hidden',
    },
    cellHint: {
        zIndex: 1,
        justifyContent: 'center',
        paddingHorizontal: UIConstant.contentOffset(),
        minHeight: UIConstant.defaultCellHeight(),
    },
});
