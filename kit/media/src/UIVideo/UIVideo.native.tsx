import * as React from 'react';
import RNVideo from 'react-native-video';
import type { UIVideoProps } from './types';

function UIVideoImpl({
    uri,
    controls,
    paused,
    muted,
    repeat,
    width,
    height,
    aspectRatio,
    resizeMode = 'contain',
    onLoad,
    onError,
}: UIVideoProps) {
    return (
        <RNVideo
            source={{ uri }}
            style={{
                width,
                height,
                aspectRatio,
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

export const UIVideo = React.memo(UIVideoImpl);
