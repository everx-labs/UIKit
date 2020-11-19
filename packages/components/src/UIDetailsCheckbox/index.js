import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View } from 'react-native';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';

import UIDetailsView from '../UIDetailsView';
import UICheckboxItem from '../UICheckboxItem';
import UIComponent from '../UIComponent';
import UIDetailsSwitcher from '../UIDetailsSwitcher';

type State = {};
type Props = {
  /** container style
  @default null
  */
  style?: ?StylePropType,
  /** Text along with the toggle
  @default ''
  */
  details?: string,
  /** Text under the details
  @default ''
  */
  comments?: string,
  /** Defines whether toggle ON/OFF
  @default false
  */
  active: boolean,
  /**
  Editable/disabled
  @default false
  */
  disabled?: boolean,
  /**
  shape of checkbox, one of:
  UIDetailsCheckbox.Type.Square
  UIDetailsCheckbox.Type.Circle
  @default UIDetailsCheckbox.Type.Square
  */
  type?: string,
  /**
  toggle position to text, one of:
  UIDetailsCheckbox.Position.Right
  UIDetailsCheckbox.Position.Left
  @default UIDetailsCheckbox.Position.Right
  */
  switcherPosition?: string,
  /** Your action here, arg is new state of toggle (isActive: boolean)
  */
  onPress: (isActive: boolean) => void,
  /** test id
  * @ignore
  * @default null
  */
  testID?: ?string,
  /** customize your icon
  * @default null
  */
  iconActive?: ?string,
  /** customize your icon
  * @default null
  */
  iconInactive?: ?string,
};

const styles = StyleSheet.create({
});

export default class UIDetailsCheckbox extends UIDetailsSwitcher<Props, State> {
    static Position = UIDetailsSwitcher.Position;
    static Type = UICheckboxItem.Type;

    renderSwitcher(): React$Node {
        const {
            active, disabled, iconActive, iconInactive, type,
        } = this.props;

        return (<UICheckboxItem
            iconActive={iconActive}
            iconInactive={iconInactive}
            containerStyle={this.getSwitcherStyle()}
            selected={active}
            editable={!disabled}
            type={type}
        />
        );
    }

    render() {
        return super.render();
    }

    static defaultProps: Props;
}

UIDetailsCheckbox.defaultProps = {
    switcherPosition: UIDetailsCheckbox.Position.Right,
    disabled: false,
    type: UICheckboxItem.Type.Square,
    style: null,
    details: '',
    comments: '',
    selected: false,
    onPress: () => {},
    testID: null,
    iconActive: null,
    iconInactive: null,
};
