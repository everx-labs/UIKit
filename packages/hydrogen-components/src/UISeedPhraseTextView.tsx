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

export type UISeedPhraseTextViewProps = {
    words: string[];
};

export const UISeedPhraseTextView = React.forwardRef<
    TextInput,
    UISeedPhraseTextViewProps
>(function UISeedPhraseTextViewForwarded(
    props: UISeedPhraseTextViewProps,
    ref,
) {
    const textInputRef = React.useRef(null);
    const refToUse = ref || textInputRef;

    const { words } = props;

    const [currentTypingWord, setCurrentTypingWord] = React.useState('');

    const hints = React.useMemo(() => {
        if (currentTypingWord.length === 0) {
            return [];
        }
        return words.filter((word) => word.indexOf(currentTypingWord) === 0);
    }, [words, currentTypingWord]);

    const savedText = React.useRef('');

    const [
        currentHighlightedItemIndex,
        setCurrentHighlightedItemIndex,
    ] = React.useState(-1); // Do not highlight anything at start

    const onHintSelected = React.useCallback(
        (item: string) => {
            const parts = savedText.current.split(SPLITTER);

            parts[parts.length - 1] = item;

            const newText = `${parts.join(SPLITTER)}${SPLITTER}`;

            console.log(refToUse);
            if (refToUse && 'current' in refToUse) {
                refToUse.current?.setNativeProps({
                    text: newText,
                });
                refToUse.current?.focus();
            }

            savedText.current = newText;
            setCurrentHighlightedItemIndex(-1);
            setCurrentTypingWord('');
        },
        [
            refToUse,
            savedText,
            setCurrentTypingWord,
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

            const parts = text.split(SPLITTER);
            const lastWord = parts[parts.length - 1];

            setCurrentTypingWord(lastWord);

            savedText.current = text;
        },
        [
            savedText,
            refToUse,
            setCurrentHighlightedItemIndex,
            setCurrentTypingWord,
        ],
    );

    return (
        <View style={styles.container}>
            <UIMaterialTextView
                ref={refToUse}
                {...props}
                label={uiLocalized.MasterPassword}
                onChangeText={onChangeText}
                onKeyPress={onKeyPress}
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
