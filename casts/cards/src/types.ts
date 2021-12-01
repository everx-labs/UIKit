import type { ImageURISource } from 'react-native';

export type ContentType = 'Image' | 'Video' | 'Unknown';

export type ContentSource = ImageURISource;

export type Content = {
    contentType: ContentType;
    source: ContentSource;
};
