// @flow
import React from 'react';
import { PanResponder, Animated, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import StylePropType from 'react-style-proptype';

import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type { PanResponderInstance } from 'react-native/Libraries/Interaction/PanResponder';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';
import UIDot from '../../design/UIDot';

type Props = {
    containerStyle: StylePropType,
    maxWidth: number,
    itemsList: [],
    itemRenderer: (item: any) => ?React$Node,
    itemWidth: number,
};

type State = {
    activeIndex: number,
    marginLeft: number,
    dx: AnimatedValue,
};

const styles = StyleSheet.create({
    cardsContainer: {
        marginVertical: UIConstant.contentOffset(),
    },
    sliderContainer: {
        margin: -(UIConstant.hugeContentOffset() * 2),
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: UIConstant.iconSize(),
    },
});

export default class UISlider extends UIComponent<Props, State> {
    panResponder: PanResponderInstance;

    constructor(props: Props) {
        super(props);

        this.state = {
            activeIndex: 0,
            marginLeft: 0,
            dx: new Animated.Value(0),
        };

        this.panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            // Handling responder events
            onPanResponderMove: Animated.event(
                [null, { dx: this.state.dx }],
                {
                    useNativeDriver: true,
                    listener: (event, { dx }) => this.onMove(dx),
                },
            ),
            onPanResponderRelease: (evt, { dx }) => {
                this.onSwipeRelease(dx);
            },
        });
    }

    // Events
    onDotsPress() {
        const { itemsList, itemWidth } = this.props;
        const activeIndex = this.getActiveIndex();
        const newActiveIndex = (activeIndex + 1) % itemsList.length;
        this.setActiveIndex(newActiveIndex);

        const deltaX = (newActiveIndex - activeIndex) * itemWidth;
        this.setMarginLeft(-newActiveIndex * itemWidth);
        Animated.sequence([
            Animated.timing(this.state.dx, {
                toValue: deltaX,
                duration: 0,
            }),
            Animated.timing(this.state.dx, {
                toValue: 0,
                duration: UIConstant.animationDuration(),
            }),
        ]).start();
    }

    onSwipeRelease(dx: number) {
        const marginLeft = this.getMarginLeft();
        const currDx = marginLeft + dx;
        const { itemWidth } = this.props;

        const rounding = this.getRounding(dx);
        const newIndex = this.getIndex(currDx, rounding);
        const newDx = -newIndex * itemWidth;
        this.setMarginLeft(newDx);
        this.setActiveIndex(newIndex);
        Animated.sequence([
            Animated.timing(this.state.dx, {
                toValue: currDx - newDx,
                duration: 0,
            }),
            Animated.timing(this.state.dx, {
                toValue: 0,
                duration: UIConstant.animationDuration() / 2,
            }),
        ]).start();
    }

    onMove(dx: number) {
        const currDx = this.getMarginLeft() + dx;
        const newIndex = this.getIndex(currDx);
        this.setActiveIndex(newIndex);
    }

    // Setters
    setActiveIndex(activeIndex: number) {
        this.setStateSafely({ activeIndex });
    }

    setMarginLeft(marginLeft: number) {
        this.setStateSafely({ marginLeft });
    }

    setDx(dx: AnimatedValue) {
        this.setStateSafely({ dx });
    }

    // Getters
    getActiveIndex() {
        return this.state.activeIndex;
    }

    getMarginLeft() {
        return this.state.marginLeft;
    }

    getDx() {
        return this.state.dx;
    }

    getMarginLeftFromDx() {
        const marginLeft = this.getMarginLeft();
        return Animated.add(new Animated.Value(marginLeft), this.getDx());
    }

    getIndex(currDx: number, rounding: ((number) => number) = Math.round) {
        const { itemsList, itemWidth } = this.props;
        let result = rounding(-currDx / itemWidth);
        if (result > itemsList.length - 1) {
            result = itemsList.length - 1;
        } else if (result < 0) {
            result = 0;
        }
        return result;
    }

    getRounding(dx: number) {
        if (dx > UIConstant.smallSwipeThreshold()) {
            return Math.floor;
        }
        if (dx < -UIConstant.smallSwipeThreshold()) {
            return Math.ceil;
        }
        return Math.round;
    }

    // Actions

    // Render
    renderDots() {
        const { itemsList } = this.props;
        const dots = itemsList.map((item, index) => {
            if (index === this.getActiveIndex()) {
                return <UIDot key={`slider-dot-${Math.random()}`} type={UIDot.Type.Line} />;
            }
            return <UIDot key={`slider-dot-${Math.random()}`} />;
        });
        return (
            <TouchableWithoutFeedback onPress={() => this.onDotsPress()}>
                <View style={styles.dotsContainer}>
                    {dots}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        const { itemsList, itemRenderer } = this.props;
        const cards = itemsList.map(itemRenderer);
        const marginLeft = this.getMarginLeftFromDx();
        return (
            <View style={this.props.containerStyle}>
                <Animated.View
                    style={[UIStyle.flexRow, styles.cardsContainer, { marginLeft }]}
                >
                    {cards}
                    <View
                        {...this.panResponder.panHandlers}
                        style={[UIStyle.absoluteFillObject, styles.sliderContainer]}
                    />
                </Animated.View>
                {this.renderDots()}
            </View>
        );
    }

    static defaultProps: Props;
}

UISlider.defaultProps = {
    containerStyle: {},
    maxWidth: 0,
    itemsList: [],
    itemRenderer: () => {},
    itemWidth: 0,
};
