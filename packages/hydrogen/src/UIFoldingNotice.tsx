import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Portal } from './Portal';
import {UIConstant} from "./constants";

type OnFold = () => void | Promise<void>;

export type UIFondingNoticeProps = {
    visible: boolean,
    onFold?: OnFold;
    children: React.ReactNode;
};

type UIFoldingNoticePortalContentProps = UIFondingNoticeProps & {
    onClosePortalRequest: () => void;
};

function UIFoldingNoticePortalContent({
    visible,
    onFold,
    children,
    onClosePortalRequest,
}: UIFoldingNoticePortalContentProps) {
    console.log('YOLO content props', visible, onFold, children, onClosePortalRequest);
    return (
        <View style={styles.container} />
    );
}

export function UIFoldingNotice(props: UIFondingNoticeProps) {
    const { visible } = props;
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        if (!visible) {
            return;
        }

        setIsVisible(true);
    }, [visible, setIsVisible]);

    const onClosePortalRequest = React.useCallback(() => {
        setIsVisible(false);
    }, []);

    if(!isVisible) {
        return null;
    }

    return (
        <Portal>
            <UIFoldingNoticePortalContent
                {...props}
                onClosePortalRequest={onClosePortalRequest}
            />
        </Portal>
    )
}

export type UIPromoNoticeProps = UIFondingNoticeProps & { style?: ViewStyle };

export function UIPromoNotice({
    children,
    style,
    ...rest
}: UIPromoNoticeProps) {
    return (
        <UIFoldingNotice {...rest}>
            <View
                style={[
                    styles.promo,
                    {
                        paddingBottom: UIConstant.contentOffset * 2,
                        paddingRight: UIConstant.contentOffset * 2,
                    },
                ]}
            >
                <View style={[style, styles.promoInner]}>{children}</View>
            </View>
        </UIFoldingNotice>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    notice: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
    },
    promo: {
        width: '100%',
        padding: UIConstant.normalContentOffset,
    },
    promoInner: {

    },
});
