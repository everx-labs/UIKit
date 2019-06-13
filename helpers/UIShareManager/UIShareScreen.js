// @flow
import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    Clipboard,
} from 'react-native';

// Module imports

import UIModalController from '../../controllers/UIModalController';
import UIToastMessage from '../../components/notifications/UIToastMessage';
import UIConstant from '../../helpers/UIConstant';
import UIButton from '../../components/buttons/UIButton';
import UILabel from '../../components/text/UILabel';
import UILocalized from '../../helpers/UILocalized';
import UIColor from '../UIColor';
import UIFont from '../UIFont';

import type { ModalControllerProps } from '../../controllers/UIModalController';

// End imports

type Options = {
    message: string,
}
type Props = ModalControllerProps & {
    isShared: boolean,
}
type State = {
    message: string,
}

const styles = StyleSheet.create({
    container: {
        //
    },
    titleText: {
        marginHorizontal: UIConstant.contentOffset(),
        ...UIFont.subtitleBold(),
        color: UIColor.black(),
    },
    messageContainer: {
        margin: UIConstant.contentOffset(),
        paddingLeft: UIConstant.smallContentOffset(),
        borderLeftColor: UIColor.primary1(),
        borderLeftWidth: 4,
    },
    button: {
        marginTop: UIConstant.contentOffset(),
        paddingHorizontal: UIConstant.contentOffset(),
        alignSelf: 'center',
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
        shared.show();
        return true;
    }

    // constructor
    constructor(props: Props) {
        super(props);
        this.state = {
            ...this.state,
            message: '',
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
        this.hide();
        (async () => {
            await Clipboard.setString(this.getMessage());
            UIToastMessage.showMessage(UILocalized.MessageCopiedToClipboard);
        })();
    };

    // Setters
    setMessage(message: string) {
        this.setStateSafely({ message });
    }

    // Getters
    isShared() {
        return this.props.isShared;
    }

    getMessage() {
        return this.state.message;
    }

    // Render

    renderContentView(contentHeight: number) {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>
                    {UILocalized.Share}
                </Text>
                <View style={styles.messageContainer}>
                    <UILabel
                        role={UILabel.Role.Description}
                        text={this.getMessage()}
                    />
                </View>
                <UIButton
                    testID="copy_button"
                    style={styles.button}
                    title={UILocalized.Copy}
                    buttonShape={UIButton.ButtonShape.Radius}
                    onPress={this.onCopyPressed}
                />
            </View>
        );
    }
}
