import React from 'react';
import { View } from 'react-native';

import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';
import { getUri } from '../helpers/getUri';
import Constants from '../helpers/constants';

import {
    UIButtonGroup,
    UIButton,
    UIActionIcon,
    UIStyle,
} from '../../../UIKit';

const iconDefault = getUri(require('../../../assets/ico-triangle/ico-triangle.png'), 24, 24);


storiesOf(Constants.CategoryButtonGroup, module)
    .addParameters({
        info: {
            propTables: [UIButtonGroup],
            propTablesExclude: [UIButton, UIActionIcon, View],
        },
    })
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Row', () => (
        <React.Fragment>
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
                <UIActionIcon icon={iconDefault} style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
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
                <UIActionIcon icon={iconDefault} style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
            </UIButtonGroup>

            <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                <UIButton title="Back" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Border} />
                <UIButton title="Accent Action" style={{ flex: 2 }} />
            </UIButtonGroup>
        </React.Fragment>
    ))
    .add('Stacked', () => (
        <React.Fragment>
            <UIButtonGroup direction={UIButtonGroup.Direction.Column} gutter={0}>
                <UIButton title="Loooooooong Action" style={{ flex: 1 }} />
                <UIButton title="Loooooooong Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Link} />
                <UIButton title="Loooooooong Action" style={{ flex: 1 }} buttonStyle={UIButton.ButtonStyle.Border} />
            </UIButtonGroup>
        </React.Fragment>
    ));
