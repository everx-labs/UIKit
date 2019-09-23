import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import UIDetailsView from '../../views/UIDetailsView';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';

type Props = {
  /** container style
  @default null
  */
  containerStyle?: StylePropType,
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
  UIDetailsSwitcher.Type.Square
  UIDetailsSwitcher.Type.Circle
  @default UIDetailsSwitcher.Type.Square
  */
  type?: string,
  /**
  toggle position to text, one of:
  UIDetailsSwitcher.Position.Right
  UIDetailsSwitcher.Position.Left
  @default UIDetailsSwitcher.Position.Right
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
    switcher: {
    },
    switcherLeft: {
        marginRight: UIConstant.smallContentOffset(),
    },
    switcherRight: {
        marginLeft: UIConstant.smallContentOffset(),
    },
});

export default class UIDetailsSwitcher<Props, State> extends UIComponent<Props, State> {
    static Position = {
        Left: 'left',
        Right: 'right',
    };
    static Type = {
        Square: 'square',
        Circle: 'circle',
    };

    // Events
    onPress = () => {
        const { active, onPress } = this.props;
        onPress(!active);
    };

    getSwitcherStyle() {
        const switcherStyle = [styles.switcher];
        if (this.props.switcherPosition === UIDetailsSwitcher.Position.Right) {
            switcherStyle.push(styles.switcherRight);
        } else {
            switcherStyle.push(styles.switcherLeft);
        }
        return switcherStyle;
    }

    // Render
    renderDetailsView() {
        const {
            details, comments,
        } = this.props;

        if (!comments && !details) {
            return null;
        }

        if (!comments) {
            return (
                <Text style={[UIStyle.Text.primarySmallMedium(), UIStyle.Common.flex()]}>{details}</Text>
            );
        }

        return (<UIDetailsView
            containerStyle={UIStyle.Common.flex()}
            value={details}
            comments={comments}
            onPress={() => {}}
        />);
    }

    renderSwitcher(): React$Node {
        return null;
    }

    render() {
        const left = (this.props.switcherPosition === UIDetailsSwitcher.Position.Right) ?
            this.renderDetailsView() : this.renderSwitcher();

        const right = (this.props.switcherPosition === UIDetailsSwitcher.Position.Right) ?
            this.renderSwitcher() : this.renderDetailsView();

        const button = (<View
            style={[
                UIStyle.Common.flexRow(),
                UIStyle.Common.alignCenter(),
                this.props.containerStyle,
            ]}
            pointerEvents="box-only"
        >
            {left}
            {right}
        </View>);


        return this.props.disabled ? button : (
            <TouchableOpacity onPress={this.onPress}>
                {button}
            </TouchableOpacity>
        );
    }

    // static defaultProps: Props;
}

/* UIDetailsSwitcher.defaultProps = {
    switcherPosition: UIDetailsSwitcher.Position.Right,
    disabled: false,
    type: UIDetailsSwitcher.Type.Square,
    containerStyle: {},
    details: '',
    comments: '',
    active: false,
    onPress: () => {},
    testID: null,
    iconActive: null,
    iconInactive: null,
}; */
