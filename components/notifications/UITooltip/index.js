// @flow
import React from 'react';
import { View, TouchableOpacity, Platform, Text, StyleSheet, Dimensions } from 'react-native';
import type { NativeMethodsMixinType } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import StylePropType from 'react-style-proptype';
import type { Node } from 'react';
import type { EventProps } from '../../../types';

import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UIComponent from '../../UIComponent';
import UILayoutManager from '../../../helpers/UILayoutManager';
import UITextStyle from '../../../helpers/UITextStyle';
import UIDevice from '../../../helpers/UIDevice';

import type { Position } from '../../../helpers/UILayoutManager';
import UIStyle from '../../../helpers/UIStyle';

type Props = {
    message: string,
    active: boolean,
    children: Node,
    containerStyle: ?StylePropType,
};

type State = {};

type Point = { x: number, y: number };
type Preset = { position: Position, containerStyle: StylePropType };

const tooltipDelay = 200;
const tooltipFadein = 200;
const tooltipFadeout = 100;
const tooltipAnimation = {
    type: UILayoutManager.Animation.Fade,
    showDuration: tooltipFadein,
    hideDuration: tooltipFadeout,
    delay: tooltipDelay,
};

const tooltipOffset = UIConstant.contentOffset();
const tooltipMaxHeight = UIConstant.tooltipMaxHeight();
const tooltipMaxWidth = UIConstant.tooltipMaxWidth();

const styles = StyleSheet.create({
    tooltipContainer: {
        width: tooltipMaxWidth,
        height: tooltipMaxHeight,
    },
    tooltip: {
        maxHeight: tooltipMaxHeight,
        backgroundColor: UIColor.black(),
        borderRadius: UIConstant.smallBorderRadius(),
        padding: UIConstant.smallContentOffset(),
        overflow: 'hidden',
    },
    leftContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    topContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    rightContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    topRightContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    onMouseContainer: {
        padding: UIConstant.mediumContentOffset(),
    },
});

let masterMouseMoveListener = null;

export default class UITooltip extends UIComponent<Props, State> {
    static showOnMouseForWeb(message: string) {
        UITooltip.initMouseMoveListenerForWeb();
        UILayoutManager.showComponent({
            component: UITooltip.renderTooltip(message, styles.onMouseContainer),
            animation: tooltipAnimation,
        });
    }

    static hideOnMouseForWeb() {
        UILayoutManager.hideComponent();
        UITooltip.deinitMouseMoveListenerForWeb();
    }

