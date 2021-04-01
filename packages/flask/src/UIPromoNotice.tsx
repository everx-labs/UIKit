import * as React from 'react';
import {
    ImageProps,
    Linking,
    Platform,
    StyleSheet,
    View,
    useWindowDimensions,
} from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIDevice } from '@tonlabs/uikit.core';
import {
    UIButton,
    UINotice,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

type UIPromoNoticeProps = {
    appStoreUrl: string;
    googlePlayUrl: string;
    icon?: ImageProps;
    folding?: boolean;
    minimumWidthToShowFoldingNotice?: number;
};

const styles = StyleSheet.create({
    noticeText: {
        marginBottom: 4,
    },
    buttons: {
        flexDirection: 'row',
    },
    leftButton: {
        marginRight: 6,
    },
    rightButton: {
        marginLeft: 6,
    },
});

const openLink = (OS: string, link: string) => {
    if (!link) {
        return;
    }
    if (OS === 'web') {
        window.open(link, '_blank');
    } else {
        Linking.openURL(link);
    }
};

export function UIPromoNotice({
    appStoreUrl,
    googlePlayUrl,
    icon= UIAssets.icons.brand.tonSymbol,
    folding= false,
    minimumWidthToShowFoldingNotice = 600,
}: UIPromoNoticeProps) {
    const [visible, setVisible] = React.useState(Platform.OS === 'web');
    const [folded, setFolded] = React.useState(true);
    const windowWidth = useWindowDimensions().width;
    const deviceOS = UIDevice.deviceOS();

    React.useEffect(() => {
        if (windowWidth < minimumWidthToShowFoldingNotice) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    }, [windowWidth, minimumWidthToShowFoldingNotice]);

    const onClose = React.useCallback(() => {
        setVisible(false);
    }, []);

    const onFold = React.useCallback(() => {
        setFolded(!folded);
    }, [folded]);

    const onAppStore = React.useCallback(() => {
        openLink(deviceOS, appStoreUrl);
    }, [deviceOS, appStoreUrl]);

    const onGooglePlay = React.useCallback(() => {
        openLink(deviceOS, googlePlayUrl);
    }, [deviceOS, googlePlayUrl]);

    const content = React.useMemo(
        () => {
            if (deviceOS === 'ios') {
                return (
                    <View>
                        <UIButton
                            title={uiLocalized.promoDownload.appStore}
                            onPress={onAppStore}
                        />
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.ParagraphFootnote}
                            style={styles.noticeText}
                        >
                            {uiLocalized.promoDownload.notice}
                        </UILabel>
                    </View>
                );
            } else if (deviceOS === 'android') {
                return (
                    <View>
                        <UIButton
                            title={uiLocalized.promoDownload.googlePlay}
                            onPress={onGooglePlay}
                        />
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.ParagraphFootnote}
                            style={styles.noticeText}
                        >
                            {uiLocalized.promoDownload.notice}
                        </UILabel>
                    </View>
                );
            }
            return (
                <View>
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.ParagraphFootnote}
                        style={styles.noticeText}
                    >
                        {uiLocalized.promoDownload.notice}
                    </UILabel>
                    <View style={styles.buttons}>
                        <UIButton
                            title={uiLocalized.promoDownload.appStore}
                            onPress={onAppStore}
                            style={styles.leftButton}
                        />
                        <UIButton
                            title={uiLocalized.promoDownload.googlePlay}
                            onPress={onGooglePlay}
                            style={styles.rightButton}
                        />
                    </View>
                </View>
            );
        },
        [deviceOS, onAppStore, onGooglePlay],
    );

    return (
        Platform.OS === 'web'
            ? (
                <UINotice
                    folding={folding}
                    folded={folded}
                    onFold={onFold}
                    visible={visible}
                    onClose={onClose}
                    icon={icon}
                >
                    {content}
                </UINotice>
            ) : null
    );
}
