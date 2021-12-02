import * as React from 'react';
import RNVideo from 'react-native-video';
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
    return (
        <RNVideo
            source={{ uri }}
            style={{
                width,
                height,
                aspectRatio,
            }}
            controls={controls}
            muted={muted}
            repeat={repeat}
            onLoad={onLoad}
            onError={onError}
        />
    );
};
