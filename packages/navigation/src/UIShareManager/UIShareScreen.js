// @flow
import React from 'react';
import {
    StyleSheet,
    View,
    Clipboard,
    ScrollView,
} from 'react-native';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

import { UIColor, UIFont, UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIToastMessage, UIButton, UILabel } from '@tonlabs/uikit.components';

import { uiLocalized } from '@tonlabs/uikit.localization';

import UIModalController from '../UIModalController';
import type { ModalControllerProps } from '../UIModalController';

type Options = {
    message: string,
    subtitle: ?string,
}
type Props = ModalControllerProps & {
    isShared: boolean,
}
type State = {
    message: string,
    subtitle: string,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: UIConstant.contentOffset(),
        //
    },
    titleText: {
        ...UIFont.subtitleBold(),
        color: UIColor.black(),
    },
    note: {
        marginTop: UIConstant.contentOffset(),
    },
    messageContainer: {
        marginTop: UIConstant.hugeContentOffset(),
        flex: 1,
    },
    button: {
        //
    },
});

export default class UIShareScreen extends UIModalController<Props, State> {
    static shared: ?UIShareScreen = null;

    static share(options: Options): boolean {
        const { shared } = UIShareScreen;

        if (!shared) {
            return false;
        }

        shared.setMessage(options.message);
        shared.setSubtitle(options.subtitle);
        shared.show();

        return true;
    }

    // constructor
    constructor(props: Props) {
        super(props);

        this.testID = '[UIShareScreen]';
        this.maxHeight = UIConstant.shareDialogHeight();
        this.maxWidth = UIConstant.shareDialogWidth();

        this.state = {
            ...this.state,
            message: '',
            subtitle: '',
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.isShared()) {
            UIShareScreen.shared = this;
        }
    }

    componentWillUnmount() {
        if (this.isShared()) {
            UIShareScreen.shared = null;
        }
        super.componentWillUnmount();
    }

    // Events
    onCopyPressed = () => {
        (async () => {
            await Clipboard.setString(this.getMessage());
            UIToastMessage.showMessage(uiLocalized.MessageCopiedToClipboard);
        })();
    };

    // Setters
    setMessage(message: string) {
        this.setStateSafely({ message });
    }

    setSubtitle(subtitle: ?string) {
        this.setStateSafely({ subtitle });
    }

    // Getters
    isShared() {
        return this.props.isShared;
    }

    getMessage() {
        return this.state.message;
    }

    getSubtitle() {
        return this.state.subtitle;
    }

    getCancelImage(): ?ImageSource {
        return UIAssets.icons.ui.buttonClose;
    }

    // Render

    renderContentView(contentHeight: number) {
        return (
            <View style={styles.container}>
                <UILabel
                    role={UILabel.Role.Subtitle}
                    text={uiLocalized.Share}
                />
                <UILabel
                    role={UILabel.Role.Note}
                    text={this.getSubtitle() || uiLocalized.ShareToTalk}
                    style={styles.note}
                />
                <ScrollView contentContainerStyle={styles.messageContainer}>
                    <UILabel
                        role={UILabel.Role.AccentRegular}
                        text={this.getMessage()}
                    />
                </ScrollView>
                <UIButton
                    testID="copy_button"
                    title={uiLocalized.CopyToClipboard}
                    buttonShape={UIButton.ButtonShape.Radius}
                    style={UIStyle.margin.topDefault()}
                    onPress={this.onCopyPressed}
                />
            </View>
        );
    }
}
