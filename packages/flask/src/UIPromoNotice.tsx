import * as React from 'react';
import { ImageProps, Linking, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import {
    UIButton,
    UIFoldingNotice,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

type UIPromoNoticeProps = {
    appStoreUrl: string;
    googlePlayUrl: string;
    icon?: ImageProps;
    minimumWidthToShow?: number;
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

export function UIPromoNotice({
    appStoreUrl,
    googlePlayUrl,
    icon,
    minimumWidthToShow = 600,
}: UIPromoNoticeProps) {
    const [visible, setVisible] = React.useState(Platform.OS === 'web');
    const [folded, setFolded] = React.useState(true);
    const windowWidth = useWindowDimensions().width;

    React.useEffect(() => {
        if (windowWidth < minimumWidthToShow) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    }, [windowWidth, minimumWidthToShow]);

    const onFold = React.useCallback(() => {
        setFolded(!folded);
    }, [folded]);

    const onAppStore = React.useCallback(() => {
        Linking.openURL(appStoreUrl);
    }, [appStoreUrl]);

    const onGooglePlay = React.useCallback(() => {
        Linking.openURL(googlePlayUrl);
    }, [googlePlayUrl]);

    return (
        Platform.OS === 'web'
            ? (
                <UIFoldingNotice
                    visible={visible}
                    folded={folded}
                    onFold={onFold}
                    icon={icon || UIAssets.icons.brand.tonSymbol}
                >
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
                </UIFoldingNotice>
            ) : null
    );
}
