// @flow
import React from 'react';
import { Animated, View } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';

type Props = {
    currentItem: ?React$Node,
    prevItem: ?React$Node,
    currentItemKey: ?string,
    prevItemKey: ?string,
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
        currentItemKey: null,
        prevItemKey: null,
        itemStyle: {},
        containerStyle: {},
    };

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

    componentDidUpdate(prevProps: Props) {
        if (this.props.currentItemKey !== prevProps.currentItemKey
            || this.props.prevItemKey !== prevProps.prevItemKey) {
            this.setStateSafely({
                currentItem: this.props.currentItem,
                prevItem: this.props.prevItem,
                currentItemOpacity: new Animated.Value(0),
                prevItemOpacity: new Animated.Value(1),
            }, this.updateCallback);
        }
    }

    updateCallback = () => {
        Animated.parallel([
            Animated.spring(this.getCurrentItemOpacity(), { // looks better than `timing`
                toValue: 1.0,
                useNativeDriver: true,
            }),
            Animated.spring(this.getPrevItemOpacity(), {
                toValue: 0.0,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Getters
    getCurrentItem(): ?React$Node {
        return this.state.currentItem;
    }

    getPrevItem(): ?React$Node {
        return this.state.prevItem;
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
            <View style={[UIStyle.Common.flex(), this.props.containerStyle]}>
                {this.renderItem(prevItem, false)}
                {this.renderItem(currentItem, true)}
            </View>
        );
    }
}
