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
