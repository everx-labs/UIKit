// @flow
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

import Clipboard from '@react-native-clipboard/clipboard';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { UIBoxButton, TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { uiLocalized } from '@tonlabs/localization';
import { UIPopup } from '@tonlabs/uikit.popups';

import type { ModalControllerProps } from '../UIModalController';
import UIModalController from '../UIModalController';

type Options = {
    message: string,
    subtitle: ?string,
};
type Props = ModalControllerProps & {
    isShared: boolean,
};
type State = {
    message: string,
    subtitle: string,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: UIConstant.contentOffset(),
    },
    messageContainer: {
        marginTop: UIConstant.contentOffset(),
        flex: 1,
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
            visibleToast: false,
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
    onCopyPressed = async () => {
        this.setVisibleToastNotice(true);
        // Copy the message into Clipboard
        Clipboard.setString(this.getMessage());
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

    setVisibleToastNotice(visibleToast: boolean) {
        this.setState({ visibleToast });
    }

    // Render

    renderContentView(contentHeight: number) {
        return (
            <View style={styles.container}>
                <UILabel color={UILabelColors.TextPrimary} role={UILabelRoles.TitleMedium}>
                    {uiLocalized.Share}
                </UILabel>
                <UILabel
                    color={UILabelColors.TextSecondary}
                    role={UILabelRoles.ParagraphNote}
                    style={UIStyle.margin.topDefault()}
                >
                    {this.getSubtitle() || uiLocalized.ShareToTalk}
                </UILabel>
                <ScrollView contentContainerStyle={styles.messageContainer}>
                    <TouchableOpacity onPress={this.onCopyPressed}>
                        <UILabel color={UILabelColors.TextPrimary} role={UILabelRoles.PromoMedium}>
                            {this.getMessage()}
                        </UILabel>
                    </TouchableOpacity>
                </ScrollView>
                <UIBoxButton
                    testID="copy_button"
                    title={uiLocalized.CopyToClipboard}
                    onPress={this.onCopyPressed}
                    layout={UIStyle.margin.topDefault()}
                />
                <UIPopup.Notice
                    type={UIPopup.Notice.Type.Toast}
                    title={uiLocalized.CopiedToClipboard}
                    visible={this.state.visibleToast}
                    onClose={() => {
                        this.setVisibleToastNotice(false);
                    }}
                    onTap={() => {
                        this.setVisibleToastNotice(false);
                    }}
                    duration={UIPopup.Notice.Duration.Long}
                />
            </View>
        );
    }
}
