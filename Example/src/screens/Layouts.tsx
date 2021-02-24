import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
    UIDetailsTable,
    UIGrid,
    UIGridColumn,
    UIButton,
} from '@tonlabs/uikit.components';
import { UIColor } from '@tonlabs/uikit.core';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Layouts = () => (
    <ExampleScreen>
        <ExampleSection title="UIDetailsTable">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
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
        <ExampleSection title="UIGrid">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIGrid type={UIGrid.Type.C6} style={styles.grid}>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={3}
                    >
                        <UIButton
                            title="3 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.warning() }}
                        medium={3}
                    >
                        <UIButton
                            title="3 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                </UIGrid>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIGrid type={UIGrid.Type.C8} style={styles.grid}>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.warning() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={2}
                    >
                        <UIButton
                            title="2 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.warning() }}
                        medium={4}
                    >
                        <UIButton
                            title="4 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.warning() }}
                        medium={3}
                    >
                        <UIButton
                            title="3 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.warning() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                </UIGrid>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIGrid
                    type={UIGrid.Type.C12}
                    style={styles.grid}
                    gutter={4}
                    rowGutter={8}
                >
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={4}
                    >
                        <UIButton
                            title="4 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={4}
                    >
                        <UIButton
                            title="4 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={4}
                    >
                        <UIButton
                            title="4 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                    <UIGridColumn
                        style={{ backgroundColor: UIColor.success() }}
                        medium={1}
                    >
                        <UIButton
                            title="1 cells"
                            buttonStyle={UIButton.ButtonStyle.Border}
                        />
                    </UIGridColumn>
                </UIGrid>
            </View>
        </ExampleSection>
    </ExampleScreen>
);

const styles = StyleSheet.create({
    grid: {},
});
