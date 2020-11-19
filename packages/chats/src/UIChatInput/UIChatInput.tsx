import * as React from 'react';
import { Platform } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
import { UIDetailsInput } from '@tonlabs/uikit.components';

import { MenuPlus } from './MenuPlus';
import { MenuMore } from './MenuMore';
import { QuickAction } from './QuickAction';
import { StickerButton } from './StickerButton';

import type { MenuItem } from './types';

type Props = {
    containerStyle?: StyleProp<ViewStyle>;

    menuPlus?: MenuItem[];
    menuPlusDisabled?: boolean;
    menuMore?: MenuItem[];
    menuMoreDisabled?: boolean;
    quickAction?: MenuItem[];

    inputHidden?: boolean;
    showBorder?: boolean;
    hasStickers?: boolean;
    stickersActive?: boolean;

    onSendText?: (text: string) => void;
    onStickersPress?: (visible: boolean) => void;
    // TODO: can we not expose it?
    onHeightChange: (height: number) => void;
};

export class TODOUIChatInput extends UIDetailsInput {
    static defaultProps: Props = {};

    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.state,
            inputHeight: UIConstant.smallCellHeight(),
            inputWidth: UIConstant.toastWidth(),
            heightChanging: false,
        };
    }

    // Setters
    setInputHeight(inputHeight: number) {
        this.setStateSafely({ inputHeight });
    }

    numOfLines(): number {
        return Math.round(
            this.state.inputHeight / UIConstant.smallCellHeight()
        );
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

    renderInputArea() {
        if (this.props.inputHidden) {
            return null;
        }
        const minHeight =
            Platform.OS === 'android'
                ? { height: this.state.inputHeight }
                : null;
        return (
            <View style={minHeight}>
                {this.renderAuxTextInput()}
                {this.renderTextInput()}
            </View>
        );
    }

    renderTextFragment() {
        return (
            <View>
                <MenuPlus
                    menuPlus={this.props.menuPlus}
                    menuPlusDisabled={this.props.menuPlusDisabled}
                />
                <View style={styles.inputMsg}>{this.renderInputArea()}</View>
                <StickerButton
                    hasStickers={this.props.hasStickers}
                    stickersActive={this.props.stickersActive}
                    value={this.getValue()}
                    onPress={this.onStickersPress}
                />
                <QuickAction
                    quickAction={this.props.quickAction}
                    value={this.getValue()}
                    onSendText={this.onSendText}
                />
                <MenuMore
                    menuMore={this.props.menuMore}
                    menuMoreDisabled={this.props.menuMoreDisabled}
                />
            </View>
        );
    }
}
