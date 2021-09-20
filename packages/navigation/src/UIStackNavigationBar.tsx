import * as React from 'react';
import { Platform } from 'react-native';
import type Animated from 'react-native-reanimated';

import { NestedInDismissibleModalContext } from './ModalNavigator/createModalNavigator';
import { UINavigationBar, UINavigationBarProps } from './UINavigationBar';
import { UISlideBar } from './UISlideBar';

type PrivateProps = {
    headerTitleOpacity?: Animated.SharedValue<number>;
};

export function UIStackNavigationBar({ ...rest }: UINavigationBarProps & PrivateProps) {
    const isNestedInDismissibleModalContext = React.useContext(NestedInDismissibleModalContext);

    // temporary solution to have default close button for dismissible modals on web
    // @savelichalex will probably remove it in closest navigation releases
    if (isNestedInDismissibleModalContext && Platform.OS !== 'web') {
        return <UISlideBar {...rest} />;
    }

    return <UINavigationBar {...rest} />;
}
