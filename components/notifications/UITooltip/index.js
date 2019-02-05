// @flow
import React from 'react';
import { View, TouchableOpacity, Platform, Text } from 'react-native';
import { Popover } from 'react-native-simple-popover';

// import UIConstant from '../../../helpers/UIConstant';
// import UIColor from '../../../helpers/UIColor';
import UIDevice from '../../../helpers/UIDevice';
import UIComponent from '../../UIComponent';

const TOOLTIP_TRIGGER = 'menu-trigger';

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

export default class UITooltip extends UIComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isVisible: false,
            triggerWidth: 0,
            menuMarginLeft: 0,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (Platform.OS === 'web') {
            this.initMouseOverListenerForWeb();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (Platform.OS === 'web') {
            this.deinitMouseOverListenerForWeb();
        }
    }

    // Events

    // Setters
    setIsVisible(isVisible: boolean = true) {
        this.setStateSafely({ isVisible });
    }

    setTriggerWidth(triggerWidth: number) {
        this.setStateSafely({ triggerWidth });
    }

    setMenuMarginLeft(menuMarginLeft: number) {
        this.setStateSafely({ menuMarginLeft });
    }

    // Getters
    getTriggerWidth(): number {
        return this.state.triggerWidth;
    }

    getMenuPaddingLeft(): number {
        return this.state.menuMarginLeft;
    }

    isVisible(): boolean {
        return this.state.isVisible;
    }

    // Actions
    showTooltip() {
        this.setIsVisible();
    }

    // hideMenu() {
    //     if (Platform.OS === 'web') {
    //         this.setIsVisible(false);
    //         this.deinitClickListenerForWeb();
    //     }
    // }

    initMouseOverListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        const listenerType = 'mouseover';
        this.mouseOverListener = (e: any) => {
            const triggers = Array.from(document.getElementsByClassName(TOOLTIP_TRIGGER));
            if (triggers && triggers.length) {
                const mouseOnTrigger = triggers.reduce((contains, trigger) => {
                    if (!contains) {
                        return trigger.contains(e.target);
                    }
                    return contains;
                }, false);
                if (mouseOnTrigger) {
                    this.showTooltip();
                }
            }
        };
        window.addEventListener(listenerType, this.mouseOverListener);
    }

    deinitMouseOverListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        const listenerType = UIDevice.isDesktopWeb() ? 'click' : 'touchend';
        window.removeEventListener(listenerType, this.clickListener);
    }

    // Render
    renderTooltip() {
        return (
            <View style={{ backgroundColor: 'black' }}>
                <Text>Some text</Text>
            </View>
        );
    }

    render() {
        // This trick with class name required to suppress flow warning
        // on undeclared className prop.
        const setClassNameTrick: {} = {
            className: TOOLTIP_TRIGGER,
        };
        return (
            <View style={{ flexDirection: 'row' }}>
                <Popover
                    placement={this.props.placement}
                    arrowWidth={0}
                    arrowHeight={0}
                    isVisible={this.isVisible()}
                    // pointerEvents="auto" // doesn't works for some reason
                    component={() => this.renderTooltip()}
                >
                    <TouchableOpacity
                        {...setClassNameTrick}
                        // onPress={() => this.openMenu()}
                        // onLayout={e => this.onTriggerLayout(e)}
                    >
                        <View pointerEvents="none">
                            {this.props.children}
                        </View>
                    </TouchableOpacity>
                </Popover>
            </View>
        );
    }

    clickListener: (e: any) => void;
    static defaultProps: Props;
}

UITooltip.defaultProps = {
    menuItemsList: [],
    placement: 'bottom',
    needCancelItem: true, // for iOS and Android only
    onCancelCallback: () => {
    }, // for iOS and Android only
};
