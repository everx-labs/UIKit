import React from 'react';
import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';

import {
    UIActionIcon,
    UIStyle,
} from '../../../UIKit';

const iconCam = require('../../../assets/ico-camera/ico-camera.png');

storiesOf('Actions', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Action Icon', () => (
        <React.Fragment>
            <UIActionIcon
                buttonStyle={UIActionIcon.Style.Full}
            />
            <UIActionIcon
                style={UIStyle.Margin.topDefault()}
                buttonStyle={UIActionIcon.Style.Border}
            />
            <UIActionIcon
                style={UIStyle.Margin.topDefault()}
                buttonStyle={UIActionIcon.Style.Link}
            />

            <UIActionIcon
                style={UIStyle.Margin.topDefault()}
                buttonStyle={UIActionIcon.Style.Full}
                buttonShape={UIActionIcon.Shape.Rounded}
            />
            <UIActionIcon
                style={UIStyle.Margin.topDefault()}
                buttonStyle={UIActionIcon.Style.Border}
                buttonShape={UIActionIcon.Shape.Rounded}
            />
            <UIActionIcon
                style={UIStyle.Margin.topDefault()}
                buttonStyle={UIActionIcon.Style.Link}
                icon={iconCam}
            />

        </React.Fragment>
    ));
