/* eslint-disable react/no-multi-comp */
import * as React from 'react';
import { Keyboard } from 'react-native';
import {
    NavigationHelpersContext,
    useNavigationBuilder,
    createNavigatorFactory,
} from '@react-navigation/native';
import type {
    Descriptor,
    RouteProp,
    NavigationProp,
    ParamListBase,
    EventMapBase,
} from '@react-navigation/native';

import { ModalRouter, ModalActions } from './ModalRouter';
import type { ModalNavigationState } from './ModalRouter';

type ModalControllerProps = {
    state: ModalNavigationState;
    descriptors: { [key: string]: Descriptor<ParamListBase> };
    navigation: NavigationProp<ParamListBase>;
};

export const NestedInModalContext = React.createContext<(() => void) | null>(
    null,
);

export const NestedInDismissibleModalContext = React.createContext<boolean>(
    false,
);

export class ModalController extends React.Component<ModalControllerProps> {
    static show(name: string, params?: Record<string, unknown>) {
        if (ModalController.instance) {
            ModalController.instance.show(name, params);
        }
    }

    static hide(name: string) {
        if (ModalController.instance) {
            ModalController.instance.hide(name);
        }
    }

    static hideAll() {
        if (ModalController.instance) {
            ModalController.instance.hideAll();
        }
    }

    componentDidMount() {
        ModalController.instance = this;
    }

    componentWillUnmount() {
        ModalController.instance = null;
    }

    static instance: ModalController | null = null;

    show(name: string, params?: Record<string, unknown>) {
        Keyboard.dismiss();
        this.props.navigation.dispatch(ModalActions.show(name, params));
    }

    hide(name: string) {
        Keyboard.dismiss();
        this.props.navigation.dispatch(ModalActions.hide(name));
    }

    hideAll() {
        Keyboard.dismiss();
        this.props.navigation.dispatch(ModalActions.hideAll());
    }

    render() {
        return this.props.state.routes.map<React.ReactNode>((route) => {
            const descriptor = this.props.descriptors[route.key];

            if (descriptor == null) {
                return null;
            }

            return (
                <NestedInModalContext.Provider
                    value={() => this.hide(route.name)}
                >
                    {descriptor.render()}
                </NestedInModalContext.Provider>
            );
        });
    }
}

type ModalSceneInstance = {
    show: <Params = { [key: string]: any }>(
        params: Params,
    ) => void | Promise<void>;
    hide: () => void;
};

type ModalSceneWrapperProps<
    ParamList extends ParamListBase = { params: { visible: boolean } }
> = {
    ref: React.Ref<ModalSceneInstance>;
    navigation: NavigationProp<ParamList>;
    route: RouteProp<ParamList, keyof ParamList>;
};

type ModalSceneWrapperState = {
    visible: boolean;
    needToHide: boolean;
    needToShow: boolean;
};

export const withModalSceneWrapper = (
    WrappedComponent: React.ComponentType<ModalSceneWrapperProps>,
) => {
    return class ModalSceneWrapper extends React.Component<
        ModalSceneWrapperProps,
        ModalSceneWrapperState
    > {
        static getDerivedStateFromProps(
            props: ModalSceneWrapperProps,
            state: ModalSceneWrapperState,
        ) {
            const { visible } = props.route?.params || {};
            if (state.visible && !visible) {
                return {
                    needToShow: false,
                    needToHide: true,
                    visible: false,
                };
            }
            if (!state.visible && visible) {
                return {
                    needToHide: false,
                    needToShow: true,
                    visible: true,
                };
            }
            return {
                ...state,
                needToHide: false,
                needToShow: false,
            };
        }

        state = {
            visible: false,
            needToHide: false,
            needToShow: false,
        };

        componentDidMount() {
            if (this.state.needToShow && this.ref.current) {
                this.ref.current.show(this.props.route.params);
            }
            if (this.state.needToHide && this.ref.current) {
                this.ref.current.hide();
            }
        }

        componentDidUpdate() {
            if (this.state.needToShow && this.ref.current) {
                this.ref.current.show(this.props.route.params);
            }
            if (this.state.needToHide && this.ref.current) {
                this.ref.current.hide();
            }
        }

        ref = React.createRef<ModalSceneInstance>();

        render() {
            return (
                <WrappedComponent
                    ref={this.ref}
                    navigation={this.props.navigation}
                    route={this.props.route}
                />
            );
        }
    };
};

const ModalNavigator = ({ children }: { children: React.ReactNode }) => {
    const { state, navigation, descriptors } = useNavigationBuilder(
        ModalRouter,
        {
            children,
            childrenForConfigs: children,
        },
    );

    return (
        <NavigationHelpersContext.Provider value={navigation}>
            <ModalController
                descriptors={descriptors}
                state={state}
                navigation={navigation}
            >
                {children}
            </ModalController>
        </NavigationHelpersContext.Provider>
    );
};

type ModalScreenOptions = {
    defaultProps: Record<string, unknown>;
};

export const createModalNavigator = createNavigatorFactory<
    ModalNavigationState,
    ModalScreenOptions,
    EventMapBase,
    any
>(ModalNavigator);
