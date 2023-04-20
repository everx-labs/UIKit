import * as React from 'react';

import { MediaMessageError } from '../constants';
import type { ChatMediaMessage, MediaMessage } from '../types';
import { MediaImage } from './MediaImage';

// eslint-disable-next-line no-shadow
enum DataType {
    Image,
    Unknown,
    Empty,
}

const useDataType = (data: string | null): DataType => {
    return React.useMemo(() => {
        if (!data) {
            return DataType.Empty;
        }
        if (data.startsWith('data:image')) {
            return DataType.Image;
        }
        return DataType.Unknown;
    }, [data]);
};

export function BubbleMedia(message: MediaMessage) {
    const { data, onError } = message;
    const dataType = useDataType(data);

    switch (dataType) {
        case DataType.Image:
            return <MediaImage {...message} />;
        case DataType.Empty:
            if (onError) {
                onError(MediaMessageError.DataIsEmpty);
            }
            return null;
        case DataType.Unknown:
        default:
            if (onError) {
                onError(MediaMessageError.NotSupportedDataFormat);
            }
            return null;
    }
}

export function ChatBubbleMedia(message: ChatMediaMessage) {
    return <BubbleMedia {...message} />;
}
