// @flow
import { Component } from 'react';
import type { Node } from 'react';

type StateUpdate<Props, State> = ((Props, State) => $Shape<State> | void);

export default class UIComponent<Props, State> extends Component<Props, State> {
    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setStateSafely(
        state: $Shape<State> | StateUpdate<Props, State>,
        callback?: () => mixed,
    ) {
        if (!this.mounted) {
            return;
        }
        this.setState(state, callback);
    }

    mounted: boolean;

    render(): ?Node {
        return null;
    }
}
