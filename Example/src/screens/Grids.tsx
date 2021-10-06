import * as React from 'react';
import { View } from 'react-native';

import { UIGridList } from '@tonlabs/uikit.navigation';
import { ColorVariants, TypographyVariants, UILabel, useTheme } from '@tonlabs/uikit.hydrogen';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ExampleSection } from '../components/ExampleSection';

export const Grids = () => {
    const theme = useTheme();

    const renderItem = ({ item }: any) => {
        return (
            <View
                style={{
                    backgroundColor: theme[ColorVariants.BackgroundSecondary],
                    flex: 1,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <UILabel role={TypographyVariants.TitleLarge}>{item}</UILabel>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme[ColorVariants.BackgroundPrimary] }}>
            <ExampleSection title="UIGridView">
                <View
                    style={{
                        flex: 1,
                        maxWidth: 500,
                        margin: 8,
                    }}
                >
                    <UIGridList
                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                        renderItem={renderItem}
                    />
                </View>
            </ExampleSection>
        </SafeAreaView>
    );
};
