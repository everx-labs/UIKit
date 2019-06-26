// @flow
import React, { PureComponent } from 'react';

type StateUpdate<State, Props> = ((State, Props) => $Shape<State> | void);

export default class UIPureComponent<Props, State> extends PureComponent<Props, State> {
    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setStateSafely(
        state: $Shape<State> | StateUpdate<State, Props>,
        callback?: () => mixed,
    ) {
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
