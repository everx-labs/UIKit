// @flow
import React from 'react';
import { Animated, View } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';

type Props = {
    currentItem: ?React$Node,
    prevItem: ?React$Node,
    itemStyle: ViewStyleProp,
    containerStyle: ViewStyleProp,
}

type State = {
    currentItem: ?React$Node,
    prevItem: ?React$Node,
    currentItemOpacity: Animated.Value,
    prevItemOpacity: Animated.Value,
}

export default class UITransitionView extends UIComponent<Props, State> {
    static defaultProps = {
        currentItem: null,
        prevItem: null,
        itemStyle: {},
        containerStyle: {},
    }

    // Constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            currentItem: null,
            prevItem: null,
            currentItemOpacity: new Animated.Value(1),
            prevItemOpacity: new Animated.Value(0),
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        const newCurrentItem = nextProps.currentItem;
        const newPrevItem = nextProps.prevItem;
        const currentItem = this.getCurrentItem();
        const prevItem = this.getPrevItem();
        if (currentItem !== newCurrentItem || prevItem !== newPrevItem) {
            this.setStateSafely({
                currentItem,
                prevItem,
                currentItemOpacity: new Animated.Value(0),
                prevItemOpacity: new Animated.Value(1),
            }, () => {
                Animated.parallel([
                    Animated.spring(this.getCurrentItemOpacity(), { // looks better than `timing`
                        toValue: 1.0,
                    }),
                    Animated.spring(this.getPrevItemOpacity(), {
                        toValue: 0.0,
                    }),
                ]).start();
            });
        }
    }

    // Getters
    getCurrentItem(): ?React$Node {
        return this.props.currentItem;
    }

    getPrevItem(): ?React$Node {
        return this.props.prevItem;
    }

    getCurrentItemOpacity(): Animated.Value {
        return this.state.currentItemOpacity;
    }

    getPrevItemOpacity(): Animated.Value {
        return this.state.prevItemOpacity;
    }

    // Render
    renderItem(item: ?React$Node, isCurrent: boolean = true) {
        if (!item) {
            return null;
        }
        return (
            <Animated.View
                style={[
                    UIStyle.absoluteFillObject,
                    this.props.itemStyle,
                    {
                        opacity: isCurrent
                            ? this.getCurrentItemOpacity()
                            : this.getPrevItemOpacity(),
                    },
                ]}
            >
                {item}
            </Animated.View>
        );
    }

    render() {
        const currentItem = this.getCurrentItem();
        const prevItem = this.getPrevItem();
        return (
            <View style={[UIStyle.flex, this.props.containerStyle]}>
                {this.renderItem(prevItem, false)}
                {this.renderItem(currentItem, true)}
            </View>
        );
    }
}
