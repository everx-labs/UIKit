import * as React from 'react';
import type { UIButtonGroupProps } from '../types';
import { UIButtonGroupAction } from '../UIButtonGroupAction';

function getChilds(children: React.ReactNode): React.ReactNode[] {
    const childElements = React.Children.toArray(children).reduce<React.ReactNode[]>(
        (acc, child) => {
            if (React.isValidElement(child)) {
                if (child.type === UIButtonGroupAction) {
                    acc.push(child);
                    return acc;
                }

                if (child.type === React.Fragment) {
                    acc.push(...getChilds(child.props.children));
                    return acc;
                }
            }

            throw new Error(
                `UIButtonGroup must contain only UIButtonGroupAction components as its direct children (found ${
                    // eslint-disable-next-line no-nested-ternary
                    React.isValidElement(child)
                        ? `${typeof child.type === 'string' ? child.type : child.type?.name}`
                        : typeof child === 'object'
                        ? JSON.stringify(child)
                        : `'${String(child)}'`
                })`,
            );
        },
        [],
    );

    return childElements;
}

export function useButtonGroupChildren(children: UIButtonGroupProps['children']) {
    return React.useMemo(() => getChilds(children), [children]);
}
