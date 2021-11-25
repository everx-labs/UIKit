import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ColorVariants, makeStyles, Theme, useTheme } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';
import type { UICollectionCardProps } from './types';
import { Preview } from './Preview';
import { Title } from './Title';
import { Badge } from './Badge';
import { UIConstant } from '../constants';

export function UICollectionCard({
    contentType,
    title,
    badge,
    onPress,
    source,
    loading,
    testID,
}: UICollectionCardProps) {
    const theme = useTheme();
    const styles = useStyles(theme);
    return (
        <UISkeleton show={!!loading} style={styles.skeleton}>
            <TouchableOpacity testID={testID} onPress={onPress} style={styles.touchable}>
                <View style={styles.container}>
                    <Preview source={source} style={styles.preview} contentType={contentType} />
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={[UIConstant.linearGradientStart, UIConstant.linearGradientEnd]}
                        style={styles.gradient}
                    />
                    <Title title={title} />
                    <Badge badge={badge} />
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
        backgroundColor: theme[ColorVariants.BackgroundOverlay],
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
}));
