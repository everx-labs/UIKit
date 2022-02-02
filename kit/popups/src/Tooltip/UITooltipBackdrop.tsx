import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import type { UITooltipBackdropProps } from './types';

export const UITooltipBackdrop = React.memo(function Backdrop({ onTap }: UITooltipBackdropProps) {
    return (
        <TapGestureHandler onHandlerStateChange={onTap}>
            <View style={StyleSheet.absoluteFill} />
        </TapGestureHandler>
    );
});
