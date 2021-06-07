import * as React from 'react';
import type Animated from 'react-native-reanimated';

import { NestedInDismissibleModalContext } from './ModalNavigator/createModalNavigator';
import { UINavigationBar, UINavigationBarProps } from './UINavigationBar';
import { UISlideBar } from './UISlideBar';

type PrivateProps = {
    headerTitleOpacity?: Animated.SharedValue<number>;
};

export function UIStackNavigationBar(
    props: UINavigationBarProps & PrivateProps,
) {
    const isNestedInDismissibleModalContext = React.useContext(
        NestedInDismissibleModalContext,
    );

    if (isNestedInDismissibleModalContext) {
        return <UISlideBar {...props} />;
    }

    return <UINavigationBar {...props} />;
}
