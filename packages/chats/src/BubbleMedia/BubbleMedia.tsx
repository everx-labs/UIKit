import * as React from 'react';

import { ChatMediaMessage, MediaMessageStatus, MediaMessage } from '../types';
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
    const { data, onOutput } = message;
    const dataType = useDataType(data);

    switch (dataType) {
        case DataType.Image:
            return <MediaImage {...message} />;
        case DataType.Empty:
            if (onOutput) {
                onOutput(MediaMessageStatus.DataIsEmpty);
            }
            return null;
        case DataType.Unknown:
        default:
            if (onOutput) {
                onOutput(MediaMessageStatus.NotSupportedDataFormat);
            }
            return null;
    }
};
