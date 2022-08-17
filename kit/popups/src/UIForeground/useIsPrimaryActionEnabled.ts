import React from 'react';
import { ActionCell, CancelCell } from './Cells';
import { PrimaryColumn } from './Columns';
import type { ContainerProps } from './types';

export function useIsPrimaryActionEnabled(children: ContainerProps['children']) {
    return React.useMemo(() => {
        const primaryColumn = React.Children.toArray(children).find(child => {
            return React.isValidElement(child) && child.type === PrimaryColumn;
        });
        if (!primaryColumn || !React.isValidElement(primaryColumn)) {
            return false;
        }
        if (primaryColumn.props.onPress) {
            return !primaryColumn.props.disabled;
        }

        const actionCell = React.Children.toArray(primaryColumn.props.children).find(child => {
            return (
                React.isValidElement(child) &&
                (child.type === ActionCell || child.type === CancelCell)
            );
        });
        if (!actionCell || !React.isValidElement(actionCell)) {
            return false;
        }

        return !actionCell.props.disabled && actionCell.props.onPress;
    }, [children]);
}
