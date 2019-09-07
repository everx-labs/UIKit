import React from 'react';
import { View, Image } from 'react-native';
import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';
import { getUri } from '../helpers/getUri';
import Constants from '../helpers/constants';

import {
    UIActionIcon,
    UIButtonGroup,
    UIStyle,
} from '../../../UIKit';

const iconCam = getUri(require('../../../assets/ico-camera/ico-camera.png'), 24, 24);
const iconDefault = getUri(require('../../../assets/ico-triangle/ico-triangle.png'), 24, 24);

storiesOf(Constants.CategoryButtonIcon, module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('ButtonIcon', () => (
        <UIButtonGroup>
            <UIButtonGroup direction={UIButtonGroup.Direction.Column}>
                <UIActionIcon buttonStyle={UIActionIcon.Style.Full} onPress={() => {}} icon={iconDefault} />
                <UIActionIcon buttonStyle={UIActionIcon.Style.Border} icon={iconDefault} />
                <UIActionIcon buttonStyle={UIActionIcon.Style.Link} icon={iconDefault} />
            </UIButtonGroup>
            <UIButtonGroup direction={UIButtonGroup.Direction.Column}>
                <UIActionIcon buttonStyle={UIActionIcon.Style.Full} buttonShape={UIActionIcon.Shape.Rounded} icon={iconDefault} />
                <UIActionIcon buttonStyle={UIActionIcon.Style.Border} buttonShape={UIActionIcon.Shape.Rounded} icon={iconDefault} />
                <UIActionIcon buttonStyle={UIActionIcon.Style.Link} icon={iconCam} />
            </UIButtonGroup>
        </UIButtonGroup>
    ));
