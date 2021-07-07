// @flow
import React from 'react';
import { View, Text } from 'react-native';

import { UIStyle, UIFunction } from '@tonlabs/uikit.core';
import { UIComponent } from '@tonlabs/uikit.components';
import { UILinkButton } from '@tonlabs/uikit.hydrogen';

type Props = {
    // screens: BreadCrumbScreen[],
    narrow: boolean,
    navigation: any,
    numberOfLastRoutesShown: number,
    screenTitleMapper: (routeName: string) => string,
    pathMap: {
        [string]: {
            name: string,
            staticParameters: { section: string },
            dynamicParameters: { [string]: boolean },
        }
    }
};

export default class UIBreadCrumbs extends UIComponent<Props, {}> {
    static defaultProps = {
        narrow: false,
        numberOfLastRoutesShown: 3,
        pathMap: {},
        screenTitleMapper: () => '',
    };

    getLastRoutes() {
        const {
            numberOfLastRoutesShown, pathMap, narrow, navigation,
        } = this.props;
        const { state } = navigation ? navigation.dangerouslyGetParent() : {};
        const { routes } = state || {};
        const num = narrow ? 1 : numberOfLastRoutesShown;

        if (routes) {
            const min = Math.max(routes.length - num - 1, 0);
            return routes.slice(min, routes.length - 1)
                .map(({ routeName, params }) => {
                    const { dynamicParameters } = pathMap[routeName] || {};
                    const keysArr = Object.keys(dynamicParameters || {}).map(key => key);
                    const paramValues = {};
                    keysArr.forEach((key) => {
                        paramValues[key] = params[key];
                    });
                    return { routeName, paramValues };
                });
        }
        return [];
    }

    render() {
        const lastRoutes = this.getLastRoutes();
        if (!lastRoutes.length) return null;

        const slash = (
            <Text style={[UIStyle.margin.rightNormal(), UIStyle.text.quaternarySmallRegular()]}>
                /
            </Text>
        );

        return (
            <View style={[UIStyle.container.centerLeft()]}>
                {lastRoutes.map(({ routeName, paramValues }, index) => {
                    const key = Object.keys(paramValues)[0];
                    const id = paramValues[key] ? UIFunction.truncText(paramValues[key], true) : '';
                    const title = `${this.props.screenTitleMapper(routeName)} ${id ? '- ' : ''}${id}`;

                    return (
                        <React.Fragment key={`bread-crumbs-${title}-${index}`}>
                            <UILinkButton
                                title={title}
                                onPress={() => this.props.navigation.pop(lastRoutes.length - index)}
                                layout={UIStyle.margin.rightNormal()}
                            />
                            {index < lastRoutes.length - 1 && slash}
                        </React.Fragment>
                    );
                })}
            </View>
        );
    }
}
