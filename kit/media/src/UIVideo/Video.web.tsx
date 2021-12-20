import * as React from 'react';
import ReactPlayer from 'react-player';
import type { VideoProps } from './types';

export function Video({
    uri,
    controls,
    paused = false,
    muted,
    repeat,
    resizeMode = 'contain',
    onLoad,
    onError,
    width,
    height,
}: VideoProps) {
    const config = React.useMemo(
        () => ({
            file: {
                attributes: {
                    style: {
                        height: '100%',
                        width: '100%',
                        objectFit: resizeMode,
                    },
                },
            },
        }),
        [resizeMode],
    );

    if (!width || !height || !uri) {
        return null;
    }
    return (
        <ReactPlayer
            url={uri}
            controls={controls}
            width={width}
            height={height}
            loop={repeat}
            playing={!paused}
            muted={muted}
            /**
             * For apply resizeMode
             */
            config={config}
            onReady={onLoad}
            onError={onError}
        />
    );
}
