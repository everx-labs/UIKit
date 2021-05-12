import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import type { ViewStyle} from 'react-native';
import type { StyleProp, ViewProps } from 'react-native';

const styles = StyleSheet.create({
    blur: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 12,
    },
});

type Props = Omit<ViewProps, 'style'> & {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

export function UIBlurView({
    children,
    style,
}: Props) {
    return (
        <View style={style}>
            <BlurView
                style={styles.blur}
                blurType="light"
                blurAmount={10}
                reducedTransparencyFallbackColor="white"
            />
            {children}
        </View>
    );
}
