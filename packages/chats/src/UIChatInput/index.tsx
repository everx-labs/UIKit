import * as React from 'react';
import { Platform, TextInput } from 'react-native';

import { uiLocalized } from '@tonlabs/uikit.localization';
import {
    UICustomKeyboard,
    useCustomKeyboard,
    UICustomKeyboardItem,
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
import type { ChatPickerRef } from './ChatPicker';

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
    onStickersVisible?: (visible: boolean) => void | Promise<void>;
    onHeightChange?: OnHeightChange;

    customKeyboard: UICustomKeyboardItem;
};

export function UIChatInput(props: Props) {
    const textInputRef = React.useRef<TextInput>(null);
    const {
        customKeyboardVisible,
        toggleKeyboard,
        onKeyboardResigned,
        onFocus,
        onBlur,
    } = useCustomKeyboard(props.onStickersVisible, props.editable);
    const { menuPlus, chatPickerRef } = useMenuPlus(props.menuPlusHidden);

    const input = (
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
            pickerRef={chatPickerRef}
            customKeyboardVisible={customKeyboardVisible}
            onCustomKeyboardPress={toggleKeyboard}
            customKeyboardButton={props.customKeyboard.button}
            onSendText={props.onSendText}
            onSendMedia={props.onSendMedia}
            onSendDocument={props.onSendDocument}
            onHeightChange={
                Platform.OS === 'web' ? props.onHeightChange : undefined
            }
            onFocus={onFocus}
            onBlur={onBlur}
        />
    );

    return (
        <UICustomKeyboard
            renderContent={() => input}
            kbInputRef={textInputRef}
            kbID={props.customKeyboard.kbID}
            customKeyboardVisible={customKeyboardVisible}
            customKeyboardComponent={props.customKeyboard.component}
            kbInitialProps={props.customKeyboard.props}
            onItemSelected={(_id: string | undefined, stk: any) => {
                toggleKeyboard();

                props.customKeyboard.onItemSelected(_id, stk);
            }}
            onKeyboardResigned={onKeyboardResigned}
            onHeightChange={props.onHeightChange}
        />
    );
}
