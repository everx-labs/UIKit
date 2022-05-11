import * as React from 'react';
import { findNodeHandle, Platform } from 'react-native';

/**
 * Due to https://github.com/react-native-svg/react-native-svg/commit/69ff5f0e9850798cf0f717c4e88ae5f32f805a5c
 * rn-svg became incompatible with `reanimated`.
 *
 * Since it doesn't have `setNativeProps`
 * reanimated tries to access `_touchableNode`
 * https://github.com/software-mansion/react-native-reanimated/blob/main/src/reanimated2/js-reanimated/index.ts#L70
 *
 * But svg component miss it too (because of the change above).
 *
 * This HOC provides `setNativeProps` for svg components
 */
export function makeRNSvgReanimatedCompat<P>(
    Comp: React.ComponentClass<P>,
): React.ComponentClass<P> {
    if (Platform.OS !== 'web') {
        return Comp;
    }

    return React.forwardRef<any, P>(function CirclePlatformComp(props, ref) {
        const localRef = React.useRef<any>();
        React.useImperativeHandle(ref, () => ({
            setNativeProps(nativeProps: Record<string, any>) {
                if (localRef.current == null) {
                    return;
                }

                const node: HTMLElement = findNodeHandle(localRef.current) as any;
                if (node == null) {
                    return;
                }

                if (nativeProps && nativeProps.style) {
                    Object.keys(nativeProps.style).forEach(key => {
                        const prop = nativeProps.style[key];

                        if (prop) {
                            node.setAttribute(key, prop);
                        }
                    });
                }
            },
        }));

        return <Comp ref={localRef} {...props} />;
    }) as any;
}
