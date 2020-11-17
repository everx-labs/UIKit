import * as React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Image, // TODO: use fast-image?
    View,
} from "react-native";
import type { ImageSourcePropType } from "react-native";

import { UIStyle } from "@tonlabs/uikit.core";
import { UIButtonGroup, UITextButton } from "@tonlabs/uikit.components";
import buttonSend from "@tonlabs/uikit.assets/btn_msg_send/btn_msg_send.png";

import { commonStyles } from "./styles";

type QuickAction = {
    key: string;
    testID: string;
    onPress: () => void | Promise<void>;
    icon?: ImageSourcePropType;
    title?: string;
};

type Props = {
    quickAction?: QuickAction[];
    value?: string;
    onSendText?: (value: string) => void | Promise<void>;
};

export function QuickAction(props: Props) {
    const { quickAction, value, onSendText } = props;

    if (value && value.length) {
        return (
            <View>
                <TouchableOpacity
                    testID="send_btn"
                    style={commonStyles.buttonContainer}
                    onPress={() => {
                        if (onSendText) {
                            onSendText(value);
                        }
                    }}
                >
                    <Image source={buttonSend} style={styles.buttonSend} />
                </TouchableOpacity>
            </View>
        );

        if (!quickAction) {
            return null;
        }

        return (
            <UIButtonGroup>
                {quickAction.map((action, index) => (
                    <UITextButtton
                        key={`quickAction~${action.key}`}
                        testID={action.testID}
                        buttonStyle={commonStyles.buttonContainer}
                        textStyle={UIStyle.text.bodyMedium()}
                        onPress={action.onPress}
                        icon={action.icon}
                        title={action.title}
                        disableIconColor
                    />
                ))}
            </UIButtonGroup>
        );
    }
}

const styles = StyleSheet.create({
    buttonSend: {
        height: UIConstant.contentOffset(),
        justifyContent: "center",
        alignSelf: "flex-end",
    },
});
