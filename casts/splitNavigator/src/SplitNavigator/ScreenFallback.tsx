import * as React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { ResourceSavingView } from '@react-navigation/elements';

type Props = {
    visible: boolean;
    children: React.ReactNode;
    enabled: boolean;
    style?: StyleProp<ViewStyle>;
};

let Screens: typeof import('react-native-screens') | undefined;

try {
    // eslint-disable-next-line global-require
    Screens = require('react-native-screens');
} catch (e) {
    // Ignore
}

export const MaybeScreenContainer = ({
    enabled,
    ...rest
}: ViewProps & {
    enabled: boolean;
    children: React.ReactNode;
}) => {
    if (Screens?.screensEnabled?.()) {
        return <Screens.ScreenContainer enabled={enabled} {...rest} />;
    }

    return <View {...rest} />;
};

function MaybeNativeScreen({ visible, children, ...rest }: Props) {
    const Screen = React.useContext(
        (Screens as typeof import('react-native-screens')).ScreenContext,
    );

    return (
        <Screen activityState={visible ? 2 : 0} {...rest}>
            {children}
        </Screen>
    );
}

export function MaybeScreen({ visible, children, ...rest }: Props) {
    if (Screens?.screensEnabled?.()) {
        return (
            <MaybeNativeScreen visible={visible} {...rest}>
                {children}
            </MaybeNativeScreen>
        );
    }

    return (
        <ResourceSavingView visible={visible} {...rest}>
            {children}
        </ResourceSavingView>
    );
}
