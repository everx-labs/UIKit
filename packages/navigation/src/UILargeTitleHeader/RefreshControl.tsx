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

    const runOnRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await onRefresh();

        if (forseChangePosition == null) {
            return;
        }

        forseChangePosition(-1 * UIConstant.refreshControlHeight, 200, () => {
            refreshingGuard.value = false;
            setRefreshing(false);
        });
    }, [onRefresh, forseChangePosition, refreshingGuard]);

    useDerivedValue(() => {
        if (position == null) {
            return;
        }

        if (position.value > 0 && !refreshingGuard.value) {
            refreshingGuard.value = true;
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
