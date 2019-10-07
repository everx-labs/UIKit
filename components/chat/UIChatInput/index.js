// @flow
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Platform, Image, View, StyleSheet, TouchableHighlight } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UITextButton from '../../buttons/UITextButton';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';
import UIStyle from '../../../helpers/UIStyle';
import UIMenuView from '../../menus/UIMenuView';
import UIButtonGroup from '../../buttons/UIButtonGroup';
import UIDetailsInput from '../../input/UIDetailsInput';

import type { DetailsProps } from '../../input/UIDetailsInput';
import type { ActionState } from '../../UIActionComponent';
import type { MenuItemType } from '../../menus/UIActionSheet/MenuItem';

import btnPlus from '../../../assets/btn_plus/btn_plus.png';
import btnDots from '../../../assets/btn_dots/btn_dots.png';
import btnSend from '../../../assets/btn_msg_send/btn_msg_send.png';

type Props = DetailsProps & {
    containerStyle?: ViewStyleProp,
    menuPlus?: ?MenuItemType[],
    menuMore?: ?MenuItemType[],
    quickAction?: ?MenuItemType[],

    onSendText?: (text: string) => void,
};

type State = ActionState & {
    inputHeight: number,
    inputWidth: number,
    heightChanging: boolean,
};

const styles = StyleSheet.create({
    btnMenuContainer: {
        alignSelf: 'flex-end',
        marginHorizontal: UIConstant.smallContentOffset(),
    },
    btnMenu: {
        alignItems: 'center',
        justifyContent: 'center',
        height: UIConstant.smallButtonHeight(),
        width: UIConstant.smallButtonHeight(),
        bottom: UIConstant.smallContentOffset() - 1,
    },
    btnSend: {
        height: UIConstant.defaultCellHeight(),
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    inputMsg: {
        marginVertical: 0,
        paddingBottom: Platform.select({ // compensate mobile textContainer's default padding
            ios: 10,
            android: 10,
        }),
    },
});

export default class UIChatInput extends UIDetailsInput<Props, State> {
    static defaultProps: Props = {
        ...UIDetailsInput.defaultProps,
        autoCapitalize: 'sentences',
        placeholder: UILocalized.TypeMessage,
        hideBottomLine: true,
        autoFocus: false,
        containerStyle: { },
        floatingTitle: false,
        hideFloatingTitle: true,
        forceMultiLine: true,
        keyboardType: 'default',

        onSendText: (text: string) => {},
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.state,
            inputHeight: UIConstant.smallCellHeight(),
            inputWidth: UIConstant.toastWidth(),
            heightChanging: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    // Setters
    setInputHeight(inputHeight: number) {
        this.setStateSafely({ inputHeight });
    }

    setHeightChanging(heightChanging: boolean, callback?: () => void) {
        this.setStateSafely({ heightChanging }, callback);
    }

    // Getters
    getInputHeight(): number {
        return this.state.inputHeight;
    }

    numOfLines(): number {
        return Math.round(this.getInputHeight() / UIConstant.smallCellHeight());
    }

    isHeightChanging(): boolean {
        return this.state.heightChanging;
    }

    // Events
    onLayout(e: any) {
        const { nativeEvent } = e;
        // If the browser window is resized, this forces the input
        // to adjust its size so that the full phrase is displayed.
        if (Platform.OS === 'web') {
            this.onChange(e);
        }
        if (nativeEvent) {
            const { layout } = nativeEvent;
            this.setStateSafely({ inputWidth: layout.width });
        }
    }

    onContentSizeChange(height: number) {
        this.setInputHeight(height);
    }

    onSendText(text: string) {
        const { onSendText } = this.props;
        if (onSendText) {
            onSendText(text);
        }
    }

    // Render
    renderQuickAction() {
        const { quickAction, menuMore } = this.props;
        const val = this.getValue();

        if (val.length > 0) {
            return (
                <View style={menuMore ? styles.btnSend : UIStyle.Margin.rightDefault()}>
                    <TouchableHighlight
                        testID="send_btn"
                        onPress={() => this.onSendText(val)}
                    >
                        <Image source={btnSend} />
                    </TouchableHighlight>
                </View>
            );
        }
        if (!quickAction) {
            return null;
        }
        return (
            <UIButtonGroup style={menuMore ? null : UIStyle.Margin.rightSmall()}>
                {
                    quickAction.map(action => (
                        <UITextButton
                            buttonStyle={styles.btnMenuContainer}
                            testID={action.testID}
                            onPress={action.onPress}
                            title={action.title}
                        />
                    ))
                }
            </UIButtonGroup>
        );
    }

    renderMenu(isMenuPlus: boolean = false) {
        const { menuPlus, menuMore } = this.props;
        if ((isMenuPlus && !menuPlus) || (!isMenuPlus && !menuMore)) {
            return null;
        }

        const items = isMenuPlus ? menuPlus : menuMore;
        const img = isMenuPlus ? btnPlus : btnDots;

        return (
            <View style={styles.btnMenuContainer}>
                <UIMenuView
                    testID="menu_view"
                    menuItemsList={items}
                    placement="top"
                >
                    <View style={styles.btnMenu}>
                        <Image source={img} />
                    </View>
                </UIMenuView>
            </View>
        );
    }

    renderTextFragment() {
        return (
            <React.Fragment>
                {this.renderMenu(true)}
                <View style={[UIStyle.Flex.x1(), styles.inputMsg]}>
                    {this.renderAuxTextInput()}
                    {this.renderTextInput()}
                </View>
                {this.renderQuickAction()}
                {this.renderMenu()}
            </React.Fragment>
        );
    }
}
