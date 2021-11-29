import * as React from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';
// import FastImage, {Source} from 'react-native-fast-image';
import { UIImage } from '@tonlabs/uikit.media';

import type { PreviewProps } from './types';
import { UIConstant } from '../constants';

// const usePreload = (
//     contentType: ContentType,
//     source?: ImageSourcePropType | ImageSourcePropType[],
// ): void => {
//     if (contentType !== 'Image' || !source || (Array.isArray(source) && source.length === 0)) {
//         /**
//          * Nothing to preload
//          */
//         return
//     }
//     if (Array.isArray(source)) {
//         const imageToPreload = source.map((sourceItem: ImageSourcePropType): Source => {
//             if (typeof sourceItem === 'number') {
//                 return {
//                     uri: sourceItem
//                 }
//             }
//         } ({
//             uri: typeof sourceItem === 'number' ? sourceItem : sourceItem.
//         }))
//         FastImage.preload(source);
//     }

// };

export function Preview({ source, style, contentType }: PreviewProps) {
    const [currentSourceItemIndex, setCurrentSourceItemIndex] = React.useState(0);
    React.useEffect(() => {
        const timeout: NodeJS.Timeout = setTimeout(() => {
            if (Array.isArray(source)) {
                const nextIndex =
                    currentSourceItemIndex >= source.length - 1 ? 0 : currentSourceItemIndex + 1;
                setCurrentSourceItemIndex(nextIndex);
            }
        }, UIConstant.uiCollectionCard.timeToShowOneSlide);
        return () => clearTimeout(timeout);
    }, [source, currentSourceItemIndex]);
    if (contentType !== 'Image' || !source || (Array.isArray(source) && source.length === 0)) {
        return null;
    }
    const currentSource: ImageSourcePropType = Array.isArray(source)
        ? source[currentSourceItemIndex]
        : source;
    return (
        <View style={style}>
            <UIImage source={currentSource} style={StyleSheet.absoluteFill} />
        </View>
    );
}
