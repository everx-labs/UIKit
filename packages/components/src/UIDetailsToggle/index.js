import React from 'react';
import type { ViewStyleProp, TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UISwitcher, UISwitcherVariant } from '@tonlabs/uikit.hydrogen';
import UIDetailsSwitcher from '../UIDetailsSwitcher';

type State = {};
type Props = {
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
     toggle position to text, one of:
     UIDetailsToggle.Position.Right
     UIDetailsToggle.Position.Left
     @default UIDetailsToggle.Position.Right
     */
    switcherPosition?: string,
    /** Details text color
     @default null
     */
    textColor?: TextStyleProp,
    /** Details text style
     @default null
     */
    textStyle?: TextStyleProp,
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

export default class UIDetailsToggle extends UIDetailsSwitcher<Props, State> {
    static Position = UIDetailsSwitcher.Position;

    renderSwitcher(): React$Node {
        const {
            active, disabled
        } = this.props;

        return (
            <UISwitcher
                variant={UISwitcherVariant.Toggle}
                active={active}
                disabled={disabled}
            />
        );
    }

    static defaultProps: Props;
}

UIDetailsToggle.defaultProps = {
    switcherPosition: UIDetailsToggle.Position.Right,
    colored: false,
    style: null,
    textColor: null,
    textStyle: null,
    details: '',
    comments: '',
    active: false,
    disabled: false,
    onPress: () => {},
    testID: null,
    iconActive: null,
    iconInactive: null,
};
