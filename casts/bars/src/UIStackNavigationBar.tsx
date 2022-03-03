import * as React from 'react';
import { Platform } from 'react-native';
import type Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/core';

import { UISlideBar } from './UISlideBar';
import { UINavigationBar, UINavigationBarProps } from './UINavigationBar';

type PrivateProps = {
    headerTitleOpacity?: Animated.SharedValue<number>;
};

export function UIStackNavigationBar({ ...rest }: UINavigationBarProps & PrivateProps) {
    let navigation: ReturnType<typeof useNavigation> | null = null;

    // If it's used not in a navigation context
    // it might throw an error, to prevent a crash trying to catch it
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        navigation = useNavigation();
    } catch (err) {
        // no-op
    }

    // temporary solution to have default close button for dismissible modals on web
    // @savelichalex will probably remove it in closest navigation releases
    if (Platform.OS !== 'web' && navigation != null && 'hide' in navigation) {
        return <UISlideBar {...rest} />;
    }

    return <UINavigationBar {...rest} />;
}
