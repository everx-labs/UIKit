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
    const [isActive, setIsActive] = React.useState(true);
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

                    <ContentLayoutDoesNotMatchSkeletonLayout isActive={isActive} />
                </View>
                <UIBoxButton title="Toggle skeletons" onPress={() => setIsActive(!isActive)} />
            </ExampleSection>
        </ExampleScreen>
    );
}
