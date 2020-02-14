// @flow
import React from 'react';
import { StyleSheet, View } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

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
    style?: ViewStyleProp,
    /** @ignore */
    children?: any,
    /** Gap between buttons
    @default 16
    */
    gutter: number,
    /** ID for testing
     @default ''
     */
    testID?: string,
    /** onLayout handler
    * @default null
    */
    onLayout?: ?(e: any) => void,
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

        const childrenCount = this.props.children?.length || 1;
        const propChildren = childrenCount > 1 ?
            this.props.children :
            [this.props.children];

        const children = [];
        propChildren.forEach((child) => {
            if (!child?.props && child?.length) {
                // case if passed array of columns
                children.push(...child.filter((ch) => { return ch !== null; }));
            } else if (child?.props) {
                children.push(child);
            }
        });
        if (children.length === 0) return null;

        return children.map<any>((child, rank) => {
            const style = rank !== 0 ? this.getGutterStyle() : null;
            return React.cloneElement(child, {
                style: [style, child.props.style],
                // eslint-disable-next-line
                key: `button-${rank}`,
            });
        });
    }

    render() {
        const groupStyle = [];
        if (this.props.direction === UIButtonGroup.Direction.Row) {
            groupStyle.push(
                UIStyle.container.centerLeft(),
                UIStyle.common.flexRowWrap(),
            );
        }

        groupStyle.push(this.props.style);

        return (
            <View testID={this.props.testID} style={groupStyle} onLayout={this.props.onLayout}>
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
    onLayout: null,
};
