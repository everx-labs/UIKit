import React from 'react';
import { View, Platform } from 'react-native';

import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';
import { withInfo } from '../helpers/addonInfo';
import { getMarkdown } from '../helpers/getMarkdown';
import { getUri } from '../helpers/getUri';
import Constants from '../helpers/constants';

import {
    UIButton,
    UIButtonGroup,
    UIStyle,
    UICustomSheet,
} from '../../../UIKit';

const iconCam = getUri(require('../../../assets/ico-camera/ico-camera.png'), 24, 24);
const iconDefault = getUri(require('../../../assets/ico-triangle/ico-triangle.png'), 24, 24);

const md = getMarkdown('../../../components/menus/UICustomSheet/Readme.md');

if (Platform.OS === 'web') {
    storiesOf('Props', module)
        .addDecorator(withInfo)
        .addParameters({
            info: {
                propTables: [UIButton],
                propTablesExclude: [View],
                source: false,
                styles: {
                    header: {
                        h1: {
                            display: 'none',
                        },
                        h3: {
                            display: 'none',
                        },
                    },
                    propTableHead: {
                        display: 'none',
                    },
                    source: {
                        h1: {
                            display: 'none',
                        },
                    },
                },
            },
        })
        .add('Button', () => (
            <View style={{ display: 'none' }}><UIButton title="Action" /></View>
        ));
}

storiesOf(Constants.CategoryButton, module)
    .addParameters({
        info: {
            propTables: [UIButton],
            propTablesExclude: [View],
        },
    })
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('ButtonStyle', () => (
        <UIButtonGroup>
            <UIButton title="Action" buttonStyle={UIButton.ButtonStyle.Full} onPress={() => { console.log('iconCam: ', iconCam); }} />
            <UIButton title="Action" buttonStyle={UIButton.ButtonStyle.Border} onPress={() => {}} />
            <UIButton title="Action" buttonStyle={UIButton.ButtonStyle.Link} onPress={() => { console.log('iconCam: ', iconCam); }} />
        </UIButtonGroup>
    ))
    .add('ButtonShape', () => (
        <UIButtonGroup>
            <UIButton title="Action" buttonShape={UIButton.ButtonShape.Radius} />
            <UIButton title="Action" buttonShape={UIButton.ButtonShape.Rounded} />
            <UIButton title="Action" buttonShape={UIButton.ButtonShape.Full} />
        </UIButtonGroup>
    ))
    .add('Disabled', () => (
        <UIButtonGroup>
            <UIButton title="Action" buttonStyle={UIButton.ButtonStyle.Full} disabled />
            <UIButton title="Action" buttonStyle={UIButton.ButtonStyle.Border} disabled />
            <UIButton title="Action" buttonStyle={UIButton.ButtonStyle.Link} disabled />
        </UIButtonGroup>
    ))
    .add('Iconed', () => (
        <UIButtonGroup direction={UIButtonGroup.Direction.Column}>
            <UIButton icon={iconCam} />
            <UIButton hasIcon icon={iconDefault} title="Center & IconL" />
            <UIButton hasIcon icon={iconDefault} title="Center & IconL" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton hasIcon icon={iconDefault} title="Center & IconL" buttonStyle={UIButton.ButtonStyle.Link} />
            <UIButton hasIconR iconR={iconDefault} title="Center & IconR" />
            <UIButton hasIconR iconR={iconDefault} title="Center & IconR" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton hasIconR iconR={iconDefault} title="Center & IconR" buttonStyle={UIButton.ButtonStyle.Link} />
            <UIButton hasIcon hasIconR icon={iconDefault} iconR={iconDefault} title="Center & 2 ico" />
            <UIButton hasIcon hasIconR icon={iconDefault} iconR={iconDefault} title="Center & 2 ico" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton hasIcon hasIconR icon={iconDefault} iconR={iconDefault} title="Center & 2 ico" buttonStyle={UIButton.ButtonStyle.Link} />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIcon icon={iconDefault} title="Left & IconL" />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIcon icon={iconDefault} title="Left & IconL" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIcon icon={iconDefault} title="Left & IconL" buttonStyle={UIButton.ButtonStyle.Link} />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIconR iconR={iconDefault} title="Left & IconR" />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIconR iconR={iconDefault} title="Left & IconR" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIconR iconR={iconDefault} title="Left & IconR" buttonStyle={UIButton.ButtonStyle.Link} />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIcon hasIconR icon={iconDefault} iconR={iconDefault} title="Left & 2 ico" />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIcon hasIconR icon={iconDefault} iconR={iconDefault} title="Left & 2 ico" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIcon hasIconR icon={iconDefault} iconR={iconDefault} title="Left & 2 ico" buttonStyle={UIButton.ButtonStyle.Link} />
            <UIButton textAlign={UIButton.TextAlign.Left} icon={iconCam} iconR={iconCam} title="Left & 2 ico" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton textAlign={UIButton.TextAlign.Right} icon={iconCam} buttonStyle={UIButton.ButtonStyle.Border} />
        </UIButtonGroup>
    ))
    .add('Progress Animations', () => (
        <UIButtonGroup direction={UIButtonGroup.Direction.Column}>
            <UIButton showIndicator />
            <UIButton showIndicator indicatorAnimation={UIButton.Indicator.Spin} iconIndicator={iconDefault} />
            <UIButton showIndicator indicatorAnimation={UIButton.Indicator.Round} iconIndicator={iconDefault} />
            <UIButton showIndicator indicatorAnimation={UIButton.Indicator.Pulse} iconIndicator={iconDefault} />
            <UIButton showIndicator indicatorAnimation={UIButton.Indicator.Sandglass} iconIndicator={iconDefault} />
        </UIButtonGroup>
    ));
