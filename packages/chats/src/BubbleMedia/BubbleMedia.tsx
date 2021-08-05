import * as React from 'react';

import type { MediaMessage, ChatMediaMessage } from '../types';
import { MediaImage } from './MediaImage';

export const ChatBubbleMedia: React.FC<ChatMediaMessage> = (
    message: ChatMediaMessage,
) => {
    return <BubbleMedia {...message} />;
};

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

export const BubbleMedia: React.FC<MediaMessage> = (message: MediaMessage) => {
    const { data } = message;
    const dataType = useDataType(data);

    switch (dataType) {
        case DataType.Image:
            return <MediaImage {...message} />;
        case DataType.Empty:
            // Add preloader here if it's necessary
            return null;
        case DataType.Unknown:
        default:
            console.error(`BubbleMedia: Unknown data format`);
            return null;
    }
};
