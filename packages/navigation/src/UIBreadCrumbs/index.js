// @flow
import React from 'react';
import { View, Text } from 'react-native';

import { UIStyle, UIColor, UIFunction } from '@tonlabs/uikit.core';
import { UIComponent, UITextButton } from '@tonlabs/uikit.components';

// export type BreadCrumbScreen = {
//     screen: string,
//     title: string,
// }

type PathParams = {
    path: string,
    params: { [string]: string }
};

type Props = {
    // screens: BreadCrumbScreen[],
    narrow: boolean,
    navigation: any,
    numberOfLastRoutesShown: number,
    screenTitleMapper: (routeName: string) => string,
    pageHistory: PathParams[],
    onPress: (number) => void,
};

export default class UIBreadCrumbs extends UIComponent<Props, {}> {
    static defaultProps = {
        narrow: false,
        numberOfLastRoutesShown: 3,
        screenTitleMapper: () => '',
    };

    getLastRoutes(): PathParams[] {
        const {
            numberOfLastRoutesShown, pageHistory, narrow, navigation,
        } = this.props;
        const num = narrow ? 1 : numberOfLastRoutesShown;

        if (pageHistory) {
            const min = Math.max(pageHistory.length - num - 1, 0);
            return pageHistory.slice(min, pageHistory.length - 1)
        }
        return [];
    }

    getOnPress(index: number) {
        return () => {
            const steps = this.getLastRoutes().length - index + 1;
            this.props.onPress(steps);
        }
    }

    // Render
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
                {lastRoutes.map(({ path, params = {} }, index) => {
                    const key = Object.keys(params)[0];
                    const id = params[key] ? UIFunction.truncText(`${params[key]}`, true) : '';
                    const title = `${this.props.screenTitleMapper(path)} ${id ? '- ' : ''}${id}`;

                    return (
                        <React.Fragment key={`bread-crumbs-${title}-${index}`}>
                            <UITextButton
                                title={title}
                                textStyle={[
                                    UIStyle.text.smallRegular(),
                                    UIStyle.color.getColorStyle(UIColor.tagBlack()),
                                ]}
                                style={UIStyle.margin.rightNormal()}
                                onPress={this.getOnPress(index)}
                            />
                            {index < lastRoutes.length - 1 && slash}
                        </React.Fragment>
                    );
                })}
            </View>
        );
    }
}
