import * as React from 'react';

export function shouldUpdateScreens(children: React.ReactNode, prevChildren: React.ReactNode) {
    const prevScreens = React.Children.toArray(prevChildren);
    const currentScreens = React.Children.toArray(children);

    if (prevScreens.length !== currentScreens.length) {
        return true;
    }

    for (let i = 0; i < currentScreens.length; i += 1) {
        const prevScreen = prevScreens[i];
        const currentScreen = currentScreens[i];

        if (React.isValidElement(prevScreen) && React.isValidElement(currentScreen)) {
            if (currentScreen.type === React.Fragment) {
                if (shouldUpdateScreens(currentScreen.props.children, prevScreen.props.children)) {
                    return true;
                }
                continue;
            }

            if (currentScreen.props && 'component' in currentScreen.props) {
                if (currentScreen.props.component !== prevScreen.props.component) {
                    return true;
                }
                continue;
            }

            if (currentScreen.props && 'getComponent' in currentScreen.props) {
                if (currentScreen.props.getComponent !== prevScreen.props.getComponent) {
                    return true;
                }
                continue;
            }

            if (currentScreen.props && 'children' in currentScreen.props) {
                if (currentScreen.props.children !== prevScreen.props.children) {
                    return true;
                }
                continue;
            }
        }
    }

    return false;
}
