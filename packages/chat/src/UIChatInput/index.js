// @flow
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Platform, Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/uikit.localization';
import {
    UITextButton,
    UIButtonGroup,
    UIDetailsInput,
} from '@tonlabs/uikit.components';
import { UIPopoverMenu } from '@tonlabs/uikit.navigation';
import type { DetailsProps } from '@tonlabs/uikit.components/UIDetailsInput';
import type { ActionState } from '@tonlabs/uikit.components/UIActionComponent';
import type { MenuItemType } from '@tonlabs/uikit.navigation/UIActionSheet/MenuItem';
import btnPlus from '@tonlabs/uikit.assets/icon-plus/add.png';
import btnPlusDisabled from '@tonlabs/uikit.assets/icon-plus-disabled/add.png';
import btnDots from '@tonlabs/uikit.assets/btn_dots/btn_dots.png';
import btnSend from '@tonlabs/uikit.assets/btn_msg_send/btn_msg_send.png';
import stickerEnabled from '@tonlabs/uikit.assets/btn_sticker_enabled/stickerEnabled.png';
import stickerDisabled from '@tonlabs/uikit.assets/btn_sticker_disabled/stickerDisabled.png';

type Props = DetailsProps & {
    containerStyle?: ViewStyleProp,
    menuPlus?: ?MenuItemType[],
    menuMore?: ?MenuItemType[],
    menuPlusDisabled?: boolean,
    menuMoreDisabled?: boolean,
    inputHidden?: boolean,
    showBorder?: boolean,
    hasStickers?: boolean,
    stickersActive?: boolean,

    quickAction?: ?MenuItemType[],

    onSendText?: (text: string) => void,
    onHeightChange: (height: number) => void,
    onStickersPress?: (visible: boolean) => void,
};

type State = ActionState & {
    inputHeight: number,
    inputWidth: number,
    heightChanging: boolean,
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
        flex: 1,
        marginVertical: 0,
        paddingBottom: Platform.select({ // compensate mobile textContainer's default padding
            android: 10,
            ios: 17,
            web: 15,
        }),
        paddingTop: Platform.select({ // compensate mobile textContainer's default padding
            android: 10,
            ios: 0, // has it's own top padding in a native text container
            web: 10,
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
        placeholder: uiLocalized.TypeMessage,
        secondaryPlaceholder: uiLocalized.TypeMessage,
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

    onSendText(text: string) {
        const { onSendText } = this.props;
        if (onSendText) {
            onSendText(text);
        }
    }

    onStickersPress = (newState: boolean) => {
        const { onStickersPress } = this.props;
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

        const { stickersActive } = this.props;
        return (
            <TouchableOpacity
                style={styles.buttonContainer}
                testID="stickers_btn"
                onPress={() => this.onStickersPress(!stickersActive)}
            >
                <Image
                    style={styles.icon}
                    source={!stickersActive ? stickerEnabled : stickerDisabled}
                />
            </TouchableOpacity>
        );
    }

    renderInputArea() {
        if (this.props.inputHidden) {
            return null;
        }
        const minHeight = Platform.OS === 'android' ? { height: this.state.inputHeight } : null;
        return (
            <View style={minHeight}>
                {this.renderAuxTextInput()}
                {this.renderTextInput()}
            </View>
        );
    }

    renderTextFragment(): React$Node {
        return (
            <View style={styles.container}>
                {this.renderPlusMenu()}
                <View style={styles.inputMsg}>
                    {this.renderInputArea()}
                </View>
                {this.renderStickerButton()}
                {this.renderQuickAction()}
                {this.renderMoreMenu()}
            </View>
        );
    }
}
