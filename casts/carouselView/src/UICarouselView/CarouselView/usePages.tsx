import React from 'react';

import { UICarouselViewPage } from './UICarouselViewPage';
import type { UICarouselViewPageProps } from '../types';

export function getPages(children: React.ReactNode): React.ReactElement<UICarouselViewPageProps>[] {
    const childElements: React.ReactElement<UICarouselViewPageProps>[] = React.Children.toArray(
        children,
    ).reduce<React.ReactElement<UICarouselViewPageProps>[]>(
        (
            acc: React.ReactElement[],
            child: React.ReactNode,
        ): React.ReactElement<UICarouselViewPageProps>[] => {
            if (React.isValidElement(child)) {
                const pages: React.ReactElement<UICarouselViewPageProps>[] = acc;
                if (child.type === UICarouselViewPage) {
                    pages.push(child as React.ReactElement<UICarouselViewPageProps>);
                    return pages;
                }

                if (child.type === React.Fragment) {
                    pages.push(...getPages(child.props.children));
                    return pages;
                }
            }
            if (__DEV__) {
                throw new Error(
                    `UICarouselViewContainer can only contain 'UICarouselView.Page' components as its direct children (found ${
                        // eslint-disable-next-line no-nested-ternary
                        React.isValidElement(child)
                            ? `${typeof child.type === 'string' ? child.type : child.type?.name}`
                            : typeof child === 'object'
                            ? JSON.stringify(child)
                            : `'${String(child)}'`
                    })`,
                );
            }
            return acc;
        },
        [],
    );

    return childElements;
}

export function usePages(
    children:
        | React.ReactElement<UICarouselViewPageProps>
        | React.ReactElement<UICarouselViewPageProps>[],
): React.ReactElement<UICarouselViewPageProps>[] {
    return React.useMemo((): React.ReactElement<UICarouselViewPageProps>[] => {
        const pages: React.ReactElement<UICarouselViewPageProps>[] = getPages(children);
        return pages;
    }, [children]);
}
