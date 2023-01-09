import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    ColorVariants,
    makeStyles,
    Theme,
    useTheme,
    UILabel,
    TypographyVariants,
} from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';
import { uiLocalized } from '@tonlabs/localization';
import type { UICollectionCardProps } from './types';
import { Preview } from './Preview';
import { Badge } from './Badge';
import { UIConstant } from '../constants';

export function UICollectionCard({
    contentList,
    title,
    notSupportedMessage,
    badge,
    onPress,
    loading,
    testID,
}: UICollectionCardProps) {
    const theme = useTheme();
    const styles = useStyles(theme);
    const isEmptyList = React.useMemo(
        () => !contentList || contentList.length === 0,
        [contentList],
    );

    const [isLoadingFailure, setIsLoadingFailure] = React.useState<boolean>(false);

    const onFailure = React.useCallback(function onFailure() {
        setIsLoadingFailure(true);
    }, []);

    return (
        <UISkeleton show={!!loading} style={styles.skeleton}>
            <TouchableOpacity testID={testID} onPress={onPress} style={styles.touchable}>
                <View style={styles.container}>
                    <Preview
                        style={styles.preview}
                        contentList={contentList}
                        onFailure={onFailure}
                    />
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={[UIConstant.linearGradientStart, UIConstant.linearGradientEnd]}
                        style={styles.gradient}
                    />
                    <View>
                        <UILabel
                            role={TypographyVariants.NarrowActionText}
                            color={ColorVariants.StaticTextPrimaryLight}
                            numberOfLines={UIConstant.uiCollectionCard.numberOfLinesInTitle}
                        >
                            {title}
                        </UILabel>
                        {isEmptyList || isLoadingFailure ? (
                            <UILabel
                                style={styles.description}
                                role={TypographyVariants.NarrowParagraphFootnote}
                                color={ColorVariants.TextSecondary}
                                numberOfLines={UIConstant.uiCollectionCard.numberOfLinesInTitle}
                            >
                                {notSupportedMessage || uiLocalized.NotSupportedMedia}
                            </UILabel>
                        ) : null}
                    </View>
                    <Badge
                        badge={badge}
                        testID={`collection_badge_${title}${
                            typeof badge === 'string' ? `_count_${  badge}` : ''
                        }`}
                    />
                </View>
            </TouchableOpacity>
        </UISkeleton>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    skeleton: {
        borderRadius: UIConstant.uiCollectionCard.borderRadius,
    },
    touchable: {
        borderRadius: UIConstant.uiCollectionCard.borderRadius,
        overflow: 'hidden',
    },
    container: {
        backgroundColor: theme[ColorVariants.StaticBackgroundOverlay],
        padding: UILayoutConstant.contentOffset,
        justifyContent: 'space-between',
        aspectRatio: 1,
    },
    preview: {
        ...StyleSheet.absoluteFillObject,
        ...Platform.select({
            web: {
                zIndex: -20,
            },
        }),
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        ...Platform.select({
            web: {
                zIndex: -10,
            },
        }),
    },
    description: {
        paddingTop: 4,
    },
}));
