import * as React from 'react';
import { BackHandler, Platform, TextInput } from 'react-native';

import { uiLocalized } from '@tonlabs/localization';
import {
    useCustomKeyboard,
    UIInputAccessoryView,
    UICustomKeyboardView,
} from '@tonlabs/uikit.inputs';
import { UIPopup } from '@tonlabs/uikit.popups';
import type { UIMenuActionProps } from '@tonlabs/uikit.popups';

import { ChatInput } from './ChatInput';
import type { OnSendText, OnSendMedia, OnSendDocument, Shortcut, QuickActionItem } from './types';
import { ChatPicker, ChatPickerRef } from './ChatPicker';

function useMenuPlus(menuPlusHidden = false) {
    const chatPickerRef = React.useRef<ChatPickerRef>(null);
    const onPressImage = React.useCallback(() => {
        chatPickerRef.current?.openImageDialog();
    }, []);
    const onPressDocument = React.useCallback(() => {
        chatPickerRef.current?.openDocumentDialog();
    }, []);

    const menu: UIMenuActionProps[] = React.useMemo(() => {
        if (menuPlusHidden) {
            return [];
        }

        return [
            {
                type: UIPopup.Menu.Action.Type.Neutral,
                title: uiLocalized.Chats.Actions.AttachImage,
                onPress: onPressImage,
            },
            {
                type: UIPopup.Menu.Action.Type.Neutral,
                title: uiLocalized.Chats.Actions.AttachDocument,
                onPress: onPressDocument,
            },
        ];
    }, [menuPlusHidden, onPressImage, onPressDocument]);

    return {
        menuPlus: menu,
        chatPickerRef,
    };
}

export function useBackHandler(ref: React.RefObject<TextInput>, dismissKeyboard: () => void) {
    React.useEffect(() => {
        if (Platform.OS !== 'android') {
            return undefined;
        }

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (ref.current && ref.current.isFocused()) {
                dismissKeyboard();
                return true;
            }
            return false;
        });

        return () => {
            if (backHandler) {
                backHandler.remove();
            }
        };
    }, [ref, dismissKeyboard]);
}

export type UIChatInputProps = {
    editable: boolean;
    autoFocus?: boolean;
    placeholder?: string;
    shortcuts?: Shortcut[];
    menuPlusHidden?: boolean;
    menuPlusDisabled?: boolean;
    menuMoreDisabled?: boolean;
    quickActions?: QuickActionItem[];
    // TODO: revisit how it should work after it'll be integrated to Surf
    inputHidden?: boolean;

    onSendText: OnSendText;
    onSendMedia: OnSendMedia;
    onSendDocument: OnSendDocument;
    onCustomKeyboardVisible?: (visible: boolean) => void | Promise<void>;
    onMaxLength?: (maxValue: number) => void;

    customKeyboard?: UICustomKeyboardView;

    managedScrollViewNativeID?: string;
};

export function UIChatInput(props: UIChatInputProps) {
    const textInputRef = React.useRef<TextInput>(null);

    const {
        customKeyboardView,
        toggle: toggleKeyboard,
        dismiss: dismissKeyboard,
    } = useCustomKeyboard(textInputRef, props.customKeyboard);

    const { menuPlus, chatPickerRef } = useMenuPlus(props.menuPlusHidden);

    useBackHandler(textInputRef, dismissKeyboard);

    return (
        <UIInputAccessoryView
            managedScrollViewNativeID={props.managedScrollViewNativeID}
            customKeyboardView={customKeyboardView}
        >
            <ChatInput
                textInputRef={textInputRef}
                editable={props.editable}
                autoFocus={props.autoFocus}
                placeholder={props.placeholder}
                shortcuts={props.shortcuts}
                menuPlus={menuPlus}
                menuPlusDisabled={props.menuPlusDisabled}
                menuMore={undefined /* TODO: we not render it right now, but could at some point */}
                menuMoreDisabled={props.menuMoreDisabled}
                inputHidden={props.inputHidden}
                quickActions={props.quickActions}
                customKeyboardVisible={customKeyboardView != null}
                onCustomKeyboardPress={toggleKeyboard}
                customKeyboardButton={props.customKeyboard?.button}
                onSendText={props.onSendText}
                onFocus={dismissKeyboard}
                onMaxLength={props.onMaxLength}
            />
            <ChatPicker
                ref={chatPickerRef}
                onSendDocument={props.onSendDocument}
                onSendMedia={props.onSendMedia}
                dismissKeyboard={dismissKeyboard}
            />
        </UIInputAccessoryView>
    );
}
