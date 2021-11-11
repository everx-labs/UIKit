import * as React from 'react';
import { View } from 'react-native';

import { UIDetailsTable } from '@tonlabs/uikit.components';

import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Layouts = () => {
    return (
        <ExampleScreen>
            <ExampleSection title="UIDetailsTable">
                <View testID="uiDetailsTable_default" style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIDetailsTable
                        detailsList={[
                            {
                                caption: 'row 1',
                                value: 'value 1',
                            },
                            {
                                caption: 'row 2',
                                value: 'value 2',
                                type: UIDetailsTable.CellType.Success,
                            },
                            {
                                caption: 'row 3',
                                value: 'value 3',
                                type: UIDetailsTable.CellType.Action,
                            },
                            {
                                caption: 'row 4',
                                value: 'value 4',
                                type: UIDetailsTable.CellType.Accent,
                            },
                            {
                                caption: 'row 5',
                                value: '7,900,404 (98.8 %)',
                                type: UIDetailsTable.CellType.NumberPercent,
                            },
                        ]}
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
