import * as React from 'react';
import { View } from 'react-native';
import { runOnJS, useDerivedValue } from 'react-native-reanimated';

import { UILabel } from '@tonlabs/uikit.hydrogen';

import { useLargeTitlePosition } from './index';

export const REFRESH_CONTROL_HEIGHT = 50;

export function RefreshControl({
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

        forseChangePosition(-1 * REFRESH_CONTROL_HEIGHT, 200);
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
        <View
            style={{
                height: REFRESH_CONTROL_HEIGHT,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <UILabel>{refreshing ? 'Refreshing...' : 'Refresh'}</UILabel>
        </View>
    );
}
