import * as React from 'react';
import ReactPlayer from 'react-player';
import { useDimensionsByAspectRatio } from './hooks';
import type { UIVideoProps } from './types';

export const UIVideo: React.FC<UIVideoProps> = ({
    uri,
    controls,
    paused = false,
    muted,
    repeat,
    width,
    height,
    aspectRatio,
    resizeMode = 'contain',
}: UIVideoProps) => {
    const dimensions = useDimensionsByAspectRatio(width, height, aspectRatio);

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
            config={{
                file: {
                    attributes: {
                        style: {
                            height: '100%',
                            width: '100%',
                            objectFit: resizeMode,
                        },
                    },
                },
            }}
        />
    );
};
