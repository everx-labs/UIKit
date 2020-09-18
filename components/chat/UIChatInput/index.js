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

import btnPlus from '../../../assets/icon-plus/add.png';
import btnPlusDisabled from '../../../assets/icon-plus-disabled/add.png';
import btnDots from '../../../assets/btn_dots/btn_dots.png';
import btnSend from '../../../assets/btn_msg_send/btn_msg_send.png';

import stickerEnabled from '../../../assets/btn_sticker_enabled/stickerEnabled.png';
import stickerDisabled from '../../../assets/btn_sticker_disabled/stickerDisabled.png';

type Props = DetailsProps & {
    containerStyle?: ViewStyleProp,
    menuPlus?: ?MenuItemType[],
    menuMore?: ?MenuItemType[],
    menuPlusDisabled?: boolean,
    menuMoreDisabled?: boolean,
    inputHidden?: boolean,
    showBorder?: boolean,
    hasStickers?: boolean,

    quickAction?: ?MenuItemType[],

    onSendText?: (text: string) => void,
    onHeightChange: (height: number) => void,
    onStickersPress?: (visible: boolean) => void,
};

type State = ActionState & {
    inputHeight: number,
    inputWidth: number,
    heightChanging: boolean,
    stickersVisible: boolean,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    buttonContainer: {
        padding: UIConstant.contentOffset(),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: UIConstant.largeButtonHeight(),
    },
    icon: {
        height: UIConstant.iconSize(),
        width: UIConstant.iconSize(),
    },
    iconView: {
        height: UIConstant.iconSize(),
        width: UIConstant.iconSize(),
    },
    btnSend: {
        height: UIConstant.contentOffset(),
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    inputMsg: {
        marginVertical: 0,
        paddingBottom: Platform.select({ // compensate mobile textContainer's default padding
            ios: UIConstant.normalContentOffset(),
            android: UIConstant.normalContentOffset(),
            web: UIConstant.tinyContentOffset(),
        }),
    },
    inputView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default class UIChatInput extends UIDetailsInput<Props, State> {
    static defaultProps: Props = {
        ...UIDetailsInput.defaultProps,
        autoCapitalize: 'sentences',
        placeholder: UILocalized.TypeMessage,
        secondaryPlaceholder: UILocalized.TypeMessage,
        hideBottomLine: true,
        inputHidden: false,
        autoFocus: false,
        containerStyle: { },
        floatingTitle: false,
        hideFloatingTitle: true,
        forceMultiLine: true,
        hasStickers: false,
        keyboardType: 'default',

        onSendText: (text: string) => {},
        onStickersPress: () => {},
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.state,
            inputHeight: UIConstant.smallCellHeight(),
            inputWidth: UIConstant.toastWidth(),
            heightChanging: false,
            stickersVisible: false,
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

    onFocus = () => {
        this.setFocused();
        this.props.onFocus();
        this.onStickersPress(false);
    }

    onSendText(text: string) {
        const { onSendText } = this.props;
        if (onSendText) {
            onSendText(text);
        }
    }

    onStickersPress = (newState: boolean) => {
        const { onStickersPress } = this.props;

        this.setStateSafely({ stickersVisible: newState });
        if (onStickersPress) {
            onStickersPress(newState);
        }
    };

    // Styles
    textViewStyle(): * {
        return styles.inputView;
    }

    // Render
    renderQuickAction() {
        const { quickAction } = this.props;
        const val = this.getValue();

        if (val.length > 0) {
            return (
                <View>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        testID="send_btn"
                        onPress={() => this.onSendText(val)}
                    >
                        <Image source={btnSend} style={styles.icon} />
                    </TouchableOpacity>
                </View>
            );
        }

        if (!quickAction) {
            return null;
        }

        return (
            <UIButtonGroup>
                {quickAction.map((action, index) => (
                    <UITextButton
                        // eslint-disable-next-line
                        key={`quickAction~${index}`}
                        buttonStyle={styles.buttonContainer}
                        textStyle={UIStyle.text.bodyMedium()}
                        testID={action.testID}
                        onPress={action.onPress}
                        icon={action.icon}
                        title={action.title}
                        disableIconColor
                    />
                ))}
            </UIButtonGroup>
        );
    }

    renderPlusMenu() {
        const { menuPlus, menuPlusDisabled } = this.props;

        if (!menuPlus || menuPlus.length === 0) {
            return null;
        }

        if (!menuPlusDisabled) {
            if (menuPlus.length === 1) {
                return (
                    <TouchableOpacity
                        testID="menu_view"
                        onPress={menuPlus[0].onPress}
                        style={styles.buttonContainer}
                    >
                        <Image source={btnPlus} style={styles.icon} />
                    </TouchableOpacity>
                );
            }

            return (
                <UIPopoverMenu
                    testID="menu_view"
                    menuItemsList={menuPlus}
                    placement="top"
                >
                    <Image source={btnPlus} style={styles.icon} />
                </UIPopoverMenu>
            );
        }

        return (
            <View style={styles.buttonContainer}>
                <Image source={btnPlusDisabled} style={styles.icon} />
            </View>
        );
    }

    renderMoreMenu() {
        const { menuMore, menuMoreDisabled } = this.props;

        if (!menuMore || menuMore.length === 0) {
            return null;
        }

        const activeButton = () => {
            if (menuMore.length === 1) {
                return (
                    <TouchableOpacity onPress={menuMore[0].onPress}>
                        <Image source={btnDots} />
                    </TouchableOpacity>
                );
            }
            return (
                <UIPopoverMenu
                    testID="menu_view"
                    menuItemsList={menuMore}
                    placement="top"
                >
                    <Image source={btnDots} />
                </UIPopoverMenu>
            );
        };

        return (
            <View style={styles.buttonContainer}>
                <View style={styles.iconView}>
                    {!menuMoreDisabled
                        ? activeButton()
                        // TODO: support btnDotsDisabled
                        : (<Image source={btnDots} />)
                    }
                </View>
            </View>
        );
    }

    renderStickerButton() {
        if (!this.props.hasStickers) {
            return null;
        }

        const val = this.getValue();

        if (val.length > 0) {
            this.onStickersPress(false);
            return null;
        }

        const { stickersVisible } = this.state;
        return (
            <TouchableOpacity
                style={styles.buttonContainer}
                testID="stickers_btn"
                onPress={() => this.onStickersPress(!stickersVisible)}
            >
                <Image
                    style={styles.icon}
                    source={stickersVisible ? stickerDisabled : stickerEnabled}
                />
            </TouchableOpacity>
        );
    }

    renderInputArea() {
        if (this.props.inputHidden) {
            return null;
        }

        return (
            <View>
                {this.renderAuxTextInput()}
                {this.renderTextInput()}
            </View>
        );
    }

    renderTextFragment(): React$Node {
        return (
            <View style={[styles.container]}>
                {this.renderPlusMenu()}
                <View style={[UIStyle.flex.x1(), styles.inputMsg]}>
                    {this.renderInputArea()}
                </View>
                {this.renderStickerButton()}
                {this.renderQuickAction()}
                {this.renderMoreMenu()}
            </View>
        );
    }
}
