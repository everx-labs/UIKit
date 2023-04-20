import * as React from 'react';

export const addNativeProps = <P extends object>(
    component: React.ComponentClass<P>,
): React.ForwardRefExoticComponent<P> => {
    return React.forwardRef<any, any>((props, ref: React.ForwardedRef<any>) => {
        return React.createElement(component, { ...props, ref });
    });
};
