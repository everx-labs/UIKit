import React from 'react';
import { View } from 'react-native';
import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';
import Constants from '../helpers/constants';

import {
    UIGrid,
    UIButton,
    UIStyle,
    UIColor,
} from '../../../UIKit';

const styles = {
    grid: {
        backgroundColor: UIColor.whiteLight(),
        marginTop: 16,
    },
};

storiesOf(Constants.CategoryLayout, module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Grid', () => (
        <View style={{ height: 500 }}>
            <UIGrid
                type={UIGrid.Type.C6}
                style={styles.grid}
            >
                <View style={{ backgroundColor: UIColor.success() }} medium={3}>
                    <UIButton title="3 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.warning() }} medium={3}>
                    <UIButton title="3 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
            </UIGrid>

            <UIGrid
                type={UIGrid.Type.C8}
                style={styles.grid}
            >
                <View style={{ backgroundColor: UIColor.warning() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={2}>
                    <UIButton title="2 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.warning() }} medium={4}>
                    <UIButton title="4 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.warning() }} medium={3}>
                    <UIButton title="3 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.warning() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
            </UIGrid>

            <UIGrid
                type={UIGrid.Type.C12}
                style={styles.grid}
                gutter={4}
                rowGutter={8}
            >
                <View style={{ backgroundColor: UIColor.success() }} medium={4}>
                    <UIButton title="4 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={4}>
                    <UIButton title="4 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={4}>
                    <UIButton title="4 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
                <View style={{ backgroundColor: UIColor.success() }} medium={1}>
                    <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border} />
                </View>
            </UIGrid>
        </View>
    ));
