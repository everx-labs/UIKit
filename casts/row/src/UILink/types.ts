import type { ImageSourcePropType } from 'react-native';

export type UILinkProps = {
    title?: string;
    description?: string;
    logo?: ImageSourcePropType;
    onPress?: () => void;
    loading?: boolean;
    testID?: string;
};

export type LogoProps = {
    logo?: ImageSourcePropType;
    loading?: boolean;
};

export type IconProps = {
    source?: ImageSourcePropType;
};
