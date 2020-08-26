// @flow
import React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { View, TouchableOpacity, Text } from 'react-native';

import UIDetailsView from '../../views/UIDetailsView';
import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';

type DetailsSwitcherProps = {
    /** container style
     @default null
     */
    style?: ViewStyleProp,
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

export default class UIDetailsSwitcher<Props, State>
    extends UIComponent<any & DetailsSwitcherProps, State> {
    static Position = {
        Left: 'left',
        Right: 'right',
    };
    static Type = {
        Square: 'square',
        Circle: 'circle',
    };

    static defaultProps: any & DetailsSwitcherProps = {
        switcherPosition: UIDetailsSwitcher.Position.Right,
        disabled: false,
        type: UIDetailsSwitcher.Type.Square,
        style: null,
        details: '',
        comments: '',
        active: false,
        onPress: () => {},
        testID: null,
        iconActive: null,
        iconInactive: null,
    };

    // Events
    onPress = () => {
        const { active, onPress } = this.props;
        onPress(!active);
    };

    getSwitcherStyle() {
        const switcherStyle = [];
        if (this.props.switcherPosition === UIDetailsSwitcher.Position.Right) {
            switcherStyle.push(UIStyle.margin.leftSmall());
        } else {
            switcherStyle.push(UIStyle.margin.rightSmall());
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
                <Text style={[UIStyle.text.primaryBodyMedium(), UIStyle.common.flex()]}>
                    {details}
                </Text>
            );
        }

        return (<UIDetailsView
            containerStyle={UIStyle.common.flex()}
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

        const button = (
            <View
                style={[
                    UIStyle.common.flexRow(),
                    UIStyle.common.alignCenter(),
                    this.props.disabled ? this.props.style : null,
                ]}
                pointerEvents="box-only"
            >
                {left}
                {right}
            </View>
        );


        return this.props.disabled ? button : (
            <TouchableOpacity onPress={this.onPress} style={this.props.style}>
                {button}
            </TouchableOpacity>
        );
    }
}
