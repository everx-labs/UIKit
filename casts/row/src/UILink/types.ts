import type { ImageSourcePropType } from 'react-native';

export type UILinkProps = {
    title?: string;
    description?: string;
    logoSource?: ImageSourcePropType;
    iconAfterTitleSource?: ImageSourcePropType;
    onPress?: () => void;
    loading?: boolean;
    testID?: string;
};

export type LogoProps = {
    logoSource?: ImageSourcePropType;
};

export type IconProps = {
    source?: ImageSourcePropType;
};
