import * as React from 'react';
import { BackHandler, Platform, TextInput } from 'react-native';

import { uiLocalized } from '@tonlabs/uikit.localization';
import {
    UICustomKeyboard,
    useCustomKeyboard,
    UICustomKeyboardItem,
    UICustomKeyboardUtils,
} from '@tonlabs/uikit.keyboard';

import { ChatInput } from './ChatInput';
import type {
    OnHeightChange,
    OnSendText,
    OnSendMedia,
    OnSendDocument,
    Shortcut,
    MenuItem,
    QuickActionItem,
} from './types';
import { ChatPicker, ChatPickerRef } from './ChatPicker';

function useMenuPlus(menuPlusHidden = false) {
    const chatPickerRef = React.useRef<ChatPickerRef>(null);
    const onPressImage = React.useCallback(() => {
        chatPickerRef.current?.openImageDialog();
    }, []);
    const onPressDocument = React.useCallback(() => {
        chatPickerRef.current?.openDocumentDialog();
    }, []);

    const menu: MenuItem[] = React.useMemo(() => {
        if (menuPlusHidden) {
            return [];
        }

        return [
            {
                title: uiLocalized.Chats.Actions.AttachImage,
                onPress: onPressImage,
            },
            {
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

function useBackHandler(ref: React.RefObject<TextInput>) {
    React.useEffect(() => {
        if (Platform.OS !== 'android') {
            return undefined;
        }

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (ref.current && ref.current.isFocused()) {
                    UICustomKeyboardUtils.dismiss();
                    return true;
                }
                return false;
            },
        );

        return () => {
            if (backHandler) {
                backHandler.remove();
            }
        };
    }, [ref]);
}

type Props = {
    editable: boolean;
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
    onHeightChange?: OnHeightChange;

    customKeyboard?: UICustomKeyboardItem;
};

export function UIChatInput(props: Props) {
    const textInputRef = React.useRef<TextInput>(null);
    const {
        customKeyboardVisible,
        toggleKeyboard,
        onKeyboardResigned,
        onFocus,
        onBlur,
    } = useCustomKeyboard(props.onCustomKeyboardVisible, props.editable);
    const { menuPlus, chatPickerRef } = useMenuPlus(props.menuPlusHidden);

    useBackHandler(textInputRef);

    const input = (
        <>
            <ChatInput
                editable={props.editable}
                placeholder={props.placeholder}
                shortcuts={props.shortcuts}
                menuPlus={menuPlus}
                menuPlusDisabled={props.menuPlusDisabled}
                menuMore={
                    undefined /* TODO: we not render it right now, but could at some point */
                }
                menuMoreDisabled={props.menuMoreDisabled}
                inputHidden={props.inputHidden}
                quickActions={props.quickActions}
                textInputRef={textInputRef}
                customKeyboardVisible={customKeyboardVisible}
                onCustomKeyboardPress={toggleKeyboard}
                customKeyboardButton={props.customKeyboard?.button}
                onSendText={props.onSendText}
                onHeightChange={
                    Platform.OS === 'web' ? props.onHeightChange : undefined
                }
                onFocus={onFocus}
                onBlur={onBlur}
            />
            <ChatPicker
                ref={chatPickerRef}
                onSendDocument={props.onSendDocument}
                onSendMedia={props.onSendMedia}
            />
        </>
    );

    return (
        <UICustomKeyboard
            renderContent={() => input}
            kbInputRef={textInputRef}
            kbID={props.customKeyboard?.kbID}
            customKeyboardVisible={customKeyboardVisible}
            customKeyboardComponent={props.customKeyboard?.component}
            kbInitialProps={props.customKeyboard?.props}
            onItemSelected={(_id: string | undefined, stk: any) => {
                toggleKeyboard();

                props.customKeyboard?.onItemSelected(_id, stk);
            }}
            onKeyboardResigned={onKeyboardResigned}
            onHeightChange={props.onHeightChange}
        />
    );
}
