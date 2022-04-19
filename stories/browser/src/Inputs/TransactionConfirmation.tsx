import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { UIMsgButton, UIMsgButtonType } from '@tonlabs/uikit.controls';
import {
    UIBackgroundView,
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.themes';
import { UIConstant } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/localization';
import type { TransactionConfirmationMessage } from '../types';
import { TransactionDetails } from '../TransactionDetails';

export function TransactionConfirmation({
    onLayout,
    recipient,
    onRecipientPress,
    action,
    amount,
    contractFee,
    networkFee,
    signature,
    isDangerous,
    onApprove: onApproveProp,
    onCancel: onCancelProp,
    externalState,
    firstFromChain,
    lastFromChain,
    status,
    key,
}: TransactionConfirmationMessage) {
    const theme = useTheme();
    // const shadow = useShadow(1);

    const onApprove = React.useCallback(() => {
        onApproveProp({
            status: 'approved',
        });
    }, [onApproveProp]);
    const onCancel = React.useCallback(() => {
        onCancelProp({
            status: 'cancelled',
        });
    }, [onCancelProp]);

    return (
        <View onLayout={onLayout}>
            <TransactionDetails
                signature={signature.title}
                action={action}
                recipient={recipient}
                amount={amount}
                contractFee={contractFee}
                networkFee={networkFee}
                isDangerous={isDangerous}
                onRecipientPress={onRecipientPress}
                firstFromChain={firstFromChain}
                lastFromChain={lastFromChain}
                status={status}
                key={key}
            />
            {externalState?.status == null ? (
                <View style={styles.buttonsContainer}>
                    <UIMsgButton
                        testID="transaction_confirmation_confirm"
                        title={uiLocalized.Browser.TransactionConfirmation.Confirm}
                        type={UIMsgButtonType.Secondary}
                        onPress={onApprove}
                        layout={{
                            marginRight: UIConstant.tinyContentOffset(),
                        }}
                    />
                    <UIMsgButton
                        testID="transaction_confirmation_cancel"
                        title={uiLocalized.Browser.TransactionConfirmation.Cancel}
                        type={UIMsgButtonType.Secondary}
                        onPress={onCancel}
                    />
                </View>
            ) : (
                <View style={styles.responseContainer}>
                    <UIBackgroundView
                        testID="transaction_confirmation_response"
                        color={ColorVariants.BackgroundAccent}
                        style={[
                            styles.button,
                            styles.response,
                            {
                                borderColor: theme[ColorVariants.LineAccent],
                            },
                        ]}
                    >
                        <UILabel
                            role={UILabelRoles.Action}
                            color={UILabelColors.StaticTextPrimaryLight}
                        >
                            {externalState.status === 'approved'
                                ? uiLocalized.Browser.TransactionConfirmation.Confirm
                                : uiLocalized.Browser.TransactionConfirmation.Cancel}
                        </UILabel>
                    </UIBackgroundView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...Platform.select({
            web: {
                maxWidth: '100%',
            },
            default: {
                width: '100%',
            },
        }),
        paddingRight: '20%',
        alignSelf: 'flex-start',
        paddingTop: UIConstant.smallContentOffset(),
    },
    card: {
        paddingHorizontal: 12,
        paddingTop: 24,
        paddingBottom: 8,
        borderRadius: 12,
    },
    cardRow: {
        paddingVertical: 12,
    },
    buttonsContainer: {
        maxWidth: '100%',
        paddingRight: '20%',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: UIConstant.smallContentOffset(),
    },
    responseContainer: {
        maxWidth: '100%',
        paddingLeft: '20%',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        paddingTop: UIConstant.smallContentOffset(),
    },
    // TODO: change it to UIMsgButton (or similar)
    button: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        paddingHorizontal: UIConstant.spaciousContentOffset(),
        borderRadius: UIConstant.mediumBorderRadius(),
        marginRight: UIConstant.tinyContentOffset(),
    },
    response: {
        borderBottomRightRadius: 0,
    },
    address: {
        flexDirection: 'row',
    },
});
