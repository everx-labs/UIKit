import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';

import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';

import type { UILargeTitleHeaderProps } from './types';
import { useRubberBandEffectDistance } from './useRubberBandEffectDistance';
import { runOnUIPlatformSelect } from './useScrollHandler/runOnUIPlatformSelect';
import { UIConstant } from '../constants';

const AnimatedUILabel = Animated.createAnimatedComponent(UILabel);

// @inline
const LARGE_TITLE_SCALE_WEB = 1.1;
// @inline
const LARGE_TITLE_SCALE_DEFAULT = 1.2;

function useLargeTitleScale() {
    return useDerivedValue(() => {
        return runOnUIPlatformSelect({
            web: LARGE_TITLE_SCALE_WEB,
            default: LARGE_TITLE_SCALE_DEFAULT,
        });
    });
}

export const LargeTitleHeaderContent = React.memo(function LargeTitleHeaderContent({
    label,
    labelTestID,
    title,
    titleTestID,
    note,
    noteTestID,
    onHeaderLargeTitlePress,
    onHeaderLargeTitleLongPress,
    shift,
}: Pick<
    UILargeTitleHeaderProps,
    | 'label'
    | 'labelTestID'
    | 'title'
    | 'titleTestID'
    | 'note'
    | 'noteTestID'
    | 'onHeaderLargeTitlePress'
    | 'onHeaderLargeTitleLongPress'
> & {
    shift: Animated.SharedValue<number>;
}) {
    const titleWidth = useSharedValue(0);
    const rubberBandEffectDistance = useRubberBandEffectDistance();
    const largeTitleScale = useLargeTitleScale();
    const largeTitleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(
                        shift.value,
                        [0, rubberBandEffectDistance.value],
                        [1, largeTitleScale.value],
                        {
                            extrapolateLeft: Extrapolate.CLAMP,
                        },
                    ),
                },
                {
                    translateX: interpolate(
                        shift.value,
                        [0, rubberBandEffectDistance.value],
                        [0, (titleWidth.value * largeTitleScale.value - titleWidth.value) / 2],
                        {
                            extrapolateLeft: Extrapolate.CLAMP,
                        },
                    ),
                },
            ],
        };
    });

    const onTitleLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { width },
            },
        }) => {
            titleWidth.value = width;
        },
        [titleWidth],
    );

    const hasSomethingInHeader = title != null || label != null || note != null;

    const content = (
        <>
            {label != null && (
                <UILabel
                    testID={labelTestID}
                    role={UILabelRoles.ParagraphLabel}
                    color={UILabelColors.TextSecondary}
                    style={styles.label}
                >
                    {label}
                </UILabel>
            )}
            {title != null &&
                (React.isValidElement(title) ? (
                    title
                ) : (
                    <AnimatedUILabel
                        testID={titleTestID}
                        role={UILabelRoles.TitleLarge}
                        style={largeTitleStyle}
                        onLayout={onTitleLayout}
                    >
                        {title}
                    </AnimatedUILabel>
                ))}
            {note != null && (
                <UILabel testID={noteTestID} role={UILabelRoles.ParagraphNote} style={styles.note}>
                    {note}
                </UILabel>
            )}
        </>
    );

    return (
        <View style={hasSomethingInHeader && styles.largeTitleHeaderInner}>
            {onHeaderLargeTitlePress != null || onHeaderLargeTitleLongPress != null ? (
                <TouchableOpacity
                    onPress={onHeaderLargeTitlePress}
                    onLongPress={onHeaderLargeTitleLongPress}
                >
                    {content}
                </TouchableOpacity>
            ) : (
                content
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    largeTitleHeaderInner: {
        padding: UIConstant.scrollContentInsetHorizontal,
    },
    label: {
        marginBottom: 8,
    },
    note: {
        marginTop: 8,
    },
});
