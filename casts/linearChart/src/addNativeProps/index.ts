// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import { addNativeProps as addNativePropsImpl } from './addNativeProps';

export const addNativeProps: <P>(
    component: React.ComponentClass<P>,
    properties: {
        [key: string]: true;
    },
) => React.ForwardRefExoticComponent<P> = addNativePropsImpl;
