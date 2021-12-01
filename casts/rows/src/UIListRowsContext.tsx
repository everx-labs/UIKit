import * as React from 'react';

type UIRowsPressabilityT<P = void> = {
    onPress?: P extends void ? () => void : (payload: P) => void;
    onLongPress?: P extends void ? () => void : (payload: P) => void;
};

const UIRowsPressabilityContext = React.createContext<UIRowsPressabilityT<any>>({});

export function UIRowsPressabilityProvider<P = void>({
    children,
    onPress,
    onLongPress,
}: UIRowsPressabilityT<P> & { children: React.ReactNode }) {
    const value = React.useMemo(
        () => ({
            onPress,
            onLongPress,
        }),
        [onPress, onLongPress],
    );

    return (
        <UIRowsPressabilityContext.Provider value={value}>
            {children}
        </UIRowsPressabilityContext.Provider>
    );
}

export function useUIRowsPressability<P>(
    payload?: P,
    onPressProp?: (arg?: P) => void,
    onLongPressProp?: (arg?: P) => void,
) {
    const { onPress: onPressC, onLongPress: onLongPressC } =
        React.useContext(UIRowsPressabilityContext);
    const onPress = React.useCallback(() => {
        if (onPressProp) {
            onPressProp(payload);
            return;
        }
        if (onPressC) {
            onPressC(payload);
        }
    }, [onPressProp, onPressC, payload]);
    const onLongPress = React.useCallback(() => {
        if (onLongPressProp) {
            onLongPressProp(payload);
            return;
        }
        if (onLongPressC) {
            onLongPressC(payload);
        }
    }, [onLongPressProp, onLongPressC, payload]);
    return {
        onPress,
        onLongPress,
    };
}
