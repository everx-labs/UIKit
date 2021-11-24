import * as React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ColorVariants, makeStyles, Theme, useTheme } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';
import type { UIMediaCardProps } from './types';
import { Title } from './Title';
import { QuickView } from './QuickView';
import { UIConstant } from '../constants';

export function UIMediaCard({
    contentType,
    title,
    onPress,
    source,
    loading,
    testID,
}: UIMediaCardProps) {
    const theme = useTheme();
    const styles = useStyles(theme);
    return (
        <UISkeleton show={!!loading} style={styles.skeleton}>
            <TouchableOpacity testID={testID} onPress={onPress} style={styles.container}>
                <QuickView style={styles.quickView} source={source} contentType={contentType} />
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    colors={[UIConstant.linearGradientStart, UIConstant.linearGradientEnd]}
                    style={styles.gradient}
                />
                <Title title={title} />
            </TouchableOpacity>
        </UISkeleton>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    skeleton: {
        /**
         * The radius of the skeleton has to be made a little smaller
         * so that the corners of the content are not visible
         */
        borderRadius: UIConstant.uiMediaCard.borderRadius - 2,
    },
    container: {
        borderRadius: UIConstant.uiMediaCard.borderRadius,
        backgroundColor: theme[ColorVariants.BackgroundOverlay],
        padding: UILayoutConstant.contentOffset,
        justifyContent: 'flex-end',
        aspectRatio: 1,
        overflow: 'hidden',
    },
    quickView: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -20,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -10,
    },
}));
