import * as React from 'react';
import { StatusBar, StatusBarStyle } from 'react-native';

import { useTheme, ColorVariants } from './Colors';

const StatusBarContext = React.createContext<{
    addBar: (id: number, barStyle: StatusBarStyle) => void;
    removeBar: (id: number) => void;
} | null>(null);

let globalID = 0;
function useLocalID() {
    const localIdRef = React.useRef(0);

    if (localIdRef.current === 0) {
        globalID += 1;
        localIdRef.current = globalID;
    }

    return localIdRef.current;
}

export function UIStatusBarManager({
    children,
}: {
    children: React.ReactNode;
}) {
    const theme = useTheme();
    const localID = useLocalID();
    const styles = React.useRef<{
        [key: number]: StatusBarStyle;
    }>({
        [localID]: theme[ColorVariants.StatusBarStyle] as StatusBarStyle,
    }).current;
    const [stack, setStack] = React.useState([localID]);
    const manager = React.useRef({
        addBar(id: number, barStyle: StatusBarStyle) {
            styles[id] = barStyle;
            if (styles[id] != null) {
                return;
            }
            setStack(stack.concat([id]));
        },
        removeBar(id: number) {
            delete styles[id];
            setStack(stack.filter((barId) => barId !== id));
        },
    }).current;

    return (
        <StatusBarContext.Provider value={manager}>
            {children}
            <StatusBar barStyle={styles[stack[stack.length - 1]]} />
        </StatusBarContext.Provider>
    );
}

export function useStatusBar({ barStyle }: { barStyle: StatusBarStyle }) {
    const localID = useLocalID();
    const parentManager = React.useContext(StatusBarContext);

    React.useEffect(() => {
        if (parentManager == null) {
            return undefined;
        }

        parentManager.addBar(localID, barStyle);

        return () => {
            parentManager.removeBar(localID);
        };
    }, [parentManager, localID, barStyle]);
}

export function UIStatusBar(props: { barStyle: StatusBarStyle }) {
    useStatusBar(props);

    return null;
}
