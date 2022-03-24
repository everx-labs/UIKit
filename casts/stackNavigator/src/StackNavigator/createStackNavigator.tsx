import * as React from 'react';
import { Platform } from 'react-native';
import {
    useNavigationBuilder,
    createNavigatorFactory,
    StackRouter,
    StackRouterOptions,
    StackActionHelpers,
    StackActions,
    EventArg,
} from '@react-navigation/native';
import type { StackNavigationState, ParamListBase } from '@react-navigation/native';
import { screensEnabled } from 'react-native-screens';
import { StackView, TransitionPresets } from '@react-navigation/stack';
import { NativeStackView } from 'react-native-screens/native-stack';
import type { StackNavigationEventMap } from '@react-navigation/stack/lib/typescript/src/types';

import {
    filterDescriptorOptionsForOriginalImplementation,
    useWrapScreensWithUILargeTitleHeader,
} from './useWrapScreensWithUILargeTitleHeader';
import type { StackNavigationOptions } from './types';

type SurfSplitNavigatorProps = {
    children?: React.ReactNode;
    initialRouteName: string;
    screenOptions: StackRouterOptions;
};

export const StackNavigator = ({
    children,
    initialRouteName,
    screenOptions,
}: SurfSplitNavigatorProps) => {
    const doesSupportNative = Platform.OS !== 'web' && screensEnabled?.();

    const {
        state,
        navigation,
        descriptors: rawDescriptors,
    } = useNavigationBuilder<
        StackNavigationState<ParamListBase>,
        StackRouterOptions,
        StackActionHelpers<ParamListBase>,
        StackNavigationOptions,
        StackNavigationEventMap
    >(StackRouter, {
        children,
        initialRouteName,
        screenOptions: {
            ...screenOptions,
            // @ts-ignore
            headerShown: false,
            ...(doesSupportNative
                ? Platform.select({
                      android: {
                          stackAnimation: 'slide_from_right',
                      },
                      default: null,
                  })
                : {
                      ...TransitionPresets.SlideFromRightIOS,
                      animationEnabled: true,
                  }),
        },
    });

    React.useEffect(
        () =>
            navigation.addListener?.('tabPress', e => {
                const isFocused = navigation.isFocused();

                // Run the operation in the next frame so we're sure all listeners have been run
                // This is necessary to know if preventDefault() has been called
                requestAnimationFrame(() => {
                    if (
                        state.index > 0 &&
                        isFocused &&
                        !(e as EventArg<'tabPress', true>).defaultPrevented
                    ) {
                        // When user taps on already focused tab and we're inside the tab,
                        // reset the stack to replicate native behaviour
                        navigation.dispatch({
                            ...StackActions.popToTop(),
                            target: state.key,
                        });
                    }
                });
            }),
        [navigation, state.index, state.key],
    );

    const descriptors = useWrapScreensWithUILargeTitleHeader(rawDescriptors);

    if (doesSupportNative) {
        // TODO: check, maybe we don't need it anymore
        const descriptorsFiltered = filterDescriptorOptionsForOriginalImplementation(descriptors);
        return (
            <NativeStackView
                state={state}
                navigation={navigation}
                descriptors={descriptorsFiltered}
            />
        );
    }

    return (
        <StackView
            headerMode="none"
            state={state}
            navigation={navigation}
            // @ts-ignore `title` types are incompatible
            descriptors={descriptors}
        />
    );
};

export const createStackNavigator = createNavigatorFactory(StackNavigator);
