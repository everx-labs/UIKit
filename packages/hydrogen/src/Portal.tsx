import * as React from 'react';
import { View, StyleSheet } from 'react-native';

type PortalMethods = {
    mount: (
        children: React.ReactNode,
        forId?: string,
        absoluteFill?: boolean,
    ) => number;
    update: (
        key: number,
        children: React.ReactNode,
        forId?: string,
        absoluteFill?: boolean,
    ) => void;
    unmount: (key: number, forId?: string) => void;
};

const PortalContext = React.createContext<PortalMethods | null>(null);

type PortalConsumerProps = {
    forId?: string;
    absoluteFill?: boolean;
    manager: PortalMethods;
    children: React.ReactNode;
};

function PortalConsumer({
    forId,
    absoluteFill,
    manager,
    children,
}: PortalConsumerProps) {
    const key = React.useRef<number | null>(null);

    React.useEffect(() => {
        if (key.current == null) {
            key.current = manager.mount(children, forId, absoluteFill);
        } else {
            manager.update(key.current, children, forId, absoluteFill);
        }

        return () => {
            // @ts-ignore
            manager.unmount(key.current, forId, absoluteFill);
        };
    }, [manager, children, forId, absoluteFill]);

    return null;
}

interface PortalProps {
    forId?: string;
    absoluteFill?: boolean;
    children: React.ReactNode;
}

export const Portal = (props: PortalProps) => (
    <PortalContext.Consumer>
        {(manager) => {
            if (manager != null) {
                return (
                    <PortalConsumer
                        forId={props.forId}
                        manager={manager}
                        absoluteFill={props.absoluteFill}
                    >
                        {props.children}
                    </PortalConsumer>
                );
            }
            return null;
        }}
    </PortalContext.Consumer>
);

type PortalManagerState = {
    [key: number]: {
        children: React.ReactNode;
        absoluteFill?: boolean;
    } | null;
};

export class PortalManager extends React.PureComponent<
    { id?: string; children: React.ReactNode },
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

    parentManager: PortalMethods | null = null;

    counter: number = 0;

    mount = (
        children: React.ReactNode,
        forId?: string,
        absoluteFill?: boolean,
    ) => {
        if (
            this.props.id != null &&
            this.parentManager &&
            this.props.id !== forId
        ) {
            return this.parentManager.mount(children, forId, absoluteFill);
        }
        const key = this.getKey();
        this.setState((state) => ({
            ...state,
            [key]: {
                children,
                absoluteFill,
            },
        }));
        return key;
    };

    update = (
        key: number,
        children: React.ReactNode,
        forId?: string,
        absoluteFill?: boolean,
    ) => {
        if (
            this.props.id != null &&
            this.parentManager &&
            this.props.id !== forId
        ) {
            this.parentManager.update(key, children, forId, absoluteFill);
            return;
        }
        this.setState((state) => {
            return {
                ...state,
                [key]: {
                    children,
                    absoluteFill,
                },
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
                            {Object.keys(this.state).map((key: string) => {
                                const portal = this.state[Number(key)];
                                if (portal != null) {
                                    return (
                                        <View
                                            key={`portal_${key}`}
                                            collapsable={false}
                                            pointerEvents="box-none"
                                            style={
                                                portal.absoluteFill
                                                    ? StyleSheet.absoluteFill
                                                    : null
                                            }
                                        >
                                            {portal.children}
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
