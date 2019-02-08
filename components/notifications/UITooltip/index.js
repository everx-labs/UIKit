// @flow
import React from 'react';
import { View, TouchableOpacity, Platform, Text, StyleSheet, Dimensions } from 'react-native';

import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UIComponent from '../../UIComponent';
import UILayoutManager from '../../../helpers/UILayoutManager';
import UITextStyle from '../../../helpers/UITextStyle';
import UIDevice from '../../../helpers/UIDevice';

type Placement = 'top' | 'bottom' | 'left' | 'right';

type Props = {
    placement?: Placement,
    needCancelItem?: boolean,
    children?: Node,
    onCancelCallback?: () => void,
};

type State = {
    isVisible: boolean,
    triggerWidth: number,
    menuMarginLeft: number,
};

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
    static Placement = {
        Top: 'top',
        Bottom: 'bottom',
        Left: 'left',
        Right: 'right',
    };

    static showOnMouseForWeb(message) {
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

    static renderTooltip(message, containerStyle) {
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

    static calcPlacement(width, height, ax, ay) {
        const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

        const areBothOnScreen = (side) => {
            let result = true;
            const isPointOnScreen = ({ x, y }) => {
                return x >= 0 && x <= windowWidth && y >= 0 && y <= windowHeight;
            };
            Object.keys(side).forEach((pointName) => {
                result = result && isPointOnScreen(side[pointName]);
            });
            return result;
        };

        const leftX = ax + Math.floor((width - tooltipMaxWidth) / 2);
        const rightX = ax + Math.floor((width + tooltipMaxWidth) / 2);
        const southY = ay + height + tooltipOffset + tooltipMaxHeight;
        const bottom = {
            leftBottomPoint: { x: leftX, y: southY },
            rightBottomPoint: { x: rightX, y: southY },
        };
        if (areBothOnScreen(bottom)) {
            return {
                placement: UITooltip.Placement.Bottom,
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
        const left = {
            leftBottomPoint: { x: westX, y: bottomY },
            leftTopPoint: { x: westX, y: topY },
        };
        if (areBothOnScreen(left)) {
            return {
                placement: UITooltip.Placement.Left,
                containerStyle: styles.leftContainer,
                position: {
                    left: westX,
                    top: topY,
                },
            };
        }
        const northY = ay - tooltipOffset - tooltipMaxHeight;
        const top = {
            leftTopPoint: { x: leftX, y: northY },
            rightTopPoint: { x: rightX, y: northY },
        };
        if (areBothOnScreen(top)) {
            return {
                placement: UITooltip.Placement.Top,
                containerStyle: styles.topContainer,
                position: {
                    left: leftX,
                    top: northY,
                },
            };
        }

        // const eastX = ax + width + tooltipOffset + tooltipMaxWidth;
        // const right = {
        //     rightBottomPoint: { x: eastX, y: bottomY },
        //     rightTopPoint: { x: eastX, y: topY },
        // };
        // if (areBothOnScreen(right)) {

        // right as a default
        return {
            placement: UITooltip.Placement.Right,
            containerStyle: styles.rightContainer,
            position: {
                left: ax + width + tooltipOffset,
                top: topY,
            },
        };
    }

    constructor(props: Props) {
        super(props);
        this.triggerClassName = `tooltip-trigger-${this.props.classNameKey}`;
        this.isVisible = false;
    }

    componentDidMount() {
        super.componentDidMount();
        if (Platform.OS === 'web') {
            setTimeout(() => {
                this.initMouseOverListenerForWeb();
            }, 0);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (Platform.OS === 'web') {
            this.deinitMouseOverListenerForWeb();
        }
    }

    // Events
    onLongPress() {
        if (UIDevice.isMobile() || UIDevice.isTablet()) {
            this.show();
        }
    }

    onPressOut() {
        if (UIDevice.isMobile() || UIDevice.isTablet()) {
            this.hide();
        }
    }

    // Setters

    // Getters

    // Actions
    calcPreset() {
        return new Promise((resolve) => {
            this.trigger.measure((rx, ry, width, height, ax, ay) => {
                const result = UITooltip.calcPlacement(width, height, ax, ay);
                resolve(result);
            });
        });
    }

    async show() {
        if (!this.props.active) {
            return;
        }
        this.isVisible = true;
        if (masterMouseMoveListener) {
            UITooltip.deinitMouseMoveListenerForWeb();
        }
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
    render() {
        // This trick with class name required to suppress flow warning
        // on undeclared className prop.
        const setClassNameTrick: {} = {
            className: this.triggerClassName,
        };
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    {...setClassNameTrick}
                    onLongPress={() => this.onLongPress()}
                    onPressOut={() => this.onPressOut()}
                >
                    <View
                        ref={(component) => { this.trigger = component; }}
                        pointerEvents="none"
                    >
                        {this.props.children}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    static defaultProps: Props;
}

UITooltip.defaultProps = {
    message: '',
    classNameKey: '',
    active: false,
};
