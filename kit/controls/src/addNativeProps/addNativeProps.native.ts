import * as React from 'react';

// The following type is taken from @types/react@^17.0.0 which is not yet supported in UIKit
type ForwardedRef<T> = ((instance: T | null) => void) | React.MutableRefObject<T | null> | null;

export const addNativeProps = <P extends Record<string, unknown>>(
    component: React.ComponentClass<P>,
): React.ForwardRefExoticComponent<P> => {
    return React.forwardRef<any, any>((props, ref: ForwardedRef<any>) => {
        return React.createElement(component, { ...props, ref });
    });
};
