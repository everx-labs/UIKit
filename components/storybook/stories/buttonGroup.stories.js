import React from 'react';
import { View } from 'react-native';

import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';
import { action } from '@storybook/addon-actions';
import getSearchParameters from '../helpers/location';

import {
    UIButtonGroup,
    UIButton,
    UIActionIcon,
    UIStyle,
} from '../../../UIKit';

const params = getSearchParameters();

storiesOf('Actions', module)
    .addParameters({
        info: params.frame ? {
            propTables: [UIButtonGroup],
            propTablesExclude: [UIButton, UIActionIcon, View],
        } : null,
    })
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Button Group', () => (
        <View>
            <UIButtonGroup>
                <UIButton title="Action" style={{ flex: 1 }} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Accent Action" style={{ flex: 2 }} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Loooooooong Action" style={{ flex: 3 }} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup direction={UIButtonGroup.Direction.Column} style={UIStyle.Margin.topDefault()}>
                <UIButton title="Loooooooong Action" style={{ flex: 1 }} />
                <UIButton title="Loooooooong Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Action" style={{ flex: 1 }} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Accent Action" style={{ flex: 2 }} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Action" style={{ flex: 2 }} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIActionIcon style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Accent Action" style={{ flex: 2 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Loooooooong Action" style={{ flex: 3 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup direction={UIButtonGroup.Direction.Column} style={UIStyle.Margin.topDefault()}>
                <UIButton title="Loooooooong Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIButton title="Loooooooong Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Accent Action" style={{ flex: 2 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Action" style={{ flex: 2 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIButton title="Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIActionIcon style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Back" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Border} />
                <UIButton title="Accent Action" style={{ flex: 2 }} />
            </UIButtonGroup>
        </View>
    ));
