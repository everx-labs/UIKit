import * as React from 'react';
import type ViewShot from 'react-native-view-shot';

export const useScreenshotRef = (
    value: string,
    getPng?: (base64: string) => void,
): React.MutableRefObject<ViewShot | null> => {
    const ref = React.useRef<null | ViewShot>(null);
    React.useEffect(() => {
        if (getPng) {
            if (ref.current && ref.current.capture) {
                ref.current.capture().then((uri: string): void => {
                    getPng(uri);
                });
            }
        }
    }, [value, getPng]);

    return ref;
};
