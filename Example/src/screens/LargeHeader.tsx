import * as React from 'react';
import { View } from 'react-native';

import { UILargeTitleHeader, ScrollView } from '@tonlabs/uikit.navigation';

export function LargeHeaderScreen() {
    return (
        <UILargeTitleHeader
            title="Long title"
            headerRightItems={[{ label: 'Action' }]}
        >
            <ScrollView>
                {new Array(9)
                    .fill(null)
                    .map((_el, i) => (i + 1) / 10)
                    // .reverse()
                    .map((opacity) => (
                        <View
                            key={opacity}
                            style={{
                                height: 100,
                                backgroundColor: `rgba(255,0,0,${opacity})`,
                            }}
                        />
                    ))}
            </ScrollView>
        </UILargeTitleHeader>
    );
}
