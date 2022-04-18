import * as React from 'react';
import { View, StyleSheet } from 'react-native';

type WrapperComponent = React.ComponentType<{
    children: React.ReactNode;
    portals: React.ReactNode;
}>;

type PortalMethods = {
    mount: (children: React.ReactNode, forId?: string, absoluteFill?: boolean) => number;
    update: (
        key: number,
        children: React.ReactNode,
        forId?: string,
        absoluteFill?: boolean,
    ) => void;
    unmount: (key: number, forId?: string) => void;
};

const PortalContext = React.createContext<PortalMethods | undefined>(undefined);

type PortalConsumerProps = {
    forId?: string;
    absoluteFill?: boolean;
    manager: PortalMethods;
    children: React.ReactNode;
};

function PortalConsumer({ forId, absoluteFill, manager, children }: PortalConsumerProps) {
    const key = React.useRef<number | null>(null);

    React.useEffect(() => {
        if (key.current == null) {
            key.current = manager.mount(children, forId, absoluteFill);
        } else {
            manager.update(key.current, children, forId, absoluteFill);
        }
    }, [manager, children, forId, absoluteFill]);

    React.useEffect(() => {
        return () => {
            if (key.current == null) {
                return;
            }
            manager.unmount(key.current, forId);
        };
    }, [forId, manager]);

    return null;
}

interface PortalProps {
    forId?: string;
    absoluteFill?: boolean;
    children: React.ReactNode;
}

export function Portal({ forId, absoluteFill, children }: PortalProps) {
    const manager = React.useContext(PortalContext);

    if (manager == null) {
        return null;
    }

    return (
        <PortalConsumer forId={forId} manager={manager} absoluteFill={absoluteFill}>
            {children}
        </PortalConsumer>
    );
}

type PortalItem = {
    children: React.ReactNode;
    absoluteFill?: boolean;
};

type PortalManagerState = {
    [key: string]: PortalItem | null;
};

type PortalManagerProps = {
    id?: string;
    renderOnlyLastPortal?: boolean;
    children: React.ReactNode;
    contentWrapperComponent?: WrapperComponent;
};

const PortalView = React.memo<PortalItem>(function PortalView({
    absoluteFill,
    children,
}: PortalItem) {
    if (absoluteFill) {
        return (
            <View collapsable={false} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                {children}
            </View>
        );
    }

    return <>{children}</>;
});

type PortalsViewProps = {
    renderOnlyLastPortal: boolean;
    // Sorted by priority array of portals
    portalKeys: string[];
    portals: { [key: string]: PortalItem | null };
};

const PortalsView = React.memo<PortalsViewProps>(function PortalsView({
    renderOnlyLastPortal,
    portalKeys,
    portals,
}) {
    if (!renderOnlyLastPortal) {
        return (
            <>
                {portalKeys.map(key => {
                    const portal = portals[key];

                    if (portal == null) {
                        return null;
                    }

                    return <PortalView key={`portal_${key}`} {...portal} />;
                })}
            </>
        );
    }

    const maxMountedKey = portalKeys[portalKeys.length - 1];

    const lastPortal = portals[maxMountedKey];

    if (lastPortal == null) {
        return null;
    }

    return <PortalView key={`portal_${maxMountedKey}`} {...lastPortal} />;
});

const MaybeParentManager = React.memo(function MaybeParentManager({
    setParentManager,
}: {
    setParentManager: (parentManager: PortalMethods) => void;
}) {
    const parentManager = React.useContext(PortalContext);

    React.useEffect(() => {
        if (parentManager == null) {
            return;
        }

        setParentManager(parentManager);
    }, [parentManager, setParentManager]);

    return null;
});

type MaybePortalContentWrapperProps = {
    wrapperComponent?: WrapperComponent | null;
    children: React.ReactNode;
    portals: React.ReactNode;
};

function MaybePortalContentWrapper({
    wrapperComponent: ContentWrapperComponent,
    children,
    portals,
}: MaybePortalContentWrapperProps) {
    if (ContentWrapperComponent == null) {
        return (
            <>
                {children}
                {portals}
            </>
        );
    }

    return <ContentWrapperComponent portals={portals}>{children}</ContentWrapperComponent>;
}

export class PortalManager extends React.PureComponent<PortalManagerProps, PortalManagerState> {
    parentManager?: PortalMethods;

    counter: number = 0;

    manager: PortalMethods;

    atomicState: Record<number, PortalItem | null>;

    constructor(props: PortalManagerProps) {
        super(props);

        this.state = {};
        /**
         * Atomic state is needed to update state synchronously
         * since `setState` is asynchronous there could be a situation
         * when few portals can be mounted at the same time,
         * hence they try to obtain a key and it can happen
         * when state isn't updated yet, that leads to the equal keys
         * (after `getMaxMountedKey` was called)
         */
        this.atomicState = {};
        this.manager = {
            mount: this.mount,
            update: this.update,
            unmount: this.unmount,
        };
    }

    getMaxMountedKey() {
        const portals = this.atomicState;
        return (
            Object.keys(portals)
                .map(portalKey => Number(portalKey))
                .filter(portalKey => portals[portalKey] != null)
                .sort((a, b) => b - a) // reversed order by keys
                // eslint-disable-next-line react/destructuring-assignment
                .find(key => !!portals[key])
        ); // find the first (max) key
    }

    getKey(): number {
        const maxMountedKey = this.getMaxMountedKey();

        if (maxMountedKey != null) {
            return maxMountedKey + 1;
        }

        this.counter += 1;
        return this.counter;
    }

    mount = (children: React.ReactNode, forId?: string, absoluteFill?: boolean) => {
        const { id } = this.props;
        if (id != null && this.parentManager && id !== forId) {
            return this.parentManager.mount(children, forId, absoluteFill);
        }
        const key = this.getKey();
        this.atomicState = {
            ...this.atomicState,
            [key]: {
                children,
                absoluteFill,
            },
        };
        this.setState(this.atomicState);
        return key;
    };

    update = (key: number, children: React.ReactNode, forId?: string, absoluteFill?: boolean) => {
        const { id } = this.props;
        if (id != null && this.parentManager && id !== forId) {
            this.parentManager.update(key, children, forId, absoluteFill);
            return;
        }
        this.atomicState = {
            ...this.atomicState,
            [key]: {
                children,
                absoluteFill,
            },
        };
        this.setState(this.atomicState);
    };

    unmount = (key: number, forId?: string) => {
        const { id } = this.props;
        if (id != null && this.parentManager && id !== forId) {
            this.parentManager.unmount(key, forId);
            return;
        }
        this.atomicState = {
            ...this.atomicState,
            [key]: null,
        };
        this.setState(this.atomicState);
    };

    setParentManager = (parentManager: PortalMethods) => {
        this.parentManager = parentManager;
    };

    render() {
        const { children, renderOnlyLastPortal, contentWrapperComponent } = this.props;
        const portals = this.state;
        const portalKeys = Object.keys(portals)
            .filter(portalKey => portals[Number(portalKey)] != null)
            .sort((a, b) => Number(a) - Number(b)); // ordered by keys

        return (
            <>
                <MaybeParentManager setParentManager={this.setParentManager} />
                <PortalContext.Provider value={this.manager}>
                    <MaybePortalContentWrapper
                        wrapperComponent={contentWrapperComponent}
                        portals={
                            <PortalsView
                                renderOnlyLastPortal={!!renderOnlyLastPortal}
                                portalKeys={portalKeys}
                                portals={portals}
                            />
                        }
                    >
                        {children}
                    </MaybePortalContentWrapper>
                </PortalContext.Provider>
            </>
        );
    }
}
