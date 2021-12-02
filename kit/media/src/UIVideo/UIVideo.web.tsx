import * as React from 'react';
import ReactPlayer from 'react-player';
import { useDimensionsByAspectRatio } from './hooks';
import type { UIVideoProps } from './types';

function UIVideoImpl({
    uri,
    controls,
    paused = false,
    muted,
    repeat,
    width,
    height,
    aspectRatio,
    resizeMode = 'contain',
    onLoad,
    onError,
}: UIVideoProps) {
    const dimensions = useDimensionsByAspectRatio(width, height, aspectRatio);

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

    return (
        <ReactPlayer
            url={uri}
            controls={controls}
            {...dimensions}
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

export const UIVideo = React.memo(UIVideoImpl);
