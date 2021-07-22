import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    runOnJS,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';

import {
    ColorVariants,
    UIImage,
    UILabel,
    UIIndicator,
    hapticImpact,
} from '@tonlabs/uikit.hydrogen';
import { UIAssets } from '@tonlabs/uikit.assets';

import { useLargeTitlePosition } from './index';
import { UIConstant } from '../constants';

export function UILargeHeaderRefreshControl({
    onRefresh,
}: {
    onRefresh: () => Promise<void>;
}) {
    const { position, forseChangePosition } = useLargeTitlePosition();
    const [refreshing, setRefreshing] = React.useState(false);
    const refreshingGuard = useSharedValue(false);

    React.useEffect(() => {
        if (forseChangePosition == null) {
            return;
        }

        requestAnimationFrame(() => {
            forseChangePosition(-1 * UIConstant.refreshControlHeight, {
                duration: 0,
                changeDefaultShift: true,
            });
        });
    }, [forseChangePosition]);

    const stopRefreshing = React.useCallback(() => {
        setRefreshing(false);
    }, []);

    const runOnRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await onRefresh();

        if (forseChangePosition == null) {
            return;
        }

        forseChangePosition(
            -1 * UIConstant.refreshControlHeight,
            { duration: UIConstant.refreshControlPositioningDuration },
            () => {
                'worklet';

                refreshingGuard.value = false;
                runOnJS(stopRefreshing)();
            },
        );
    }, [onRefresh, forseChangePosition, refreshingGuard, stopRefreshing]);

    useDerivedValue(() => {
        if (position == null) {
            return;
        }

        /**
         * By the time of initial rendering refresh control is shown,
         * like any other content that is rendered with `renderAboveContent` method
         * So to hide it we adjust the position by the height of the RefreshControl.
         * And that means that position 0 is when RefreshControl will be visible again
         * and by our logic it's a point when refreshing should be done
         */
        if (position.value > 0 && !refreshingGuard.value) {
            refreshingGuard.value = true;
            hapticImpact('medium');
            runOnJS(runOnRefresh)();
        }
    }, [position, refreshing, onRefresh]);

    return (
        <View style={styles.container}>
            <UILabel>
                {refreshing ? (
                    <UIIndicator size={UIConstant.refreshControlLoaderSize} />
                ) : (
                    <Animated.View
                        style={{ transform: [{ rotate: '-90deg' }] }}
                    >
                        <UIImage
                            source={UIAssets.icons.ui.arrowLeftBlack}
                            tintColor={ColorVariants.IconAccent}
                        />
                    </Animated.View>
                )}
            </UILabel>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: UIConstant.refreshControlHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
