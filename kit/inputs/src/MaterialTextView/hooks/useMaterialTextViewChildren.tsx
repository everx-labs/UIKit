import * as React from 'react';
import {
    MaterialTextViewIcon,
    MaterialTextViewAction,
    MaterialTextViewText,
} from '../MaterialTextViewChildren';
import type { MaterialTextViewProps, MaterialTextViewChild } from '../types';

const getChildList = (children: React.ReactNode): MaterialTextViewChild[] | undefined => {
    const configs = React.Children.toArray(children).reduce<MaterialTextViewChild[]>(
        (acc, child) => {
            if (React.isValidElement(child)) {
                if (
                    child.type === MaterialTextViewIcon ||
                    child.type === MaterialTextViewAction ||
                    child.type === MaterialTextViewText
                ) {
                    acc.push(child as MaterialTextViewChild);
                    return acc;
                }

                if (child.type === React.Fragment && child.props.children) {
                    const fragmentChildList = getChildList(child.props.children);
                    if (fragmentChildList) {
                        acc.push(...fragmentChildList);
                    }
                    return acc;
                }
            }

            console.error(
                `A MaterialText can only contain 'MaterialTextView.[Icon|Action|Text]' components as its direct children (found ${
                    // eslint-disable-next-line no-nested-ternary
                    React.isValidElement(child)
                        ? `${typeof child.type === 'string' ? child.type : child.type?.name}`
                        : typeof child === 'object'
                        ? JSON.stringify(child)
                        : `'${String(child)}'`
                })`,
            );
            return acc;
        },
        [],
    );

    return configs;
};

export function useMaterialTextViewChildren(
    children: MaterialTextViewProps['children'],
): MaterialTextViewChild[] | undefined {
    return React.useMemo(() => getChildList(children), [children]);
}
