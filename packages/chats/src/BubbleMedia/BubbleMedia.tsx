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
    Image = 'Image',
    Unknown = 'Unknown',
}

const useDataType = (data: string): DataType => {
    return React.useMemo(() => {
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
        default:
            console.error(`BubbleMedia: Unknown data format`);
            return null;
    }
};
