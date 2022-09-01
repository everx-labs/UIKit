import * as React from 'react';
import { InputIcon, InputAction, InputText } from './InputChildren';
import type {
    InputChildren,
    InputIconChild,
    InputActionChild,
    InputTextChild,
    InputActionProps,
    InputIconProps,
    InputTextProps,
} from './types';

const getChildList = (children: React.ReactNode) => {
    const configs = React.Children.toArray(children).reduce<React.ReactNode[]>((acc, child) => {
        if (React.isValidElement(child)) {
            if (
                child.type === InputIcon ||
                child.type === InputAction ||
                child.type === InputText
            ) {
                acc.push(child);
                return acc;
            }

            if (child.type === React.Fragment) {
                acc.push(...getChildList(child.props.children));

                return acc;
            }
        }

        throw new Error(
            `A MaterialText can only contain 'Input.[Icon|Action|Text]' components as its direct children (found ${
                // eslint-disable-next-line no-nested-ternary
                React.isValidElement(child)
                    ? `${typeof child.type === 'string' ? child.type : child.type?.name}`
                    : typeof child === 'object'
                    ? JSON.stringify(child)
                    : `'${String(child)}'`
            })`,
        );
    }, []);

    return configs;
};

export function useInputChildren(children: InputChildren): InputChildren {
    const { icons, action, text } = getChildList(children).reduce<{
        icons: (InputIconChild | undefined)[];
        action: InputActionChild | undefined;
        text: InputTextChild | undefined;
    }>(
        (acc, child) => {
            if (React.isValidElement(child)) {
                if (child.type === InputIcon) {
                    acc.icons.push(child as React.ReactElement<InputIconProps>);
                } else if (child.type === InputAction) {
                    acc.action = child as React.ReactElement<InputActionProps>;
                } else if (child.type === InputText) {
                    acc.text = child as React.ReactElement<InputTextProps>;
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

    const hasIcons = icons.length > 0;
    const hasAction = action != null;
    const hasText = text != null;

    if (hasIcons) {
        if (hasAction || hasText) {
            throw new Error(
                `You can't pass Input.Action or Input.Text with icons at the same time.`,
            );
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
            throw new Error(`You can't pass Input.Text with Action at the same time.`);
        }

        return action;
    }

    return text;
}
