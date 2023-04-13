import * as React from 'react';

// @ts-ignore-next-line
// eslint-disable-next-line import/no-extraneous-dependencies
import useMergeRefs from 'react-native-web/dist/modules/useMergeRefs';

const usePlatformMethods = (properties: { [key: string]: true }) => {
    return React.useMemo(() => {
        return (hostNode: Record<string, any>): Record<string, any> | undefined => {
            if (hostNode) {
                // eslint-disable-next-line no-param-reassign
                hostNode.setNativeProps = (nativeProps: Record<string, any>) => {
                    if (nativeProps && nativeProps.style) {
                        Object.keys(properties).forEach(key => {
                            const prop = nativeProps.style[key];

                            if (prop) {
                                hostNode.setAttribute(key, prop);
                            }
                        });
                    }
                };

                return hostNode;
            }
            return undefined;
        };
    }, [properties]);
};

export const addNativeProps = <P extends {}>(
    component: React.ComponentClass<P>,
    properties: {
        [key: string]: true;
    },
): React.ForwardRefExoticComponent<P> => {
    return React.forwardRef<any, any>((props, ref: React.ForwardedRef<any>) => {
        const platformRef = usePlatformMethods(properties);
        const forwardedRef = useMergeRefs(ref, platformRef);

        return React.createElement(component, { ...props, forwardedRef });
    });
};
