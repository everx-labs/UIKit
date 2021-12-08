import * as React from 'react';
import RNVideo from 'react-native-video';
import type { VideoProps } from './types';

export function Video({
    uri,
    controls,
    paused,
    muted,
    repeat,
    resizeMode = 'contain',
    onLoad,
    onError,
    width,
    height,
}: VideoProps) {
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
        />
    );
}
