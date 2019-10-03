import React from 'react';
import { View } from 'react-native';
import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';
import Constants from '../helpers/constants';
import { getUri } from '../helpers/getUri';

import {
    UIGrid,
    UIDetailsRadio,
    UIStyle,
    UIColor,
    UIComponent,
} from '../../../UIKit';


const icoActiveDefault = getUri(require('../../../assets/ico-radiobutton-active/ico-radiobutton-active.png'), 24, 24);
const icoInactiveDefault = getUri(require('../../../assets/ico-radiobutton-inactive/ico-radiobutton-inactive.png'), 24, 24);

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
            const iconActive = icoActiveDefault;
            const iconInactive = icoInactiveDefault;
            return React.cloneElement(
                child,
                {
                    onPress: this.onPress,
                    active: !child.props.disabled ? this.state.isActive : child.props.active,
                    iconActive,
                    iconInactive,
                },
            );
        });
    }
}

storiesOf(Constants.CategoryRadio, module)
    .addDecorator(getStory => <CenterView><ToggleTester>{getStory()}</ToggleTester></CenterView>)
    .add('Radio Default', () => (
        <UIDetailsRadio active={false} onPress={(isActive) => { /* your code here */ }} />
    ))
    .add('Radio With title', () => (
        <UIDetailsRadio details="Details" />
    ))
    .add('Radio With title and details', () => (
        <UIDetailsRadio details="Details" comments="Comments" />
    ))
    .add('Radio Position', () => (
        <UIDetailsRadio details="Action" switcherPosition={UIDetailsRadio.Position.Left} />
    ));
