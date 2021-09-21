import * as React from 'react';
import { View } from 'react-native';

import { UILabel } from '@tonlabs/uikit.hydrogen';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { useRoute } from '@react-navigation/core';
import { SectionsService } from '../Search';

export function ExampleSection({ title, children }: { title: string; children: React.ReactNode }) {
    const theme = useTheme();
    const route = useRoute();

    React.useEffect(() => {
        SectionsService.shared.registerCommand({ title, routeKey: route.key });
    }, [title, route]);

    return (
        <>
            <View
                style={{
                    width: '96%',
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: '2%',
                    marginTop: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: theme[ColorVariants.LineNeutral],
                }}
            >
                <UILabel>{title}</UILabel>
            </View>
            {children}
        </>
    );
}
