import * as React from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import {
    UIButton,
    UIFoldingNotice,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

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

function getWindowWidth() {
    const { innerWidth: width } = window;

    return width;
}

function useWindowWidth() {
    const [windowWidth, setWindowWidth] = React.useState(getWindowWidth());

    React.useEffect(
        () => {
            function handleResize() {
                setWindowWidth(getWindowWidth());
            }

            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        },
        [],
    );

    return windowWidth;
}

export function UIPromoNotice() {
    const [visible, setVisible] = React.useState(Platform.OS === 'web');
    const [folded, setFolded] = React.useState(false);
    const windowWidth = useWindowWidth();

    React.useEffect(() => {
        if (Platform.OS === 'web') {
            if (windowWidth < 600) {
                setVisible(false);
            } else {
                setVisible(true);
            }
        } else {
            setVisible(false);
        }
    }, [windowWidth]);

    const onFold = React.useCallback(() => {
        setFolded(!folded);
    }, [folded]);

    const onAppStore = React.useCallback(() => {
        Linking.openURL('https://apps.apple.com/app/ton-surf-blockchain-browser/id1481986831');
    }, []);

    const onGooglePlay = React.useCallback(() => {
        Linking.openURL('https://play.google.com/store/apps/details?id=surf.ton');
    }, []);

    return (
        <UIFoldingNotice
            visible={visible}
            folded={folded}
            onFold={onFold}
            icon={UIAssets.icons.brand.tonSymbol}
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
    );
}
