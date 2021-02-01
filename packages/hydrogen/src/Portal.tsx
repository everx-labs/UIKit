import * as React from 'react';
import { View, StyleSheet } from 'react-native';

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
            // @ts-ignore
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
    [key: number]: React.ReactNode;
};

export class PortalManager extends React.PureComponent<
    { children: React.ReactNode },
    PortalManagerState
> {
    state: PortalManagerState = {};

    getKey(): number {
        const emptyKey = Object.keys(this.state).reduce<string | null>(
            (acc, key) => {
                // @ts-expect-error
                if (this.state[key] == null) {
                    return key;
                }
                return acc;
            },
            null,
        );

        if (emptyKey != null) {
            return Number(emptyKey);
        }

        this.counter = this.counter + 1;
        return this.counter;
    }

    counter: number = 0;

    mount = (children: React.ReactNode) => {
        const key = this.getKey();
        this.setState((state) => ({
            ...state,
            [key]: children,
        }));
        return key;
    };

    update = (key: number, children: React.ReactNode) => {
        this.setState((state) => {
            return {
                ...state,
                [key]: children,
            };
        });
    };

    unmount = (key: number) => {
        this.setState((state) => ({
            ...state,
            [key]: null,
        }));
    };

    manager = {
        mount: this.mount,
        update: this.update,
        unmount: this.unmount,
    };

    render() {
        return (
            <PortalContext.Provider value={this.manager}>
                {this.props.children}
                {Object.keys(this.state).map((key: string) => {
                    const children = this.state[Number(key)];
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
