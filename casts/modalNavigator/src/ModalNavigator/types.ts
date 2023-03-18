import type {
    DefaultRouterOptions,
    Descriptor,
    NavigationProp,
    ParamListBase,
    RouteProp,
} from '@react-navigation/native';

import type { UIModalSheetProps } from '@tonlabs/uikit.popups';
import type { ColorVariants } from '@tonlabs/uikit.themes';

import type { ModalActionHelpers, ModalNavigationRoute, ModalNavigationState } from './ModalRouter';

export type ModalScreenOptions = {
    /**
     * Callback that is called when the user close the modal.
     */
    onClose?: UIModalSheetProps['onClose'];
    /**
     * Whether to show header or not
     *
     * Defaults to false
     */
    headerVisible?: boolean;
    /**
     * Background color for the whole screen
     */
    backgroundColor?: ColorVariants;
};
export type ModalDescriptor<ParamList extends ParamListBase = ParamListBase> = Descriptor<
    ParamList,
    keyof ParamList,
    ModalNavigationState,
    ModalScreenOptions,
    // eslint-disable-next-line @typescript-eslint/ban-types
    {}
>;

export type ModalNavigatorProps = {
    children?: React.ReactNode;
    maxMobileWidth: number;
    screenOptions?: ModalScreenOptions;
};

export type ModalNavigatorScreenProps<ParamList extends ParamListBase = ParamListBase> = {
    route: ModalNavigationRoute<ParamList, keyof ParamList>;
    descriptor: ModalDescriptor<ParamList>;
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
> = NavigationProp<
    ParamList,
    RouteName,
    ModalNavigationState<ParamList>,
    /* TODO add ModalScreenOptions and resolve TS errors */ any
> &
    ModalActionHelpers;

export type ModalScreenProps<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string,
> = {
    navigation: ModalNavigationProp<ParamList, RouteName>;
    route: RouteProp<ParamList, RouteName>;
};
