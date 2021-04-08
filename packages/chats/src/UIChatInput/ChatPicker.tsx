import * as React from 'react';
import { View, StyleSheet, Image, Linking, Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker from 'react-native-document-picker';

import { UIConstant } from '@tonlabs/uikit.core';
import { UIAlertView, UIImageView } from '@tonlabs/uikit.navigation_legacy';
import { uiLocalized } from '@tonlabs/uikit.localization';

import type { OnSendMedia, OnSendDocument, ImageSize } from './types';

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

const wasAccessToCameraOrGalleryDenied = (message: string): boolean => {
    const msg = message.toLowerCase();
    return (
        msg.includes('permissions not granted') ||
        msg.includes("permissions weren't granted") ||
        msg.includes('permissions were not granted')
    );
};

const pickDocument = async (
    callback: (doc: any, name: string) => Promise<void>,
) => {
    try {
        const file = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
        });
        const source =
            Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
        callback(source, file.name);
    } catch (error) {
        console.error(`Failed to pick document with: ${error}`);
    }
};

const onPickDocument = async (
    doc: any,
    name: string,
    onSendDocument?: OnSendDocument,
) => {
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
        const data = await RNFetchBlob.fs.readFile(decodeURI(doc), 'base64');
        processData(data);
    } catch (decError) {
        // Failed to load the data from the decoded URI, try the plain one
        try {
            // TODO: I don't like it, can we do it without base64?
            const data = await RNFetchBlob.fs.readFile(doc, 'base64');
            processData(data);
        } catch (error) {
            console.error(
                'Failed to pick the document with error:',
                error,
                decError,
            );
        }
    }
};

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

    if (file.size >= UIConstant.maxFileSize()) {
        // in decimal
        const msg = uiLocalized.formatString(
            uiLocalized.FileIsTooBig,
            UIConstant.maxFileSize() / 1000000,
        );
        UIAlertView.showAlert(uiLocalized.Error, msg, [
            {
                title: uiLocalized.OK,
                onPress: () => {
                    // nothing
                },
            },
        ]);
        return;
    }

    reader.onload = () => {
        onPickDocument(reader.result, name, onSendDocument);
    };
    reader.readAsDataURL(file);
};

const uploadPhoto = (
    photo: any,
    imageSize: ImageSize | null,
    onSendMedia: OnSendMedia,
) => {
    if (Platform.OS === 'web') {
        onSendMedia(photo.split('base64,')[1], imageSize);
        return;
    }

    RNFetchBlob.fs.readFile(photo, 'base64').then((data) => {
        if (data instanceof String || typeof data === 'string') {
            const dataSplit = data.split('base64,');
            onSendMedia(dataSplit[dataSplit.length - 1], imageSize);
        }
    });
};

const onUploadPhoto = (photo: any, onSendMedia: OnSendMedia) => {
    Image.getSize(
        photo,
        (width, height) => {
            const imageSize = { width, height };
            uploadPhoto(photo, imageSize, onSendMedia);
        },
        (error) => {
            console.error(`Failed to get image size with: ${error}`);
            uploadPhoto(photo, null, onSendMedia);
        },
    );
};

export type ChatPickerRef = {
    openImageDialog: () => void;
    openDocumentDialog: () => void;
};

type Props = {
    dismissKeyboard: () => void;
    onSendDocument?: OnSendDocument;
    onSendMedia?: OnSendMedia;
};

export const ChatPicker = React.forwardRef<ChatPickerRef, Props>(
    function ChatImagePickerImpl(props: Props, ref) {
        const inputRef = React.useRef<HTMLInputElement>(null);
        const uiImageViewRef = React.useRef<typeof UIImageView>();

        React.useImperativeHandle(ref, () => ({
            openImageDialog: () => {
                props.dismissKeyboard();

                uiImageViewRef.current?.openDialog();
            },
            openDocumentDialog: () => {
                props.dismissKeyboard();

                if (Platform.OS === 'web') {
                    inputRef.current?.click();
                    return;
                }

                setTimeout(() => {
                    pickDocument((data: any, name: string) =>
                        onPickDocument(data, name, props.onSendDocument),
                    );
                }, UIConstant.animationDuration() * 2);
            },
        }));

        return (
            <View
                testID="chat_image_picker"
                style={{ height: 0 }}
                pointerEvents="none"
            >
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
                <UIImageView
                    ref={uiImageViewRef}
                    editable
                    disabled={false}
                    // TODO: what is a real type of photo?
                    onUploadPhoto={(photo: any) => {
                        if (props.onSendMedia) {
                            onUploadPhoto(photo, props.onSendMedia);
                        }
                    }}
                    onError={(error: Error) => {
                        const msg = error.toString();
                        if (wasAccessToCameraOrGalleryDenied(msg)) {
                            UIAlertView.showAlert(
                                uiLocalized.Chats.Alerts
                                    .EnableFromSettingsTitle,
                                uiLocalized.Chats.Alerts.EnableFromSettings,
                                [
                                    {
                                        title: uiLocalized.OK,
                                        onPress: () => {
                                            Linking.openSettings();
                                        },
                                    },
                                ],
                            );
                        }
                    }}
                />
            </View>
        );
    },
);

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
