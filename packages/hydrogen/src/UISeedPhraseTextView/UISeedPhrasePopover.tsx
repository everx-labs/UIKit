import * as React from 'react';
import {
    ColorValue,
    findNodeHandle,
    UIManager,
    View,
    Platform,
    StyleSheet,
    FlatList,
} from 'react-native';

import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { UIConstant } from '../constants';
import { Portal } from '../Portal';
import { TouchableOpacity } from '../TouchableOpacity';
import { UILabel, UILabelColors, UILabelRoles } from '../UILabel';

const MAX_CELLS = 3;

type UISeedPhrasePopoverProps = {
    elementRef: React.Ref<any>;
    currentHighlightedItemIndex: number;
    onHighlightedItemIndexChange: (index: number) => void;
    hints: string[];
    onHintSelected: (item: string) => void;
    // width: number;
};

function UISeedPhrasePopoverContent(props: UISeedPhrasePopoverProps) {
    const {
        currentHighlightedItemIndex,
        onHighlightedItemIndexChange,
        hints,
        onHintSelected,
        // width,
        elementRef,
    } = props;
    const theme = useTheme();
    const maxHintsToShow = Math.min(hints.length, MAX_CELLS);
    const height = hints.length > 0 ? UIConstant.defaultCellHeight * maxHintsToShow : 0;
    // Calculate the padding bottom to view cells even if clipped
    const paddingBottom = UIConstant.defaultCellHeight * (maxHintsToShow - 1);

    const [measurement, setMeasurement] = React.useState<{
        x: number;
        y: number;
        width: number;
    } | null>(null);

    React.useEffect(() => {
        if (elementRef && 'current' in elementRef) {
            // delay to the next tick to guarantee layout
            setTimeout(() => {
                const node = findNodeHandle(elementRef.current);

                if (node == null) {
                    return;
                }

                UIManager.measureInWindow(node, (x, y, width, inputHeight) => {
                    setMeasurement({
                        x,
                        y: y + inputHeight,
                        width,
                    });
                });
            });
        }
    }, [elementRef]);

    React.useEffect(() => {
        return () => {
            onHighlightedItemIndexChange(0);
        };
    }, [onHighlightedItemIndexChange]);

    const renderItem = React.useCallback(
        ({ item, index }) => {
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
                    {...Platform.select({
                        web: {
                            // a popover is closing before `onPress` event is triggered on web
                            onPressIn: () => onHintSelected(item),
                            onMouseEnter: () => onHighlightedItemIndexChange(index),
                            onMouseLeave: () => onHighlightedItemIndexChange(-1),
                        },
                        default: {
                            onPress: () => onHintSelected(item),
                        },
                    })}
                >
                    <UILabel color={UILabelColors.TextSecondary} role={UILabelRoles.ParagraphNote}>
                        {item}
                    </UILabel>
                </TouchableOpacity>
            );
        },
        [theme, currentHighlightedItemIndex, onHintSelected, onHighlightedItemIndexChange],
    );

    if (measurement == null) {
        return null;
    }

    return (
        <View
            nativeID="hints-view"
            style={[
                styles.hintsContainer,
                {
                    position: 'absolute',
                    height,
                    width: measurement.width,
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    top: measurement.y,
                    left: measurement.x,
                },
            ]}
        >
            <View style={styles.hintsInner}>
                <FlatList
                    contentContainerStyle={{ paddingBottom }}
                    scrollEnabled
                    showsVerticalScrollIndicator
                    keyExtractor={item => item}
                    keyboardShouldPersistTaps="handled"
                    data={hints}
                    extraData={currentHighlightedItemIndex}
                    renderItem={renderItem}
                />
            </View>
        </View>
    );
}

export function UISeedPhrasePopover(props: UISeedPhrasePopoverProps) {
    if (props.hints.length === 0) {
        return null;
    }

    return (
        <Portal absoluteFill>
            <UISeedPhrasePopoverContent {...props} />
        </Portal>
    );
}

const styles = StyleSheet.create({
    hintsContainer: {
        flex: 1,
        ...UIConstant.cardShadow,
        borderBottomLeftRadius: UIConstant.borderRadius,
        borderBottomRightRadius: UIConstant.borderRadius,
    },
    hintsInner: {
        flex: 1,
        overflow: 'hidden',
        borderBottomLeftRadius: UIConstant.borderRadius,
        borderBottomRightRadius: UIConstant.borderRadius,
    },
    cellHint: {
        zIndex: 1,
        justifyContent: 'center',
        paddingHorizontal: UIConstant.contentOffset,
        minHeight: UIConstant.defaultCellHeight,
    },
});
