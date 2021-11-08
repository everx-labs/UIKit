import * as React from 'react';

/**
 * Component which prevents updates for children if no props changed
 */
function StaticContainer(props: any) {
    return props.children;
}

/**
 * Extracted from https://github.com/react-navigation/react-navigation/blob/26ba019155e2638035a71f755330b52ff281b196/packages/core/src/StaticContainer.tsx
 */
export default React.memo(StaticContainer, (prevProps: any, nextProps: any) => {
    const prevPropKeys = Object.keys(prevProps);
    const nextPropKeys = Object.keys(nextProps);

    if (prevPropKeys.length !== nextPropKeys.length) {
        return false;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const key in prevPropKeys) {
        if (Object.prototype.hasOwnProperty.call(prevPropKeys, key)) {
            if (key === 'children') {
                continue;
            }

            if (prevProps[key] !== nextProps[key]) {
                return false;
            }
        }
    }

    return true;
});
