// @flow
import React from 'react';
import { View, Text } from 'react-native';

import UIComponent from '../../UIComponent';
import UITextButton from '../../buttons/UITextButton';
import type { ReactNavigation } from '../UINavigationBar';
import UIStyle from '../../../helpers/UIStyle';
import UIColor from '../../../helpers/UIColor';
import UIFunction from '../../../helpers/UIFunction';

// export type BreadCrumbScreen = {
//     screen: string,
//     title: string,
// }

type Props = {
    // screens: BreadCrumbScreen[],
    narrow: boolean,
    navigation: ReactNavigation,
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
        const { numberOfLastRoutesShown, pathMap, narrow } = this.props;
        const { routes } = this.props.navigation.dangerouslyGetParent().state || {};
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

        return (
            <View style={[UIStyle.container.centerLeft()]}>
                {lastRoutes.map(({ routeName, paramValues }, index) => {
                    const key = Object.keys(paramValues)[0];
                    const id = paramValues[key] ? UIFunction.truncText(paramValues[key], true) : '';
                    const title = `${this.props.screenTitleMapper(routeName)} ${id ? '- ' : ''}${id}`;

                    return (
                        <React.Fragment key={`bread-crumbs-${title}`}>
                            <UITextButton
                                title={title}
                                textStyle={[
                                    UIStyle.text.smallRegular(),
                                    UIStyle.color.getColorStyle(UIColor.tagBlack()),
                                ]}
                                style={UIStyle.margin.rightNormal()}
                                onPress={() => this.props.navigation.pop(lastRoutes.length - index)}
                            />
                            <Text style={[
                                UIStyle.margin.rightNormal(),
                                UIStyle.text.quaternarySmallRegular(),
                            ]}
                            >
                                /
                            </Text>
                        </React.Fragment>
                    );
                })}
            </View>
        );
    }
}
