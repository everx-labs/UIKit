import * as React from 'react';
import { View, ColorValue } from 'react-native';

import { ColorVariants, UIBoxButton, UILabel } from '@tonlabs/uikit.hydrogen';
import {
    UIDialogBar,
    UIPagerView,
    UISearchBar,
    UISearchBarButton,
    UISearchController,
    UISlideBar,
} from '@tonlabs/uikit.navigation';
import { UIAssets } from '@tonlabs/uikit.assets';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const component = (color: ColorValue) => (): React.ReactElement<View> =>
    (
        <View
            style={{
                flex: 1,
                backgroundColor: color,
            }}
        />
    );

export const Navigation = () => {
    const [isSearchControllerVisible, setSearchControllerVisible] = React.useState(false);
    const [isSearchBarVisible, setSearchBarVisible] = React.useState(false);

    return (
        <ExampleScreen color={ColorVariants.BackgroundSecondary}>
            <ExampleSection title="UIPagerView">
                <View style={{ height: 20 }} />
                <UILabel>type = Scrollable</UILabel>
                <View
                    testID="UIPagerView"
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        height: 500,
                    }}
                >
                    <UIPagerView.Container
                        type="Scrollable"
                        initialPageIndex={0}
                        onPageIndexChange={(newPageIndex: number) => newPageIndex}
                        testID="UIPagerView"
                    >
                        <>
                            <UIPagerView.Page
                                id="Item 1"
                                title="Item 1"
                                component={component('red')}
                            />
                            <UIPagerView.Page
                                id="Item 2"
                                title="Item 2"
                                component={component('green')}
                            />
                        </>
                        <UIPagerView.Page
                            id="Item 3"
                            title="Item 3"
                            component={component('blue')}
                        />
                        <UIPagerView.Page
                            id="Item 4"
                            title="Destructive"
                            component={component('yellow')}
                            isDestructive
                        />
                        <UIPagerView.Page
                            id="Item 5"
                            title="Long title of item is displayed in its entirety"
                            component={component('gray')}
                        />
                        <UIPagerView.Page id="Item 6" title="I6" component={component('black')} />
                        <UIPagerView.Page
                            id="Item 7"
                            title="Item 7"
                            component={component('white')}
                        />
                        <UIPagerView.Page
                            id="Item 8"
                            title="Item 8"
                            component={component('lightblue')}
                        />
                        <UIPagerView.Page
                            id="Item 9"
                            title="Item 9"
                            component={component('pink')}
                        />
                    </UIPagerView.Container>
                </View>
                <View style={{ height: 20 }} />
                <UILabel>type = Fixed</UILabel>
                <View
                    testID="UIPagerView"
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        height: 500,
                    }}
                >
                    <UIPagerView.Container
                        type="Fixed"
                        initialPageIndex={0}
                        onPageIndexChange={(newPageIndex: number) => newPageIndex}
                        testID="UIPagerView"
                    >
                        <UIPagerView.Page
                            id="Item 1"
                            title="Item 1"
                            component={component('green')}
                        />
                        <UIPagerView.Page
                            id="Item 2"
                            title="Long title of item is displayed in its entirety"
                            component={component('blue')}
                        />
                    </UIPagerView.Container>
                </View>

                <View style={{ height: 20 }} />
                <UILabel>type = FixedPadded</UILabel>
                <View
                    testID="UIPagerView"
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        height: 500,
                    }}
                >
                    <UIPagerView.Container
                        type="FixedPadded"
                        initialPageIndex={0}
                        onPageIndexChange={(newPageIndex: number) => newPageIndex}
                        testID="UIPagerView"
                    >
                        <UIPagerView.Page
                            id="Item 1"
                            title="Item 1"
                            component={component('green')}
                        />
                        <UIPagerView.Page
                            id="Item 2"
                            title="Long title of item is displayed in its entirety"
                            component={component('blue')}
                        />
                    </UIPagerView.Container>
                </View>
                <View style={{ height: 20 }} />
            </ExampleSection>
            <ExampleSection title="UISearchBar">
                <View
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        paddingVertical: 20,
                    }}
                >
                    <UISearchBar testID="UISearchBar_default" />
                    <View style={{ height: 20 }} />
                    <UISearchBar
                        headerRightLabel="Action"
                        testID="UISearchBar_with_action_button"
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UISearchController">
                <View
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        paddingVertical: 20,
                    }}
                >
                    <UIBoxButton
                        testID="UISearchController_open_button"
                        title="Open search controller"
                        onPress={() => setSearchControllerVisible(!isSearchControllerVisible)}
                    />
                    <UISearchController
                        visible={isSearchControllerVisible}
                        onCancel={() => setSearchControllerVisible(false)}
                    >
                        {(searchText: string) => (
                            <View>
                                <UILabel>{searchText}</UILabel>
                            </View>
                        )}
                    </UISearchController>
                </View>
            </ExampleSection>
            <ExampleSection title="UISearchBarButton">
                <View
                    testID="UISearchBarButton_open_button"
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        paddingVertical: 20,
                    }}
                >
                    <UISearchBarButton
                        visible={isSearchBarVisible}
                        onOpen={() => {
                            setSearchBarVisible(true);
                        }}
                        onClose={() => {
                            setSearchBarVisible(false);
                        }}
                    >
                        {(searchText: string) => (
                            <View>
                                <UILabel>{searchText}</UILabel>
                            </View>
                        )}
                    </UISearchBarButton>
                </View>
                <View style={{ height: 20 }} />
            </ExampleSection>
            <ExampleSection title="UIDialogBar">
                <View
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        paddingVertical: 20,
                    }}
                >
                    <UIDialogBar testID="UIDialogBar_default" />
                    <View style={{ height: 20 }} />
                    <UIDialogBar
                        testID="UIDialogBar_with_action_buttons"
                        headerLeftItems={[
                            {
                                label: 'Action1',
                            },
                            {
                                label: 'Action2',
                            },
                            {
                                label: 'Action3',
                            },
                            {
                                label: 'Action4',
                            },
                        ]}
                        headerRightItems={[
                            {
                                label: 'Action1',
                            },
                            {
                                label: 'Action2',
                            },
                            {
                                label: 'Action3',
                            },
                            {
                                label: 'Action4',
                            },
                        ]}
                    />
                    <View style={{ height: 20 }} />
                    <UIDialogBar
                        testID="UIDialogBar_with_icons"
                        headerLeftItems={[
                            {
                                icon: {
                                    source: UIAssets.icons.ui.camera,
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                            {
                                icon: {
                                    source: UIAssets.icons.ui.cloudBlack,
                                    style: {
                                        width: 25,
                                    },
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                            {
                                icon: {
                                    source: UIAssets.icons.ui.glass,
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                            {
                                icon: {
                                    source: UIAssets.icons.ui.triangle,
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                        ]}
                        headerRightItems={[
                            {
                                icon: {
                                    source: UIAssets.icons.ui.camera,
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                            {
                                icon: {
                                    source: UIAssets.icons.ui.cloudBlack,
                                    style: {
                                        width: 25,
                                    },
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                            {
                                icon: {
                                    source: UIAssets.icons.ui.glass,
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                            {
                                icon: {
                                    source: UIAssets.icons.ui.triangle,
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                        ]}
                    />
                    <View style={{ height: 20 }} />
                    <UIDialogBar
                        testID="UIDialogBar_without_slider"
                        headerLeftItems={[
                            {
                                label: 'Action1',
                            },
                            {
                                label: 'Action2',
                            },
                            {
                                label: 'Action3',
                            },
                            {
                                label: 'Action4',
                            },
                        ]}
                        headerRightItems={[
                            {
                                label: 'Action1',
                            },
                            {
                                label: 'Action2',
                            },
                            {
                                label: 'Action3',
                            },
                            {
                                label: 'Action4',
                            },
                        ]}
                        hasPuller={false}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UISlideBar">
                <View
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        paddingVertical: 20,
                    }}
                >
                    <UISlideBar testID="UISlideBar_default" />
                    <View style={{ height: 20 }} />
                    <UISlideBar
                        testID="UISlideBar_with_action_buttons"
                        headerLeftItems={[
                            {
                                label: 'Action1',
                            },
                            {
                                label: 'Action2',
                            },
                            {
                                label: 'Action3',
                            },
                            {
                                label: 'Action4',
                            },
                        ]}
                        headerRightItems={[
                            {
                                label: 'Action1',
                            },
                            {
                                label: 'Action2',
                            },
                            {
                                label: 'Action3',
                            },
                            {
                                label: 'Action4',
                            },
                        ]}
                    />
                    <View style={{ height: 20 }} />
                    <UISlideBar
                        testID="UISlideBar_with_icons"
                        headerLeftItems={[
                            {
                                icon: {
                                    source: UIAssets.icons.ui.camera,
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                            {
                                icon: {
                                    source: UIAssets.icons.ui.cloudBlack,
                                    style: {
                                        width: 25,
                                    },
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                            {
                                icon: {
                                    source: UIAssets.icons.ui.glass,
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                            {
                                icon: {
                                    source: UIAssets.icons.ui.triangle,
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                        ]}
                        headerRightItems={[
                            {
                                icon: {
                                    source: UIAssets.icons.ui.camera,
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                            {
                                icon: {
                                    source: UIAssets.icons.ui.cloudBlack,
                                    style: {
                                        width: 25,
                                    },
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                            {
                                icon: {
                                    source: UIAssets.icons.ui.glass,
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                            {
                                icon: {
                                    source: UIAssets.icons.ui.triangle,
                                },
                                iconTintColor: ColorVariants.IconSecondary,
                            },
                        ]}
                    />
                    <View style={{ height: 20 }} />
                    <UISlideBar
                        testID="UISlideBar_without_slider"
                        headerLeftItems={[
                            {
                                label: 'Action1',
                            },
                            {
                                label: 'Action2',
                            },
                            {
                                label: 'Action3',
                            },
                            {
                                label: 'Action4',
                            },
                        ]}
                        headerRightItems={[
                            {
                                label: 'Action1',
                            },
                            {
                                label: 'Action2',
                            },
                            {
                                label: 'Action3',
                            },
                            {
                                label: 'Action4',
                            },
                        ]}
                        hasPuller={false}
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
