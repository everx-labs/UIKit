import type { ImageProps } from 'react-native';
import type { ColorVariants } from '@tonlabs/uikit.themes';

export type UIImageProps = ImageProps & {
    /**
     * Native:
     * tintColor for some reason don't work properly with
     * react-native-fast-image, hence passing this prop
     * we force to use default <Image /> from RN
     *
     * Web:
     * tintColor in some cases don't work on Safary with RNImage.
     * Here is the issue: https://github.com/necolas/react-native-web/issues/1914
     * Hence passing this prop we force to use canvas
     */
    tintColor?: ColorVariants | null;
};
