import type { Image, ImageProps } from 'react-native';

export type DuplicateImageProps = Omit<ImageProps, 'source'> & {
    source: React.RefObject<Image>;
    children: React.ReactElement;
};
