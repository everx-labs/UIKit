import * as React from 'react';
import RNVideo from 'react-native-video';
import type { VideoProps } from './types';

export function Video({
    uri,
    controls,
    paused,
    muted: mutedProp,
    repeat,
    resizeMode = 'contain',
    onLoad,
    onError,
    width,
    height,
}: VideoProps) {
    const [muted, setMuted] = React.useState<boolean>(!!mutedProp);

    const onFullscreenOpen = React.useCallback(() => {
        if (muted) {
            setMuted(false);
        }
    }, [muted]);

    const onFullscreenClose = React.useCallback(() => {
        if (mutedProp) {
            setMuted(true);
        }
    }, [mutedProp]);

    if (!width || !height || !uri) {
        return null;
    }
    return (
        <RNVideo
            source={{ uri }}
            style={{
                width,
                height,
            }}
            controls={controls}
            repeat={repeat}
            paused={paused}
            muted={muted}
            resizeMode={resizeMode}
            /**
             * For playing many videos simultaneously on Android
             */
            disableFocus
            onLoad={onLoad}
            onError={onError}
            onFullscreenPlayerWillPresent={onFullscreenOpen}
            onFullscreenPlayerWillDismiss={onFullscreenClose}
        />
    );
}
