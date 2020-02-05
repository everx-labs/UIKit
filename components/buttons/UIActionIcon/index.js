// @flow
import React from 'react';

import UIButton from '../UIButton';
import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIFunction from '../../../helpers/UIFunction';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

type Props = {
    /** One of:
    UIActionIcon.Size.Large,
    UIActionIcon.Size.Medium,
    UIActionIcon.Size.Small,
    UIActionIcon.Size.Default
    @default UIActionIcon.Size.Default
    */
    buttonSize?: string,
    /** One of:
    UIActionIcon.Shape.Radius,
    UIButton.Shape.Rounded,
    UIButton.Shape.Full,
    UIButton.Shape.Default
    @default UIButton.Shape.Default
    */
    buttonShape?: string,
    /** One of:
    UIActionIcon.Style.Full,
    UIActionIcon.Style.Border,
    UIActionIcon.Style.Link
    @default UIActionIcon.Style.Full
    */
    buttonStyle?: string,
    /** uri to left icon
    @default null
    */
    icon?: ?string,
    /** button container style
    @default null
    */
    style?: ViewStyleProp | ViewStyleProp[],
    /** @ignore */
    theme?: string,

    /** set true if button disabled
    @default false
    */
    disabled?: boolean,
    /** Your action here */
    onPress?: () => void,
    /** Your action here */
    onMouseEnter?: () => void,
    /** Your action here */
    onMouseLeave?: () => void,
};

type State = {};

export default class UIActionIcon extends UIComponent<Props, State> {
    static Size = UIButton.ButtonSize;
    static Shape = UIButton.ButtonShape;
    static Style = UIButton.ButtonStyle;

    // Deprecated
    static size = UIButton.buttonSize;
    static shape = UIButton.buttonShape;
    static style = UIButton.buttonStyle;

    getButtonWidth() {
        switch (this.props.buttonSize) {
        case UIActionIcon.size.large:
            return UIConstant.largeButtonHeight();
        case UIActionIcon.size.medium:
            return UIConstant.mediumButtonHeight();
        case UIActionIcon.size.small:
            return UIConstant.smallButtonHeight();
        default: // UIActionIcon.size.default
            return UIConstant.buttonHeight();
        }
    }

    render() {
        const widthStyle = { width: this.getButtonWidth() };
        return (
            <UIButton
                {...this.props}
                style={UIFunction.combineStyles([this.props.style, widthStyle])}
                hasIcon
            />
        );
    }

    static defaultProps: Props;
}

UIActionIcon.defaultProps = {
    buttonSize: UIActionIcon.size.medium,
    buttonShape: UIActionIcon.shape.default,
    buttonStyle: UIActionIcon.style.full,
    icon: null,
    theme: UIColor.Theme.Light,
    style: null,
    disabled: false,
};
