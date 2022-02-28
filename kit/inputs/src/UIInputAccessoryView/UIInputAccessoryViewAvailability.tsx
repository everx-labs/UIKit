import * as React from 'react';
import { Platform } from 'react-native';

/**
 * This is temporary until
 * UIInputAccessoryView isn't re-worked with
 * reanimated hook!!!
 */

const UIInputAccessoryViewAvailabilityContext = React.createContext<
    | {
          addInputAccessoryView: () => void;
          removeInputAccessoryView: () => void;
      }
    | undefined
>(undefined);

export function UIInputAccessoryViewAvailability({
    children,
    onInputAccessoryViewAvailable,
    onInputAccessoryViewUnavailable,
}: {
    children: React.ReactNode;
    onInputAccessoryViewAvailable: () => void;
    onInputAccessoryViewUnavailable: () => void;
}) {
    const inputsCount = React.useRef(0);

    const addInputAccessoryView = React.useCallback(() => {
        inputsCount.current += 1;

        if (inputsCount.current === 1) {
            onInputAccessoryViewAvailable();
        }
    }, [onInputAccessoryViewAvailable]);

    const removeInputAccessoryView = React.useCallback(() => {
        inputsCount.current -= 1;

        if (inputsCount.current === 0) {
            onInputAccessoryViewUnavailable();
        }
    }, [onInputAccessoryViewUnavailable]);

    const context = React.useMemo(() => {
        if (Platform.OS === 'web') {
            return undefined;
        }

        return {
            addInputAccessoryView,
            removeInputAccessoryView,
        };
    }, [addInputAccessoryView, removeInputAccessoryView]);

    return (
        <UIInputAccessoryViewAvailabilityContext.Provider value={context}>
            {children}
        </UIInputAccessoryViewAvailabilityContext.Provider>
    );
}

export function useUIInputAccessoryViewAvailability() {
    return React.useContext(UIInputAccessoryViewAvailabilityContext);
}
