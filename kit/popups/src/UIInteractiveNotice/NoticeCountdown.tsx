import * as React from 'react';
import { ViewStyle, View } from 'react-native';
import type Animated from 'react-native-reanimated';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { ColorVariants } from '@tonlabs/uikit.themes';
import { UIConstant } from '../constants';
import { CountdownCirlce } from '../Notice/CountdownCircle';

export function NoticeCountdown({
    countdownProgress,
    style,
    hasCountdown,
}: {
    countdownProgress: Animated.SharedValue<number>;
    style: ViewStyle;
    hasCountdown: boolean | undefined;
}): React.ReactElement | null {
    if (hasCountdown) {
        return (
            <View
                style={[
                    {
                        height: UILayoutConstant.iconSize,
                        width: UILayoutConstant.iconSize,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    style,
                ]}
            >
                <CountdownCirlce
                    countdownProgress={countdownProgress}
                    color={ColorVariants.TextPrimary}
                    strokeWidth={UIConstant.interactiveNotice.countdownCircleStrokeWidth}
                />
            </View>
        );
    }
    return null;
}
