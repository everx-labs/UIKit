import * as React from 'react';
import { View } from 'react-native';

import { ColorVariants, UILabel } from '@tonlabs/uikit.hydrogen';
import {
    UIDialogBar,
    UIPagerView,
    UISearchBar,
    UISearchBarButton,
    UISearchController,
    UISlideBar,
} from '@tonlabs/uikit.navigation';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIButton } from '@tonlabs/uikit.components';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const component = (): React.ReactElement<View> => (
    <View
        style={{
            flex: 1,
            backgroundColor: `#${(Math.random() * 999999).toFixed()}`,
        }}
    />
);

export const Navigation = () => {
    const [
        isSearchControllerVisible,
        setSearchControllerVisible,
    ] = React.useState(false);
    const [isSearchBarVisible, setSearchBarVisible] = React.useState(false);

    return (
        <ExampleScreen color={ColorVariants.BackgroundSecondary}>
            <ExampleSection title="UIPagerView">
                <View
                    testID="UIPagerView"
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        height: 500,
                        paddingVertical: 20,
                        alignItems: 'center',
                    }}
                >
                    <UILabel>type = Left</UILabel>
                    <UIPagerView.Container
                        type="Left"
                        initialPageIndex={0}
                        onPageIndexChange={(newPageIndex: number) =>
                            newPageIndex
                        }
                        testID="UIPagerView"
                    >
                        <UIPagerView.Page
                            title="Item 1"
                            component={component}
                        />
                        <UIPagerView.Page
                            title="Item 2"
                            component={component}
                        />
                        <UIPagerView.Page
                            title="Item 3"
                            component={component}
                        />
                        <UIPagerView.Page
                            title="Long title of item is displayed in its entirety 4"
                            component={component}
                        />
                        <UIPagerView.Page
                            title="Item 5"
                            component={component}
                        />
                        <UIPagerView.Page title="I6" component={component} />
                        <UIPagerView.Page
                            title="Item 7"
                            component={component}
                        />
                        <UIPagerView.Page
                            title="Item 8"
                            component={component}
                        />
                        <UIPagerView.Page
                            title="Item 9"
                            component={component}
                        />
                    </UIPagerView.Container>
                </View>
                <View style={{ height: 20 }} />
                <View
                    testID="UIPagerView"
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        height: 500,
                        paddingVertical: 20,
                        alignItems: 'center',
                    }}
                >
                    <UILabel>type = Center</UILabel>
                    <UIPagerView.Container
                        type="Center"
                        initialPageIndex={0}
                        onPageIndexChange={(newPageIndex: number) =>
                            newPageIndex
                        }
                        testID="UIPagerView"
                    >
                        <UIPagerView.Page title="Item3" component={component} />
                        <UIPagerView.Page title="Item4" component={component} />
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
                    <UIButton
                        testID="UISearchController_open_button"
                        onPress={() =>
                            setSearchControllerVisible(
                                !isSearchControllerVisible,
                            )
                        }
                        title="Open search controller"
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
