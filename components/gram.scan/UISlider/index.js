// @flow
import React from 'react';
import { PanResponder, Animated, TouchableWithoutFeedback, View } from 'react-native';

import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type { PanResponderInstance } from 'react-native/Libraries/Interaction/PanResponder';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';
import UIDot from '../../design/UIDot';

type Props = {
    screenWidth: number,
    maxWidth: number,
    itemsList: [],
    itemRenderer: (item: any) => ?React$Node,
    itemWidth: number,
};

type State = {
    activeIndex: number,
    marginLeft: AnimatedValue,
    moving: boolean,
};

export default class UISlider extends UIComponent<Props, State> {
    panResponder: PanResponderInstance;

    constructor(props: Props) {
        super(props);

        this.state = {
            activeIndex: 0,
            marginLeft: new Animated.Value(0),
            moving: false,
        };

        this.panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            // Handling responder events
            onPanResponderMove: (evt, { dx }) => {
                if (Math.abs(dx) > UIConstant.swipeTreshold()) {
                    this.onSwipe(dx);
                }
            },
        });
    }

    // Events
    onSwipe(dx: number) {
        if (this.isMoving()) {
            return;
        }
        const activeIndex = this.getActiveIndex();
        if (dx > 0) {
            if (activeIndex > 0) {
                this.animateMoving(activeIndex - 1);
            }
        } else if (activeIndex < this.props.itemsList.length - 1) {
            this.animateMoving(activeIndex + 1);
        }
    }

    onDotsPress() {
        const activeIndex = this.getActiveIndex();
        const newActiveIndex = (activeIndex + 1) % this.props.itemsList.length;
        this.animateMoving(newActiveIndex);
    }

    // Setters
    setActiveIndex(activeIndex: number) {
        this.setStateSafely({ activeIndex });
    }

    setMoving(moving: boolean = true) {
        this.setStateSafely({ moving });
    }

    setMarginLeft(marginLeft: AnimatedValue) {
        this.setStateSafely({ marginLeft });
    }

    // Getters
    getActiveIndex() {
        return this.state.activeIndex;
    }

    getMarginLeft() {
        return this.state.marginLeft;
    }

    isMoving() {
        return this.state.moving;
    }

    // Actions
    animateMoving(newActiveIndex: number) {
        this.setMoving();
        this.setActiveIndex(newActiveIndex);
        const newValue = -(newActiveIndex * this.props.itemWidth);
        Animated.timing(this.state.marginLeft, {
            toValue: newValue,
            duration: UIConstant.animationDuration(),
        }).start(() => {
            this.setMoving(false);
        });
    }

    // Render
    renderDots() {
        const { screenWidth, itemWidth, itemsList } = this.props;
        if (screenWidth > itemWidth * itemsList.length) {
            return null;
        }
        const dots = itemsList.map((item, index) => {
            if (index === this.getActiveIndex()) {
                return <UIDot key={`slider-dot-${Math.random()}`} type={UIDot.Type.Line} />;
            }
            return <UIDot key={`slider-dot-${Math.random()}`} />;
        });
        return (
            <TouchableWithoutFeedback onPress={() => this.onDotsPress()}>
                <View style={[UIStyle.centerContainer, UIStyle.marginTopDefault]}>
                    {dots}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        const { itemsList, itemRenderer } = this.props;
        const cards = itemsList.map(itemRenderer);
        const marginLeft = this.getMarginLeft();
        return (
            <React.Fragment>
                <Animated.View
                    {...this.panResponder.panHandlers}
                    style={[UIStyle.flexRow, UIStyle.marginTopDefault, { marginLeft }]}
                >
                    {cards}
                </Animated.View>
                {this.renderDots()}
            </React.Fragment>
        );
    }

    static defaultProps: Props;
}

UISlider.defaultProps = {
    screenWidth: 0,
    maxWidth: 0,
    itemsList: [],
    itemRenderer: () => {},
    itemWidth: 0,
};
