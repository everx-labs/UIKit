import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import BlobUtil from 'react-native-blob-util';

import type { OnSendMedia, OnSendDocument } from './types';

const extractDocumentName = (e: any) => {
    const source = Platform.OS === 'web' ? e.target.files[0] : e;
    let fileName = '';
    if (Platform.OS === 'web') {
        fileName = source.name;
    } else {
        const tmp = source.split('/');
        fileName = tmp[tmp.length - 1];
    }

    return fileName;
};

const onPickDocument = async (doc: any, name: string, onSendDocument?: OnSendDocument) => {
    if (Platform.OS === 'web') {
        if (onSendDocument) {
            onSendDocument(doc.split('base64,')[1], name);
        }
        return;
    }
    const processData = (data: string | any) => {
        if (typeof data === 'string') {
            const dataSplit = data.split('base64,');
            if (onSendDocument) {
                onSendDocument(dataSplit[dataSplit.length - 1], name);
            }
        } else {
            console.error('The picked data is not in base64 format');
        }
    };
    try {
        // TODO: I don't like it, can we do it without base64?
        const data = await BlobUtil.fs.readFile(decodeURI(doc), 'base64');
        processData(data);
    } catch (decError) {
        // Failed to load the data from the decoded URI, try the plain one
        try {
            // TODO: I don't like it, can we do it without base64?
            const data = await BlobUtil.fs.readFile(doc, 'base64');
            processData(data);
        } catch (error) {
            console.error('Failed to pick the document with error:', error, decError);
        }
    }
};

const MAX_FILE_SIZE = 10000000;

const onPickDocumentWeb = (e: any, onSendDocument?: OnSendDocument) => {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];
    const name = extractDocumentName(e);

    if (!file) {
        // TODO: I don't like it, can we do it without base64?
        // log.debug('Document picker was cancelled');
        return;
    }

    if (file.size >= MAX_FILE_SIZE) {
        // TODO: shared UIAlertView doesn't exist anymore
        //       please use modern popover
        //
        // in decimal
        // const msg = uiLocalized.formatString(
        //     uiLocalized.FileIsTooBig,
        //     ( MAX_FILE_SIZE / 1000000).toFixed(),
        // );
        // UIAlertView.showAlert(uiLocalized.Error, msg, [
        //     {
        //         title: uiLocalized.OK,
        //         onPress: () => {
        //             // nothing
        //         },
        //     },
        // ]);
        return;
    }

    reader.onload = () => {
        onPickDocument(reader.result, name, onSendDocument);
    };
    reader.readAsDataURL(file);
};

export type ChatPickerRef = {
    openImageDialog: () => void;
    openDocumentDialog: () => void;
};

type Props = {
    dismissKeyboard: () => void;
    onSendDocument?: OnSendDocument;
    // eslint-disable-next-line react/no-unused-prop-types
    onSendMedia?: OnSendMedia;
};

export const ChatPicker = React.forwardRef<ChatPickerRef, Props>(function ChatImagePickerImpl(
    props: Props,
    ref,
) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => ({
        openImageDialog: () => {
            props.dismissKeyboard();
        },
        openDocumentDialog: () => {
            props.dismissKeyboard();

            if (Platform.OS === 'web') {
                inputRef.current?.click();
            } else {
                // Not supported for now
            }
        },
    }));

    return (
        <View testID="chat_image_picker" style={{ height: 0 }} pointerEvents="none">
            {Platform.OS === 'web' && (
                <input
                    ref={inputRef}
                    type="file"
                    name="document"
                    className="inputClass"
                    onChange={(e: any) => {
                        if (props.onSendDocument) {
                            onPickDocumentWeb(e, props.onSendDocument);
                        }
                    }}
                    disabled={false}
                    accept=".pdf"
                    style={StyleSheet.flatten(styles.webInput)}
                />
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    webInput: {
        opacity: 0,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
    },
});
