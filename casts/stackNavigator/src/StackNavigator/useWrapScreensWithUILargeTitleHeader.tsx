import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContext, NavigationState } from '@react-navigation/native';
import type { Descriptor, StackNavigationState, ParamListBase } from '@react-navigation/native';

import { UIBackgroundView, ColorVariants } from '@tonlabs/uikit.themes';
import { PortalManager } from '@tonlabs/uikit.layout';
import { UILargeTitleHeader, UIStackNavigationBar } from '@tonlabs/uicast.bars';

import { useStackTopInsetStyle } from './useStackTopInsetStyle';
import type { StackNavigationOptions } from './types';

export type StackDescriptor = Descriptor<
    // eslint-disable-next-line @typescript-eslint/ban-types
    Record<string, object | undefined>,
    string,
    StackNavigationState<ParamListBase>,
    StackNavigationOptions,
    // eslint-disable-next-line @typescript-eslint/ban-types
    {}
>;

type StackLikeDescriptor<
    Options extends StackNavigationOptions = StackNavigationOptions,
    NavState extends NavigationState<ParamListBase> = NavigationState<ParamListBase>,
> = Descriptor<
    // eslint-disable-next-line @typescript-eslint/ban-types
    Record<string, object | undefined>,
    string,
    NavState,
    // eslint-disable-next-line @typescript-eslint/ban-types
    Options,
    // eslint-disable-next-line @typescript-eslint/ban-types
    {}
>;

export type StackLikeDescriptors<
    Options extends StackNavigationOptions = StackNavigationOptions,
    NavState extends NavigationState<ParamListBase> = NavigationState<ParamListBase>,
> = Record<string, StackLikeDescriptor<Options, NavState>>;

function ScreenWithHeaderContent({
    descriptor,
    hasTopInset,
    children,
}: {
    descriptor: StackLikeDescriptor;
    hasTopInset: boolean;
    children: React.ReactNode;
}) {
    const topInsetStyle = useStackTopInsetStyle(hasTopInset);

    if (descriptor.options.headerVisible === false) {
        return (
            <UIBackgroundView
                color={descriptor.options.backgroundColor || ColorVariants.BackgroundPrimary}
                style={styles.screenContainer}
            >
                <PortalManager id="scene">{children}</PortalManager>
            </UIBackgroundView>
        );
    }

    return (
        <UIBackgroundView
            color={descriptor.options.backgroundColor || ColorVariants.BackgroundPrimary}
            style={[styles.screenContainer, topInsetStyle]}
        >
            {descriptor.options.useHeaderLargeTitle ? (
                <PortalManager id="scene">
                    <UILargeTitleHeader
                        testID={descriptor.options.testID}
                        title={descriptor.options.title}
                        titleTestID={descriptor.options.titleTestID}
                        headerLargeTitle={descriptor.options.headerLargeTitle}
                        caption={descriptor.options.caption}
                        captionTestID={descriptor.options.captionTestID}
                        onTitlePress={descriptor.options.onTitlePress}
                        onHeaderLargeTitlePress={descriptor.options.onHeaderLargeTitlePress}
                        label={descriptor.options.label}
                        labelTestID={descriptor.options.labelTestID}
                        note={descriptor.options.note}
                        noteTestID={descriptor.options.noteTestID}
                        renderAboveContent={descriptor.options.renderAboveContent}
                        renderBelowContent={descriptor.options.renderBelowContent}
                        headerLeft={descriptor.options.headerLeft}
                        headerLeftItems={descriptor.options.headerLeftItems}
                        headerBackButton={descriptor.options.headerBackButton}
                        headerRight={descriptor.options.headerRight}
                        headerRightItems={descriptor.options.headerRightItems}
                    >
                        {children}
                    </UILargeTitleHeader>
                </PortalManager>
            ) : (
                <PortalManager id="scene">
                    <UIStackNavigationBar
                        testID={descriptor.options.testID}
                        title={descriptor.options.title}
                        titleTestID={descriptor.options.titleTestID}
                        caption={descriptor.options.caption}
                        captionTestID={descriptor.options.captionTestID}
                        onTitlePress={descriptor.options.onTitlePress}
                        headerLeft={descriptor.options.headerLeft}
                        headerLeftItems={descriptor.options.headerLeftItems}
                        headerBackButton={descriptor.options.headerBackButton}
                        headerRight={descriptor.options.headerRight}
                        headerRightItems={descriptor.options.headerRightItems}
                    />
                    {children}
                </PortalManager>
            )}
        </UIBackgroundView>
    );
}

export function useWrapScreensWithUILargeTitleHeader<
    Options extends StackNavigationOptions = StackNavigationOptions,
    NavState extends NavigationState<ParamListBase> = NavigationState<ParamListBase>,
>(
    descriptors: StackLikeDescriptors<Options, NavState>,
    hasTopInset: boolean = true,
): StackLikeDescriptors<Options, NavState> {
    return React.useMemo(
        () =>
            Object.keys(descriptors).reduce<StackLikeDescriptors<Options, NavState>>((acc, key) => {
                const descriptor = descriptors[key];
                acc[key] = {
                    ...descriptor,
                    render: () => {
                        return (
                            <NavigationContext.Provider value={descriptor.navigation}>
                                <ScreenWithHeaderContent
                                    descriptor={descriptor}
                                    hasTopInset={hasTopInset}
                                >
                                    {descriptor.render()}
                                </ScreenWithHeaderContent>
                            </NavigationContext.Provider>
                        );
                    },
                };
                return acc;
            }, {}),
        [descriptors, hasTopInset],
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
});
