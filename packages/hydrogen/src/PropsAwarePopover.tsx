import * as React from 'react';
import { Popover } from 'react-native-simple-popover';

export function PropsAwarePopover<T>(props: {
    placement: 'bottom';
    arrowWidth: number;
    arrowHeight: number;
    isVisible: boolean;
    offset: { x: number, y: number };
    component: React.ComponentType<T>;
    componentProps: T;
    children: React.ReactNode;
}) {
    const passedPropsRef = React.useRef<T>(props.componentProps);
    passedPropsRef.current = props.componentProps;
    const setPassedPropsRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (setPassedPropsRef.current != null) {
            setPassedPropsRef.current(props.componentProps);
        }
    }, [props.componentProps]);

    const component = React.useMemo(
        () => () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [passedProps, setPassedProps] = React.useState<T>(
                passedPropsRef.current,
            );

            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
                setPassedPropsRef.current = setPassedProps;

                return () => {
                    setPassedPropsRef.current = null;
                };
            }, [setPassedProps]);

            return React.createElement(props.component, passedProps);
        },
        [props.component],
    );

    return (
        <Popover
            placement={props.placement}
            arrowWidth={props.arrowWidth}
            arrowHeight={props.arrowHeight}
            isVisible={props.isVisible}
            offset={props.offset}
            component={component}
        >
            {props.children}
        </Popover>
    );
}
