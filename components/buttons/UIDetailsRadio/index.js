import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { StyleSheet, View } from 'react-native';

import UIDetailsView from '../../views/UIDetailsView';
import UIRadioButtonItem from '../UIRadioButtonList/UIRadioButtonItem';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';
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
  toggle position to text, one of:
  UIDetailsRadio.Position.Right
  UIDetailsRadio.Position.Left
  @default UIDetailsRadio.Position.Right
  */
  switcherPosition?: string,
  /** Defines whether toggle is colored or default
  * @default false
  */
  colored?: boolean,
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

export default class UIDetailsRadio extends UIDetailsSwitcher<Props, State> {
    static Position = UIDetailsSwitcher.Position;

    renderSwitcher(): React$Node {
        const {
            active, iconActive, iconInactive,
        } = this.props;

        return (<UIRadioButtonItem
            iconActive={iconActive}
            iconInactive={iconInactive}
            radioStyle={this.getSwitcherStyle()}
            selected={active}
        />
        );
    }

    render() {
        return super.render();
    }

    static defaultProps: Props;
}

UIDetailsRadio.defaultProps = {
    switcherPosition: UIDetailsRadio.Position.Right,
    style: null,
    details: '',
    comments: '',
    active: false,
    disabled: false,
    onPress: () => {},
    testID: null,
    iconActive: null,
    iconInactive: null,
};
