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

type PortalItem = {
    children: React.ReactNode;
    absoluteFill?: boolean;
};

type PortalManagerState = {
    [key: number]: PortalItem | null;
};

type PortalManagerProps = {
    id?: string;
    renderOnlyLastPortal?: boolean;
    children: React.ReactNode;
};

export class PortalManager extends React.PureComponent<
    PortalManagerProps,
    PortalManagerState
> {
    state: PortalManagerState = {};

    getMaxMountedKey() {
        return Object.keys(this.state)
            .sort((a, b) => Number(b) - Number(a)) // reversed order by keys
            .find((key) => !!this.state[Number(key)]); // find the first (max) key
    }

    getKey(): number {
        const maxMountedKey = this.getMaxMountedKey();

        if (maxMountedKey != null) {
            return Number(maxMountedKey + 1);
        }

        this.counter += 1;
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

    renderPortal(key: string | undefined) {
        const portal = this.state[Number(key)];

        if (portal == null) {
            return null;
        }

        if (portal.absoluteFill) {
            return (
                <View
                    key={`portal_${key}`}
                    collapsable={false}
                    pointerEvents="box-none"
                    // Pick `zIndex` for PortalManager thus to overlap all components
                    // http://softwareas.com/whats-the-maximum-z-index (as per Safari 0-3 threshold)
                    style={[StyleSheet.absoluteFill, { zIndex: 16777271 }]}
                >
                    {portal.children}
                </View>
            );
        }

        return portal.children;
    }

    renderLastPortal() {
        const maxMountedKey = this.getMaxMountedKey();

        if (maxMountedKey == null) {
            return null;
        }

        return this.renderPortal(maxMountedKey);
    }

    renderAllPortals() {
        return Object.keys(this.state)
            .sort((a, b) => Number(a) - Number(b)) // ordered by keys
            .map((key: string) => {
                return this.renderPortal(key);
            });
    }

    render() {
        return (
            <PortalContext.Consumer>
                {(manager) => {
                    this.parentManager = manager;
                    return (
                        <PortalContext.Provider value={this.manager}>
                            {this.props.children}
                            {this.props.renderOnlyLastPortal
                                ? this.renderLastPortal()
                                : this.renderAllPortals()}
                        </PortalContext.Provider>
                    );
                }}
            </PortalContext.Consumer>
        );
    }
}
