// @flow
import React from 'react';
import {
    PanResponder,
    Animated,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
} from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type { PanResponderInstance } from 'react-native/Libraries/Interaction/PanResponder';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';
import UIDot from '../../design/UIDot';
import UIDevice from '../../../helpers/UIDevice';

type Props = {
    containerStyle: ViewStyleProp,
    maxWidth: number,
    itemsList: [],
    itemRenderer: (item: any) => ?React$Node,
    itemWidth: number,
};

type State = {
    mouseDown: boolean,
    activeIndex: number,
    marginLeft: number,
    dx: AnimatedValue,
};

type DXType = { dx: number };

const styles = StyleSheet.create({
    cardsContainer: {
        marginVertical: UIConstant.contentOffset(),
    },
    sliderContainer: {
        margin: -UIConstant.contentOffset(),
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
            mouseDown: false,
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
            onPanResponderMove: (evt, gestureState) => {
                if (!UIDevice.isDesktopWeb() || this.isMouseDown()) {
                    return Animated.event(
                        [null, { dx: this.state.dx }],
                        {
                            useNativeDriver: true,
                            listener: this.onMove,
                        },
                    )(evt, gestureState);
                }
                return true;
            },
            onPanResponderRelease: this.onSwipeRelease,
        });
    }

    // Events
    onDotsPress = () => {
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
    };

    onSwipeRelease = (evt: any, { dx }: DXType) => {
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
    };

    onMove = (event: any, { dx }: DXType) => {
        if (UIDevice.isDesktopWeb() && !this.isMouseDown()) {
            this.onSwipeRelease(null, { dx });
        } else {
            const currDx = this.getMarginLeft() + dx;
            const newIndex = this.getIndex(currDx);
            this.setActiveIndex(newIndex);
        }
    };

    onMouseDown = (event: any) => {
        event.preventDefault();
        this.setMouseDown();
        setTimeout(() => {
            this.setMouseDown(false);
        }, 2000);
    };

    onMouseUp = () => {
        this.setMouseDown(false);
    };

    // Setters
    setMouseDown(mouseDown: boolean = true) {
        this.setStateSafely({ mouseDown });
    }

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

    isMouseDown() {
        return this.state.mouseDown;
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

    getResponder() {
        let webResponder = null;
        if (UIDevice.isDesktopWeb()) {
            webResponder = {
                onMouseDown: this.onMouseDown,
                onMouseUp: this.onMouseUp,
            };
        }

        return {
            ...this.panResponder.panHandlers,
            ...webResponder,
        };
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
            <TouchableWithoutFeedback onPress={this.onDotsPress}>
                <View style={styles.dotsContainer}>
                    {dots}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        const { itemsList, itemRenderer, containerStyle } = this.props;
        if (!itemsList.length) {
            return null;
        }

        const cards = itemsList.map(itemRenderer);
        if (itemsList.length === 1) {
            return (
                <View style={containerStyle}>
                    {cards}
                </View>
            );
        }

        const marginLeft = this.getMarginLeftFromDx();
        const responder: any = this.getResponder();
        return (
            <View style={containerStyle}>
                <Animated.View
                    style={[UIStyle.flexRow, styles.cardsContainer, { marginLeft }]}
                >
                    {cards}
                    <View
                        {...responder}
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
