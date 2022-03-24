import type { ImageURISource } from 'react-native';

export type MediaCardContentType = 'Image' | 'Video' | 'Unknown';

export type MediaCardContentSource = ImageURISource;

export type MediaCardContent = {
    id: string;
    contentType: MediaCardContentType;
    source: MediaCardContentSource;
};
