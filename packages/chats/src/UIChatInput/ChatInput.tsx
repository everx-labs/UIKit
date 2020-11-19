import * as React from 'react';
import { Platform, StyleSheet, View, TextInput } from 'react-native';

import { UIConstant, UIColor, UIStyle } from '@tonlabs/uikit.core';
import { UIDetailsInput } from '@tonlabs/uikit.components';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { MenuPlus } from './MenuPlus';
import { MenuMore } from './MenuMore';
import { QuickAction } from './QuickAction';
import { StickerButton } from './StickerButton';

import type { MenuItem } from './types';

import { useTheme } from '../useTheme';

const MAX_INPUT_LENGTH = 320;

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

export function ChatInput(props: Props) {
    const theme = useTheme();
    const [inputHeight, setInputHeight] = React.useState(
        UIConstant.smallCellHeight()
    );
    const onContentSizeChange = React.useCallback((event: any) => {
        if (Platform.OS !== 'web' && event && event.nativeEvent) {
            const { contentSize } = event.nativeEvent;
            const height = contentSize?.height || 0;
            if (height > 0) {
                this.onHeightChange(height);
            }

            if (props.onHeightChange) {
                props.onHeightChange(height);
            }

            if (Platform.OS === 'ios') {
                // iOS input have the own multiline native auto-grow behaviour
                // No need to adjust the height
                return;
            }
            const constrainedHeight = Math.min(
                height,
                UIConstant.smallCellHeight() * 5
            );
            setInputHeight(constrainedHeight);
        }
    }, []);
    return (
        <View style={styles.container}>
            <MenuPlus
                menuPlus={props.menuPlus}
                menuPlusDisabled={props.menuPlusDisabled}
            />
            <View style={styles.inputMsg}>
                <TextInput
                    testID="chat_input"
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    keyboardType="default"
                    maxLength={MAX_INPUT_LENGTH}
                    multiline={true}
                    numberOfLines={Math.round(
                        inputHeight / UIConstant.smallCellHeight()
                    )}
                    noPersonalizedLearning={false}
                    clearButtonMode="never"
                    placeholder={uiLocalized.TypeMessage}
                    placeholderTextColor={UIColor.textPlaceholder(theme)}
                    underlineColorAndroid="transparent"
                    onContentSizeChange={onContentSizeChange}
                    style={[
                        { padding: 0 },
                        UIColor.textPrimaryStyle(theme),
                        UIStyle.text.bodyRegular(),
                        // We remove the fontFamily for Android in oder to eliminate jumping input behaviour
                        Platform.OS === 'android'
                            ? { fontFamily: undefined }
                            : {},
                        UIStyle.common.flex(),
                        {
                            marginTop:
                                Platform.OS === 'ios' &&
                                process.env.NODE_ENV === 'production'
                                    ? 5 // seems to be smth connected to iOS's textContainerInset
                                    : 0,
                            maxHeight: UIConstant.chatInputMaxHeight(),
                            ...(Platform.OS === 'android'
                                ? { minHeight: inputHeight }
                                : null),
                        },
                    ]}
                />
            </View>
            <StickerButton
                hasStickers={props.hasStickers}
                stickersActive={props.stickersActive}
                // value={this.getValue()}
                // onPress={this.onStickersPress}
            />
            <QuickAction
                quickAction={props.quickAction}
                // value={this.getValue()}
                // onSendText={this.onSendText}
            />
            <MenuMore
                menuMore={props.menuMore}
                menuMoreDisabled={props.menuMoreDisabled}
            />
        </View>
    );
}
