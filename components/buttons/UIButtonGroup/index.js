// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View } from 'react-native';

import UIButton from '../UIButton';
import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';

const styles = StyleSheet.create({
    //
});

type Props = {
    /** One of: UIButtonGroup.Direction.Column, UIButtonGroup.Direction.Row */
    direction?: string,
    /** button group container style */
    style?: StylePropType,
    /** @ignore */
    theme?: string,
    /** @ignore */
    children?: any,
};

type State = {};

export default class UIButtonGroup extends UIComponent<Props, State> {
    static Direction = {
        Row: 'row',
        Column: 'column',
    };

    constructor(props: Props) {
        super(props);
    }

    renderChildren() {
        if (!this.props.children) return null;
        const buttonsCount = this.props.children?.length;
        if (!buttonsCount) return null;

        const style = this.props.direction === 'row' ? UIStyle.Margin.leftDefault() : null;
        return this.props.children.map((child, rank) => {
            const style = this.props.direction === 'row' && rank !== 0 ? UIStyle.Margin.leftDefault() : null;
            return React.cloneElement(child, { style: [style, child.props.style], key: `button-${rank}` });
        });
    }

    render() {
        const groupStyle = [UIStyle.Common.flex()];
        if (this.props.direction === 'row') {
            groupStyle.push(
                UIStyle.Common.centerLeftContainer(),
                UIStyle.Common.flexRowWrap(),
            );
        }

        groupStyle.push(this.props.style);

        return (
            <View style={groupStyle}>
                {this.renderChildren()}
            </View>
        );
    }

    static defaultProps: Props;
}

UIButtonGroup.defaultProps = {
    children: null,
    direction: UIButtonGroup.Direction.Row,
    theme: UIColor.Theme.Light,
    style: null,
};
