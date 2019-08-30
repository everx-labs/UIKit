import React from 'react';
import { View, Platform } from 'react-native';

import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';
import { withInfo } from '../helpers/addonInfo';
import { getMarkdown } from '../helpers/getMarkdown';

import { action } from '@storybook/addon-actions';

import { UIButton, UIStyle, UICustomSheet } from '../../../UIKit';

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

storiesOf('Actions|Button', module)
    .addParameters({
        info: {
            propTables: [UIButton],
            propTablesExclude: [View],
        },
    })
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Button Default', () => (
        <UIButton title="Action2" onPress={() => { console.log('iconCam', iconCam); }} />
    ))
    .add('Button Outline', () => (
        <UIButton title="Action1" onPress={action('clicked-text')} buttonStyle={UIButton.ButtonStyle.Border} />
    ))
    .add('Buttons All', () => (
        <View style={UIStyle.Width.full()}>
            <UIButton
                title="Default button"
                onPress={action('clicked-text')}
            />
            <UIButton
                style={{ marginTop: 16 }}
                buttonShape={UIButton.ButtonShape.Radius}
                title="Radius button"
            />
            <UIButton
                style={{ marginTop: 16 }}
                buttonShape={UIButton.ButtonShape.Rounded}
                title="Rounded button"
            />
            <UIButton
                style={{ marginTop: 16 }}
                buttonStyle={UIButton.ButtonStyle.Full}
                title="Action"
            />
            <UIButton
                style={{ marginTop: 16 }}
                buttonStyle={UIButton.ButtonStyle.Full}
                disabled
                title="Disabled"
            />
            <UIButton
                style={{ marginTop: 16 }}
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Action"
            />
            <UIButton
                style={{ marginTop: 16 }}
                buttonStyle={UIButton.ButtonStyle.Border}
                disabled
                title="Disabled"
            />
            <UIButton
                style={{ marginTop: 16 }}
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Action"
            />
            <UIButton
                style={{ marginTop: 16 }}
                buttonStyle={UIButton.ButtonStyle.Link}
                disabled
                title="Disabled"
            />

            <UIButton
                style={{ marginTop: 16 }}
                hasIcon
                title="Center & IconL"
            />
            <UIButton
                style={{ marginTop: 16 }}
                hasIcon
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Center & IconL"
            />
            <UIButton
                style={{ marginTop: 16 }}
                hasIcon
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Center & IconL"
            />

            <UIButton
                style={{ marginTop: 16 }}
                hasIconR
                title="Center & IconR"
            />
            <UIButton
                style={{ marginTop: 16 }}
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Center & IconR"
            />
            <UIButton
                style={{ marginTop: 16 }}
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Center & IconR"
            />

            <UIButton
                style={{ marginTop: 16 }}
                hasIcon
                hasIconR
                title="Center & 2 ico"
            />
            <UIButton
                style={{ marginTop: 16 }}
                hasIcon
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Center & 2 ico"
            />
            <UIButton
                style={{ marginTop: 16 }}
                hasIcon
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Center & 2 ico"
            />

            <UIButton
                style={{ marginTop: 16 }}
                textAlign={UIButton.TextAlign.Left}
                hasIcon
                title="Left & IconL"
            />
            <UIButton
                style={{ marginTop: 16 }}
                textAlign={UIButton.TextAlign.Left}
                hasIcon
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Left & IconL"
            />
            <UIButton
                style={{ marginTop: 16 }}
                textAlign={UIButton.TextAlign.Left}
                hasIcon
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Left & IconL"
            />

            <UIButton
                style={{ marginTop: 16 }}
                textAlign={UIButton.TextAlign.Left}
                hasIconR
                title="Left & IconR"
            />
            <UIButton
                style={{ marginTop: 16 }}
                textAlign={UIButton.TextAlign.Left}
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Left & IconR"
            />
            <UIButton
                style={{ marginTop: 16 }}
                textAlign={UIButton.TextAlign.Left}
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Left & IconR"
            />

            <UIButton
                style={{ marginTop: 16 }}
                textAlign={UIButton.TextAlign.Left}
                hasIcon
                hasIconR
                title="Left & 2 ico"
            />
            <UIButton
                style={{ marginTop: 16 }}
                textAlign={UIButton.TextAlign.Left}
                hasIcon
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Left & 2 ico"
            />
            <UIButton
                style={{ marginTop: 16 }}
                textAlign={UIButton.TextAlign.Left}
                hasIcon
                hasIconR
                buttonStyle={UIButton.ButtonStyle.Link}
                title="Left & 2 ico"
            />

            <UIButton
                style={{ marginTop: 16 }}
                textAlign={UIButton.TextAlign.Left}
                icon={iconCam}
                iconR={iconCam}
                buttonStyle={UIButton.ButtonStyle.Border}
                title="Left & 2 ico"
            />

            <UIButton
                style={{ marginTop: 16 }}
                textAlign={UIButton.TextAlign.Left}
                icon={iconCam}
                buttonStyle={UIButton.ButtonStyle.Border}
            />
            <UIButton
                style={{ marginTop: 16 }}
                textAlign={UIButton.TextAlign.Right}
                icon={iconCam}
                buttonStyle={UIButton.ButtonStyle.Border}
            />
            <UIButton
                style={{ marginTop: 16 }}
                icon={iconCam}
            />

            <UIButton
                badge={10}
                style={{ marginTop: 16 }}
                buttonStyle={UIButton.ButtonStyle.Full}
                title="Badged"
            />

            <UIButton
                style={{ marginTop: 16 }}
                showIndicator
                indicatorAnimation={UIButton.Indicator.Spin}
            />
            <UIButton
                style={{ marginTop: 16 }}
                showIndicator
                indicatorAnimation={UIButton.Indicator.Spin}
                buttonStyle={UIButton.ButtonStyle.Border}
            />
            <UIButton
                style={{ marginTop: 16 }}
                showIndicator
                indicatorAnimation={UIButton.Indicator.Spin}
                buttonStyle={UIButton.ButtonStyle.Link}
            />
            <UIButton
                style={{ marginTop: 16 }}
                showIndicator
                indicatorAnimation={UIButton.Indicator.Round}
            />
            <UIButton
                style={{ marginTop: 16 }}
                showIndicator
                indicatorAnimation={UIButton.Indicator.Pulse}
            />
            <UIButton
                style={{ marginTop: 16 }}
                showIndicator
                indicatorAnimation={UIButton.Indicator.Sandglass}
            />
            <UIButton
                style={{ marginTop: 16 }}
                showIndicator
                buttonStyle={UIButton.ButtonStyle.Border}
            />
        </View>
    ));
