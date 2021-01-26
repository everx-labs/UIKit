import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

type PortalMethods = {
    mount: (children: React.ReactNode) => number;
    update: (key: number, children: React.ReactNode) => void;
    unmount: (key: number) => void;
};

const PortalContext = React.createContext<PortalMethods | null>(null);

type PortalConsumerProps = {
    manager: PortalMethods;
    children: React.ReactNode;
};

function PortalConsumer({ manager, children }: PortalConsumerProps) {
    const key = React.useRef<number | null>(null);

    React.useEffect(() => {
        if (key.current == null) {
            key.current = manager.mount(children);
        } else {
            manager.update(key.current, children);
        }

        return () => {
            manager.unmount(key.current);
        };
    }, [manager, children]);

    return null;
}

interface PortalProps {
    children: React.ReactNode;
}

export const Portal = (props: PortalProps) => (
    <PortalContext.Consumer>
        {(manager) => {
            if (manager != null) {
                return (
                    <PortalConsumer manager={manager}>
                        {props.children}
                    </PortalConsumer>
                );
            }
            return null;
        }}
    </PortalContext.Consumer>
);

type PortalManagerState = {
    [key: string]: React.ReactNode;
};

export class PortalManager extends React.PureComponent<
    { children: React.ReactNode },
    PortalManagerState
> {
    state: PortalManagerState = {};
    counter: number = 0;

    mount = (children: React.ReactNode) => {
        this.counter = this.counter + 1;
        const key = this.counter;
        this.setState((state) => ({
            ...state,
            [key]: children,
        }));
        return key;
    };

    update = (key: number, children: React.ReactNode) => {
        this.setState((state) => ({
            ...state,
            [key]: children,
        }));
    };

    unmount = (key: number) => {
        const newState = Object.assign({}, this.state);
        delete newState[key];
        this.setState(newState);
    };

    render() {
        return (
            <PortalContext.Provider
                value={{
                    mount: this.mount,
                    update: this.update,
                    unmount: this.unmount,
                }}
            >
                {this.props.children}
                {Object.keys(this.state).map((key) => {
                    const children = this.state[key];
                    if (children != null) {
                        return (
                            <View
                                key={`portal_${key}`}
                                collapsable={false}
                                pointerEvents="box-none"
                                style={StyleSheet.absoluteFill}
                            >
                                {children}
                            </View>
                        );
                    }
                    return null;
                })}
            </PortalContext.Provider>
        );
    }
}
