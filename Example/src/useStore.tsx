import * as React from 'react';

const defaultStore = {
    rowsLoading: false,
    menuVisible: false,
};
type Store = typeof defaultStore;
const StoreContext = React.createContext<Store>(defaultStore);

const storesUpdaters: Record<number, any> = {};

let uid = 0;

let globalStore = { ...defaultStore };

export function updateStore(op: Partial<Store> | ((state: Store) => Partial<Store>)) {
    const update = typeof op === 'function' ? op(globalStore) : op;
    const newStore = { ...globalStore, ...update };
    Object.keys(storesUpdaters).forEach(key => {
        // @ts-expect-error
        storesUpdaters[key](newStore);
    });
    globalStore = newStore;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const id = React.useRef<number>(0);
    if (id.current == null) {
        uid += 1;
        id.current = uid;
    }
    const [store, setStore] = React.useState(defaultStore);
    React.useEffect(() => {
        storesUpdaters[id.current] = setStore;

        return () => {
            delete storesUpdaters[id.current];
        };
    }, []);

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore<T>(selector: (store: Store) => T): T {
    return selector(React.useContext(StoreContext));
}
