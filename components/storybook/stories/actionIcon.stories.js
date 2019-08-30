import React from 'react';
import { View } from 'react-native';
import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';
import Constants from '../helpers/constants';

import {
    UIActionIcon,
    UIButtonGroup,
    UIStyle,
} from '../../../UIKit';

const iconCam = require('../../../assets/ico-camera/ico-camera.png');

storiesOf(Constants.CategoryButtonIcon, module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('ButtonIcon', () => (
        <UIButtonGroup>
            <UIButtonGroup direction={UIButtonGroup.Direction.Column}>
                <UIActionIcon buttonStyle={UIActionIcon.Style.Full} />
                <UIActionIcon buttonStyle={UIActionIcon.Style.Border} />
                <UIActionIcon buttonStyle={UIActionIcon.Style.Link} />
            </UIButtonGroup>
            <UIButtonGroup direction={UIButtonGroup.Direction.Column}>
                <UIActionIcon buttonStyle={UIActionIcon.Style.Full} buttonShape={UIActionIcon.Shape.Rounded} />
                <UIActionIcon buttonStyle={UIActionIcon.Style.Border} buttonShape={UIActionIcon.Shape.Rounded} />
                <UIActionIcon buttonStyle={UIActionIcon.Style.Link} icon={iconCam} />
            </UIButtonGroup>
        </UIButtonGroup>
    ));
