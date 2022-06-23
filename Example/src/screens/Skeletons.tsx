import * as React from 'react';
import { View } from 'react-native';

import { UISkeleton, UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIBoxButton } from '@tonlabs/uikit.controls';

import { ExampleScreen } from '../components/ExampleScreen';
import { ExampleSection } from '../components/ExampleSection';

const contentBackgroundColor = 'rgba(255,0,0,.1)';

function ContentLayoutDoesNotMatchSkeletonLayout({ isActive }: { isActive: boolean }) {
    if (isActive) {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                }}
            >
                <UISkeleton
                    show
                    style={{
                        width: 100,
                        height: 100,
                        marginRight: 20,
                        borderRadius: UILayoutConstant.alertBorderRadius,
                    }}
                />
                <View style={{ flex: 1 }}>
                    <UISkeleton show style={{ height: 30, borderRadius: 8 }} />
                    <UISkeleton show style={{ marginTop: 10, height: 30, borderRadius: 8 }} />
                    <UISkeleton show style={{ marginTop: 10, height: 30, borderRadius: 8 }} />
                </View>
            </View>
        );
    }
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
            }}
        >
            <View
                style={{
                    backgroundColor: contentBackgroundColor,
                    width: 100,
                    height: 100,
                    marginRight: 20,
                }}
            />
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: contentBackgroundColor, height: 30 }} />
                <View
                    style={{
                        backgroundColor: contentBackgroundColor,
                        height: 30,
                        marginTop: 10,
                    }}
                />
                <View
                    style={{
                        backgroundColor: contentBackgroundColor,
                        height: 30,
                        marginTop: 10,
                    }}
                />
            </View>
        </View>
    );
}

export function SkeletonsScreen() {
    const [isActive, setIsActive] = React.useState(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UISkeleton">
                <View
                    testID="ui-skeleton"
                    style={{
                        maxWidth: 500,
                        width: '100%',
                        alignItems: 'stretch',
                        marginBottom: 50,
                    }}
                >
                    <UISkeleton
                        show={isActive}
                        style={{
                            borderRadius: UILayoutConstant.alertBorderRadius,
                            alignSelf: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: contentBackgroundColor,
                                width: 100,
                                height: 100,
                            }}
                        />
                    </UISkeleton>
                    <UISkeleton show={isActive} style={{ marginTop: 10 }}>
                        <View style={{ backgroundColor: contentBackgroundColor, height: 100 }} />
                    </UISkeleton>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 20 }}>
                        <UISkeleton
                            show={isActive}
                            style={{
                                borderRadius: 50,
                                overflow: 'hidden',
                                marginRight: 20,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: contentBackgroundColor,
                                    width: 100,
                                    height: 100,
                                }}
                            />
                        </UISkeleton>
                        <View style={{ flex: 1, paddingTop: 10 }}>
                            <UISkeleton
                                show={isActive}
                                style={{
                                    borderRadius: UILayoutConstant.alertBorderRadius,
                                    overflow: 'hidden',
                                    marginBottom: 10,
                                }}
                            >
                                <View
                                    style={{
                                        // backgroundColor: contentBackgroundColor,
                                        backgroundColor: 'green',
                                        height: 40,
                                    }}
                                />
                            </UISkeleton>
                            <UISkeleton
                                show={isActive}
                                style={{
                                    borderRadius: UILayoutConstant.alertBorderRadius,
                                    overflow: 'hidden',
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: contentBackgroundColor,
                                        height: 40,
                                    }}
                                />
                            </UISkeleton>
                        </View>
                    </View>

                    {/* <ContentLayoutDoesNotMatchSkeletonLayout isActive={isActive} /> */}
                </View>
                <UIBoxButton title="Toggle skeletons" onPress={() => setIsActive(!isActive)} />
            </ExampleSection>
        </ExampleScreen>
    );
}
