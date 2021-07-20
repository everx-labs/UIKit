import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { runOnJS, useDerivedValue } from 'react-native-reanimated';

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
    refreshing,
    onRefresh,
}: {
    refreshing: boolean;
    onRefresh: () => Promise<void>;
}) {
    const { position, forseChangePosition } = useLargeTitlePosition();

    const runOnRefresh = React.useCallback(async () => {
        await onRefresh();

        if (position == null || forseChangePosition == null) {
            return;
        }

        forseChangePosition(-1 * UIConstant.refreshControlHeight, 200);
    }, [onRefresh, position, forseChangePosition]);

    useDerivedValue(() => {
        if (position == null) {
            return;
        }

        if (position.value > 0 && !refreshing) {
            runOnJS(runOnRefresh)();
        }
    }, [position, refreshing, onRefresh]);

    return (
        <View style={styles.container}>
            <UILabel>
                {refreshing ? (
                    <UIIndicator size={UIConstant.refreshControlLoaderSize} />
                ) : (
                    <UIImage
                        source={UIAssets.icons.ui.arrowLeftBlack}
                        tintColor={ColorVariants.IconAccent}
                        style={{ transform: [{ rotate: '-90deg' }] }}
                    />
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
