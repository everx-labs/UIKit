import React from 'react';

function getIsInvalidChild(
    allowedChildrenComponents: Record<string, unknown>,
    errorMessage: string,
) {
    return function checkInvalidChild(child: React.ReactNode): boolean {
        if (React.isValidElement(child)) {
            if (
                Object.keys(allowedChildrenComponents).findIndex(
                    (cellName: string) => child.type === allowedChildrenComponents[cellName],
                ) !== -1
            ) {
                return false;
            }
        }
        if (__DEV__) {
            console.error(
                new Error(
                    `[UIForeground]: ${errorMessage} (found ${
                        // eslint-disable-next-line no-nested-ternary
                        React.isValidElement(child)
                            ? `${typeof child.type === 'string' ? child.type : child.type?.name}`
                            : typeof child === 'object'
                            ? JSON.stringify(child)
                            : `'${String(child)}'`
                    })`,
                ),
            );
        }
        return true;
    };
}

export function useCheckChildren(
    children: React.ReactNode,
    allowedChildrenComponents: Record<string, unknown>,
    errorMessage: string,
): boolean {
    return React.useMemo(() => {
        if (__DEV__) {
            const isValidChildren =
                React.Children.toArray(children).findIndex(
                    getIsInvalidChild(allowedChildrenComponents, errorMessage),
                ) === -1;
            return isValidChildren;
        }
        return true;
    }, [children, allowedChildrenComponents, errorMessage]);
}
