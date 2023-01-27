import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import { uiLocalized } from '@tonlabs/localization';
import { TouchableOpacity, UIBoxButton } from '@tonlabs/uikit.controls';
import { UILayoutConstant, PortalManager, Portal } from '@tonlabs/uikit.layout';
import { ScrollView } from '@tonlabs/uikit.scrolls';
import { UILabel, UILabelColors, UILabelRoles, ColorVariants } from '@tonlabs/uikit.themes';
import { UISlideBar } from '@tonlabs/uicast.bars';
import { UIAssets } from '@tonlabs/uikit.assets';

import { UIModalSheet, UIModalSheetProps } from '../UIModalSheet';
import { UINotice, UINoticeType, UINoticeColor, UINoticeDuration } from '../../Notice';

interface UIShareSheetProps extends Omit<UIModalSheetProps, 'children'> {
    message: string;
    subtitle?: string;
}

export function UIShareSheet({ message, subtitle, ...sheetProps }: UIShareSheetProps) {
    const { onClose } = sheetProps;
    const [copiedVisible, setCopiedVisible] = React.useState(false);

    const onCopyPress = React.useCallback(() => {
        // Copy the message into Clipboard
        Clipboard.setString(message);

        setCopiedVisible(true);

        if (onClose) {
            onClose();
        }
    }, [message, onClose]);

    const onCloseCopiedNotice = React.useCallback(() => {
        setCopiedVisible(false);
    }, []);

    const headerLeftItems = React.useMemo(
        () => [
            {
                testID: 'uinavigation-close-modal-button',
                icon: {
                    source: UIAssets.icons.ui.closeBlack,
                },
                iconTintColor: ColorVariants.BackgroundAccent,
                onPress: onClose,
            },
        ],
        [onClose],
    );

    return (
        <>
            <UIModalSheet {...sheetProps}>
                <PortalManager id="share">
                    <UISlideBar headerLeftItems={headerLeftItems} />
                    <View style={styles.header}>
                        <UILabel color={UILabelColors.TextPrimary} role={UILabelRoles.TitleMedium}>
                            {uiLocalized.Share}
                        </UILabel>
                        <UILabel
                            color={UILabelColors.TextSecondary}
                            role={UILabelRoles.ParagraphNote}
                            style={styles.headerSubtitle}
                        >
                            {subtitle || uiLocalized.ShareToTalk}
                        </UILabel>
                    </View>
                    <ScrollView
                        style={styles.messageContainer}
                        contentContainerStyle={styles.content}
                        automaticallyAdjustContentInsets
                    >
                        <TouchableOpacity onPress={onCopyPress}>
                            <UILabel
                                color={UILabelColors.TextPrimary}
                                role={UILabelRoles.PromoMedium}
                            >
                                {message}
                            </UILabel>
                        </TouchableOpacity>
                    </ScrollView>
                    <Portal forId="share">
                        <UIBoxButton
                            testID="copy_button"
                            title={uiLocalized.CopyToClipboard}
                            onPress={onCopyPress}
                            layout={styles.btn}
                        />
                    </Portal>
                </PortalManager>
            </UIModalSheet>
            <UINotice
                type={UINoticeType.BottomToast}
                color={UINoticeColor.Primary}
                title={uiLocalized.CopiedToClipboard}
                visible={copiedVisible}
                onClose={onCloseCopiedNotice}
                onTap={onCloseCopiedNotice}
                duration={UINoticeDuration.Long}
            />
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: UILayoutConstant.contentOffset,
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
    },
    headerSubtitle: {
        marginTop: UILayoutConstant.contentInsetVerticalX4,
    },
    messageContainer: {
        flex: 1,
    },
    content: {
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    btn: {
        marginHorizontal: UILayoutConstant.contentOffset,
        marginBottom: UILayoutConstant.contentInsetVerticalX4,
    },
});
