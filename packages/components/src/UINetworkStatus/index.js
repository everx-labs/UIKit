// @flow
import NetInfo from '@react-native-community/netinfo';

import UIComponent from '../UIComponent';

type NetInfoState = {
    type: string,
    isConnected: boolean,
    isInternetReachable: boolean,
    isWifiEnabled: boolean,
    details: any,
};

type Props = {
    onConnected: boolean => void,
};

type State = {
    // empty
};

export default class UINetworkStatus extends UIComponent<Props, State> {
    static defaultProps: Props = {
        onConnected: () => {
            // empty
        },
    };

    componentDidMount() {
        super.componentDidMount();
        this.startListeningToConnectionInfo();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.stopListeningToConnectionInfo();
    }

    // Actions
    unsubscribe: ?() => void;
    startListeningToConnectionInfo() {
        this.unsubscribe = NetInfo.addEventListener(this.handleConnectionChange);
    }

    stopListeningToConnectionInfo() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    handleConnectionChange = ({ isConnected }: NetInfoState) => {
        const { onConnected } = this.props;

        // Pass connection status to props
        onConnected(isConnected);
    };
}
