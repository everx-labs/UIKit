// @flow
import React from 'react';
import { View, TouchableOpacity, Platform, Text, StyleSheet, Dimensions } from 'react-native';
import StylePropType from 'react-style-proptype';
import type { Node } from 'react';
import type { ReactFabricType } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';

import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UIComponent from '../../UIComponent';
import UILayoutManager from '../../../helpers/UILayoutManager';
import UITextStyle from '../../../helpers/UITextStyle';
import UIDevice from '../../../helpers/UIDevice';

type Props = {
    message: string,
    classNameKey: string,
    active: boolean,
    children: Node,
};

type State = {};

type Point = { x: number, y: number };
type Position = { left: number, top: number };
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
    bottomContainer: {
        alignItems: 'center',
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
                        style={[UITextStyle.whiteTinyRegular, { flex: 1 }]}
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

        const areBothOnScreen = (side: Point[]) => {
            let result = true;
            const isPointOnScreen = ({ x, y }: Point) => {
                return x >= 0 && x <= windowWidth && y >= 0 && y <= windowHeight;
            };
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
        if (areBothOnScreen(bottomSide)) {
            return {
                containerStyle: styles.bottomContainer,
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
        if (areBothOnScreen(leftSide)) {
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
        if (areBothOnScreen(topSide)) {
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
        if (areBothOnScreen(rightSide)) {
            return {
                containerStyle: styles.rightContainer,
                position: {
                    left: ax + width + tooltipOffset,
                    top: topY,
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
    trigger: ?ReactFabricType;
    isVisible: boolean;
    triggerClassName: string;

    constructor(props: Props) {
        super(props);
        this.triggerClassName = `tooltip-trigger-${this.props.classNameKey}`;
        this.isVisible = false;
    }

    componentDidMount() {
        super.componentDidMount();
        setTimeout(() => {
            this.initMouseOverListenerForWeb();
        }, 0);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.deinitMouseOverListenerForWeb();
    }

    // Events

    // Setters

    // Getters

    // Actions
    calcPreset() {
        return new Promise((resolve: (result: any) => void) => {
            if (this.trigger) {
                this.trigger.measure((rx, ry, width, height, ax, ay) => {
                    const result = UITooltip.calcPreset(width, height, ax, ay);
                    resolve(result);
                });
            }
        });
    }

    async show() {
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

    initMouseOverListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        this.mouseOverListener = () => {
            this.show();
        };
        this.mouseOutListener = () => {
            this.hide();
        };
        const trigger = document.getElementsByClassName(this.triggerClassName)[0];
        if (trigger) {
            trigger.addEventListener('mouseenter', this.mouseOverListener);
            trigger.addEventListener('mouseleave', this.mouseOutListener);
        }
    }

    deinitMouseOverListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        const trigger = document.getElementsByClassName(this.triggerClassName)[0];
        if (trigger) {
            trigger.removeEventListener('mouseenter', this.mouseOverListener);
            trigger.removeEventListener('mouseleave', this.mouseOutListener);
        }
    }

    // Render
    renderTrigger() {
        const setClassNameTrick: {} = {
            className: this.triggerClassName,
        };
        return (
            <View
                ref={(component) => { this.trigger = component; }}
                {...setClassNameTrick}
            >
                {this.props.children}
            </View>
        );
    }


    render() {
        // This trick with class name required to suppress flow warning
        // on undeclared className prop.
        if (UIDevice.isMobile() || UIDevice.isTablet()) {
            return (
                <TouchableOpacity
                    onLongPress={() => this.show()}
                    onPressOut={() => this.hide()}
                >
                    {this.renderTrigger()}
                </TouchableOpacity>
            );
        }
        return this.renderTrigger();
    }

    static defaultProps: Props;
}

UITooltip.defaultProps = {
    message: '',
    classNameKey: '',
    active: false,
    children: null,
};
