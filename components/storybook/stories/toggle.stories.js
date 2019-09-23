import React from 'react';
import { View } from 'react-native';
import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';
import Constants from '../helpers/constants';
import { getUri } from '../helpers/getUri';

import {
    UIGrid,
    UIDetailsToggle,
    UIStyle,
    UIColor,
    UIComponent,
} from '../../../UIKit';


const icoActiveDefault = getUri(require('../../../assets/ico-toggle-active/ico-toggle-active.png'), 24, 24);
const icoInactiveDefault = getUri(require('../../../assets/ico-toggle-inactive/ico-toggle-inactive.png'), 24, 24);
const icoOnColored = getUri(require('../../../assets/ico-toggle-on/ico-toggle-on.png'), 24, 24);
const icoOffColored = getUri(require('../../../assets/ico-toggle-off/ico-toggle-off.png'), 24, 24);

class ToggleTester extends UIComponent {
    constructor(props) {
        super(props);
        this.state = { isActive: false, children: this.props.children };
    }

    onPress = (isActive) => {
        this.setStateSafely({ isActive });
    }

    render() {
        const childrenCount = this.props.children?.length || 1;
        const children = childrenCount > 1 ?
            this.props.children :
            [this.props.children];
        return children.map((child, rank) => {
            let iconActive = null;
            let iconInactive = null;
            if (child.props.colored) {
                iconActive = icoOnColored;
                iconInactive = icoOffColored;
            } else {
                iconActive = icoActiveDefault;
                iconInactive = icoInactiveDefault;
            }
            return React.cloneElement(
                child,
                {
                    onPress: this.onPress,
                    active: this.state.isActive,
                    iconActive,
                    iconInactive,
                },
            );
        });
    }
}

storiesOf(Constants.CategoryToggle, module)
    .addDecorator(getStory => <CenterView><ToggleTester>{getStory()}</ToggleTester></CenterView>)
    .add('Toggle Default', () => (
        <UIDetailsToggle active={false} onPress={(isActive) => { /* your code here */ }} />
    ))
    .add('Toggle With title', () => (
        <UIDetailsToggle details="Details" />
    ))
    .add('Toggle With title and details', () => (
        <UIDetailsToggle details="Details" comments="Comments" />
    ))
    .add('Toggle Colored', () => (
        <UIDetailsToggle details="Action" colored />
    ))
    .add('Toggle Disabled', () => (
        <UIDetailsToggle details="Action" disabled active />
    ))
    .add('Toggle Position', () => (
        <UIDetailsToggle details="Action" switcherPosition={UIDetailsToggle.Position.Left} />
    ));
