import * as React from 'react';
import type { UIButtonGroupProps } from '../types';
import { UIButtonGroupAction } from '../UIButtonGroupAction';

function processChildren(children: React.ReactNode): React.ReactNode[] {
    const childrenElements = React.Children.toArray(children).reduce<React.ReactNode[]>(
        (acc, child) => {
            if (React.isValidElement(child)) {
                if (child.type === UIButtonGroupAction) {
                    acc.push(child);
                    return acc;
                }

                if (child.type === React.Fragment) {
                    acc.push(...processChildren(child.props.children));
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

    return childrenElements;
}

export function useButtonGroupChildren(children: UIButtonGroupProps['children']) {
    return React.useMemo(() => processChildren(children), [children]);
}
