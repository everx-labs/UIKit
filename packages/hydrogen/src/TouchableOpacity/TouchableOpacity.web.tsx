import * as React from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import type { TouchableOpacityProps } from './types';

export const TouchableOpacity = React.forwardRef<
    typeof RNTouchableOpacity,
    TouchableOpacityProps
>(function TouchableOpacityImpl(
    {
        containerStyle,
        style,
        // we don't use it on web
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        waitFor,
        ...rest
    }: TouchableOpacityProps,
    ref,
) {
    // RNGH has a prop containerStyle
    // but TouchableOpacity from RN doesn't
    // so mixing them together
    const styleProp = React.useMemo(() => {
        let s = null;
        if (containerStyle) {
            if (s == null) {
                s = [];
            }
            s.push(containerStyle);
        }
        if (style) {
            if (s == null) {
                s = [];
            }
            s.push(style);
        }
        return s;
    }, [containerStyle, style]);
    return React.createElement(RNTouchableOpacity, {
        ...rest,
        style: styleProp,
        // @ts-ignore
        ref,
    });
});
