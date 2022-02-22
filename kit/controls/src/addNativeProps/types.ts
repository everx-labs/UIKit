export type AddNativeProps = <P>(
    component: React.ComponentClass<P> | React.FunctionComponent<P>,
    properties: {
        [key: string]: true;
    },
) => React.ForwardRefExoticComponent<P>;
