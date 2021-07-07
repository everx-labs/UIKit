import type * as React from 'react';
import type ViewShot from 'react-native-view-shot';

export const getScreenshot = async (
    ref: React.MutableRefObject<ViewShot | null>,
): Promise<string | null> => {
    if (!ref.current || !ref.current.capture) {
        return null;
    }
    const uri = await ref.current.capture();
    return `data:image/png;base64,${uri}`;
};
