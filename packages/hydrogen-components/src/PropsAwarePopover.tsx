import * as React from 'react';
import { Popover } from 'react-native-simple-popover';

export function PropsAwarePopover<T>(props: {
    placement: 'bottom';
    arrowWidth: number;
    arrowHeight: number;
    isVisible: boolean;
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
            const [passedProps, setPassedProps] = React.useState<T>(
                passedPropsRef.current,
            );

            React.useEffect(() => {
                setPassedPropsRef.current = setPassedProps;
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
            component={component}
        >
            {props.children}
        </Popover>
    );
}
