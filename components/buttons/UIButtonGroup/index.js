// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View } from 'react-native';

import UIButton from '../UIButton';
import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';

const GUTTER = UIConstant.contentOffset();

const styles = StyleSheet.create({
    //
});

type Props = {
    /** One of:
    UIButtonGroup.Direction.Column,
    UIButtonGroup.Direction.Row
    @default UIButtonGroup.Direction.Row
    */
    direction?: string,
    /** button group container style
    @default null
    */
    style?: StylePropType,
    /** @ignore */
    children?: any,
    /** Gap between buttons
    @default 16
    */
    gutter: number,
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

    isRow() {
        return (this.props.direction === UIButtonGroup.Direction.Row);
    }

    getGutterStyle() {
        if (this.props.direction === UIButtonGroup.Direction.Row) {
            return { marginLeft: this.props.gutter };
        }
        return { marginTop: this.props.gutter };
    }

    renderChildren() {
        if (!this.props.children) return null;
        const buttonsCount = this.props.children?.length;
        if (!buttonsCount) return null;

        return this.props.children.map((child, rank) => {
            const style = rank !== 0 ? this.getGutterStyle() : null;
            return React.cloneElement(child, { style: [style, child.props.style], key: `button-${rank}` });
        });
    }

    render() {
        const groupStyle = [];
        if (this.props.direction === UIButtonGroup.Direction.Row) {
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
    gutter: GUTTER,
    style: null,
};
