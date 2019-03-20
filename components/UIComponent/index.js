// @flow
import { Component } from 'react';

type UpdateState<Props, State> = ((State, Props) => $Shape<State> | void);
type StateUpdates<Props, State> = $Shape<State> | UpdateState<Props, State> | void;

export default class UIComponent<Props, State> extends Component<Props, State> {
    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setStateSafely(state: StateUpdates<Props, State>, callback?: () => mixed) {
        if (!this.mounted) {
            return;
        }
        this.setState(state, callback);
    }

    mounted: boolean;

    // don't know why : ?Node doesn't work
    render(): React$Node {
        return null;
    }
}
