declare module 'react-native-indicators' {
    import * as React from 'react';
    import type { ColorPropType, StyleProp, ViewStyle } from 'react-native';

    type MaterialIndicatorProps = {
        color: ColorPropType;
        size?: number;
        trackWidth?: number;
        style?: StyleProp<ViewStyle>;
    };

    export class MaterialIndicator extends React.PureComponent<MaterialIndicatorProps> {}
}

// eslint-disable-next-line no-underscore-dangle
declare const _hapticImpact: (inputStyle: 'light' | 'medium' | 'heavy') => void;
// eslint-disable-next-line no-underscore-dangle
declare const _hapticSelection: () => void;
// eslint-disable-next-line no-underscore-dangle
declare const _hapticNotification: (inputType: 'success' | 'warning' | 'error') => void;
