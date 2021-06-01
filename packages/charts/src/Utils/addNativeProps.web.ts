import * as React from 'react';

// @ts-ignore-next-line
// eslint-disable-next-line import/no-extraneous-dependencies
import useMergeRefs from 'react-native-web/dist/modules/useMergeRefs';

const usePlatformMethods = () => {
    return React.useMemo(() => {
        return (hostNode: Record<string, any>) => {
            // eslint-disable-next-line no-param-reassign
            hostNode.setNativeProps = (nativeProps: Record<string, any>) => {
                Object.keys(nativeProps.style).forEach((key) => {
                    const prop = nativeProps.style[key];

                    if (prop) {
                        hostNode.setAttribute(key, prop);
                    }
                });
            };

            return hostNode;
        };
    }, []);
};

export const addNativeProps = <P>(
    Component: React.ComponentClass<P>,
): React.ForwardRefExoticComponent<P> => {
    return React.forwardRef<any, any>((props, ref: React.ForwardedRef<any>) => {
        const platformRef = usePlatformMethods();
        const forwardedRef = useMergeRefs(ref, platformRef);

        return React.createElement(Component, { ...props, forwardedRef });
    });
};
