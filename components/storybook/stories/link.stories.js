import React from 'react';
import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';

import {
    UILink,
    UIStyle,
    UIButtonGroup,
} from '../../../UIKit';

import Constants from '../helpers/constants';

const iconCam = require('../../../assets/ico-camera/ico-camera.png');

storiesOf(Constants.CategoryLink, module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Link', () => (
        <UIButtonGroup direction={UIButtonGroup.Direction.Column}>
            <UILink
                textAlign={UILink.TextAlign.Right}
                title="Right"
                data="Data"
            />
            <UILink
                textAlign={UILink.TextAlign.Left}
                title="Left"
                data="Data"
            />
            <UILink
                textAlign={UILink.TextAlign.Center}
                title="Center"
                data="Data"
            />
            <UILink
                textAlign={UILink.TextAlign.Left}
                title="Left"
                count="Count"
            />
            <UILink
                textAlign={UILink.TextAlign.Right}
                title="Right"
                count="Count"
            />
            <UILink
                textAlign={UILink.TextAlign.Center}
                title="Center"
                count="Count"
            />
            <UILink
                title="Looooooooooooooooooooooooooooooong Action"
            />
            <UILink
                title="Action"
                onPress={() => {}}
            />
            <UILink
                disabled
                textAlign={UILink.TextAlign.Right}
                title="DisabledR"
            />
            <UILink
                hasIcon
                title="Center"
            />
            <UILink
                hasIconR
                title="Center"
            />

            <UILink
                hasIcon
                hasIconR
                title="Center"
            />

            <UILink
                textAlign={UILink.TextAlign.Left}
                title="Left"
            />

            <UILink
                textAlign={UILink.TextAlign.Left}
                hasIcon
                title="Left"
            />

            <UILink
                textAlign={UILink.TextAlign.Left}
                hasIconR
                title="Left"
            />

            <UILink
                textAlign={UILink.TextAlign.Left}
                hasIcon
                hasIconR
                title="Left"
            />

            <UILink
                textAlign={UILink.TextAlign.Left}
                icon={iconCam}
                iconR={iconCam}
                title="Left"
            />
        </UIButtonGroup>
    ));
