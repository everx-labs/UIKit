import React from 'react';
import { View, Platform } from 'react-native';

import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';
import { withInfo } from '../helpers/addonInfo';
import { getMarkdown } from '../helpers/getMarkdown';
import Constants from '../helpers/constants';

import { action } from '@storybook/addon-actions';

import {
    UIButton,
    UIButtonGroup,
    UIStyle,
    UICustomSheet,
} from '../../../UIKit';

const md = getMarkdown('../../../components/menus/UICustomSheet/Readme.md');
const iconCam = require('../../../assets/ico-camera/ico-camera.png');
const iconTriangle = require('../../../assets/ico-triangle/ico-triangle.png');

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
            <UIButton title="Action" buttonStyle={UIButton.ButtonStyle.Full} />
            <UIButton title="Action" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton title="Action" buttonStyle={UIButton.ButtonStyle.Link} />
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
            <UIButton hasIcon title="Center & IconL" />
            <UIButton hasIcon title="Center & IconL" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton hasIcon title="Center & IconL" buttonStyle={UIButton.ButtonStyle.Link} />
            <UIButton hasIconR title="Center & IconR" />
            <UIButton hasIconR title="Center & IconR" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton hasIconR title="Center & IconR" buttonStyle={UIButton.ButtonStyle.Link} />
            <UIButton hasIcon hasIconR title="Center & 2 ico" />
            <UIButton hasIcon hasIconR title="Center & 2 ico" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton hasIcon hasIconR title="Center & 2 ico" buttonStyle={UIButton.ButtonStyle.Link} />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIcon title="Left & IconL" />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIcon title="Left & IconL" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIcon title="Left & IconL" buttonStyle={UIButton.ButtonStyle.Link} />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIconR title="Left & IconR" />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIconR title="Left & IconR" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIconR title="Left & IconR" buttonStyle={UIButton.ButtonStyle.Link} />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIcon hasIconR title="Left & 2 ico" />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIcon hasIconR title="Left & 2 ico" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton textAlign={UIButton.TextAlign.Left} hasIcon hasIconR title="Left & 2 ico" buttonStyle={UIButton.ButtonStyle.Link} />
            <UIButton textAlign={UIButton.TextAlign.Left} icon={iconCam} iconR={iconCam} title="Left & 2 ico" buttonStyle={UIButton.ButtonStyle.Border} />
            <UIButton textAlign={UIButton.TextAlign.Right} icon={iconCam} buttonStyle={UIButton.ButtonStyle.Border} />
        </UIButtonGroup>
    ))
    .add('Progress Animations', () => (
        <UIButtonGroup direction={UIButtonGroup.Direction.Column}>
            <UIButton showIndicator />
            <UIButton showIndicator indicatorAnimation={UIButton.Indicator.Spin} />
            <UIButton showIndicator indicatorAnimation={UIButton.Indicator.Round} />
            <UIButton showIndicator indicatorAnimation={UIButton.Indicator.Pulse} />
            <UIButton showIndicator indicatorAnimation={UIButton.Indicator.Sandglass} />
        </UIButtonGroup>
    ))
    .add('All', () => (
        <UIButtonGroup direction={UIButtonGroup.Direction.Column}>
            <UIButton
                title="Default button"
                onPress={action('clicked-text')}
            />
            <UIButton
                buttonShape={UIButton.ButtonShape.Radius}
                title="Radius button"
            />
            <UIButton
                buttonShape={UIButton.ButtonShape.Rounded}
                title="Rounded button"
            />
            <UIButton
                buttonStyle={UIButton.ButtonStyle.Full}
                disabled
                title="Disabled"
            />
            <UIButton
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Action"
            />
            <UIButton
                buttonStyle={UIButton.ButtonStyle.Border}
                disabled
                title="Disabled"
            />
            <UIButton
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Action"
            />
            <UIButton
                buttonStyle={UIButton.ButtonStyle.Link}
                disabled
                title="Disabled"
            />

            <UIButton
                hasIcon
                title="Center & IconL"
            />
            <UIButton
                hasIcon
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Center & IconL"
            />
            <UIButton
                hasIcon
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Center & IconL"
            />

            <UIButton
                hasIconR
                title="Center & IconR"
            />
            <UIButton
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Center & IconR"
            />
            <UIButton
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Center & IconR"
            />

            <UIButton
                hasIcon
                hasIconR
                title="Center & 2 ico"
            />
            <UIButton
                hasIcon
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Center & 2 ico"
            />
            <UIButton
                hasIcon
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Center & 2 ico"
            />

            <UIButton
                textAlign={UIButton.TextAlign.Left}
                hasIcon
                title="Left & IconL"
            />
            <UIButton
                textAlign={UIButton.TextAlign.Left}
                hasIcon
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Left & IconL"
            />
            <UIButton
                textAlign={UIButton.TextAlign.Left}
                hasIcon
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Left & IconL"
            />

            <UIButton
                textAlign={UIButton.TextAlign.Left}
                hasIconR
                title="Left & IconR"
            />
            <UIButton
                textAlign={UIButton.TextAlign.Left}
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Left & IconR"
            />
            <UIButton
                textAlign={UIButton.TextAlign.Left}
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Left & IconR"
            />

            <UIButton
                textAlign={UIButton.TextAlign.Left}
                hasIcon
                hasIconR
                title="Left & 2 ico"
            />
            <UIButton
                textAlign={UIButton.TextAlign.Left}
                hasIcon
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Left & 2 ico"
            />
            <UIButton
                textAlign={UIButton.TextAlign.Left}
                hasIcon
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Left & 2 ico"
            />

            <UIButton
                textAlign={UIButton.TextAlign.Left}
                icon={iconCam}
                iconR={iconCam}
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Left & 2 ico"
            />

            <UIButton
                textAlign={UIButton.TextAlign.Left}
                icon={iconCam}
                buttonStyle={UIButton.ButtonStyle.Border}
            />
            <UIButton
                textAlign={UIButton.TextAlign.Right}
                icon={iconCam}
                buttonStyle={UIButton.ButtonStyle.Border}
            />
            <UIButton
                icon={iconCam}
            />

            <UIButton
                badge={10}
                buttonStyle={UIButton.ButtonStyle.Full}
                title="Badged"
            />

            <UIButton
                showIndicator
                indicatorAnimation={UIButton.Indicator.Spin}
            />
            <UIButton
                showIndicator
                indicatorAnimation={UIButton.Indicator.Spin}
                buttonStyle={UIButton.ButtonStyle.Border}
            />
            <UIButton
                showIndicator
                indicatorAnimation={UIButton.Indicator.Spin}
                buttonStyle={UIButton.ButtonStyle.Link}
            />
            <UIButton
                showIndicator
                indicatorAnimation={UIButton.Indicator.Round}
            />
            <UIButton
                showIndicator
                indicatorAnimation={UIButton.Indicator.Pulse}
            />
            <UIButton
                showIndicator
                indicatorAnimation={UIButton.Indicator.Sandglass}
            />
            <UIButton
                showIndicator
                buttonStyle={UIButton.ButtonStyle.Border}
            />
        </UIButtonGroup>
    ));
