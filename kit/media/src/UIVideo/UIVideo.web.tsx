import * as React from 'react';
import ReactPlayer from 'react-player';
import { useDimensionsByAspectRatio } from './hooks';
import type { UIVideoProps } from './types';

export const UIVideo: React.FC<UIVideoProps> = ({
    uri,
    controls,
    muted,
    repeat,
    width,
    height,
    aspectRatio,
    onLoad,
    onError,
}: UIVideoProps) => {
    const dimensions = useDimensionsByAspectRatio(width, height, aspectRatio);

    return (
        <ReactPlayer
            url={uri}
            controls={controls}
            muted={muted}
            {...dimensions}
            loop={repeat}
            onReady={onLoad}
            onError={onError}
        />
    );
};
