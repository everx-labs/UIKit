import * as React from 'react';
import { View } from 'react-native';
import Animated, {
    runOnJS,
    scrollTo,
    useAnimatedReaction,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { hapticImpact, UIIndicator } from '@tonlabs/uikit.controls';
import { UIImage } from '@tonlabs/uikit.media';
import { ColorVariants, useTheme, Theme, makeStyles } from '@tonlabs/uikit.themes';
import { UIAssets } from '@tonlabs/uikit.assets';

import { UIConstant } from '../constants';
import { NON_UI_RUBBER_BAND_EFFECT_DISTANCE } from './useRubberBandEffectDistance';

export type OnRefresh = () => Promise<void>;

const allSettled =
    Promise.allSettled != null
        ? Promise.allSettled.bind(Promise)
        : /**
           * Use a polyfill
           * (from https://github.com/amrayn/allsettled-polyfill/blob/master/index.js)
           * in case `allSettled` is not present in runtime
           * (like in Hermes)
           */
          (promises: Promise<any>[]) =>
              Promise.all(
                  promises.map(p =>
                      p
                          .then(value => ({
                              status: 'fulfilled',
                              value,
                          }))
                          .catch(reason => ({
                              status: 'rejected',
                              reason,
                          })),
                  ),
              );

export function RefreshControl({
    onRefresh,
    background,
    scrollRef,
    currentPosition,
    scrollInProgress,
}: {
    onRefresh: () => Promise<void>;
    background?: boolean;
    scrollRef: React.RefObject<Animated.ScrollView>;
    currentPosition: Animated.SharedValue<number>;
    scrollInProgress: Animated.SharedValue<boolean>;
}) {
    const theme = useTheme();
    const [refreshing, setRefreshing] = React.useState(false);
    const refreshingGuard = useSharedValue(false);
    const waitForScrollEnd = useSharedValue(false);

    const stopRefreshing = React.useCallback(() => {
        setRefreshing(false);
    }, []);

    const runOnRefresh = React.useCallback(async () => {
        if (refreshingGuard.value) {
            return;
        }
        refreshingGuard.value = true;
        setRefreshing(true);

        // If onResresh is blocking it can prevent loader to draw
        // so that start it only when update is done
        await new Promise(res => requestAnimationFrame(res));

        try {
            await allSettled([
                onRefresh(),
                // An artificial timeout is needed
                // in case the refresh is super fast
                // to not break animation
                new Promise(resolve => {
                    setTimeout(resolve, 1000);
                }),
            ]);
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('Unhandled error has been caught during the refresh:', err);
            }
        } finally {
            // Do not interupt active scroll
            if (scrollInProgress.value) {
                stopRefreshing();
                waitForScrollEnd.value = true;
            } else {
                // eslint-disable-next-line no-param-reassign
                currentPosition.value = withTiming(
                    -NON_UI_RUBBER_BAND_EFFECT_DISTANCE,
                    { duration: UIConstant.refreshControlPositioningDuration },
                    () => {
                        refreshingGuard.value = false;
                        runOnJS(stopRefreshing)();
                    },
                );
                scrollTo(scrollRef, 0, 0, false);
            }
        }
    }, [
        onRefresh,
        refreshingGuard,
        stopRefreshing,
        currentPosition,
        scrollInProgress,
        waitForScrollEnd,
        scrollRef,
    ]);

    useAnimatedReaction(
        () => {
            return {
                currentPosition: currentPosition?.value,
                refreshingGuard: refreshingGuard.value,
                scrollInProgress: scrollInProgress.value,
            };
        },
        state => {
            if (state.currentPosition == null) {
                return;
            }

            /**
             * By the time of initial rendering refresh control is shown,
             * like any other content that is rendered with `renderAboveContent` method
             * So to hide it we adjust the position by the height of the RefreshControl.
             * And that means that position 0 is when RefreshControl will be visible again
             * and by our logic it's a point when refreshing should be done
             */
            if (scrollInProgress.value && state.currentPosition > 0 && !state.refreshingGuard) {
                hapticImpact('medium');
                runOnJS(runOnRefresh)();
            }
        },
        [currentPosition, refreshing, runOnRefresh],
    );

    useAnimatedReaction(
        () => {
            return scrollInProgress.value === false && waitForScrollEnd.value === true;
        },
        (stopRefreshAnimation, prevStopRefreshAnimation) => {
            if (stopRefreshAnimation === prevStopRefreshAnimation) {
                return;
            }

            // eslint-disable-next-line no-param-reassign
            currentPosition.value = withTiming(
                -NON_UI_RUBBER_BAND_EFFECT_DISTANCE,
                { duration: UIConstant.refreshControlPositioningDuration },
                () => {
                    refreshingGuard.value = false;
                    waitForScrollEnd.value = false;
                },
            );
            scrollTo(scrollRef, 0, 0, false);
        },
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
                    <UIImage source={UIAssets.icons.ui.arrowDownWhite} tintColor={color} />
                )}
            </View>
        </View>
    );
}

const useStyles = makeStyles((theme: Theme, background: boolean) => ({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: NON_UI_RUBBER_BAND_EFFECT_DISTANCE,
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
