// @flow
import React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { StyleSheet, View } from 'react-native';

import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';

const GUTTER = 16;
const ROW_GUTTER = 0;
const SIZINGS = {
    C6: {
        minWidth: 320,
        maxWidth: 992,
        maxColumns: 6,
        bounds: [
            {
                width: 496,
                columns: 3,
            },
            {
                width: 992,
                columns: 6,
            },
        ],
    },
    C8: {
        minWidth: 320,
        maxWidth: 1200,
        maxColumns: 8,
        bounds: [
            {
                width: 600,
                columns: 4,
            },
            {
                width: 1200,
                columns: 8,
            },
        ],
    },
    C12: {
        minWidth: 304,
        maxColumns: 12,
        bounds: [
            {
                width: 592,
                columns: 4,
            },
            {
                width: 880,
                columns: 8,
            },
            {
                width: 1024,
                columns: 12,
            },
        ],
    },
};

const styles = StyleSheet.create({
    //
});

type Props = {
    /** @ignore */
    children?: any,
    /** gap between columns
    @default 16
    */
    gutter: number,
    /** gap between rows
    @default 0
    */
    rowGutter: number,
    /** One of
    UIGrid.Type.C6,
    UIGrid.Type.C8,
    UIGrid.Type.C12
    @default UIGrid.Type.C8
    */
    type: string,
    /** custom style
    @default null
    */
    style?: ViewStyleProp,
    /** width of grid, if not set it's '100%'
    * @default 0
    */
    width?: number,
    /** onLayout handler
    * @default null
    */
    onLayout?: ?(e: any) => void,
    /** pointerEvents
    * @default null
    */
    pointerEvents?: any,
};

type State = {
    width: number,
};

export default class UIGrid extends UIComponent<Props, State> {
    static Type = {
        C6: 'C6',
        C8: 'C8',
        C12: 'C12',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            width: this.props.width || 0,
        };
    }

    onLayout = (e: any) => {
        const { width } = e.nativeEvent.layout;
        this.setStateSafely({ width });
        if (this.props.onLayout) {
            this.props.onLayout(e);
        }
    }

    getColumns() {
        for (const bound of SIZINGS[this.props.type].bounds) {
            if (this.state.width < bound.width) {
                return bound.columns;
            }
        }
        return SIZINGS[this.props.type].maxColumns;
    }

    getGutter() {
        return this.props.gutter;
    }

    getRowGutter() {
        return this.props.rowGutter;
    }

    getContainerPadding() {
        const { maxWidth } = SIZINGS[this.props.type];
        if (
            !maxWidth ||
            this.state.width < maxWidth
        ) return this.getGutter();
        return (this.state.width - maxWidth) / 2;
    }

    getWidth() {
        return this.state.width;
    }

    getCellWidth() {
        const rowWidth = this.state.width - 2 * this.getContainerPadding();
        const guttersWidth = (this.getColumns() - 1) * this.getGutter();
        return (rowWidth - guttersWidth) / this.getColumns();
    }

    renderChildren(children: any) {
        return children.map((child, rank) => {
            const childColumns = (child.props.medium || 1);
            const childGutters = (childColumns - 1) * this.getGutter();
            const childWidth = this.getCellWidth() * childColumns + childGutters;

            const childStyle = [
                rank !== children.length - 1 ? { marginRight: this.getGutter() } : null,
                { width: childWidth },
            ];
            return React.cloneElement(
                child,
                {
                    style: [childStyle, child.props.style],
                    key: `child-${rank}`,
                    pointerEvents: this.props.pointerEvents,
                },
            );
        });
    }

    renderRow(children: any, rank: number) {
        const rowStyle = [
            UIStyle.Width.full(),
            UIStyle.Common.flexRow(),
            { marginTop: rank !== 0 ? this.getRowGutter() : 0 },
        ];

        return (
            <View style={rowStyle} key={`row-${rank}`} pointerEvents={this.props.pointerEvents}>
                {this.renderChildren(children)}
            </View>
        );
    }

    render() {
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

        let row = 0;
        let columns = 0;
        const rows = [[]];
        children.forEach((child) => {
            const childColumns = child.props.medium || 1;
            columns += childColumns;
            if (columns > this.getColumns()) {
                rows[++row] = [];
                columns = childColumns;
            }
            rows[row].push(child);
        });

        const containerStyle = [
            {
                minWidth: SIZINGS[this.props.type].minWidth,
                paddingHorizontal: this.getContainerPadding(),
            },
            this.props.style,
            // if width isn't known, we'll know it at first in this.onLayout
            // and then render:
            {
                opacity: this.state.width === 0 ? 0 : 100,
            },
        ];

        return (
            <View style={containerStyle} onLayout={this.onLayout} pointerEvents={this.props.pointerEvents}>
                {rows.map((childrenRow, rank) => this.renderRow(childrenRow, rank))}
            </View>
        );
    }

    static defaultProps: Props;
}

UIGrid.defaultProps = {
    gutter: GUTTER,
    rowGutter: ROW_GUTTER,
    type: UIGrid.Type.C8,
    style: null,
    width: 0,
    onLayout: null,
    pointerEvents: null,
};
