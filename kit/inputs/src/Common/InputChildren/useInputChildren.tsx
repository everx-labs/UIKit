import * as React from 'react';
import { InputIcon, InputAction, InputText } from './InputChildrenLayout';
import type {
    InputChildren,
    InputIconChild,
    InputActionChild,
    InputTextChild,
    InputChild,
} from './types';
import type { InputColorScheme, InputFont } from '../constants';

const getChildList = (
    children: InputChildren,
    colorScheme: InputColorScheme,
    font: InputFont | undefined,
) => {
    return React.Children.toArray(children).reduce<InputChild[]>((acc, child) => {
        if (React.isValidElement(child)) {
            if (
                child.type === InputIcon ||
                child.type === InputAction ||
                child.type === InputText
            ) {
                const newChild = React.cloneElement(child, {
                    colorScheme,
                    font,
                    ...child.props,
                }) as InputChild;

                acc.push(newChild);
                return acc;
            }

            if (child.type === React.Fragment) {
                acc.push(...getChildList(child.props.children, colorScheme, font));

                return acc;
            }
        }

        throw new Error(
            `A Input can only contain 'Input.[Icon|Action|Text]' components as its direct children (found ${
                // eslint-disable-next-line no-nested-ternary
                React.isValidElement(child)
                    ? `${typeof child.type === 'string' ? child.type : child.type?.name}`
                    : typeof child === 'object'
                    ? JSON.stringify(child)
                    : `'${String(child)}'`
            })`,
        );
    }, []);
};

function sortInputChildList(children: InputChild[]) {
    return children.reduce<{
        icons: (InputIconChild | undefined)[];
        action: InputActionChild | undefined;
        text: InputTextChild | undefined;
    }>(
        (acc, child) => {
            if (React.isValidElement(child)) {
                if (child.type === InputIcon) {
                    acc.icons.push(child as InputIconChild);
                } else if (child.type === InputAction) {
                    acc.action = child as InputActionChild;
                } else if (child.type === InputText) {
                    acc.text = child as InputTextChild;
                }
            }

            return acc;
        },
        {
            icons: [],
            action: undefined,
            text: undefined,
        },
    );
}

export function useInputChildren(
    children: InputChildren,
    colorScheme: InputColorScheme,
    font: InputFont | undefined,
): InputChild[] {
    const childList = getChildList(children, colorScheme, font);
    const { icons, action, text } = sortInputChildList(childList);

    const hasIcons = icons.length > 0;
    const hasAction = action != null;
    const hasText = text != null;

    if (hasIcons) {
        if (hasAction || hasText) {
            console.error(`You can't pass Input.Action or Input.Text with icons at the same time.`);
        }

        return icons
            .slice(0, 2) // Render only two icons, as required by design system
            .reduce<InputIconChild[]>((acc, item) => {
                if (!React.isValidElement(item)) {
                    return acc;
                }
                acc.push(item);

                return acc;
            }, []);
    }

    if (hasAction) {
        if (hasText) {
            console.error(`You can't pass Input.Text with Action at the same time.`);
        }

        return [action];
    }

    return text ? [text] : [];
}
