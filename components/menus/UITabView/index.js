// @flow
import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';
import UITextButton from '../../buttons/UITextButton';

export type TabViewPage = {
    title: string,
    component: React$Node,
};

type Props = {
    pages: TabViewPage[],
    width: number,
    style?: ViewStyleProp,
    pageStyle?: ViewStyleProp,
};

type State = {
    index: number,
    marginLeft: AnimatedValue,
};

const styles = StyleSheet.create({
    bottomLine: {
        height: 2,
        backgroundColor: UIColor.primary(),
    },
});

export default class UITabView extends UIComponent<Props, State> {
    static defaultProps: Props = {
        pages: [],
        width: 0,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            index: 0,
            marginLeft: new Animated.Value(0),
        };
    }

    // Events
    onPressTab = (index: number) => {
        Animated.timing(this.state.marginLeft, {
            toValue: -index * this.props.width,
            useNativeDriver: true,
            duration: UIConstant.animationDuration(),
        }).start();
        this.setStateSafely({ index });
    };

    // Render
    renderTapBar() {
        return (
            <View style={UIStyle.common.flexRow()}>
                {this.props.pages.map(({ title }: TabViewPage, index: number) => {
                    const textStyle = index === this.state.index
                        ? UIStyle.text.actionBodyBold()
                        : UIStyle.text.secondaryBodyBold();
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <TouchableWithoutFeedback
                            onPress={() => this.onPressTab(index)}
                            key={`tab-view-label-${title}`}
                        >
                            <View style={[UIStyle.common.flex(), UIStyle.common.alignCenter()]}>
                                <UITextButton
                                    title={title}
                                    textStyle={textStyle}
                                    onPress={() => this.onPressTab(index)}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </View>
        );
    }

    renderIndicatorLine() {
        const { width, pages } = this.props;
        if (!pages.length || !width) {
            return null;
        }

        const marginLeft = Animated.divide(this.state.marginLeft, new Animated.Value(-2));
        return (
            <View style={[UIStyle.common.flex(), UIStyle.common.overflowHidden()]}>
                <Animated.View
                    style={[styles.bottomLine, { width: width / pages.length, marginLeft }]}
                />
            </View>
        );
    }

    renderPages() {
        const { width, pages, pageStyle } = this.props;
        return (
            <View style={[UIStyle.common.overflowHidden(), pageStyle]}>
                <Animated.View
                    style={[UIStyle.common.flexRow(), { marginLeft: this.state.marginLeft }]}
                >
                    {pages.map(({ title, component }: TabViewPage) => {
                        return (
                            <View style={{ width }} key={`tab-view-page-${title}`}>
                                {component}
                            </View>
                        );
                    })}
                </Animated.View>
            </View>
        );
    }

    render() {
        if (!this.props.width) {
            return null;
        }

        return (
            <View style={[UIStyle.common.flex(), this.props.style]}>
                {this.renderTapBar()}
                {this.renderIndicatorLine()}
                {this.renderPages()}
            </View>
        );
    }
}
