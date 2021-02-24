import * as React from 'react';
import { View } from 'react-native';

import { UILabel, useTheme, ColorVariants } from '@tonlabs/uikit.hydrogen';

export function ExampleSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const theme = useTheme();

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
