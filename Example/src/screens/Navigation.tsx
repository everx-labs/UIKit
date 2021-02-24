import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View } from 'react-native';

import { ColorVariants, UILabel, useTheme } from '@tonlabs/uikit.hydrogen';
import {
    UIDialogBar,
    UISearchBar,
    UISearchBarButton,
    UISearchController,
    UISlideBar,
} from '@tonlabs/uikit.navigation';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIButton } from '@tonlabs/uikit.components';

export const Navigation = () => {
    const theme = useTheme();

    const [
        isSearchControllerVisible,
        setSearchControllerVisible,
    ] = React.useState(false);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme[ColorVariants.BackgroundSecondary],
            }}
        >
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <View
                    style={{
                        width: '96%',
                        paddingLeft: 40,
                        paddingBottom: 10,
                        marginHorizontal: '2%',
                        marginTop: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(0,0,0,.1)',
                    }}
                >
                    <Text>UISearchBar</Text>
                </View>
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
                <View
                    style={{
                        width: '96%',
                        paddingLeft: 40,
                        paddingBottom: 10,
                        marginHorizontal: '2%',
                        marginTop: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(0,0,0,.1)',
                    }}
                >
                    <Text>UISearchController</Text>
                </View>
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
                <View
                    style={{
                        width: '96%',
                        paddingLeft: 40,
                        paddingBottom: 10,
                        marginHorizontal: '2%',
                        marginTop: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(0,0,0,.1)',
                    }}
                >
                    <Text>UISearchController</Text>
                </View>
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
                <View
                    style={{
                        width: '96%',
                        paddingLeft: 40,
                        paddingBottom: 10,
                        marginHorizontal: '2%',
                        marginTop: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(0,0,0,.1)',
                    }}
                >
                    <Text>UIDialogBar</Text>
                </View>
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
                <View
                    style={{
                        width: '96%',
                        paddingLeft: 40,
                        paddingBottom: 10,
                        marginHorizontal: '2%',
                        marginTop: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(0,0,0,.1)',
                    }}
                >
                    <Text>UISlideBar</Text>
                </View>
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
            </ScrollView>
        </SafeAreaView>
    );
};
