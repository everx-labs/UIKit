import * as React from 'react';
import {
    ColorValue,
    View,
    Platform,
    StyleSheet,
    FlatList,
    StatusBar,
    ListRenderItem,
} from 'react-native';

import {
    ColorVariants,
    useTheme,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { Portal, UILayoutConstant } from '@tonlabs/uikit.layout';

const MAX_CELLS = 3;

type UISeedPhrasePopoverProps = {
    elementRef: React.Ref<View>;
    currentHighlightedItemIndex: number;
    onHighlightedItemIndexChange: (index: number) => void;
    hints: string[];
    onHintSelected: (item: string) => void;
    forId?: string;
    height: number;
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
    const height = hints.length > 0 ? UILayoutConstant.defaultCellHeight * maxHintsToShow : 0;
    // Calculate the padding bottom to view cells even if clipped
    const paddingBottom = UILayoutConstant.defaultCellHeight * (maxHintsToShow - 1);

    const [measurement, setMeasurement] = React.useState<{
        x: number;
        y: number;
        width: number;
    } | null>(null);

    React.useEffect(() => {
        if (elementRef && 'current' in elementRef) {
            // delay to the next tick to guarantee layout
            setTimeout(() => {
                elementRef.current?.measureInWindow((x, y, width, inputHeight) => {
                    setMeasurement({
                        x,
                        y: y + inputHeight + (StatusBar.currentHeight ?? 0),
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

    const renderItem: ListRenderItem<string> = React.useCallback(
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
                    keyboardShouldPersistTaps="always"
                    data={hints}
                    extraData={currentHighlightedItemIndex}
                    renderItem={renderItem}
                />
            </View>
        </View>
    );
}

export function UISeedPhrasePopover(props: UISeedPhrasePopoverProps) {
    const { hints, forId, height } = props;
    if (hints.length === 0) {
        return null;
    }

    return (
        <Portal absoluteFill forId={forId}>
            <UISeedPhrasePopoverContent key={height} {...props} />
        </Portal>
    );
}

const styles = StyleSheet.create({
    hintsContainer: {
        flex: 1,
        ...UILayoutConstant.cardShadow,
        borderBottomLeftRadius: UILayoutConstant.borderRadius,
        borderBottomRightRadius: UILayoutConstant.borderRadius,
    },
    hintsInner: {
        flex: 1,
        overflow: 'hidden',
        borderBottomLeftRadius: UILayoutConstant.borderRadius,
        borderBottomRightRadius: UILayoutConstant.borderRadius,
    },
    cellHint: {
        zIndex: 1,
        justifyContent: 'center',
        paddingHorizontal: UILayoutConstant.contentOffset,
        minHeight: UILayoutConstant.defaultCellHeight,
    },
});
