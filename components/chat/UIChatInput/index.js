// @flow
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Platform, Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UITextButton from '../../buttons/UITextButton';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';
import UIStyle from '../../../helpers/UIStyle';
import UIButtonGroup from '../../buttons/UIButtonGroup';
import UIDetailsInput from '../../input/UIDetailsInput';
import UIPopoverMenu from '../../menus/UIPopoverMenu';

import type { DetailsProps } from '../../input/UIDetailsInput';
import type { ActionState } from '../../UIActionComponent';
import type { MenuItemType } from '../../menus/UIActionSheet/MenuItem';

import btnPlus from '../../../assets/btn_plus/btn_plus.png';
import btnDots from '../../../assets/btn_dots/btn_dots.png';
import btnSend from '../../../assets/btn_msg_send/btn_msg_send.png';
import btnPlusDisabled from '../../../assets/btn_plus_disabled/btn_plus_disabled.png';

type Props = DetailsProps & {
    containerStyle?: ViewStyleProp,
    menuPlus?: ?MenuItemType[],
    menuMore?: ?MenuItemType[],
    menuPlusDisabled?: boolean,
    menuMoreDisabled?: boolean,

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
        justifyContent: 'center',
        alignItems: 'center',
        height: UIConstant.defaultCellHeight(),
    },
    btnMenu: {
        alignItems: 'center',
        justifyContent: 'center',
        height: UIConstant.smallButtonHeight(),
        width: UIConstant.smallButtonHeight(),
    },
    btnSend: {
        height: UIConstant.defaultCellHeight(),
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    inputMsg: {
        marginVertical: 0,
        paddingBottom: Platform.select({ // compensate mobile textContainer's default padding
            ios: UIConstant.smallContentOffset(),
            android: UIConstant.smallContentOffset(),
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
    onMobileChange(event: any) {
        // Seems that it is not necessary anymore to handle the auto-growing behavior
        // on Android. So, I'm not removing the method from the UIDetailsInput class
        // and instead overriding it in here to avoid introduce any possible unexpected
        // behavior.
    }

    onLayout = (e: any) => {
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
    };

    onContentSizeChange = (height: number) => {
        this.setInputHeight(height);
    };

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
                    <TouchableOpacity
                        style={styles.btnMenuContainer}
                        testID="send_btn"
                        onPress={() => this.onSendText(val)}
                    >
                        <Image source={btnSend} />
                    </TouchableOpacity>
                </View>
            );
        }
        if (!quickAction) {
            return null;
        }
        return (
            <UIButtonGroup style={menuMore ? null : UIStyle.Margin.rightSmall()}>
                {
                    quickAction.map((action, index) => (
                        <UITextButton
                            // eslint-disable-next-line
                            key={`quickAction~${index}`}
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

    renderPlusMenu() {
        const { menuPlus, menuPlusDisabled } = this.props;

        if (!menuPlus) {
            return null;
        }

        return (
            <View style={styles.btnMenuContainer}>
                <View style={styles.btnMenu}>
                    {!menuPlusDisabled
                        ? (
                            <UIPopoverMenu
                                testID="menu_view"
                                menuItemsList={menuPlus}
                                placement="top"
                            >
                                <Image source={btnPlus} />
                            </UIPopoverMenu>
                        )
                        : (<Image source={btnPlusDisabled} />)
                    }
                </View>
            </View>
        );
    }

    renderMoreMenu() {
        const { menuMore, menuMoreDisabled } = this.props;

        if (!menuMore) {
            return null;
        }

        return (
            <View style={styles.btnMenuContainer}>
                <View style={styles.btnMenu}>
                    {!menuMoreDisabled
                        ? (
                            <UIPopoverMenu
                                testID="menu_view"
                                menuItemsList={menuMore}
                                placement="top"
                            >
                                <Image source={btnDots} />
                            </UIPopoverMenu>
                        )
                        // TODO: support btnDotsDisabled
                        : (<Image source={btnDots} />)
                    }
                </View>
            </View>
        );
    }

    renderTextFragment() {
        return (
            <React.Fragment>
                {this.renderPlusMenu()}
                <View style={[UIStyle.displayFlex.x1(), styles.inputMsg]}>
                    <View>
                        {this.renderAuxTextInput()}
                        {this.renderTextInput()}
                    </View>
                </View>
                {this.renderQuickAction()}
                {this.renderMoreMenu()}
            </React.Fragment>
        );
    }
}
