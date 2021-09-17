import * as React from 'react';
import { StatusBar, StatusBarStyle } from 'react-native';

import { ColorVariants, useTheme } from './Colors';
import { useIsDarkColor } from './useIsDarkColor';

const StatusBarContext = React.createContext<{
    addBar: (id: number, barStyle: StatusBarStyle, backgroundColor: ColorVariants) => void;
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

type State = {
    styles: {
        [key: number]: {
            barStyle: StatusBarStyle;
            backgroundColor: ColorVariants;
        };
    };
    stack: number[];
};

type AddBarAction = {
    type: 'ADD_BAR';
    payload: {
        id: number;
        barStyle: StatusBarStyle;
        backgroundColor: ColorVariants;
    };
};

type RemoveBarAction = {
    type: 'REMOVE_BAR';
    payload: {
        id: number;
    };
};

function reducer(state: State, action: AddBarAction | RemoveBarAction) {
    if (action.type === 'ADD_BAR') {
        const styles = {
            ...state.styles,
            [action.payload.id]: {
                barStyle: action.payload.barStyle,
                backgroundColor: action.payload.backgroundColor,
            },
        };
        const stack = state.stack.slice();
        if (stack.indexOf(action.payload.id) === -1) {
            stack.push(action.payload.id);
        }
        return {
            styles,
            stack,
        };
    }
    if (action.type === 'REMOVE_BAR') {
        const styles = { ...state.styles };
        delete styles[action.payload.id];

        const stack = state.stack.filter(barId => barId !== action.payload.id);

        return {
            styles,
            stack,
        };
    }

    return state;
}

function useStatusBarStyle(color: ColorVariants): StatusBarStyle {
    const isDark = useIsDarkColor(color);

    return isDark ? 'light-content' : 'dark-content';
}

export function UIStatusBarManager({ children }: { children: React.ReactNode }) {
    const theme = useTheme();
    const localID = useLocalID();

    const defaultBarStyle = useStatusBarStyle(ColorVariants.BackgroundPrimary);

    const [state, dispatch] = React.useReducer(reducer, {
        styles: {
            [localID]: {
                barStyle: defaultBarStyle,
                backgroundColor: ColorVariants.BackgroundPrimary,
            },
        },
        stack: [localID],
    });

    const manager = React.useRef({
        addBar(id: number, barStyle: StatusBarStyle, backgroundColor: ColorVariants) {
            dispatch({
                type: 'ADD_BAR',
                payload: {
                    id,
                    barStyle,
                    backgroundColor,
                },
            });
        },
        removeBar(id: number) {
            dispatch({
                type: 'REMOVE_BAR',
                payload: {
                    id,
                },
            });
        },
    }).current;

    const { barStyle, backgroundColor } = React.useMemo(() => {
        const lastStyleId = state.stack[state.stack.length - 1];

        return state.styles[lastStyleId];
    }, [state.stack, state.styles]);

    return (
        <StatusBarContext.Provider value={manager}>
            {children}
            <StatusBar barStyle={barStyle} backgroundColor={theme[backgroundColor]} />
        </StatusBarContext.Provider>
    );
}

export function useStatusBar({ backgroundColor }: { backgroundColor: ColorVariants }) {
    const localID = useLocalID();
    const parentManager = React.useContext(StatusBarContext);

    const barStyle = useStatusBarStyle(backgroundColor);

    React.useEffect(() => {
        if (parentManager == null) {
            return undefined;
        }

        parentManager.addBar(localID, barStyle, backgroundColor);

        return () => {
            parentManager.removeBar(localID);
        };
    }, [parentManager, localID, backgroundColor, barStyle]);
}

export function UIStatusBar(props: { backgroundColor: ColorVariants }) {
    useStatusBar(props);

    return null;
}
