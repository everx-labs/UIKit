// @flow
import { Component } from 'react';

export default class UIComponent<Props, State> extends Component<Props, State> {
    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setStateSafely(state: Object, callback?: () => void) {
        if (!this.mounted) {
            return;
        }
        this.setState(state, callback);
    }

    mounted: boolean;

    render(): React$Node {
        return null;
    }
}