    static initMouseMoveListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        UITooltip.deinitMouseMoveListenerForWeb();
        masterMouseMoveListener = (e: any) => {
            UILayoutManager.setPosition({ top: e.pageY, left: e.pageX });
        };
        window.addEventListener('mousemove', masterMouseMoveListener);
    }

    static deinitMouseMoveListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        if (!masterMouseMoveListener) {
            return;
        }
        window.removeEventListener('mousemove', masterMouseMoveListener);
        masterMouseMoveListener = null;
    }

    static renderTooltip(message: string, containerStyle: StylePropType) {
        return (
            <View style={[styles.tooltipContainer, containerStyle]}>
                <View style={styles.tooltip}>
                    <Text
                        style={UITextStyle.whiteTinyRegular}
                        numberOfLines={5}
                        ellipsizeMode="tail"
                    >
                        {message}
                    </Text>
                </View>
            </View>
        );
    }

    static calcPreset(width: number, height: number, ax: number, ay: number): Preset {
        const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

        const isPointOnScreen = ({ x, y }: Point) => {
            return x >= 0 && x <= windowWidth && y >= 0 && y <= windowHeight;
        };

        const arePointsOnScreen = (side: Point[]) => {
            let result = true;
            side.forEach((point: Point) => {
                result = result && isPointOnScreen(point);
            });
            return result;
        };

        const leftX = ax + Math.floor((width - tooltipMaxWidth) / 2);
        const rightX = ax + Math.floor((width + tooltipMaxWidth) / 2);
        const southY = ay + height + tooltipOffset + tooltipMaxHeight;
        const bottomSide = [
            { x: leftX, y: southY },
            { x: rightX, y: southY },
        ];
        if (arePointsOnScreen(bottomSide)) {
            return {
                containerStyle: UIStyle.alignCenter,
                position: {
                    left: leftX,
                    top: ay + height + tooltipOffset,
                },
            };
        }
        const westX = ax - tooltipOffset - tooltipMaxWidth;
        const bottomY = ay + Math.floor((height + tooltipMaxHeight) / 2);
        const topY = ay + Math.floor((height - tooltipMaxHeight) / 2);
        const leftSide = [
            { x: westX, y: bottomY },
            { x: westX, y: topY },
        ];
        if (arePointsOnScreen(leftSide)) {
            return {
                containerStyle: styles.leftContainer,
                position: {
                    left: westX,
                    top: topY,
                },
            };
        }
        const northY = ay - tooltipOffset - tooltipMaxHeight;
        const topSide = [
            { x: leftX, y: northY },
            { x: rightX, y: northY },
        ];
        if (arePointsOnScreen(topSide)) {
            return {
                containerStyle: styles.topContainer,
                position: {
                    left: leftX,
                    top: northY,
                },
            };
        }

        const eastX = ax + width + tooltipOffset + tooltipMaxWidth;
        const rightSide = [
            { x: eastX, y: bottomY },
            { x: eastX, y: topY },
        ];
        if (arePointsOnScreen(rightSide)) {
            return {
                containerStyle: styles.rightContainer,
                position: {
                    left: ax + width + tooltipOffset,
                    top: topY,
                },
            };
        }

        // on bottom at left or right side as default
        const bottomPoint = { x: 0, y: southY };
        if (isPointOnScreen(bottomPoint)) {
            if (ax < windowWidth / 2) {
                return {
                    containerStyle: null,
                    position: {
                        left: UIConstant.contentOffset(),
                        top: ay + height + tooltipOffset,
                    },
                };
            }
            return {
                containerStyle: UIStyle.alignEnd,
                position: {
                    left: windowWidth - tooltipOffset - tooltipMaxWidth,
                    top: ay + height + tooltipOffset,
                },
            };
        }

        // on top at left or right side as default
        const topPoint = { x: 0, y: northY };
        if (isPointOnScreen(topPoint)) {
            if (ax < windowWidth / 2) {
                return {
                    containerStyle: UIStyle.justifyEnd,
                    position: {
                        left: tooltipOffset,
                        top: northY,
                    },
                };
            }
            return {
                containerStyle: styles.topRightContainer,
                position: {
                    left: windowWidth - tooltipOffset - tooltipMaxWidth,
                    top: northY,
                },
            };
        }

        // bottom center of screen as default
        const leftDefault = (windowWidth - tooltipMaxWidth) / 2;
        const topDefault = windowHeight - UIConstant.contentOffset() - tooltipMaxHeight;
        return {
            containerStyle: styles.topContainer,
            position: {
                left: leftDefault,
                top: topDefault,
            },
        };
    }

    mouseOverListener: () => void;
    mouseOutListener: () => void;
    trigger: ?NativeMethodsMixinType;
    isVisible: boolean;

    constructor(props: Props) {
        super(props);
        this.isVisible = false;
    }

    // Events

    // Setters

    // Getters

    // Actions
    calcPreset(): Promise<Preset> {
        return new Promise((resolve: (result: Preset) => void) => {
            if (this.trigger) {
                this.trigger.measure((rx, ry, width, height, ax, ay) => {
                    const result = UITooltip.calcPreset(width, height, ax, ay);
                    resolve(result);
                });
            }
        });
    }

    async show() {
        console.log(111);
        if (!this.props.active) {
            return;
        }
        if (masterMouseMoveListener) {
            UITooltip.deinitMouseMoveListenerForWeb();
        }
        this.isVisible = true;
        const { containerStyle, position } = await this.calcPreset();
        const component = UITooltip.renderTooltip(this.props.message, containerStyle);
        UILayoutManager.showComponent({
            animation: tooltipAnimation,
            position,
            component,
        });
    }

    hide() {
        if (!this.isVisible) {
            return;
        }
        this.isVisible = false;
        UILayoutManager.hideComponent();
    }

    // Render
    renderTrigger() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View
                    ref={(component) => { this.trigger = component; }}
                >
                    {this.props.children}
                </View>
            </View>
        );
    }


    render() {
        if (UIDevice.isMobile() || UIDevice.isTablet()) {
            return (
                <View style={this.props.containerStyle}>
                    <TouchableOpacity
                        onPressIn={() => this.show()}
                        onPressOut={() => this.hide()}
                    >
                        {this.renderTrigger()}
                    </TouchableOpacity>
                </View>
            );
        }
        const onMouseEvents: EventProps = {
            onMouseEnter: () => this.show(),
            onMouseLeave: () => this.hide(),
        };
        return (
            <View
                style={this.props.containerStyle}
                {...onMouseEvents}
            >
                {this.renderTrigger()}
            </View>
        );
    }

    static defaultProps: Props;
}

UITooltip.defaultProps = {
    containerStyle: null,
    message: '',
    active: true,
    children: null,
};
