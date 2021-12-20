import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { UILabel, UILabelRoles, ColorVariants } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UIImage } from '@tonlabs/uikit.media';
import { UIAssets } from '@tonlabs/uikit.assets';

const AnimatedUIImage = Animated.createAnimatedComponent(UIImage);
// @inline
const SECTION_UNFOLDED = 90;
// @inline
const SECTION_FOLDED = 270;

export function AccordionSectionHeader({
    title,
    isFolded = false,
    sectionKey,
    onSectionHeaderPress,
    duration,
}: {
    title: string;
    isFolded: boolean | undefined;
    sectionKey: string;
    onSectionHeaderPress: (sectionKey: string) => void;
    duration: number;
}) {
    const chevronProgress = useSharedValue(isFolded ? SECTION_FOLDED : SECTION_UNFOLDED);
    const chevronStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotateZ: `${chevronProgress.value}deg`,
                },
            ],
        };
    });

    React.useEffect(() => {
        chevronProgress.value = withTiming(isFolded ? SECTION_FOLDED : SECTION_UNFOLDED, {
            duration,
        });
    }, [isFolded, chevronProgress, duration]);

    return (
        <TouchableOpacity
            onPress={() => onSectionHeaderPress(sectionKey)}
            style={styles.sectionHeader}
        >
            <UILabel role={UILabelRoles.HeadlineHead}>{title}</UILabel>
            <AnimatedUIImage
                source={UIAssets.icons.ui.chevron}
                style={[styles.chevron, chevronStyle]}
                tintColor={ColorVariants.TextPrimary}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        paddingTop: 20,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    chevron: { width: 20, height: 20, marginLeft: 5 },
});
