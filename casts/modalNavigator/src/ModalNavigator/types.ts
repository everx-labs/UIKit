import type {
    DefaultRouterOptions,
    Descriptor,
    EventMapBase,
    NavigationProp,
    ParamListBase,
    RouteProp,
} from '@react-navigation/native';

import { UIModalSheetProps } from '@tonlabs/uikit.popups';

import type { ModalActionHelpers, ModalNavigationRoute, ModalNavigationState } from './ModalRouter';

export type ModalScreenOptions = {
    /**
     * Callback that is called when the user close the modal.
     */
    onClose?: UIModalSheetProps['onClose'];
};
export type ModalDescriptor = Descriptor<
    Record<string, any>,
    string,
    ModalNavigationState,
    ModalScreenOptions,
    EventMapBase
>;

export type ModalNavigatorProps = {
    children?: React.ReactNode;
    maxMobileWidth: number;
    screenOptions?: ModalScreenOptions;
};

export type ModalNavigatorScreenProps<ParamList extends ParamListBase = ParamListBase> = {
    route: ModalNavigationRoute<ParamList, keyof ParamList>;
    descriptor: ModalDescriptor;
    maxMobileWidth: number;
};

type ModalRouterCustomOptions = {
    childrenForConfigs: React.ReactNode;
};
export type ModalRouterOptions<ParamList extends ParamListBase = ParamListBase> =
    DefaultRouterOptions<Extract<keyof ParamList, string>> & ModalRouterCustomOptions;

export type ModalNavigationProp<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string,
> = NavigationProp<ParamList, RouteName, ModalNavigationState<ParamList>, ModalScreenOptions> &
    ModalActionHelpers;

export type ModalScreenProps<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string,
> = {
    navigation: ModalNavigationProp<ParamList, RouteName>;
    route: RouteProp<ParamList, RouteName>;
};
