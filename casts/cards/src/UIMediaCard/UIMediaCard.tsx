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
import type { UIMediaCardProps } from './types';
import { UIConstant } from '../constants';
import { CollectionSlide } from '../UICollectionCard/CollectionSlide';

export function UIMediaCard({ content, title, onPress, loading, testID }: UIMediaCardProps) {
    const theme = useTheme();
    const styles = useStyles(theme);
    const [isContentLoaded, setIsContentLoaded] = React.useState<boolean>(false);
    const [isError, setIsError] = React.useState<boolean>(false);

    const onLoad = React.useCallback(function onLoad() {
        setIsContentLoaded(true);
    }, []);
    const onError = React.useCallback(function onError() {
        setIsError(true);
    }, []);

    return (
        <UISkeleton show={!!loading} style={styles.skeleton}>
            <TouchableOpacity testID={testID} onPress={onPress} style={styles.touchable}>
                <View style={styles.container}>
                    {content ? (
                        <CollectionSlide
                            style={styles.quickView}
                            content={content}
                            isVisible={isContentLoaded && !isError}
                            onLoad={onLoad}
                            onError={onError}
                        />
                    ) : null}
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={[UIConstant.linearGradientStart, UIConstant.linearGradientEnd]}
                        style={styles.gradient}
                    />
                    <UILabel
                        style={styles.description}
                        role={TypographyVariants.NarrowParagraphFootnote}
                        color={ColorVariants.TextSecondary}
                        numberOfLines={UIConstant.uiCollectionCard.numberOfLinesInTitle}
                    >
                        {!content || isError ? uiLocalized.TnftNotSupportedMedia : null}
                    </UILabel>
                    <UILabel
                        role={TypographyVariants.MonoNote}
                        color={ColorVariants.StaticTextPrimaryLight}
                        numberOfLines={UIConstant.uiMediaCard.numberOfLinesInTitle}
                    >
                        {title}
                    </UILabel>
                </View>
            </TouchableOpacity>
        </UISkeleton>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    skeleton: {
        borderRadius: UIConstant.uiMediaCard.borderRadius,
    },
    touchable: {
        borderRadius: UIConstant.uiMediaCard.borderRadius,
        overflow: 'hidden',
    },
    container: {
        backgroundColor: theme[ColorVariants.StaticTextOverlayDark],
        padding: UILayoutConstant.contentOffset,
        justifyContent: 'space-between',
        aspectRatio: 1,
    },
    quickView: {
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
        paddingVertical: UIConstant.uiMediaCard.descriptionPaddingVertical,
    },
}));
