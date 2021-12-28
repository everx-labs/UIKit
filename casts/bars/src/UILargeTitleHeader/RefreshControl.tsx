import * as React from 'react';
import { View } from 'react-native';
import { runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import { hapticImpact, UIIndicator } from '@tonlabs/uikit.controls';
import { UIImage } from '@tonlabs/uikit.media';
import { ColorVariants, useTheme, Theme, makeStyles } from '@tonlabs/uikit.themes';
import { UIAssets } from '@tonlabs/uikit.assets';

import { useLargeTitlePosition } from './index';
import { UIConstant } from '../constants';

export function UILargeTitleHeaderRefreshControl({
    onRefresh,
    background,
}: {
    onRefresh: () => Promise<void>;
    background?: boolean;
}) {
    const theme = useTheme();
    const { position, forceChangePosition } = useLargeTitlePosition();
    const [refreshing, setRefreshing] = React.useState(false);
    const refreshingGuard = useSharedValue(false);

    React.useLayoutEffect(() => {
        if (forceChangePosition == null) {
            return;
        }

        requestAnimationFrame(() => {
            forceChangePosition(-1 * UIConstant.refreshControlSize, {
                duration: 0,
                changeDefaultShift: true,
            });
        });
    }, [forceChangePosition]);

    const stopRefreshing = React.useCallback(() => {
        setRefreshing(false);
    }, []);

    const runOnRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await onRefresh();

        if (forceChangePosition == null) {
            return;
        }

        forceChangePosition(
            -1 * UIConstant.refreshControlSize,
            { duration: UIConstant.refreshControlPositioningDuration },
            () => {
                'worklet';

                refreshingGuard.value = false;
                runOnJS(stopRefreshing)();
            },
        );
    }, [onRefresh, forceChangePosition, refreshingGuard, stopRefreshing]);

    useAnimatedReaction(
        () => {
            return {
                position: position?.value,
                refreshingGuard: refreshingGuard.value,
            };
        },
        state => {
            if (state.position == null) {
                return;
            }

            /**
             * By the time of initial rendering refresh control is shown,
             * like any other content that is rendered with `renderAboveContent` method
             * So to hide it we adjust the position by the height of the RefreshControl.
             * And that means that position 0 is when RefreshControl will be visible again
             * and by our logic it's a point when refreshing should be done
             */
            if (state.position > 0 && !state.refreshingGuard) {
                refreshingGuard.value = true;
                hapticImpact('medium');
                runOnJS(runOnRefresh)();
            }
        },
        [position, refreshing, runOnRefresh],
    );

    const styles = useStyles(theme, background);

    const color = React.useMemo(() => {
        return background ? ColorVariants.StaticTextPrimaryLight : ColorVariants.TextPrimary;
    }, [background]);

    return (
        <View style={styles.container}>
            <View style={styles.control}>
                {refreshing ? (
                    <UIIndicator
                        size={UIConstant.refreshControlLoaderSize}
                        color={color}
                        trackWidth={UIConstant.refreshControlTrackWidth}
                    />
                ) : (
                    <View style={{}}>
                        <UIImage source={UIAssets.icons.ui.arrowDownWhite} tintColor={color} />
                    </View>
                )}
            </View>
        </View>
    );
}

const useStyles = makeStyles((theme: Theme, background: boolean) => ({
    container: {
        alignItems: 'center',
    },
    control: {
        height: UIConstant.refreshControlSize,
        width: UIConstant.refreshControlSize,
        borderRadius: UIConstant.refreshControlSize,
        backgroundColor: background ? theme[ColorVariants.BackgroundOverlay] : undefined,
        alignItems: 'center',
        justifyContent: 'center',
    },
}));
