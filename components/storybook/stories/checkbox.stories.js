import React from 'react';
import { View } from 'react-native';
import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';
import Constants from '../helpers/constants';
import { getUri } from '../helpers/getUri';

import {
    UIGrid,
    UIDetailsCheckbox,
    UIStyle,
    UIColor,
    UIComponent,
} from '../../../UIKit';

const icoSquareCheckboxOn = getUri(require('../../../assets/ico-checkbox-square-active/ico-checkbox-square-active.png'), 24, 24);
const icoSquareCheckboxOff = getUri(require('../../../assets/ico-checkbox-square-inactive/ico-checkbox-square-inactive.png'), 24, 24);
const icoCircleCheckboxOn = getUri(require('../../../assets/ico-checkbox-circle-active/ico-checkbox-circle-active-inverted.png'), 24, 24);
const icoCircleCheckboxOff = getUri(require('../../../assets/ico-checkbox-circle-inactive/ico-checkbox-circle-inactive-empty.png'), 24, 24);

class CheckboxTester extends UIComponent {
    constructor(props) {
        super(props);
        this.state = { isActive: props.active, children: this.props.children };
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
            if (child.props.type === UIDetailsCheckbox.Type.Circle) {
                iconActive = icoCircleCheckboxOn;
                iconInactive = icoCircleCheckboxOff;
            } else {
                iconActive = icoSquareCheckboxOn;
                iconInactive = icoSquareCheckboxOff;
            }
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

storiesOf(Constants.CategoryCheckbox, module)
    .addDecorator(getStory => <CenterView><CheckboxTester>{getStory()}</CheckboxTester></CenterView>)
    .add('Checkbox Default', () => (
        <UIDetailsCheckbox selected={false} onPress={(isSelected) => { /* your code here */ }} />
    ))
    .add('Checkbox With title', () => (
        <UIDetailsCheckbox details="Details" />
    ))
    .add('Checkbox With title and details', () => (
        <UIDetailsCheckbox details="Details" comments="Comments" />
    ))
    .add('Checkbox Disabled', () => (
        <UIDetailsCheckbox details="Action" disabled active />
    ))
    .add('Checkbox Position', () => (
        <UIDetailsCheckbox details="Action" switcherPosition={UIDetailsCheckbox.Position.Left} />
    ))
    .add('Checkbox Shape', () => (
        <UIDetailsCheckbox details="Action" type={UIDetailsCheckbox.Type.Circle} />
    ));
