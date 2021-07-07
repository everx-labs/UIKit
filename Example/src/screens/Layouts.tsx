import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIDetailsTable, UIGrid, UIGridColumn } from '@tonlabs/uikit.components';
import { ColorVariants, UIBoxButton, useTheme } from '@tonlabs/uikit.hydrogen';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Layouts = () => {
    const theme = useTheme();
    return (
        <ExampleScreen>
            <ExampleSection title="UIDetailsTable">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIDetailsTable
                        testID="uiDetailsTable_default"
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
            <ExampleSection title="UIGrid">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIGrid testID="uiGrid_default" type={UIGrid.Type.C6} style={styles.grid}>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={3}
                        >
                            <UIBoxButton title="3 cells" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundWarning], padding: 2 }}
                            medium={3}
                        >
                            <UIBoxButton title="3 cells" />
                        </UIGridColumn>
                    </UIGrid>
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIGrid type={UIGrid.Type.C8} style={styles.grid}>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundWarning], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={2}
                        >
                            <UIBoxButton title="2 cells" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundWarning], padding: 2 }}
                            medium={4}
                        >
                            <UIBoxButton title="4 cells" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundWarning], padding: 2 }}
                            medium={3}
                        >
                            <UIBoxButton title="3 cells" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundWarning], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                    </UIGrid>
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIGrid
                        testID="uiGrid_type_2"
                        type={UIGrid.Type.C12}
                        style={styles.grid}
                        gutter={4}
                        rowGutter={8}
                    >
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={4}
                        >
                            <UIBoxButton title="4 cells" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={4}
                        >
                            <UIBoxButton title="4 cells" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={4}
                        >
                            <UIBoxButton title="4 cells" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                        <UIGridColumn
                            style={{ backgroundColor: theme[ColorVariants.BackgroundPositive], padding: 2 }}
                            medium={1}
                        >
                            <UIBoxButton title="1 cell" />
                        </UIGridColumn>
                    </UIGrid>
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};

const styles = StyleSheet.create({
    grid: {},
});
