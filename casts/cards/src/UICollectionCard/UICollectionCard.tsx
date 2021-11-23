import * as React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ColorVariants, makeStyles, Theme, useTheme } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';
import type { UICollectionCardProps } from './types';
import { QuickView } from './QuickView';
import { Title } from './Title';
import { Badge } from './Badge';
import { UIConstant } from '../constants';

const linearGradientStart = 'rgba(16, 19, 21, 0.8)';
const linearGradientEnd = 'rgba(16, 19, 21, 0.2)';

export const UICollectionCard: React.FC<UICollectionCardProps> = ({
    title,
    badge,
    onPress,
    imageSourceList,
    loading,
    testID,
}: UICollectionCardProps) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    return (
        <UISkeleton show={!!loading} style={styles.skeleton}>
            <TouchableOpacity testID={testID} onPress={onPress} style={styles.container}>
                <QuickView imageSourceList={imageSourceList} style={styles.imageList} />
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={[linearGradientStart, linearGradientEnd]}
                    style={styles.gradient}
                />
                <Title title={title} />
                <Badge badge={badge} />
            </TouchableOpacity>
        </UISkeleton>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    skeleton: {
        /**
         * The radius of the skeleton has to be made a little smaller
         * so that the corners of the content are not visible
         */
        borderRadius: UIConstant.uiCollectionCard.borderRadius - 2,
    },
    container: {
        borderRadius: UIConstant.uiCollectionCard.borderRadius,
        backgroundColor: theme[ColorVariants.BackgroundOverlay],
        padding: UILayoutConstant.contentOffset,
        justifyContent: 'space-between',
        aspectRatio: 1,
        overflow: 'hidden',
    },
    imageList: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -20,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -10,
    },
}));
