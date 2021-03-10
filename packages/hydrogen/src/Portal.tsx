import * as React from 'react';
import { View, StyleSheet } from 'react-native';

type PortalMethods = {
    mount: (children: React.ReactNode, forId?: string) => number;
    update: (key: number, children: React.ReactNode, forId?: string) => void;
    unmount: (key: number, forId?: string) => void;
};

const PortalContext = React.createContext<PortalMethods | null>(null);

type PortalConsumerProps = {
    forId?: string;
    manager: PortalMethods;
    children: React.ReactNode;
};

function PortalConsumer({ forId, manager, children }: PortalConsumerProps) {
    const key = React.useRef<number | null>(null);

    React.useEffect(() => {
        if (key.current == null) {
            key.current = manager.mount(children, forId);
        } else {
            manager.update(key.current, children, forId);
        }

        return () => {
            // @ts-ignore
            manager.unmount(key.current, forId);
        };
    }, [manager, children, forId]);

    return null;
}

interface PortalProps {
    forId?: string;
    children: React.ReactNode;
}

export const Portal = (props: PortalProps) => (
    <PortalContext.Consumer>
        {(manager) => {
            if (manager != null) {
                return (
                    <PortalConsumer forId={props.forId} manager={manager}>
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
    { id?: string; children: React.ReactNode },
    PortalManagerState
> {
    state: PortalManagerState = {};

    getKey(): number {
        const maxMountedKey = Object.keys(this.state)
            .sort((a, b) => Number(b) - Number(a)) // reversed order by keys
            .find(key => !!this.state[Number(key)]); // find the first (max) key

        if (maxMountedKey != null) {
            return Number(maxMountedKey + 1);
        }

        this.counter = this.counter + 1;
        return this.counter;
    }

    parentManager: PortalMethods | null = null;

    counter: number = 0;

    mount = (children: React.ReactNode, forId?: string) => {
        if (
            this.props.id != null &&
            this.parentManager &&
            this.props.id !== forId
        ) {
            return this.parentManager.mount(children, forId);
        }
        const key = this.getKey();
        this.setState((state) => ({
            ...state,
            [key]: children,
        }));
        return key;
    };

    update = (key: number, children: React.ReactNode, forId?: string) => {
        if (
            this.props.id != null &&
            this.parentManager &&
            this.props.id !== forId
        ) {
            this.parentManager.update(key, children, forId);
            return;
        }
        this.setState((state) => {
            return {
                ...state,
                [key]: children,
            };
        });
    };

    unmount = (key: number, forId?: string) => {
        if (
            this.props.id != null &&
            this.parentManager &&
            this.props.id !== forId
        ) {
            this.parentManager.unmount(key, forId);
            return;
        }
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
            <PortalContext.Consumer>
                {(manager) => {
                    this.parentManager = manager;
                    return (
                        <PortalContext.Provider value={this.manager}>
                            {this.props.children}
                            {Object.keys(this.state)
                                .sort((a, b) => Number(a) - Number(b)) // ordered by keys
                                .map((key: string) => {
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
                }}
            </PortalContext.Consumer>
        );
    }
}
