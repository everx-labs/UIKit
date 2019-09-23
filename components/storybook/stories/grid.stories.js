import React from 'react';
import { View } from 'react-native';
import FullWidthView from '../FullWidthView';

import { storiesOf } from '../helpers/storiesOf';
import Constants from '../helpers/constants';

import {
    UIGrid,
    UIGridColumn,
    UIButton,
    UIStyle,
    UIColor,
} from '../../../UIKit';

const styles = {
    grid: [
        UIStyle.Color.getBackgroundColorStyle(UIColor.whiteLight()),
        UIStyle.Margin.topDefault(),
    ],
    container: { height: 500 },
};

storiesOf(Constants.CategoryLayout, module)
    .addDecorator(getStory => <FullWidthView>{getStory()}</FullWidthView>)
    .add('Grid', () => (
        <View >style={styles.container}>
            <UIGrid
                type={UIGrid.Type.C6}
                style={styles.grid}
            >
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={3}>
                    <UIButton title="3 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.warning())} medium={3}>
                    <UIButton title="3 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
            </UIGrid>

            <UIGrid
                type={UIGrid.Type.C8}
                style={styles.grid}
            >
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.warning())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={2}>
                    <UIButton title="2 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.warning())} medium={4}>
                    <UIButton title="4 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.warning())} medium={3}>
                    <UIButton title="3 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.warning())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
            </UIGrid>

            <UIGrid
                type={UIGrid.Type.C12}
                style={styles.grid}
                gutter={4}
                rowGutter={8}
            >
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={4}>
                    <UIButton title="4 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={4}>
                    <UIButton title="4 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={4}>
                    <UIButton title="4 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
                <UIGridColumn style={UIStyle.Color.getBackgroundColorStyle(UIColor.success())} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </UIGridColumn>
            </UIGrid>
        </View>
    ));
