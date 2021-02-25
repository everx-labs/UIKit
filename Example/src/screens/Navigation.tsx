import * as React from 'react';
import { View } from 'react-native';

import { ColorVariants, UILabel } from '@tonlabs/uikit.hydrogen';
import {
    UIDialogBar,
    UISearchBar,
    UISearchBarButton,
    UISearchController,
    UISlideBar,
} from '@tonlabs/uikit.navigation';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIButton } from '@tonlabs/uikit.components';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Navigation = () => {
    const [
        isSearchControllerVisible,
        setSearchControllerVisible,
    ] = React.useState(false);

    return (
        <ExampleScreen color={ColorVariants.BackgroundSecondary}>
            <ExampleSection title="UISearchBar">
                <View
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        paddingVertical: 20,
                    }}
                >
                    <UISearchBar />
                    <View style={{ height: 20 }} />
                    <UISearchBar headerRightLabel="Action" />
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
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        paddingVertical: 20,
                    }}
                >
                    <UISearchBarButton>
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
                    <UIDialogBar />
                    <View style={{ height: 20 }} />
                    <UIDialogBar
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
                    <UISlideBar />
                    <View style={{ height: 20 }} />
                    <UISlideBar
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
